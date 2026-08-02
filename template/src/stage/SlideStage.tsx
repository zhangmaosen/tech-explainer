// SlideStage — 陈列类舞台。规范: references/stages/slide.md
// 铺背景 + 安全区 + 挂字幕; children 是本句的贴纸组件。
import React from "react";
import { AbsoluteFill } from "remotion";
import { KaraokeCaption, CaptionChunk } from "../caption/KaraokeCaption";
import { CanvasSpec, CANVAS } from "../helpers";

export const SlideStage: React.FC<{
  chunks: CaptionChunk[];
  bg?: string;
  captionColor?: string;
  canvas?: CanvasSpec; // 缺省 v916 (向后兼容)
  children?: React.ReactNode;
}> = ({ chunks, bg, captionColor, canvas = CANVAS.v916, children }) => {
  const { safe } = canvas;
  return (
    <AbsoluteFill
      style={{
        background:
          bg ??
          "radial-gradient(circle at 50% 35%, #1a2740 0%, #0b1220 70%, #060a12 100%)",
      }}
    >
      {/* 网格纹理 */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {children}
      <KaraokeCaption
        chunks={chunks}
        activeColor={captionColor ?? "#FFD54A"}
        x={safe.captionX}
        y={safe.captionY}
        width={safe.captionWidth}
        fontSizePx={safe.captionFontSize}
      />
    </AbsoluteFill>
  );
};
