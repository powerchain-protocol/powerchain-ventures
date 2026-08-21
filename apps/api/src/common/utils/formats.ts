export function formatTokenAmount(value: number, decimals = 2) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(value); }
export function formatUsd(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value); }
export function shortAddress(value: string, chars = 4) { return value.length <= chars * 2 + 1 ? value : `${value.slice(0, chars)}…${value.slice(-chars)}`; }
