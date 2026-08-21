type Entry<T> = { value: T; expiresAt: number };

export class TtlCache {
  private readonly values = new Map<string, Entry<unknown>>();
  constructor(private readonly maxEntries = 500) {}

  get<T>(key: string): T | undefined {
    const entry = this.values.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) { this.values.delete(key); return undefined; }
    // Refresh insertion order so eviction approximates LRU.
    this.values.delete(key); this.values.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number) {
    this.values.delete(key);
    this.values.set(key, { value, expiresAt: Date.now() + ttlMs });
    while (this.values.size > this.maxEntries) {
      const oldest = this.values.keys().next().value as string | undefined;
      if (!oldest) break;
      this.values.delete(oldest);
    }
  }

  delete(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
  get size() { return this.values.size; }
}

export const cache = new TtlCache();
const inFlight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const existing = cache.get<T>(key);
  if (existing !== undefined) return existing;
  const active = inFlight.get(key) as Promise<T> | undefined;
  if (active) return active;
  const promise = loader().then((value) => { cache.set(key, value, ttlMs); return value; }).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
