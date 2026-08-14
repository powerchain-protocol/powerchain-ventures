export const MOBILE_TABS = [
  { key: "home", title: "Home", route: "/(tabs)" },
  { key: "launches", title: "Launches", route: "/(tabs)/sales" },
  { key: "wallet", title: "Wallet", route: "/(tabs)/wallet" },
  { key: "activity", title: "Activity", route: "/(tabs)/activity" },
  { key: "account", title: "Account", route: "/(tabs)/account" },
] as const;

export const MOBILE_STACKS = {
  sale: "/sales/[saleId]",
  checkout: "/checkout/[saleId]",
  claims: "/claims",
  transaction: "/transactions/[reviewId]",
  creator: "/creator",
  onboarding: "/onboarding",
} as const;
