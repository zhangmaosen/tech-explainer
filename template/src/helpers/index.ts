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
  totalFrames: number;
  audioTrack: string;
  shots: Shot[];
};

// 竖屏安全区常量
export const SAFE = { captionY: 1360, contentTop: 420, contentBottom: 1280 };
