// Cover.tsx — 独立封面合成 (1080x1920 静帧)。钩子 ≤8 字超大字 + 主贴纸占屏40%+。
// 规则见 douyin-video-rules H4: 缩略图尺寸下标题可读。
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const Cover: React.FC<{
  title: string;         // 钩子文案 ≤8 字
  stickerSrc?: string;   // 主贴纸 (public/ 相对路径)
  accentColor?: string;
}> = ({ title, stickerSrc, accentColor = "#FFD54A" }) => {
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
            top: 260,
            left: 190,
            width: 700,
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
          fontWeight: 900,
          fontSize: 250,
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
