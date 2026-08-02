// Cover.tsx — 独立封面合成 (静帧)。钩子 ≤8 字超大字 + 主贴纸占屏40%+。
// 规则见 douyin-video-rules H4: 缩略图尺寸下标题可读。画布由 props 注入 (默认 v916)。
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CanvasSpec, CANVAS } from "./helpers";

export const Cover: React.FC<{
  title: string;         // 钩子文案 ≤8 字
  stickerSrc?: string;   // 主贴纸 (public/ 相对路径)
  accentColor?: string;
  canvas?: CanvasSpec;
}> = ({ title, stickerSrc, accentColor = "#FFD54A", canvas = CANVAS.v916 }) => {
  const { width: W, height: H } = canvas;
  const landscape = W > H;
  // 横屏: 左大字右贴纸; 竖屏: 上贴纸下大字
  const stickerStyle: React.CSSProperties = landscape
    ? { top: H * 0.16, left: W * 0.6, width: W * 0.34 }
    : { top: H * 0.135, left: W * 0.176, width: W * 0.648 };
  const titleStyle: React.CSSProperties = landscape
    ? { top: H * 0.3, left: W * 0.06, width: W * 0.52, textAlign: "left", fontSize: H * 0.18 }
    : { top: H * 0.6, left: 0, width: W, textAlign: "center", fontSize: W * 0.23 };
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 32%, #1d2c4d 0%, #0b1220 68%, #05080f 100%)",
      }}
    >
      {/* 网格纹理 */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {stickerSrc && (
        <Img
          src={staticFile(stickerSrc)}
          style={{
            position: "absolute",
            ...stickerStyle,
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          ...titleStyle,
          fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
          fontWeight: 900,
          color: accentColor,
          WebkitTextStroke: "12px rgba(0,0,0,0.9)",
          paintOrder: "stroke fill",
          textShadow: "0 10px 40px rgba(0,0,0,0.6)",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
