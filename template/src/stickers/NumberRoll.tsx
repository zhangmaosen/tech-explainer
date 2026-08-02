// NumberRoll — 数字滚动, 命中关键词帧减速停。配方卡: sticker-cards/number-roll.md
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { easeOutExpo } from "../helpers";

export const NumberRoll: React.FC<{
  target: number;
  hitFrame: number; // 命中(读到该数字)的帧
  rollFrames?: number;
  suffix?: string;
  decimals?: number;
  color?: string;
  fontSizePx?: number;
  y?: number;
  width?: number; // 画布宽 (默认 v916 1080)
}> = ({
  target,
  hitFrame,
  rollFrames = 26,
  suffix = "",
  decimals = 0,
  color = "#FFD54A",
  fontSizePx = 180,
  y = 820,
  width = 1080,
}) => {
  const frame = useCurrentFrame();
  const start = hitFrame - rollFrames;
  const p = interpolate(frame, [start, hitFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });
  const val = (target * p).toFixed(decimals);
  const pop = frame >= hitFrame && frame < hitFrame + 6 ? 1.12 : 1;
  const appear = frame >= start ? 1 : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width,
        textAlign: "center",
        opacity: appear,
        transform: `scale(${pop})`,
        fontFamily: "'Noto Sans SC',sans-serif",
        fontWeight: 900,
        fontSize: fontSizePx,
        color,
        WebkitTextStroke: "7px rgba(0,0,0,0.85)",
        paintOrder: "stroke fill",
      }}
    >
      {val}
      <span style={{ fontSize: fontSizePx * 0.55 }}>{suffix}</span>
    </div>
  );
};
