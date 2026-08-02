// StickerImage — ComfyUI 预生成的 PNG 贴纸 (透明底) 弹入。素材在 public/assets/。
import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import { overshoot } from "../helpers";

export const StickerImage: React.FC<{
  src: string; // 相对 public/, 如 "assets/sticker/rocket_sticker.png"
  startFrame?: number;
  x?: number; // 居中锚点 (默认屏中心)
  y?: number;
  width?: number;
  rotate?: number;
  float?: boolean; // 落定后轻微浮动
  noEnter?: boolean; // 跨句持续元素: 跳过入场动画直接定格
  canvasWidth?: number; // 画布宽 (默认 v916 1080)
}> = ({ src, startFrame = 0, x, y = 560, width = 460, rotate = 0, float = true, noEnter = false, canvasWidth = 1080 }) => {
  const frame = useCurrentFrame();
  const p = noEnter ? 1 : interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: overshoot,
  });
  const floatY = float && p >= 1 ? Math.sin((frame - startFrame) / 18) * 10 : 0;
  const left = (x ?? (canvasWidth - width) / 2);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left,
        top: y + floatY,
        width,
        opacity: p,
        transform: `scale(${0.5 + 0.5 * p}) rotate(${rotate}deg)`,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.45))",
      }}
    />
  );
};
