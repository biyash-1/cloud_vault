"use client";
import { PieChart, Pie, Cell, Label } from "recharts";
import { useState, useEffect } from "react";

export default function DoughnutChart({ used, total }: { used: number; total: number }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const safeTotal = total || 1;
  const safeUsed = used || 0;
  const percentage = Math.round((safeUsed / safeTotal) * 100);

  const data = [
    { name: "Used", value: safeUsed },
    { name: "Free", value: safeTotal - safeUsed },
  ];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-[180px] h-[180px]">
        <div className="text-2xl font-bold">{percentage}%</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <PieChart width={180} height={180}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={80}
          stroke="none"
          isAnimationActive={false}
        >
          <Cell fill="#3B82F6" />  
          <Cell fill="#6EE7B7" />  
          <Label
            value={`${percentage}%`}
            position="center"
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          />
        </Pie>
      </PieChart>
    </div>
  );
}