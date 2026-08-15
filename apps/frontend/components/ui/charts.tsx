import type {
  ChartPoint,
} from "../../types/charts";

function coordinates(
  points: ChartPoint[],
  width: number,
  height: number,
) {
  if (!points.length) return "";

  const values =
    points.map(point => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span =
    Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x =
        points.length === 1
          ? width / 2
          : (index /
              (points.length - 1)) *
            width;
      const y =
        height -
        ((point.value - min) /
          span) *
          height;

      return `${x.toFixed(
        2,
      )},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function LineChart({
  points,
  height = 180,
  label = "Chart",
}: {
  points: ChartPoint[];
  height?: number;
  label?: string;
}) {
  const width = 640;
  const polyline =
    coordinates(
      points,
      width,
      height,
    );

  return (
    <svg
      className="pc-line-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <polyline
        points={polyline}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
