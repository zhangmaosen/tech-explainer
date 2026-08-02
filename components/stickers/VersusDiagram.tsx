// VersusDiagram — 双图对比讲解: 左右双图 + 居中提问标题 + 差异高亮。
// 配方卡: sticker-cards/versus-diagram.md (横屏原生)
import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import { enter, easeOutCubic, overshoot } from "../helpers";

export const VersusDiagram: React.FC<{
  leftSrc: string;
  rightSrc: string;
  question: string; // 居中提问标题 (问句)
  imgWidth?: number;
  imgY?: number;
  startFrame?: number;
  questionColor?: string;
}> = ({
  leftSrc,
  rightSrc,
  question,
  imgWidth = 640,
  imgY = 300,
  startFrame = 0,
  questionColor = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const qp = enter(frame, startFrame, 12, overshoot);
  const ip = enter(frame, startFrame + 6, 16, easeOutCubic);
  const img = (src: string, x: number) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x,
        top: imgY,
        width: imgWidth,
        opacity: ip,
        transform: `translateY(${(1 - ip) * 26}px)`,
        borderRadius: 14,
        border: "2px solid rgba(120,150,220,0.3)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
      }}
    />
  );
  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: qp,
          transform: `scale(${0.7 + 0.3 * qp})`,
          fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
          fontWeight: 900,
          fontSize: 92,
          color: questionColor,
          WebkitTextStroke: "5px rgba(0,0,0,0.85)",
          paintOrder: "stroke fill",
          textShadow: "0 6px 22px rgba(0,0,0,0.55)",
        }}
      >
        {question}
      </div>
      {img(leftSrc, 180)}
      {img(rightSrc, 1920 - 180 - imgWidth)}
    </React.Fragment>
  );
};
