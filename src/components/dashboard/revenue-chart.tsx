"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactFCFA, formatFCFA } from "@/lib/format";
import type { MonthlyPoint } from "@/lib/dashboard";

interface TooltipPayload {
  payload: MonthlyPoint;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-float">
      <p className="text-xs font-medium text-ink-faint">{point.month}</p>
      <p className="mt-1 text-sm font-semibold tabular">
        {formatFCFA(point.invoiced)}
      </p>
      <p className="text-xs text-ink-soft tabular">
        Encaissé : {formatFCFA(point.paid)}
      </p>
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const peak = Math.max(...data.map((point) => point.invoiced));

  return (
    <div className="h-full min-h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="#EDEEF2"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8B8F9A", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={52}
            tick={{ fill: "#8B8F9A", fontSize: 12 }}
            tickFormatter={(value: number) => formatCompactFCFA(value)}
          />
          <Tooltip
            cursor={{ fill: "rgba(124, 92, 252, 0.06)" }}
            content={<ChartTooltip />}
          />
          <Bar dataKey="invoiced" radius={[8, 8, 8, 8]} maxBarSize={44}>
            {data.map((point) => (
              <Cell
                key={point.month}
                fill={point.invoiced === peak ? "#7C5CFC" : "#EDEBFE"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
