export type ChartPoint = {
  timestamp: string;
  value: number;
};

export type ChartSeries = {
  id: string;
  label: string;
  points: ChartPoint[];
};

export type ChartRange =
  | "1D"
  | "7D"
  | "30D"
  | "90D"
  | "1Y"
  | "ALL";
