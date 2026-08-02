// FighterCard — versus 皮肤配方卡: 角色参数卡 (代号/称号/战绩/必杀技)。
// 语义 = DataCard 的对决特化; 配方卡: skins/versus.md
import React from "react";
import { DataCard, DataRow } from "../../stickers/DataCard";

export const FighterCard: React.FC<{
  name: string; // 代号
  rows: DataRow[]; // 称号/战绩/必杀技 等 (≤4 行)
  side: "left" | "right";
  x: number;
  y: number;
  width?: number;
  accentColor?: string;
  startFrame?: number;
}> = ({ name, rows, side, x, y, width = 600, accentColor, startFrame = 0 }) => {
  const color = accentColor ?? (side === "left" ? "#FF6B4A" : "#4AA8FF");
  return (
    <DataCard
      title={name}
      rows={rows}
      x={x}
      y={y}
      width={width}
      accentColor={color}
      startFrame={startFrame}
    />
  );
};
