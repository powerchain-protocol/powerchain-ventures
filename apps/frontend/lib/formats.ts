export const formatUsd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export const formatMoney = formatUsd;
export const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
export const formatCompactNumber = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
export const shortAddress = (value: string, chars = 4) => value.length <= chars * 2 + 1 ? value : `${value.slice(0, chars)}…${value.slice(-chars)}`;
