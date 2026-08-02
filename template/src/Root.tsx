// Root.tsx — 注册 Composition, 读 timeline.json (通过 input props 注入)。
import React from "react";
import { Composition } from "remotion";
import { Explainer } from "./Explainer";
import { Cover } from "./Cover";
import { shotPlans } from "./shotPlans";
import { getCanvas } from "./helpers";
import type { Timeline } from "./helpers";
import timelineData from "./timeline.json";

const timeline = timelineData as unknown as Timeline;
const canvas = getCanvas(timeline);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Explainer"
        component={Explainer}
        durationInFrames={timeline.totalFrames}
        fps={timeline.fps}
        width={timeline.width}
        height={timeline.height}
        defaultProps={{
          timeline,
          shotPlans,
          audioPath: "audio/full.mp3",
        }}
      />
      <Composition
        id="Cover"
        component={Cover}
        durationInFrames={1}
        fps={30}
        width={canvas.width}
        height={canvas.height}
        defaultProps={{
          title: "圣杯对决",
          stickerSrc: "assets/sticker/champion_idle.png",
          accentColor: "#FFD54A",
          canvas,
        }}
      />
    </>
  );
};
