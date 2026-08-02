// TitlePop — 大字标题爆出。配方卡: sticker-cards/title-pop.md
import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, overshoot } from "../helpers";

export const TitlePop: React.FC<{
  text: string;
  startFrame?: number;
  color?: string;
  fontSizePx?: number;
  y?: number;
  width?: number; // 画布宽 (默认 v916 1080)
}> = ({ text, startFrame = 0, color = "#FFFFFF", fontSizePx = 200, y = 760, width = 1080 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, startFrame, 16, overshoot);
  const scale = 0.6 + 0.4 * p + (p > 0.6 ? (1 - p) * 0.12 : 0); // 轻过冲
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width,
        textAlign: "center",
        opacity: p,
        transform: `scale(${scale})`,
        fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
        fontWeight: 900,
        fontSize: fontSizePx,
        color,
        WebkitTextStroke: "8px rgba(0,0,0,0.85)",
        paintOrder: "stroke fill",
        textShadow: "0 8px 30px rgba(0,0,0,0.55)",
        lineHeight: 1.05,
      }}
    >
      {text}
    </div>
  );
};
