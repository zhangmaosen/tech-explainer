// KaraokeCaption — 一屏一组(≤13字), 组内当前词高亮 (卡拉OK式)。
// 分组由 build_timeline.py chunking 产出, 见 references/caption-rules.md
import React from "react";
import { useCurrentFrame } from "remotion";

export type CaptionWord = { text: string; fromFrame: number; toFrame: number };
export type CaptionChunk = {
  fromFrame: number;
  toFrame: number;
  text: string;
  words: CaptionWord[];
};

export const KaraokeCaption: React.FC<{
  chunks: CaptionChunk[]; // 相对该 shot 的帧
  activeColor?: string;
  idleColor?: string;
  readColor?: string;
  fontSizePx?: number;
  strokePx?: number;
  y?: number;
}> = ({
  chunks,
  activeColor = "#FFD54A",
  idleColor = "#E8E8E8",
  readColor = "#FFFFFF",
  fontSizePx = 72,
  strokePx = 5,
  y = 1420,
}) => {
  const frame = useCurrentFrame();
  // 当前组: frame 落在组内; 间隙期取最近一组(已完成则最后一组, 未开始则第一组)
  let cur = chunks.findIndex((c) => frame >= c.fromFrame && frame < c.toFrame);
  if (cur === -1) {
    cur = chunks.findIndex((c) => frame < c.fromFrame);
    if (cur === -1) cur = chunks.length - 1;
  }
  const chunk = chunks[cur];
  if (!chunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 60,
        width: 960,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 4px",
        fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
        fontWeight: 900,
        fontSize: fontSizePx,
        lineHeight: 1.2,
        textAlign: "center",
      }}
    >
      {chunk.words.map((w, i) => {
        const isActive = frame >= w.fromFrame && frame < w.toFrame;
        const isRead = frame >= w.toFrame;
        const color = isActive ? activeColor : isRead ? readColor : idleColor;
        const scale = isActive ? 1.14 : 1;
        return (
          <span
            key={i}
            style={{
              color,
              display: "inline-block",
              transform: `scale(${scale})`,
              WebkitTextStroke: `${strokePx}px rgba(0,0,0,0.85)`,
              paintOrder: "stroke fill",
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
