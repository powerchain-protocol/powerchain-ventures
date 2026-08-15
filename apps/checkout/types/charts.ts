export type ChartPoint = {
  timestamp: string;
  value: number;
};

export type PriceSeries = {
  symbol: string;
  points:
    readonly ChartPoint[];
};
