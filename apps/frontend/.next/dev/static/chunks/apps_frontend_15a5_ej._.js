(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/frontend/lib/helpers.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchJson",
    ()=>fetchJson
]);
;
;
;
function fetchJson(input, options = {}, fallback = "Request failed") {
    return (void 0)(input, {
        ...options,
        fallbackMessage: options.fallbackMessage ?? fallback
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/context/powerchain-config-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PowerChainConfigProvider",
    ()=>PowerChainConfigProvider,
    "usePowerChainConfig",
    ()=>usePowerChainConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/helpers.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const PowerChainConfigContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PowerChainConfigProvider({ children }) {
    _s();
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const activeRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PowerChainConfigProvider.useCallback[refresh]": async ()=>{
            activeRequest.current?.abort();
            const controller = new AbortController();
            activeRequest.current = controller;
            setLoading(true);
            setError(null);
            try {
                const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/launchpad/config", {
                    signal: controller.signal,
                    retries: 1,
                    timeoutMs: 10_000
                }, "Unable to load PowerChain configuration");
                if (!controller.signal.aborted) setConfig(body);
            } catch (cause) {
                if (controller.signal.aborted) return;
                setConfig(null);
                setError(cause instanceof Error ? cause.message : "Unable to load PowerChain configuration");
            } finally{
                if (activeRequest.current === controller) {
                    activeRequest.current = null;
                    setLoading(false);
                }
            }
        }
    }["PowerChainConfigProvider.useCallback[refresh]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PowerChainConfigProvider.useEffect": ()=>{
            void refresh();
            return ({
                "PowerChainConfigProvider.useEffect": ()=>activeRequest.current?.abort()
            })["PowerChainConfigProvider.useEffect"];
        }
    }["PowerChainConfigProvider.useEffect"], [
        refresh
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PowerChainConfigProvider.useMemo[value]": ()=>({
                config,
                loading,
                error,
                refresh,
                mainnetReady: Boolean(config?.cluster === "mainnet-beta" && config.deployment.configured)
            })
    }["PowerChainConfigProvider.useMemo[value]"], [
        config,
        loading,
        error,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PowerChainConfigContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/frontend/context/powerchain-config-context.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
_s(PowerChainConfigProvider, "eq6d0uTklthdqdIU4HxNMc/pMwE=");
_c = PowerChainConfigProvider;
function usePowerChainConfig() {
    _s1();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PowerChainConfigContext);
    if (!value) throw new Error("usePowerChainConfig must be used inside PowerChainConfigProvider");
    return value;
}
_s1(usePowerChainConfig, "ksutO2/Ix3UeCrGnhyM+QEP505Y=");
var _c;
__turbopack_context__.k.register(_c, "PowerChainConfigProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/context/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/helpers.ts [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        configured: true,
        loading: true,
        authenticated: false,
        user: null
    });
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refresh]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/session", {
                    timeoutMs: 8000,
                    retries: 0
                });
                setState({
                    configured: data.configured !== false,
                    loading: false,
                    authenticated: data.authenticated,
                    user: data.user
                });
            } catch  {
                setState({
                    "AuthProvider.useCallback[refresh]": (s)=>({
                            ...s,
                            loading: false,
                            authenticated: false,
                            user: null
                        })
                }["AuthProvider.useCallback[refresh]"]);
            }
        }
    }["AuthProvider.useCallback[refresh]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            void refresh();
        }
    }["AuthProvider.useEffect"], [
        refresh
    ]);
    const signIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signIn]": async (email, password)=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-in", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    headers: {
                        "content-type": "application/json"
                    },
                    timeoutMs: 10000,
                    retries: 0
                });
                setState({
                    configured: true,
                    loading: false,
                    authenticated: true,
                    user: data.user
                });
                return {
                    ok: true
                };
            } catch (error) {
                return {
                    ok: false,
                    message: error instanceof Error ? error.message : "Unable to sign in"
                };
            }
        }
    }["AuthProvider.useCallback[signIn]"], []);
    const signUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signUp]": async (input)=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-up", {
                    method: "POST",
                    body: JSON.stringify(input),
                    headers: {
                        "content-type": "application/json"
                    },
                    timeoutMs: 10000,
                    retries: 0
                });
                if (data.user && !data.emailConfirmationRequired) setState({
                    configured: true,
                    loading: false,
                    authenticated: true,
                    user: data.user
                });
                return {
                    ok: true,
                    emailConfirmationRequired: data.emailConfirmationRequired
                };
            } catch (error) {
                return {
                    ok: false,
                    message: error instanceof Error ? error.message : "Unable to create account"
                };
            }
        }
    }["AuthProvider.useCallback[signUp]"], []);
    const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[signOut]": async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-out", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: "{}",
                    timeoutMs: 8000,
                    retries: 0
                });
            } finally{
                setState({
                    configured: true,
                    loading: false,
                    authenticated: false,
                    user: null
                });
            }
        }
    }["AuthProvider.useCallback[signOut]"], []);
    const forgotPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[forgotPassword]": async (email)=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/forgot-password", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email
                    }),
                    timeoutMs: 10000,
                    retries: 0
                });
                return {
                    ok: true,
                    message: data.message
                };
            } catch (error) {
                return {
                    ok: false,
                    message: error instanceof Error ? error.message : "Unable to send recovery email"
                };
            }
        }
    }["AuthProvider.useCallback[forgotPassword]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                ...state,
                refresh,
                signIn,
                signUp,
                signOut,
                forgotPassword
            })
    }["AuthProvider.useMemo[value]"], [
        state,
        refresh,
        signIn,
        signUp,
        signOut,
        forgotPassword
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/frontend/context/auth-context.tsx",
        lineNumber: 23,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "EFwfgjmg0fgi07OmEGEz+zLa23s=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!value) throw new Error("useAuth must be used inside AuthProvider");
    return value;
}
_s1(useAuth, "ksutO2/Ix3UeCrGnhyM+QEP505Y=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/lib/constants.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PURCHASE_PRESETS_USD",
    ()=>DEFAULT_PURCHASE_PRESETS_USD,
    "WALLET_CONNECTORS",
    ()=>WALLET_CONNECTORS
]);
;
const WALLET_CONNECTORS = [
    "Phantom",
    "Solflare",
    "Backpack"
];
const DEFAULT_PURCHASE_PRESETS_USD = [
    100,
    250,
    500,
    1000
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/lib/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getClientConfig",
    ()=>getClientConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
;
function getClientConfig() {
    return (void 0)({
        NODE_ENV: ("TURBOPACK compile-time value", "development"),
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_SOLANA_CLUSTER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SOLANA_CLUSTER,
        NEXT_PUBLIC_SOLANA_RPC_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SOLANA_RPC_URL
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@solana/connector/react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@solana/connector/headless'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/powerchain-config-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/constants.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/lib/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function Providers({ children }) {
    _s();
    const runtime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Providers.useMemo[runtime]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientConfig"])()
    }["Providers.useMemo[runtime]"], []);
    const connectorConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Providers.useMemo[connectorConfig]": ()=>getDefaultConfig({
                appName: "PowerChain Launchpad",
                appUrl: runtime.appUrl,
                autoConnect: true,
                enableMobile: true,
                clusters: [
                    {
                        id: runtime.solanaCluster === "mainnet-beta" ? "solana:mainnet" : "solana:devnet",
                        label: runtime.solanaCluster === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet",
                        url: runtime.solanaRpcUrl
                    }
                ],
                wallets: {
                    allowList: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WALLET_CONNECTORS"]
                    ],
                    featured: [
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WALLET_CONNECTORS"]
                    ]
                }
            })
    }["Providers.useMemo[connectorConfig]"], [
        runtime
    ]);
    const mobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Providers.useMemo[mobile]": ()=>getDefaultMobileConfig({
                appName: "PowerChain Launchpad",
                appUrl: runtime.appUrl
            })
    }["Providers.useMemo[mobile]"], [
        runtime.appUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppProvider, {
        connectorConfig: connectorConfig,
        mobile: mobile,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PowerChainConfigProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/frontend/app/providers.tsx",
                lineNumber: 33,
                columnNumber: 33
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/frontend/app/providers.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/frontend/app/providers.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(Providers, "4YVZBZSYEvsKCuEzPsEk6S/wTHM=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_frontend_15a5_ej._.js.map