module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/frontend/lib/helpers.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
}),
"[project]/apps/frontend/context/powerchain-config-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PowerChainConfigProvider",
    ()=>PowerChainConfigProvider,
    "usePowerChainConfig",
    ()=>usePowerChainConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/helpers.ts [app-ssr] (ecmascript) <locals>");
"use client";
;
;
;
const PowerChainConfigContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function PowerChainConfigProvider({ children }) {
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const activeRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        activeRequest.current?.abort();
        const controller = new AbortController();
        activeRequest.current = controller;
        setLoading(true);
        setError(null);
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/launchpad/config", {
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
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refresh();
        return ()=>activeRequest.current?.abort();
    }, [
        refresh
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            config,
            loading,
            error,
            refresh,
            mainnetReady: Boolean(config?.cluster === "mainnet-beta" && config.deployment.configured)
        }), [
        config,
        loading,
        error,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PowerChainConfigContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/frontend/context/powerchain-config-context.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
function usePowerChainConfig() {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PowerChainConfigContext);
    if (!value) throw new Error("usePowerChainConfig must be used inside PowerChainConfigProvider");
    return value;
}
}),
"[project]/apps/frontend/context/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/helpers.ts [app-ssr] (ecmascript) <locals>");
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        configured: true,
        loading: true,
        authenticated: false,
        user: null
    });
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/session", {
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
            setState((s)=>({
                    ...s,
                    loading: false,
                    authenticated: false,
                    user: null
                }));
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refresh();
    }, [
        refresh
    ]);
    const signIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, password)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-in", {
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
    }, []);
    const signUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-up", {
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
    }, []);
    const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/sign-out", {
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
    }, []);
    const forgotPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchJson"])("/api/v1/auth/forgot-password", {
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
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            ...state,
            refresh,
            signIn,
            signUp,
            signOut,
            forgotPassword
        }), [
        state,
        refresh,
        signIn,
        signUp,
        signOut,
        forgotPassword
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/frontend/context/auth-context.tsx",
        lineNumber: 23,
        columnNumber: 9
    }, this);
}
function useAuth() {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!value) throw new Error("useAuth must be used inside AuthProvider");
    return value;
}
}),
"[project]/apps/frontend/lib/constants.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
}),
"[project]/apps/frontend/lib/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getClientConfig",
    ()=>getClientConfig
]);
;
function getClientConfig() {
    return (void 0)({
        NODE_ENV: ("TURBOPACK compile-time value", "development"),
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER,
        NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    });
}
}),
"[project]/apps/frontend/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/powerchain-config-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/frontend/lib/constants.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/lib/config.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function Providers({ children }) {
    const runtime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClientConfig"])(), []);
    const connectorConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>getDefaultConfig({
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
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WALLET_CONNECTORS"]
                ],
                featured: [
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WALLET_CONNECTORS"]
                ]
            }
        }), [
        runtime
    ]);
    const mobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>getDefaultMobileConfig({
            appName: "PowerChain Launchpad",
            appUrl: runtime.appUrl
        }), [
        runtime.appUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppProvider, {
        connectorConfig: connectorConfig,
        mobile: mobile,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PowerChainConfigProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
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
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1wup0om._.js.map