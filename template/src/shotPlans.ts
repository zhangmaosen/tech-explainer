// shotPlans — v3 每句画什么 (归项目 creative)。机制段用 flow-diagram 面板。
import { ShotPlan } from "./Explainer";

const ST = "assets/sticker/";
const BG = "assets/bg/";

export const shotPlans: Record<string, ShotPlan> = {
  S01: { layers: [
    { sticker: "sticker-image", props: { src: ST + "rocket_sticker.png", width: 560, y: 360, startFrame: 0 } },
    { sticker: "title-pop", props: { text: "圣杯", color: "#FFD54A", fontSizePx: 260, y: 1040 } },
  ]},
  S02: { layers: [
    { sticker: "sticker-image", props: { src: ST + "cn_flag_sticker.png", width: 400, y: 440 } },
    { sticker: "title-pop", props: { text: "中国,冲锋!", color: "#FF5252", fontSizePx: 180, y: 1020 } },
  ]},
  S03: { layers: [
    { sticker: "title-pop", props: { text: "全流量分级燃烧", color: "#4FC3F7", fontSizePx: 140, y: 700 } },
  ]},
  // 机制段 S04-S05: FFSC 流程示意图面板 + marker 跟随
  S04: { layers: [
    { sticker: "sticker-image", props: { src: BG + "ffsc_diagram.png", width: 960, y: 480, startFrame: 0, float: false } },
    { sticker: "marker-highlight", props: { variant: "circle", keyword: "烧掉", x: 80, y: 600, width: 280, height: 340, color: "#FF5252" } },
  ]},
  S05: { layers: [
    { sticker: "sticker-image", props: { src: BG + "ffsc_diagram.png", width: 960, y: 480, startFrame: 0, float: false, noEnter: true } },
    { sticker: "marker-highlight", props: { variant: "circle", keyword: "涡轮", x: 520, y: 560, width: 260, height: 300, color: "#FFE24A" } },
    { sticker: "marker-highlight", props: { variant: "circle", keyword: "燃烧室", x: 730, y: 560, width: 250, height: 350, color: "#69F0AE" } },
  ]},
  S06: { layers: [
    { sticker: "title-pop", props: { text: "金属自己都会烧起来", color: "#FF5252", fontSizePx: 110, y: 680 } },
    { sticker: "emoji-pop", props: { emoji: "🔥", keyword: "金属", x: 800, y: 480, sizePx: 160 } },
  ]},
  S07: { layers: [
    { sticker: "list-flyin", props: { items: ["苏联", "美国"], fontSizePx: 110, top: 620 } },
  ]},
  S08: { layers: [
    { sticker: "sticker-image", props: { src: ST + "alloy_sticker.png", width: 380, y: 420 } },
    { sticker: "number-roll", props: { keyword: "八百三十", target: 830, suffix: "bar", color: "#FF8A65", fontSizePx: 210, y: 940 } },
  ]},
  S09: { layers: [
    { sticker: "number-roll", props: { keyword: "二百八十", target: 280, suffix: "吨", color: "#FFD54A", fontSizePx: 240, y: 640 } },
    { sticker: "title-pop", props: { text: "≈ 四辆主战坦克", color: "#FFFFFF", fontSizePx: 80, y: 1000 } },
  ]},
  S10: { layers: [
    { sticker: "number-roll", props: { keyword: "两头", target: 2, suffix: "头蓝鲸", color: "#4FC3F7", fontSizePx: 200, y: 640 } },
    { sticker: "title-pop", props: { text: "轿车重量的发动机", color: "#FFFFFF", fontSizePx: 80, y: 1000 } },
  ]},
  S11: { layers: [
    { sticker: "title-pop", props: { text: "两个月 → 两三天", color: "#69F0AE", fontSizePx: 130, y: 620 } },
    { sticker: "number-roll", props: { keyword: "一百万", target: 100, suffix: "万美元", color: "#FF8A65", fontSizePx: 170, y: 980 } },
  ]},
  S12: { layers: [
    { sticker: "list-flyin", props: { items: ["国家队", "民营企业"], fontSizePx: 100, top: 620 } },
  ]},
  S13: { layers: [
    { sticker: "sticker-image", props: { src: ST + "cn_flag_sticker.png", width: 380, y: 420 } },
    { sticker: "title-pop", props: { text: "YF-215", color: "#FF5252", fontSizePx: 220, y: 980 } },
  ]},
  S14: { layers: [
    { sticker: "sticker-image", props: { src: ST + "sprint_sticker.png", width: 520, y: 380 } },
    { sticker: "list-flyin", props: { items: ["蓝箭航天", "星梭科技", "火圣宇航"], fontSizePx: 90, top: 950 } },
  ]},
  S15: { layers: [
    { sticker: "sticker-image", props: { src: ST + "alloy_sticker.png", width: 440, y: 420 } },
    { sticker: "title-pop", props: { text: "国产材料已量产", color: "#69F0AE", fontSizePx: 110, y: 1000 } },
  ]},
  S16: { layers: [
    { sticker: "sticker-image", props: { src: ST + "trophy_sticker.png", width: 400, y: 420 } },
    { sticker: "title-pop", props: { text: "就要见分晓", color: "#FFD54A", fontSizePx: 170, y: 1000 } },
  ]},
  S17: { layers: [
    { sticker: "title-pop", props: { text: "谁能笑到最后?", color: "#FFFFFF", fontSizePx: 150, y: 700 } },
  ]},
};
