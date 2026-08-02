// Explainer.tsx — 主 Composition。读 timeline.json, 逐句调度舞台+贴纸+字幕。
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Timeline, Shot } from "./helpers";
import { SlideStage } from "./stage/SlideStage";
import { TitlePop } from "./stickers/TitlePop";
import { NumberRoll } from "./stickers/NumberRoll";
import { ListFlyin } from "./stickers/ListFlyin";
import { CompareBar } from "./stickers/CompareBar";
import { EmojiPop } from "./stickers/EmojiPop";
import { MarkerHighlight } from "./stickers/MarkerHighlight";
import { StickerImage } from "./stickers/StickerImage";

// 每句的画面 = 若干层贴纸 (归项目 creative)。键 = 句号。
export type Layer = { sticker: string; props: Record<string, any> };
export type ShotPlan = { layers: Layer[]; captionColor?: string };

const ShotRenderer: React.FC<{ shot: Shot; plan: ShotPlan }> = ({ shot, plan }) => {
  return (
    <SlideStage chunks={shiftChunks(shot)} captionColor={plan.captionColor}>
      {plan.layers.map((l, i) => (
        <React.Fragment key={i}>{renderSticker(l.sticker, l.props, shot)}</React.Fragment>
      ))}
    </SlideStage>
  );
};

function shiftChunks(shot: Shot) {
  return (shot.chunks ?? []).map((c) => ({
    fromFrame: c.fromFrame - shot.fromFrame,
    toFrame: c.toFrame - shot.fromFrame,
    text: c.text,
    words: c.words.map((w) => ({
      text: w.text,
      fromFrame: w.fromFrame - shot.fromFrame,
      toFrame: w.toFrame - shot.fromFrame,
    })),
  }));
}

function renderSticker(sticker: string, p: Record<string, any>, shot: Shot) {
  const pinFrame = (kw?: string) => {
    const pin = shot.pins.find((x) => (kw ? x.keyword === kw : true));
    return pin ? pin.frame - shot.fromFrame : undefined;
  };
  switch (sticker) {
    case "title-pop":
      return <TitlePop text={p.text} color={p.color} fontSizePx={p.fontSizePx} y={p.y} />;
    case "number-roll":
      return (
        <NumberRoll
          target={p.target}
          suffix={p.suffix}
          decimals={p.decimals}
          hitFrame={pinFrame(p.keyword) ?? 20}
          color={p.color}
          fontSizePx={p.fontSizePx}
          y={p.y}
        />
      );
    case "list-flyin":
      return <ListFlyin items={p.items} fontSizePx={p.fontSizePx} top={p.top} />;
    case "compare-bar":
      return <CompareBar left={p.left} right={p.right} suffix={p.suffix} top={p.top} />;
    case "emoji-pop":
      return <EmojiPop emoji={p.emoji} x={p.x} y={p.y} sizePx={p.sizePx} />;
    case "marker-highlight":
      return (
        <MarkerHighlight x={p.x} y={p.y} width={p.width} color={p.color} variant={p.variant} />
      );
    case "sticker-image":
      return (
        <StickerImage
          src={p.src}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
          x={p.x}
          y={p.y}
          width={p.width}
          rotate={p.rotate}
          float={p.float}
        />
      );
    default:
      return null;
  }
}

export const Explainer: React.FC<{
  timeline: Timeline;
  shotPlans: Record<string, ShotPlan>;
  audioPath: string;
}> = ({ timeline, shotPlans, audioPath }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#060a12" }}>
      <Audio src={staticFile(audioPath)} />
      {timeline.shots.map((shot) => (
        <Sequence
          key={shot.id}
          from={shot.fromFrame}
          durationInFrames={shot.durationFrames}
        >
          <ShotRenderer shot={shot} plan={shotPlans[shot.id] ?? { layers: [] }} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
