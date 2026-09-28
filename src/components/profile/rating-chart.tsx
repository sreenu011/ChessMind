import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RatingPoint = { date: string; rating: number };

export function RatingChart({ data }: { data: RatingPoint[] }) {
  if (data.length === 0) return null;

  return (
    <div className="h-56 w-full sm:h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <ChartTooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              color: "var(--popover-foreground)",
              fontWeight: 600,
              fontSize: "0.875rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--primary)" }}
            activeDot={{ r: 5, stroke: "var(--background)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
