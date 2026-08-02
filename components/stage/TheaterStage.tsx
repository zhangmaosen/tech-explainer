// TheaterStage — 舞台剧类舞台底盘。规范: references/stages/theater.md
// 多层布景: 幕布背景 → 舞台地板 → 聚光灯 → 角色 → 道具(children) → 皮肤装饰(skin) → 字幕。
// 底盘与皮肤无关: 皮肤(versus 等)只提供装饰层 ReactNode, 不动角色调度。
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame } from "remotion";
import { KaraokeCaption, CaptionChunk } from "../caption/KaraokeCaption";
import { CanvasSpec, CANVAS, easeOutCubic } from "../helpers";

export type TheaterCharacter = {
  id: string;
  src: string; // public/ 相对路径 (透明底角色贴纸)
  slot: "left" | "center" | "right";
  lit?: boolean; // 聚光灯: true=打亮, false=压暗 (默认 true)
  width?: number;
  enterFrom?: "left" | "right" | "none"; // 进场方向; none=已在台上
  startFrame?: number; // 进场帧 (相对 shot)
  rotate?: number; // 吃瘪/情绪倾斜
  dimmed?: boolean; // 压暗(吃瘪/退场情绪) 比 lit=false 更强
};

// 站位: 按画布宽度比例
const slotX = (slot: "left" | "center" | "right", cw: number) =>
  slot === "left" ? cw * 0.24 : slot === "right" ? cw * 0.76 : cw * 0.5;

const Character: React.FC<{ c: TheaterCharacter; canvas: CanvasSpec }> = ({ c, canvas }) => {
  const frame = useCurrentFrame();
  const { width: CW, height: CH } = canvas;
  const w = c.width ?? CH * 0.42;
  const cx = slotX(c.slot, CW);
  const start = c.startFrame ?? 0;
  const enterFrom = c.enterFrom ?? "none";
  const p =
    enterFrom === "none"
      ? 1
      : interpolate(frame, [start, start + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOutCubic,
        });
  const slideFrom = enterFrom === "left" ? -w * 1.5 : w * 1.5;
  const x = cx - w / 2 + (enterFrom === "none" ? 0 : slideFrom * (1 - p));
  // 落地后 idle 呼吸浮动
  const bob = p >= 1 ? Math.sin((frame - start) / 22) * CH * 0.006 : 0;
  const baseY = CH * 0.86 - w; // 脚站在地板线上
  const lit = c.lit !== false && !c.dimmed;
  const brightness = c.dimmed ? 0.35 : lit ? 1 : 0.5;
  return (
    <React.Fragment>
      {/* 角色脚下聚光池 */}
      {lit && p > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: cx - w * 0.75,
            top: CH * 0.82,
            width: w * 1.5,
            height: CH * 0.1,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,220,120,0.22) 0%, rgba(255,220,120,0) 70%)",
            opacity: p,
          }}
        />
      )}
      <Img
        src={staticFile(c.src)}
        style={{
          position: "absolute",
          left: x,
          top: baseY + bob,
          width: w,
          opacity: p,
          transform: `rotate(${c.rotate ?? 0}deg)`,
          filter: `brightness(${brightness}) saturate(${lit ? 1 : 0.5}) drop-shadow(0 16px 28px rgba(0,0,0,0.5))`,
        }}
      />
    </React.Fragment>
  );
};

export const TheaterStage: React.FC<{
  chunks: CaptionChunk[];
  characters?: TheaterCharacter[];
  skin?: React.ReactNode; // 皮肤装饰层 (versus 横幅/VS徽章等)
  bg?: string;
  captionColor?: string;
  canvas?: CanvasSpec;
  children?: React.ReactNode; // 道具层 (本句贴纸)
}> = ({ chunks, characters = [], skin, bg, captionColor, canvas = CANVAS.h169, children }) => {
  const { safe, height: CH } = canvas;
  const floorY = CH * 0.86;
  return (
    <AbsoluteFill
      style={{
        background:
          bg ??
          "radial-gradient(ellipse at 50% 20%, #232c4a 0%, #0d1322 55%, #05080f 100%)",
      }}
    >
      {/* 幕布两侧暗角 */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* 舞台地板 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: floorY,
          width: "100%",
          height: CH - floorY,
          background:
            "linear-gradient(180deg, rgba(60,70,110,0.35) 0%, rgba(10,14,24,0.9) 100%)",
          borderTop: "2px solid rgba(140,160,220,0.25)",
        }}
      />
      {/* 角色层 */}
      {characters.map((c) => (
        <Character key={c.id} c={c} canvas={canvas} />
      ))}
      {/* 道具层 */}
      {children}
      {/* 皮肤装饰层 */}
      {skin}
      {/* 字幕层 */}
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
