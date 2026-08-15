export type SolanaSubscriptionMethod =
  | "accountSubscribe"
  | "logsSubscribe"
  | "programSubscribe"
  | "signatureSubscribe"
  | "slotSubscribe";

export type WebSocketConnectionState =
  | "idle"
  | "connecting"
  | "open"
  | "reconnecting"
  | "closed";

export type SolanaWebSocketOptions = {
  endpoints: readonly string[];
  reconnectBaseMs?: number;
  reconnectMaxMs?: number;
  healthIntervalMs?: number;
  WebSocketImpl?: typeof WebSocket;
};

type Listener = (payload: unknown) => void;

type Subscription = {
  logicalId: string;
  method: SolanaSubscriptionMethod;
  params: unknown[];
  listener: Listener;
  serverId?: number;
};

type JsonRpcMessage = {
  id?: number;
  result?: unknown;
  params?: {
    subscription?: number;
    result?: unknown;
  };
};

export class SolanaWebSocketClient {
  readonly #endpoints: readonly string[];
  readonly #WebSocket: typeof WebSocket;
  readonly #reconnectBaseMs: number;
  readonly #reconnectMaxMs: number;
  readonly #healthIntervalMs: number;

  #socket: WebSocket | null = null;
  #state: WebSocketConnectionState = "idle";
  #endpointIndex = 0;
  #attempt = 0;
  #requestId = 1;
  #pending = new Map<number, { logicalId?: string }>();
  #subscriptions = new Map<string, Subscription>();
  #serverToLogical = new Map<number, string>();
  #reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  #healthTimer: ReturnType<typeof setInterval> | null = null;
  #closedByUser = false;

  constructor(options: SolanaWebSocketOptions) {
    if (!options.endpoints.length) {
      throw new Error(
        "At least one Solana WebSocket endpoint is required",
      );
    }

    this.#endpoints = options.endpoints.map(value => {
      const url = new URL(value);
      if (url.protocol !== "wss:" && url.protocol !== "ws:") {
        throw new Error(
          `Invalid Solana WebSocket endpoint: ${value}`,
        );
      }
      return url.toString();
    });

    const implementation =
      options.WebSocketImpl ?? globalThis.WebSocket;
    if (!implementation) {
      throw new Error("WebSocket implementation is unavailable");
    }
    this.#WebSocket = implementation;

    this.#reconnectBaseMs = Math.max(
      250,
      options.reconnectBaseMs ?? 1_000,
    );
    this.#reconnectMaxMs = Math.max(
      this.#reconnectBaseMs,
      options.reconnectMaxMs ?? 30_000,
    );
    this.#healthIntervalMs = Math.max(
      15_000,
      options.healthIntervalMs ?? 60_000,
    );
  }

  get state(): WebSocketConnectionState {
    return this.#state;
  }

  get endpoint(): string {
    return this.#endpoints[this.#endpointIndex]!;
  }

  connect(): void {
    if (
      this.#state === "connecting" ||
      this.#state === "open" ||
      this.#state === "reconnecting"
    ) {
      return;
    }
    this.#closedByUser = false;
    this.#open("connecting");
  }

  close(): void {
    this.#closedByUser = true;
    this.#state = "closed";
    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer);
    }
    if (this.#healthTimer) {
      clearInterval(this.#healthTimer);
    }
    this.#reconnectTimer = null;
    this.#healthTimer = null;
    this.#socket?.close();
    this.#socket = null;
  }

  subscribe(
    method: SolanaSubscriptionMethod,
    params: unknown[],
    listener: Listener,
  ): () => void {
    const logicalId = `sub_${this.#requestId++}`;
    this.#subscriptions.set(logicalId, {
      logicalId,
      method,
      params,
      listener,
    });

    if (this.#state === "open") {
      this.#sendSubscription(logicalId);
    }

    return () => this.unsubscribe(logicalId);
  }

  unsubscribe(logicalId: string): void {
    const subscription =
      this.#subscriptions.get(logicalId);
    if (!subscription) return;

    if (
      subscription.serverId !== undefined &&
      this.#state === "open"
    ) {
      const method = subscription.method.replace(
        "Subscribe",
        "Unsubscribe",
      );
      this.#send(method, [subscription.serverId]);
      this.#serverToLogical.delete(subscription.serverId);
    }

    this.#subscriptions.delete(logicalId);
  }

  #open(state: "connecting" | "reconnecting"): void {
    this.#state = state;
    const socket = new this.#WebSocket(this.endpoint);
    this.#socket = socket;

    socket.addEventListener("open", () => {
      if (socket !== this.#socket) return;
      this.#state = "open";
      this.#attempt = 0;
      this.#startHealth();
      this.#resubscribe();
    });

    socket.addEventListener("message", event => {
      if (socket !== this.#socket) return;
      this.#handleMessage(String(event.data));
    });

    socket.addEventListener("error", () => {
      if (socket !== this.#socket) return;
      socket.close();
    });

    socket.addEventListener("close", () => {
      if (socket !== this.#socket) return;
      this.#socket = null;
      this.#stopHealth();
      if (!this.#closedByUser) {
        this.#scheduleReconnect();
      }
    });
  }

  #scheduleReconnect(): void {
    this.#state = "reconnecting";
    this.#attempt += 1;
    this.#endpointIndex =
      (this.#endpointIndex + 1) % this.#endpoints.length;

    const delay = Math.min(
      this.#reconnectBaseMs *
        2 ** Math.min(this.#attempt - 1, 8),
      this.#reconnectMaxMs,
    );

    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      if (!this.#closedByUser) {
        this.#open("reconnecting");
      }
    }, delay);
  }

  #startHealth(): void {
    this.#stopHealth();
    this.#healthTimer = setInterval(() => {
      if (this.#state === "open") {
        this.#send("getHealth", []);
      }
    }, this.#healthIntervalMs);
  }

  #stopHealth(): void {
    if (this.#healthTimer) {
      clearInterval(this.#healthTimer);
    }
    this.#healthTimer = null;
  }

  #resubscribe(): void {
    this.#serverToLogical.clear();
    for (const subscription of this.#subscriptions.values()) {
      delete subscription.serverId;
      this.#sendSubscription(subscription.logicalId);
    }
  }

  #sendSubscription(logicalId: string): void {
    const subscription =
      this.#subscriptions.get(logicalId);
    if (!subscription) return;

    const id = this.#send(
      subscription.method,
      subscription.params,
    );
    this.#pending.set(id, { logicalId });
  }

  #send(method: string, params: unknown[]): number {
    if (!this.#socket || this.#state !== "open") {
      throw new Error(
        "Solana WebSocket is not connected",
      );
    }

    const id = this.#requestId++;
    this.#socket.send(JSON.stringify({
      jsonrpc: "2.0",
      id,
      method,
      params,
    }));
    return id;
  }

  #handleMessage(raw: string): void {
    let message: JsonRpcMessage;
    try {
      message = JSON.parse(raw) as JsonRpcMessage;
    } catch {
      return;
    }

    if (message.id !== undefined) {
      const pending = this.#pending.get(message.id);
      this.#pending.delete(message.id);

      if (
        pending?.logicalId &&
        typeof message.result === "number"
      ) {
        const subscription = this.#subscriptions.get(
          pending.logicalId,
        );
        if (subscription) {
          subscription.serverId = message.result;
          this.#serverToLogical.set(
            message.result,
            pending.logicalId,
          );
        }
      }
      return;
    }

    const serverId = message.params?.subscription;
    if (typeof serverId !== "number") return;

    const logicalId =
      this.#serverToLogical.get(serverId);
    const subscription = logicalId
      ? this.#subscriptions.get(logicalId)
      : undefined;

    subscription?.listener(message.params?.result);
  }
}
