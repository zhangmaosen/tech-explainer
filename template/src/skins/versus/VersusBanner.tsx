// VersusBanner — versus 皮肤: 顶部对决称号横幅 (左/右斜切色板)。配方卡: skins/versus.md
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { easeOutCubic } from "../../helpers";

export const VersusBanner: React.FC<{
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
  startFrame?: number;
  canvasWidth?: number;
}> = ({
  leftLabel,
  rightLabel,
  leftColor = "#E8452C",
  rightColor = "#2C7BE5",
  startFrame = 0,
  canvasWidth = 1920,
}) => {
  const frame = useCurrentFrame();
  const plateW = canvasWidth * 0.3;
  const h = 84;
  const slide = (dir: -1 | 1) =>
    interpolate(frame, [startFrame, startFrame + 12], [dir * plateW, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOutCubic,
    });
  const plate = (
    label: string,
    color: string,
    side: "left" | "right",
  ): React.CSSProperties => ({
    position: "absolute",
    top: 40,
    [side]: 60,
    width: plateW,
    height: h,
    transform: `translateX(${slide(side === "left" ? -1 : 1)}px) skewX(${side === "left" ? -12 : 12}deg)`,
    background: `linear-gradient(90deg, ${color}CC, ${color}66)` ,
    border: `2px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
    fontWeight: 900,
    fontSize: 44,
    letterSpacing: 4,
    color: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    opacity: frame >= startFrame ? 1 : 0,
  });
  return (
    <React.Fragment>
      <div style={plate(leftLabel, leftColor, "left")}>{leftLabel}</div>
      <div style={plate(rightLabel, rightColor, "right")}>{rightLabel}</div>
    </React.Fragment>
  );
};
