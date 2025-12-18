"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CompletionPoint } from "../types/types";

type Props = {
  series: CompletionPoint[];
};

export function CompletionChart({ series }: Props) {
  return (
    <div className="h-55 sm:h-65 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#17B100", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--popover))",
              fontSize: 12,
            }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#17B100"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#17B100",
              strokeWidth: 2,
              fill: "#17B100",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
