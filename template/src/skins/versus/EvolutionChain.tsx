// EvolutionChain — versus 皮肤配方卡: 进化链 (Lv.1 → Lv.2 → Lv.MAX)。节点错峰弹出。
import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, overshoot } from "../../helpers";

export type EvoNode = { label: string; sub?: string; highlight?: boolean };

export const EvolutionChain: React.FC<{
  nodes: EvoNode[]; // 2–4 个
  x: number;
  y: number;
  nodeWidth?: number;
  startFrame?: number;
  accentColor?: string;
}> = ({ nodes, x, y, nodeWidth = 340, startFrame = 0, accentColor = "#FFD54A" }) => {
  const frame = useCurrentFrame();
  const arrowW = 90;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center" }}>
      {nodes.map((n, i) => {
        const p = enter(frame, startFrame + i * 10, 12, overshoot);
        const hl = n.highlight || i === nodes.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  width: arrowW,
                  textAlign: "center",
                  fontSize: 56,
                  color: "#8FA0C8",
                  opacity: enter(frame, startFrame + i * 10 - 4, 8),
                  fontFamily: "'Noto Sans SC',sans-serif",
                  fontWeight: 900,
                }}
              >
                ➤
              </div>
            )}
            <div
              style={{
                width: nodeWidth,
                padding: "22px 12px",
                textAlign: "center",
                background: hl ? "rgba(60,46,10,0.85)" : "rgba(14,20,36,0.82)",
                border: `3px solid ${hl ? accentColor : "rgba(120,150,220,0.35)"}`,
                borderRadius: 12,
                opacity: p,
                transform: `scale(${0.5 + 0.5 * p})`,
                fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
                boxShadow: hl ? `0 0 26px ${accentColor}44` : "0 10px 24px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: hl ? accentColor : "#FFFFFF",
                }}
              >
                {n.label}
              </div>
              {n.sub && <div style={{ fontSize: 36, color: "#9AA7C7", marginTop: 6 }}>{n.sub}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
