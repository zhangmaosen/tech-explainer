// VsBadge — versus 皮肤: 中央 VS 徽章砸屏入场 (过冲 + 震屏余韵)。配方卡: skins/versus.md
import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, overshoot } from "../../helpers";

export const VsBadge: React.FC<{
  startFrame?: number;
  y?: number;
  sizePx?: number;
}> = ({ startFrame = 0, y = 380, sizePx = 150 }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, startFrame, 14, overshoot);
  const scale = 2.2 - 1.2 * p; // 从巨大砸到定型
  // 落定后 6f 震屏余韵
  const shake =
    frame >= startFrame + 14 && frame < startFrame + 20
      ? Math.sin((frame - startFrame - 14) * 2.4) * 5
      : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: y + shake,
        left: 0,
        width: "100%",
        textAlign: "center",
        opacity: p,
        transform: `scale(${scale})`,
        fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
        fontWeight: 900,
        fontSize: sizePx,
        fontStyle: "italic",
        color: "#FFD54A",
        WebkitTextStroke: "6px rgba(0,0,0,0.9)",
        paintOrder: "stroke fill",
        textShadow: "0 0 34px rgba(255,180,60,0.5), 0 8px 24px rgba(0,0,0,0.6)",
      }}
    >
      VS
    </div>
  );
};
