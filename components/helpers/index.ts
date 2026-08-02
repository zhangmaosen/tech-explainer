// helpers — 缓动/种子随机/词级高亮工具。确定性渲染: 禁 Math.random, 一切固定种子。
import { interpolate, Easing } from "remotion";

// mulberry32 固定种子伪随机
export function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 过冲弹入 (title-pop / emoji-pop 用)
export const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);
export const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);
export const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);

// 入场进度 0→1
export function enter(frame: number, from: number, dur: number, easing = easeOutCubic) {
  return interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export type Word = { text: string; fromFrame: number; toFrame: number };
export type Chunk = {
  fromFrame: number;
  toFrame: number;
  text: string;
  words: Word[];
};
export type Pin = { keyword: string; sticker?: string | null; frame: number };
export type Shot = {
  id: string;
  text: string;
  fromFrame: number;
  durationFrames: number;
  stage?: string | null;
  sticker?: string | null;
  words: Word[];
  chunks: Chunk[];
  pins: Pin[];
  audio: string;
};
export type Timeline = {
  fps: number;
  width: number;
  height: number;
  canvas?: string; // 画布预设 id: "h169" | "v916" | "v34" (缺省按 width/height 推断)
  totalFrames: number;
  audioTrack: string;
  shots: Shot[];
};

// ---- 画布预设 (默认主力 h169 横屏; v916 竖屏信息流; v34 折中) ----
export type CanvasSpec = {
  id: string;
  width: number;
  height: number;
  safe: {
    captionY: number; // 字幕容器 top
    captionX: number; // 字幕容器 left
    captionWidth: number;
    captionFontSize: number;
    contentTop: number; // 内容安全区上沿
    contentBottom: number; // 内容安全区下沿
    marginX: number; // 内容左右边距
  };
};

export const CANVAS: Record<string, CanvasSpec> = {
  h169: {
    id: "h169",
    width: 1920,
    height: 1080,
    safe: {
      captionY: 940,
      captionX: 120,
      captionWidth: 1680,
      captionFontSize: 72,
      contentTop: 140,
      contentBottom: 900,
      marginX: 120,
    },
  },
  v916: {
    id: "v916",
    width: 1080,
    height: 1920,
    safe: {
      captionY: 1420,
      captionX: 30,
      captionWidth: 1020,
      captionFontSize: 72,
      contentTop: 420,
      contentBottom: 1280,
      marginX: 30,
    },
  },
  v34: {
    id: "v34",
    width: 1080,
    height: 1440,
    safe: {
      captionY: 1140,
      captionX: 60,
      captionWidth: 960,
      captionFontSize: 70,
      contentTop: 320,
      contentBottom: 1080,
      marginX: 60,
    },
  },
};

// 解析画布: 显式 canvas id 优先, 否则按 width/height 匹配, 兜底 h169
export function getCanvas(t: { width: number; height: number; canvas?: string }): CanvasSpec {
  if (t.canvas && CANVAS[t.canvas]) return CANVAS[t.canvas];
  const hit = Object.values(CANVAS).find((c) => c.width === t.width && c.height === t.height);
  return hit ?? CANVAS.h169;
}
