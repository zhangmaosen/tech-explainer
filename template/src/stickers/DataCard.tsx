// DataCard — 参数卡: 标签小字+数值大字逐行亮相。配方卡: sticker-cards/data-card.md
import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, easeOutCubic } from "../helpers";

export type DataRow = { label: string; value: string; color?: string };

export const DataCard: React.FC<{
  title?: string;
  rows: DataRow[];
  x: number;
  y: number;
  width?: number;
  accentColor?: string;
  startFrame?: number;
}> = ({ title, rows, x, y, width = 620, accentColor = "#FFD54A", startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, startFrame, 12, easeOutCubic);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        background: "rgba(14,20,36,0.82)",
        border: "2px solid rgba(120,150,220,0.35)",
        borderRadius: 14,
        padding: "26px 34px",
        fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
        boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: accentColor,
            marginBottom: 14,
            letterSpacing: 2,
          }}
        >
          {title}
        </div>
      )}
      {rows.map((r, i) => {
        const rp = enter(frame, startFrame + 8 + i * 7, 10, easeOutCubic);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "10px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(120,150,220,0.18)",
              opacity: rp,
              transform: `translateX(${(1 - rp) * 24}px)`,
            }}
          >
            <span style={{ fontSize: 44, color: "#9AA7C7" }}>{r.label}</span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: r.color ?? "#FFFFFF",
                WebkitTextStroke: "2px rgba(0,0,0,0.6)",
                paintOrder: "stroke fill",
              }}
            >
              {r.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
