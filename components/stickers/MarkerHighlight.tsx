// MarkerHighlight — 手绘马克笔圈/下划线。配方卡: sticker-cards/marker-highlight.md
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { easeOutCubic } from "../helpers";

export const MarkerHighlight: React.FC<{
  startFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  variant?: "underline" | "circle";
}> = ({ startFrame = 0, x = 200, y = 900, width = 680, height = 120,
       color = "#FFE24A", variant = "underline" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic,
  });
  if (variant === "circle") {
    const path = `M ${width*0.5} 8 C ${width*0.95} 4, ${width*1.02} ${height*0.55}, ${width*0.5} ${height-8} C ${-width*0.04} ${height*0.55}, ${width*0.05} 4, ${width*0.5} 8`;
    const len = 2000;
    return (
      <svg style={{ position: "absolute", left: x, top: y }} width={width} height={height}>
        <path d={path} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={len} strokeDashoffset={len * (1 - p)}
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }} />
      </svg>
    );
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, width: width * p, height,
      background: color, borderRadius: height / 2, opacity: 0.55,
      transform: "skewX(-3deg)" }} />
  );
};
