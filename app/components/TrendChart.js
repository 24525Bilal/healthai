// app/components/TrendChart.js
// Interactive line chart showing symptom trends over time using Recharts

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(17, 24, 39, 0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "14px 18px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <p
          style={{
            color: "#f1f5f9",
            fontWeight: 600,
            marginBottom: 8,
            fontSize: "0.85rem",
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: entry.color,
              fontSize: "0.8rem",
              margin: "4px 0",
              fontWeight: 500,
            }}
          >
            {entry.name}: {entry.value} cases
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradDiarrhea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradFever" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRespiratory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "8px" }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="diarrhea"
            name="Diarrheal"
            stroke="#ef4444"
            strokeWidth={2.5}
            fill="url(#gradDiarrhea)"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="fever"
            name="Fever"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#gradFever)"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="respiratory"
            name="Respiratory"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#gradRespiratory)"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
