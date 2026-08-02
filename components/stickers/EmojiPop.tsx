// EmojiPop — 情绪图标弹入。配方卡: sticker-cards/emoji-pop.md
import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, overshoot } from "../helpers";

export const EmojiPop: React.FC<{
  emoji: string;
  startFrame?: number;
  x?: number;
  y?: number;
  sizePx?: number;
}> = ({ emoji, startFrame = 0, x = 780, y = 480, sizePx = 140 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, startFrame, 10, overshoot);
  const rot = (1 - p) * -20;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        fontSize: sizePx,
        opacity: p,
        transform: `scale(${p}) rotate(${rot}deg)`,
      }}
    >
      {emoji}
    </div>
  );
};
