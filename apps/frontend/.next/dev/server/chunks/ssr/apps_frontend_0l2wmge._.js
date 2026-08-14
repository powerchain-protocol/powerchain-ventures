module.exports = [
"[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletConnectModal",
    ()=>WalletConnectModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const FOCUSABLE = 'button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])';
function WalletConnectModal({ open, onClose, connectors, isConnecting, error, onConnect, embedded }) {
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const closeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const previous = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (event)=>{
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = Array.from(modalRef.current?.querySelectorAll(FOCUSABLE) ?? []);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        queueMicrotask(()=>closeRef.current?.focus());
        return ()=>{
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKey);
            previous?.focus?.();
        };
    }, [
        open,
        onClose
    ]);
    const sorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            ...connectors
        ].sort((a, b)=>Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)) || Number(b.ready) - Number(a.ready)), [
        connectors
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "wallet-modal-backdrop",
        role: "presentation",
        onMouseDown: (event)=>{
            if (event.currentTarget === event.target) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            ref: modalRef,
            className: "wallet-modal",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "wallet-modal-title",
            "aria-describedby": "wallet-modal-description",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "wallet-modal-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "Solana wallet"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "wallet-modal-title",
                                    children: "Connect to PowerChain"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: closeRef,
                            type: "button",
                            className: "icon-button",
                            "aria-label": "Close wallet dialog",
                            onClick: onClose,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    id: "wallet-modal-description",
                    className: "wallet-modal-copy",
                    children: "Use a Wallet Standard provider to participate, claim, and review transactions. PowerChain never requests private keys or recovery phrases, and never requests seed phrases."
                }, void 0, false, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "wallet-security-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Non-custodial"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 83,
                            columnNumber: 46
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Mainnet aware"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 83,
                            columnNumber: 72
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Review before sign"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 83,
                            columnNumber: 98
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "wallet-option-list",
                    children: [
                        sorted.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-empty-state",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    children: "No wallet providers detected"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 71
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Install or unlock a Wallet Standard compatible Solana wallet, then reopen this dialog."
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 106
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 85,
                            columnNumber: 35
                        }, this),
                        sorted.map((connector)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: `wallet-provider ${connector.recommended ? "recommended" : ""}`,
                                disabled: !connector.ready || isConnecting,
                                onClick: ()=>void onConnect(connector.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wallet-provider-main",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "wallet-provider-icon",
                                                "aria-hidden": "true",
                                                children: connector.name.slice(0, 1).toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 95,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: connector.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: connector.description ?? (connector.ready ? "Available in this browser" : "Not detected")
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wallet-provider-action",
                                        children: [
                                            connector.recommended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                children: "Recommended"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 99,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: isConnecting ? "Connecting…" : connector.ready ? "Connect" : "Unavailable"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, connector.id, true, {
                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this),
                embedded.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "embedded-wallets",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-section-title",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "eyebrow",
                                    children: "Embedded wallet adapters"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 107,
                                    columnNumber: 51
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: "Provider-managed, never key-custodied by PowerChain"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                    lineNumber: 107,
                                    columnNumber: 108
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        embedded.map((wallet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "wallet-provider static",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wallet-provider-main",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "wallet-provider-icon muted",
                                                "aria-hidden": "true",
                                                children: "E"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 110,
                                                columnNumber: 56
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: wallet.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 134
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: wallet.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 154
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                                lineNumber: 110,
                                                columnNumber: 128
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                        lineNumber: 110,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: wallet.status
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, wallet.id, true, {
                                fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "wallet-error",
                    role: "alert",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Wallet connection failed"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 116,
                            columnNumber: 62
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                            lineNumber: 116,
                            columnNumber: 93
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 116,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                    className: "wallet-safety",
                    children: "Only approve a transaction when the mint, recipients, instructions, token amount, and fees match the PowerChain review screen."
                }, void 0, false, {
                    fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/frontend/lib/embedded-wallets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertNoSecretMaterial",
    ()=>assertNoSecretMaterial,
    "discoverEmbeddedWallets",
    ()=>discoverEmbeddedWallets,
    "readEmbeddedWalletSession",
    ()=>readEmbeddedWalletSession,
    "writeEmbeddedWalletSession",
    ()=>writeEmbeddedWalletSession
]);
"use client";
;
const SESSION_KEY = "powerchain.embedded-wallet.session.v1";
function discoverEmbeddedWallets() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
    const browser = undefined;
}
function isEmbeddedWalletSession(value) {
    if (!value || typeof value !== "object") return false;
    const candidate = value;
    return typeof candidate.providerId === "string" && typeof candidate.address === "string" && (void 0)(candidate.address) && typeof candidate.connectedAt === "string" && Number.isFinite(Date.parse(candidate.connectedAt));
}
function readEmbeddedWalletSession() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function writeEmbeddedWalletSession(session) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function assertNoSecretMaterial(value) {
    const text = JSON.stringify(value ?? {}).toLowerCase();
    if (/seed phrase|mnemonic|private[_ -]?key|secret[_ -]?key/.test(text)) {
        throw new Error("PowerChain embedded-wallet adapters must never accept private keys or recovery phrases");
    }
}
}),
"[project]/apps/frontend/hooks/use-embedded-wallets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEmbeddedWallets",
    ()=>useEmbeddedWallets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/lib/embedded-wallets.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useEmbeddedWallets() {
    const [wallets, setWallets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [session, setSessionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const refresh = ()=>{
            setWallets((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["discoverEmbeddedWallets"])());
            setSessionState((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readEmbeddedWalletSession"])());
        };
        refresh();
        window.addEventListener("focus", refresh);
        return ()=>window.removeEventListener("focus", refresh);
    }, []);
    const setSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((next)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$lib$2f$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeEmbeddedWalletSession"])(next);
        setSessionState(next);
    }, []);
    return {
        wallets,
        session,
        setSession
    };
}
}),
"[project]/apps/frontend/hooks/use-click-outside.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useClickOutside",
    ()=>useClickOutside
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useClickOutside(ref, onOutside, enabled = true) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        const onPointerDown = (event)=>{
            const node = ref.current;
            if (node && !node.contains(event.target)) onOutside();
        };
        const onKeyDown = (event)=>{
            if (event.key === "Escape") onOutside();
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return ()=>{
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [
        enabled,
        onOutside,
        ref
    ]);
}
}),
"[project]/apps/frontend/hooks/use-copy-to-clipboard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCopyToClipboard",
    ()=>useCopyToClipboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useCopyToClipboard(resetAfterMs = 1800) {
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }, []);
    const copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (value)=>{
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        try {
            if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
            await navigator.clipboard.writeText(value);
            setStatus("copied");
        } catch  {
            setStatus("error");
        }
        timeoutRef.current = setTimeout(()=>setStatus("idle"), resetAfterMs);
    }, [
        resetAfterMs
    ]);
    return {
        copy,
        status
    };
}
}),
"[project]/apps/frontend/types/status.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SETTLEMENT_STATUS_ORDER",
    ()=>SETTLEMENT_STATUS_ORDER,
    "describeNetworkStatus",
    ()=>describeNetworkStatus,
    "describeSaleStatus",
    ()=>describeSaleStatus,
    "describeSettlementStatus",
    ()=>describeSettlementStatus,
    "describeWalletStatus",
    ()=>describeWalletStatus
]);
const SETTLEMENT_STATUS_ORDER = [
    "prepared",
    "submitted",
    "chain-confirmed",
    "payment-verified",
    "delivery-verified",
    "settled",
    "failed",
    "expired"
];
function describeWalletStatus(status) {
    switch(status){
        case "connected":
            return {
                label: "Connected",
                tone: "success"
            };
        case "connecting":
            return {
                label: "Connecting",
                tone: "info"
            };
        case "error":
            return {
                label: "Connection issue",
                tone: "danger"
            };
        default:
            return {
                label: "Not connected",
                tone: "neutral"
            };
    }
}
function describeNetworkStatus(status) {
    switch(status){
        case "ready":
            return {
                label: "Mainnet ready",
                tone: "success"
            };
        case "degraded":
            return {
                label: "Mainnet degraded",
                tone: "warning"
            };
        case "incomplete":
            return {
                label: "Configuration incomplete",
                tone: "danger"
            };
        case "offline":
            return {
                label: "Network unavailable",
                tone: "danger"
            };
        default:
            return {
                label: "Checking mainnet",
                tone: "info"
            };
    }
}
function describeSaleStatus(status) {
    switch(status){
        case "public":
            return {
                label: "Public sale",
                tone: "success"
            };
        case "private":
            return {
                label: "Private sale",
                tone: "info"
            };
        case "scheduled":
            return {
                label: "Upcoming",
                tone: "info"
            };
        case "claimable":
            return {
                label: "Claimable",
                tone: "success"
            };
        case "completed":
            return {
                label: "Completed",
                tone: "neutral"
            };
        case "cancelled":
            return {
                label: "Cancelled",
                tone: "danger"
            };
        case "ended":
            return {
                label: "Sale ended",
                tone: "warning"
            };
        default:
            return {
                label: "Draft",
                tone: "neutral"
            };
    }
}
function describeSettlementStatus(status) {
    switch(status){
        case "settled":
            return {
                label: "Settled",
                tone: "success"
            };
        case "delivery-verified":
            return {
                label: "Delivery verified",
                tone: "success"
            };
        case "payment-verified":
            return {
                label: "Payment verified",
                tone: "info"
            };
        case "chain-confirmed":
            return {
                label: "Chain confirmed",
                tone: "info"
            };
        case "submitted":
            return {
                label: "Submitted",
                tone: "info"
            };
        case "failed":
            return {
                label: "Failed",
                tone: "danger"
            };
        case "expired":
            return {
                label: "Expired",
                tone: "warning"
            };
        default:
            return {
                label: "Prepared",
                tone: "neutral"
            };
    }
}
}),
"[project]/apps/frontend/types/wallets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shortenWalletAddress",
    ()=>shortenWalletAddress
]);
function shortenWalletAddress(address, prefix = 6, suffix = 6) {
    if (address.length <= prefix + suffix + 1) return address;
    return `${address.slice(0, prefix)}…${address.slice(-suffix)}`;
}
}),
"[project]/apps/frontend/components/ui/status-badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function StatusBadge({ status, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `status-badge ${status.tone} ${className}`.trim(),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/apps/frontend/components/ui/status-badge.tsx",
                lineNumber: 4,
                columnNumber: 78
            }, this),
            status.label
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/components/ui/status-badge.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/apps/frontend/hooks/use-wallet-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWalletData",
    ()=>useWalletData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useWalletData(wallet) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null), [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false), [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!wallet) {
            setData(null);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const r = await fetch(`/api/v1/wallets/${encodeURIComponent(wallet)}`, {
                cache: "no-store"
            });
            const j = await r.json();
            if (!r.ok) throw new Error(j?.error?.message || "Unable to load wallet balances");
            setData(j);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to load wallet balances");
        } finally{
            setLoading(false);
        }
    }, [
        wallet
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refresh();
    }, [
        refresh
    ]);
    return {
        data,
        loading,
        error,
        refresh
    };
}
}),
"[project]/apps/frontend/components/pwrc-coin.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PwrcCoin",
    ()=>PwrcCoin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/image.js [app-ssr] (ecmascript)");
;
;
function PwrcCoin({ size = 40, className = "", priority = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `pwrc-coin ${className}`,
        style: {
            width: size,
            height: size
        },
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            src: "/assets/pwrc/pwrc.png",
            alt: "",
            width: size,
            height: size,
            priority: priority
        }, void 0, false, {
            fileName: "[project]/apps/frontend/components/pwrc-coin.tsx",
            lineNumber: 4,
            columnNumber: 105
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/pwrc-coin.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/apps/frontend/components/wallet-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletButton",
    ()=>WalletButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@solana/connector/react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$wallet$2f$wallet$2d$connect$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/components/wallet/wallet-connect-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/hooks/use-embedded-wallets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/powerchain-config-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$click$2d$outside$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/hooks/use-click-outside.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$copy$2d$to$2d$clipboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/hooks/use-copy-to-clipboard.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/types/status.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/types/wallets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/components/ui/status-badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$wallet$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/hooks/use-wallet-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$pwrc$2d$coin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/components/pwrc-coin.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function WalletButton() {
    const wallet = useWallet();
    const connectors = useWalletConnectors();
    const connect = useConnectWallet();
    const disconnect = useDisconnectWallet();
    const { config, mainnetReady } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePowerChainConfig"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const embedded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$embedded$2d$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmbeddedWallets"])();
    const clipboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$copy$2d$to$2d$clipboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCopyToClipboard"])();
    const address = wallet.account ? String(wallet.account) : "";
    const walletData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$wallet$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWalletData"])(address);
    const status = wallet.isConnecting ? "connecting" : wallet.isConnected && address ? "connected" : connect.error ? "error" : "disconnected";
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>connectors.map((connector, index)=>({
                id: connector.id,
                name: connector.name,
                kind: "wallet-standard",
                ready: connector.ready,
                recommended: index === 0 && connector.ready,
                description: connector.ready ? "Wallet Standard provider detected" : "Install or unlock this wallet"
            })), [
        connectors
    ]);
    const closeMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setOpen(false), []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$click$2d$outside$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClickOutside"])(menuRef, closeMenu, open && Boolean(wallet.isConnected && address));
    if (wallet.isConnected && address) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "wallet-control",
            ref: menuRef,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "wallet-button connected",
                    onClick: ()=>setOpen((value)=>!value),
                    "aria-expanded": open,
                    "aria-haspopup": "menu",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "wallet-button-dot"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shortenWalletAddress"])(address)
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "wallet-chevron",
                            "aria-hidden": "true",
                            children: "⌄"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "wallet-menu",
                    role: "menu",
                    "aria-label": "Connected wallet actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-menu-head",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "eyebrow",
                                            children: "Connected wallet"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$wallets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shortenWalletAddress"])(address, 8, 8)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 68,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 66,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeWalletStatus"])(status)
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            className: "wallet-full-address",
                            children: address
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-balance-mini",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$pwrc$2d$coin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PwrcCoin"], {
                                            size: 28
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 74,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: "PWRC"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: walletData.data?.pwrc.uiAmount ?? "0"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 64
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 74,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mini-sol",
                                            children: "◎"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 75,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                    children: "SOL"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 59
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: walletData.data?.sol.uiAmount.toLocaleString("en-US", {
                                                        maximumFractionDigits: 5
                                                    }) ?? "0"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 77
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 75,
                                            columnNumber: 56
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-menu-meta",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: "Network"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 78,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: config?.cluster === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 78,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: "Launchpad"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 79,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: config?.cluster !== "mainnet-beta" || mainnetReady ? "Ready" : "Config incomplete"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                            lineNumber: 79,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "wallet-center-link",
                            href: "/wallet",
                            children: "Open Wallet Center →"
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wallet-menu-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "secondary",
                                    role: "menuitem",
                                    onClick: ()=>void clipboard.copy(address),
                                    children: clipboard.status === "copied" ? "Copied" : clipboard.status === "error" ? "Copy failed" : "Copy address"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "secondary danger-text",
                                    role: "menuitem",
                                    onClick: ()=>{
                                        disconnect.disconnect();
                                        embedded.setSession(null);
                                        setOpen(false);
                                    },
                                    children: "Disconnect"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                    lineNumber: 64,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/frontend/components/wallet-button.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "wallet-button",
                onClick: ()=>setOpen(true),
                disabled: wallet.isConnecting,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "wallet-button-dot"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    wallet.isConnecting ? "Connecting…" : "Connect wallet"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$wallet$2f$wallet$2d$connect$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WalletConnectModal"], {
                open: open,
                onClose: ()=>setOpen(false),
                connectors: options,
                isConnecting: connect.isConnecting,
                error: connect.error?.message,
                embedded: embedded.wallets,
                onConnect: async (id)=>{
                    await connect.connect(id);
                    setOpen(false);
                }
            }, void 0, false, {
                fileName: "[project]/apps/frontend/components/wallet-button.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/frontend/components/launchpad/network-status.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NetworkStatus",
    ()=>NetworkStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/powerchain-config-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/types/status.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/components/ui/status-badge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function NetworkStatus({ compact = false }) {
    const { config, loading: configLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$powerchain$2d$config$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePowerChainConfig"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let live = true;
        fetch("/api/v1/launchpad/network", {
            cache: "no-store"
        }).then(async (r)=>{
            const j = await r.json();
            if (live) {
                setState(j);
                setError(!r.ok);
            }
        }).catch(()=>live && setError(true));
        return ()=>{
            live = false;
        };
    }, []);
    const deploymentReady = Boolean(config?.deployment.configured);
    const ok = Boolean(state?.ok && deploymentReady);
    const readiness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (configLoading && !state) return "checking";
        if (error) return "offline";
        if (config && !deploymentReady) return "incomplete";
        if (state?.ok && deploymentReady) return state.infra?.redundant ? "ready" : "degraded";
        return "checking";
    }, [
        configLoading,
        state,
        error,
        config,
        deploymentReady
    ]);
    const descriptor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$types$2f$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeNetworkStatus"])(readiness);
    if (compact) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
        status: descriptor,
        className: "network-compact"
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
        lineNumber: 16,
        columnNumber: 20
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `network-banner ${descriptor.tone}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "network-summary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
                        status: descriptor
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 99
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: ok ? "Solana mainnet-beta verified" : "PowerChain network readiness"
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                                lineNumber: 17,
                                columnNumber: 138
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: state?.network ? `Slot ${state.network.slot.toLocaleString()} • Block ${state.network.blockHeight.toLocaleString()} • Core ${state.network.version}` : "Checking RPC identity, health, deployment addresses and redundancy"
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                                lineNumber: 17,
                                columnNumber: 211
                            }, this),
                            config && !deploymentReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: [
                                    ...config.deployment.missing,
                                    ...config.deployment.invalid
                                ].slice(0, 3).join(" • ")
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                                lineNumber: 17,
                                columnNumber: 470
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 133
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                lineNumber: 17,
                columnNumber: 66
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "network-badges",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: state?.infra?.dedicated ? "ok" : "",
                        children: state?.infra?.dedicated ? "Dedicated RPC" : "RPC check"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 614
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: state?.infra?.redundant ? "ok" : "",
                        children: state?.infra?.redundant ? `${state.infra.count} RPC endpoints` : "Redundancy check"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 724
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: config?.deployment.presaleMintConfigured ? "ok" : "",
                        children: config?.deployment.presaleMintConfigured ? "PWRC mint configured" : "Mint required"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 862
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: config?.deployment.treasuryConfigured ? "ok" : "",
                        children: config?.deployment.treasuryConfigured ? "Treasury configured" : "Treasury required"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                        lineNumber: 17,
                        columnNumber: 1017
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
                lineNumber: 17,
                columnNumber: 582
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/components/launchpad/network-status.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, this);
}
}),
"[project]/apps/frontend/components/navigation/app-navigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppNavigation",
    ()=>AppNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const links = [
    [
        "/",
        "Launchpad"
    ],
    [
        "/sales",
        "Sales"
    ],
    [
        "/dashboard",
        "Dashboard"
    ],
    [
        "/analytics",
        "Analytics"
    ],
    [
        "/integration",
        "Integration"
    ],
    [
        "/wallet",
        "Wallet"
    ],
    [
        "/claims",
        "Claims"
    ],
    [
        "/transactions",
        "Transactions"
    ],
    [
        "/create",
        "Create Sale"
    ],
    [
        "/account",
        "Account"
    ]
];
function isActive(pathname, href) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
function AppNavigation() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>setOpen(false), [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-navigation",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "nav-toggle",
                "aria-label": open ? "Close navigation" : "Open navigation",
                "aria-expanded": open,
                "aria-controls": "primary-navigation",
                onClick: ()=>setOpen((value)=>!value),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                id: "primary-navigation",
                className: open ? "open" : "",
                "aria-label": "Primary navigation",
                children: links.map(([href, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: href,
                        "aria-current": isActive(pathname, href) ? "page" : undefined,
                        children: label
                    }, href, false, {
                        fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/components/navigation/app-navigation.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/frontend/components/mobile/mobile-bottom-nav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileBottomNav",
    ()=>MobileBottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const items = [
    {
        href: "/",
        label: "Home",
        icon: "⌂"
    },
    {
        href: "/sales",
        label: "Sales",
        icon: "◈"
    },
    {
        href: "/wallet",
        label: "Wallet",
        icon: "◉"
    },
    {
        href: "/transactions",
        label: "Activity",
        icon: "↗"
    },
    {
        href: "/account",
        label: "Account",
        icon: "○"
    }
];
function MobileBottomNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "mobile-bottom-nav",
        "aria-label": "Mobile navigation",
        children: items.map((item)=>{
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                "aria-current": active ? "page" : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: item.icon
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/mobile/mobile-bottom-nav.tsx",
                        lineNumber: 12,
                        columnNumber: 343
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/mobile/mobile-bottom-nav.tsx",
                        lineNumber: 12,
                        columnNumber: 379
                    }, this)
                ]
            }, item.href, true, {
                fileName: "[project]/apps/frontend/components/mobile/mobile-bottom-nav.tsx",
                lineNumber: 12,
                columnNumber: 265
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/mobile/mobile-bottom-nav.tsx",
        lineNumber: 12,
        columnNumber: 71
    }, this);
}
}),
"[project]/apps/frontend/components/auth/auth-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthButton",
    ()=>AuthButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.12_@babel+core@7.29.7_supports-color@8.1.1__babel-plugin-react-compiler@1.0.0_5990ea76a0cceab74cf81a86d67b2a35/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/context/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$click$2d$outside$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/hooks/use-click-outside.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function AuthButton() {
    const { loading, authenticated, user, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$hooks$2f$use$2d$click$2d$outside$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClickOutside"])(ref, ()=>setOpen(false), open);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "account-skeleton",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
        lineNumber: 3,
        columnNumber: 220
    }, this);
    if (!authenticated) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        className: "account-sign-in",
        href: "/auth/sign-in",
        children: "Sign in"
    }, void 0, false, {
        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
        lineNumber: 3,
        columnNumber: 293
    }, this);
    const label = user?.displayName || user?.email?.split("@")[0] || "Account";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "account-menu",
        ref: ref,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "account-trigger",
                onClick: ()=>setOpen((v)=>!v),
                "aria-expanded": open,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "account-avatar",
                        children: label.slice(0, 1).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 565
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "account-label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 637
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                lineNumber: 3,
                columnNumber: 479
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "account-popover",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                                lineNumber: 3,
                                columnNumber: 737
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: user?.email
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                                lineNumber: 3,
                                columnNumber: 761
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 732
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/account",
                        children: "Account"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 795
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        children: "Creator dashboard"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 831
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$12_$40$babel$2b$core$40$7$2e$29$2e$7_supports$2d$color$40$8$2e$1$2e$1_$5f$babel$2d$plugin$2d$react$2d$compiler$40$1$2e$0$2e$0_5990ea76a0cceab74cf81a86d67b2a35$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void signOut(),
                        children: "Sign out"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                        lineNumber: 3,
                        columnNumber: 879
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
                lineNumber: 3,
                columnNumber: 699
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/components/auth/auth-button.tsx",
        lineNumber: 3,
        columnNumber: 439
    }, this);
}
}),
];

//# sourceMappingURL=apps_frontend_0l2wmge._.js.map