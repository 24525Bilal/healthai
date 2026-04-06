// app/components/ResourceTable.js
// Displays medicine/resource availability with visual stock bars

"use client";

import { Package, AlertTriangle, CheckCircle } from "lucide-react";

export default function ResourceTable({ data }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "low":
        return <AlertTriangle size={14} />;
      case "high":
        return <CheckCircle size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  return (
    <div className="reports-scroll">
      <table className="resource-table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Stock Level</th>
            <th>Availability</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const percentage = Math.round((item.stock / item.capacity) * 100);
            return (
              <tr key={index}>
                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {item.name}
                </td>
                <td>
                  {item.stock.toLocaleString()} / {item.capacity.toLocaleString()}{" "}
                  {item.unit}
                </td>
                <td style={{ minWidth: 120 }}>
                  <div className="stock-bar">
                    <div
                      className={`stock-bar-fill ${item.status}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {percentage}%
                  </span>
                </td>
                <td>
                  <span className={`stock-status ${item.status}`}>
                    {getStatusIcon(item.status)}
                    {item.status === "low"
                      ? "Critical"
                      : item.status === "medium"
                      ? "Moderate"
                      : "Adequate"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
