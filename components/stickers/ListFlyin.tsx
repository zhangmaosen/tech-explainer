// ListFlyin — 要点逐条飞入, 越来越快。配方卡: sticker-cards/list-flyin.md
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { easeOutCubic } from "../helpers";

export const ListFlyin: React.FC<{
  items: string[];
  startFrame?: number;
  color?: string;
  fontSizePx?: number;
  top?: number;
  x?: number; // 容器 left (默认 v916 的 80)
  width?: number; // 容器宽 (默认 v916 的 920)
}> = ({ items, startFrame = 0, color = "#FFFFFF", fontSizePx = 72, top = 500, x = 80, width = 920 }) => {
  const frame = useCurrentFrame();
  // 错峰间隔越来越短
  const gaps = [10, 8, 6, 5, 4, 3];
  const starts: number[] = [];
  let acc = startFrame;
  items.forEach((_, i) => {
    starts.push(acc);
    acc += gaps[Math.min(i, gaps.length - 1)];
  });
  return (
    <div style={{ position: "absolute", top, left: x, width }}>
      {items.map((it, i) => {
        const p = interpolate(frame, [starts[i], starts[i] + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOutCubic,
        });
        return (
          <div
            key={i}
            style={{
              opacity: p,
              transform: `translateX(${(1 - p) * 180}px)`,
              marginBottom: 28,
              fontFamily: "'Noto Sans SC',sans-serif",
              fontWeight: 800,
              fontSize: fontSizePx,
              color,
              WebkitTextStroke: "5px rgba(0,0,0,0.8)",
              paintOrder: "stroke fill",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ color: "#FFD54A" }}>▸</span>
            {it}
          </div>
        );
      })}
    </div>
  );
};
