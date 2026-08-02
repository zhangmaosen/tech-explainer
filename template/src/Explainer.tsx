// Explainer.tsx — 主 Composition。读 timeline.json, 逐句调度舞台+贴纸+字幕。
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { Timeline, Shot, CanvasSpec, getCanvas } from "./helpers";
import { SlideStage } from "./stage/SlideStage";
import { TheaterStage, TheaterCharacter } from "./stage/TheaterStage";
import { TitlePop } from "./stickers/TitlePop";
import { NumberRoll } from "./stickers/NumberRoll";
import { ListFlyin } from "./stickers/ListFlyin";
import { CompareBar } from "./stickers/CompareBar";
import { EmojiPop } from "./stickers/EmojiPop";
import { MarkerHighlight } from "./stickers/MarkerHighlight";
import { StickerImage } from "./stickers/StickerImage";
import { DataCard } from "./stickers/DataCard";
import { VersusDiagram } from "./stickers/VersusDiagram";
import { VersusBanner } from "./skins/versus/VersusBanner";
import { VsBadge } from "./skins/versus/VsBadge";
import { FighterCard } from "./skins/versus/FighterCard";
import { EvolutionChain } from "./skins/versus/EvolutionChain";

// 每句的画面 = 舞台 + 若干层贴纸 (归项目 creative)。键 = 句号。
export type Layer = { sticker: string; props: Record<string, any> };
export type Sfx = { src: string; frame: number }; // frame 相对该 shot
export type TheaterPlan = {
  characters: TheaterCharacter[];
  skin?: string | null; // "versus" | null
  skinProps?: Record<string, any>;
};
export type ShotPlan = {
  layers: Layer[];
  captionColor?: string;
  theater?: TheaterPlan;
  sfx?: Sfx[];
};

const ShotRenderer: React.FC<{ shot: Shot; plan: ShotPlan; canvas: CanvasSpec }> = ({ shot, plan, canvas }) => {
  const chunks = shiftChunks(shot);
  const layers = plan.layers.map((l, i) => (
    <React.Fragment key={i}>{renderSticker(l.sticker, l.props, shot, canvas)}</React.Fragment>
  ));
  if (plan.theater) {
    return (
      <TheaterStage
        chunks={chunks}
        captionColor={plan.captionColor}
        canvas={canvas}
        characters={plan.theater.characters}
        skin={renderSkin(plan.theater.skin, plan.theater.skinProps ?? {}, shot, canvas)}
      >
        {layers}
      </TheaterStage>
    );
  }
  return (
    <SlideStage chunks={chunks} captionColor={plan.captionColor} canvas={canvas}>
      {layers}
    </SlideStage>
  );
};

function renderSkin(skin: string | null | undefined, p: Record<string, any>, shot: Shot, canvas: CanvasSpec) {
  if (skin !== "versus") return null;
  const pinFrame = (kw?: string) => {
    if (!kw) return undefined;
    const pin = shot.pins.find((x) => x.keyword === kw);
    return pin ? pin.frame - shot.fromFrame : undefined;
  };
  return (
    <React.Fragment>
      {p.banner && (
        <VersusBanner
          leftLabel={p.banner.leftLabel}
          rightLabel={p.banner.rightLabel}
          leftColor={p.banner.leftColor}
          rightColor={p.banner.rightColor}
          startFrame={pinFrame(p.banner.keyword) ?? p.banner.startFrame ?? 0}
          canvasWidth={canvas.width}
        />
      )}
      {p.vsBadge && (
        <VsBadge
          startFrame={pinFrame(p.vsBadge.keyword) ?? p.vsBadge.startFrame ?? 10}
          y={p.vsBadge.y}
          sizePx={p.vsBadge.sizePx}
        />
      )}
    </React.Fragment>
  );
}

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

function renderSticker(sticker: string, p: Record<string, any>, shot: Shot, canvas: CanvasSpec) {
  const cw = canvas.width;
  // 钉帧: 只在显式给 keyword 时匹配; 否则返回 undefined 让组件用自己的 startFrame
  const pinFrame = (kw?: string) => {
    if (!kw) return undefined;
    const pin = shot.pins.find((x) => x.keyword === kw);
    return pin ? pin.frame - shot.fromFrame : undefined;
  };
  switch (sticker) {
    case "title-pop":
      return <TitlePop text={p.text} color={p.color} fontSizePx={p.fontSizePx} y={p.y} width={cw} />;
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
          width={cw}
        />
      );
    case "list-flyin":
      return <ListFlyin items={p.items} fontSizePx={p.fontSizePx} top={p.top} x={p.x} width={p.width} />;
    case "compare-bar":
      return <CompareBar left={p.left} right={p.right} suffix={p.suffix} top={p.top} x={p.x} barMaxWidth={p.barMaxWidth} />;
    case "emoji-pop":
      return (
        <EmojiPop
          emoji={p.emoji}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
          x={p.x}
          y={p.y}
          sizePx={p.sizePx}
        />
      );
    case "marker-highlight":
      return (
        <MarkerHighlight
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
          x={p.x}
          y={p.y}
          width={p.width}
          height={p.height}
          color={p.color}
          variant={p.variant}
        />
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
          noEnter={p.noEnter}
          canvasWidth={cw}
        />
      );
    case "data-card":
      return (
        <DataCard
          title={p.title}
          rows={p.rows}
          x={p.x}
          y={p.y}
          width={p.width}
          accentColor={p.accentColor}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
        />
      );
    case "versus-diagram":
      return (
        <VersusDiagram
          leftSrc={p.leftSrc}
          rightSrc={p.rightSrc}
          question={p.question}
          imgWidth={p.imgWidth}
          imgY={p.imgY}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
          questionColor={p.questionColor}
        />
      );
    case "fighter-card":
      return (
        <FighterCard
          name={p.name}
          rows={p.rows}
          side={p.side}
          x={p.x}
          y={p.y}
          width={p.width}
          accentColor={p.accentColor}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
        />
      );
    case "evolution-chain":
      return (
        <EvolutionChain
          nodes={p.nodes}
          x={p.x}
          y={p.y}
          nodeWidth={p.nodeWidth}
          startFrame={pinFrame(p.keyword) ?? p.startFrame ?? 0}
          accentColor={p.accentColor}
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
  const canvas = getCanvas(timeline);
  return (
    <AbsoluteFill style={{ backgroundColor: "#060a12" }}>
      <Audio src={staticFile(audioPath)} />
      {timeline.shots.map((shot) => (
        <Sequence
          key={shot.id}
          from={shot.fromFrame}
          durationInFrames={shot.durationFrames}
        >
          <ShotRenderer shot={shot} plan={shotPlans[shot.id] ?? { layers: [] }} canvas={canvas} />
          {(shotPlans[shot.id]?.sfx ?? []).map((s, i) => (
            <Sequence key={i} from={s.frame}>
              <Audio src={staticFile(s.src)} volume={0.6} />
            </Sequence>
          ))}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
