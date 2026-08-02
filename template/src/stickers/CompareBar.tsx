// CompareBar — 两方数据对比条。配方卡: sticker-cards/compare-bar.md
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { easeOutCubic } from "../helpers";

type Side = { label: string; value: number; color: string; lead?: boolean };

export const CompareBar: React.FC<{
  left: Side;
  right: Side;
  startFrame?: number;
  maxValue?: number;
  suffix?: string;
  top?: number;
  x?: number; // 容器 left (默认 v916 的 80)
  barMaxWidth?: number; // 条最大长 (默认 v916 的 860)
}> = ({ left, right, startFrame = 0, maxValue, suffix = "", top = 640, x = 80, barMaxWidth = 860 }) => {
  const frame = useCurrentFrame();
  const max = maxValue ?? Math.max(left.value, right.value);
  const p = interpolate(frame, [startFrame, startFrame + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutCubic,
  });
  const Bar = (s: Side, delay: number) => {
    const pp = interpolate(
      frame,
      [startFrame + delay, startFrame + delay + 28],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOutCubic }
    );
    const w = (s.value / max) * barMaxWidth * pp;
    return (
      <div style={{ marginBottom: 60 }}>
        <div
          style={{
            fontFamily: "'Noto Sans SC',sans-serif",
            fontWeight: 800,
            fontSize: 62,
            color: "#fff",
            WebkitTextStroke: "4px rgba(0,0,0,0.8)",
            paintOrder: "stroke fill",
            marginBottom: 12,
            opacity: p,
          }}
        >
          {s.label} {s.lead ? "👑" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: w,
              height: 90,
              background: s.color,
              borderRadius: 45,
              boxShadow: s.lead ? "0 0 30px " + s.color : "none",
            }}
          />
          <span
            style={{
              fontFamily: "'Noto Sans SC',sans-serif",
              fontWeight: 900,
              fontSize: 76,
              color: s.color,
              WebkitTextStroke: "4px rgba(0,0,0,0.8)",
              paintOrder: "stroke fill",
              opacity: pp,
            }}
          >
            {(s.value * pp).toFixed(0)}
            {suffix}
          </span>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", top, left: x, width: barMaxWidth + 260 }}>
      {Bar(left, 0)}
      {Bar(right, 8)}
    </div>
  );
};
