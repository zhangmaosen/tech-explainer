// shotPlans.ts — 项目 creative: 每句的舞台/皮肤/贴纸层/SFX。键 = 句号。
// 画布 h169 (1920×1080), 内容安全区 y140–900 x120–1800, 字幕带 y940。
import type { ShotPlan } from "./Explainer";

export const shotPlans: Record<string, ShotPlan> = {
  // S01 钩子: 冠军独享聚光灯 (胜利姿态), 奖杯钉"圣杯"
  S01: {
    theater: {
      characters: [
        { id: "champ", src: "assets/sticker/champion_highlight.png", slot: "left", lit: true, enterFrom: "left", startFrame: 0 },
      ],
    },
    layers: [
      { sticker: "sticker-image", props: { src: "assets/sticker/trophy_sticker.png", keyword: "圣杯", x: 1240, y: 280, width: 400 } },
    ],
    sfx: [{ src: "assets/sfx/whoosh.mp3", frame: 0 }],
  },
  // S02 挑战者进场: versus 皮肤全套 (banner + VS徽章钉"冲锋")
  S02: {
    theater: {
      characters: [
        { id: "champ", src: "assets/sticker/champion_idle.png", slot: "left", lit: true, enterFrom: "none" },
        { id: "chal", src: "assets/sticker/challenger_idle.png", slot: "right", lit: true, enterFrom: "right", startFrame: 6 },
      ],
      skin: "versus",
      skinProps: {
        banner: { leftLabel: "卫冕冠军", rightLabel: "挑战者" },
        vsBadge: { keyword: "冲锋", y: 360 },
      },
    },
    layers: [],
    sfx: [{ src: "assets/sfx/whoosh.mp3", frame: 6 }, { src: "assets/sfx/impact.mp3", frame: 96 }],
  },
  // S03 圣杯揭晓: 大字
  S03: {
    layers: [
      { sticker: "title-pop", props: { text: "全流量分级燃烧", fontSizePx: 150, y: 420 } },
    ],
  },
  // S04 开式循环单图: 圈"废气"钉"漏油"
  S04: {
    layers: [
      { sticker: "sticker-image", props: { src: "assets/bg/open_cycle_diagram.png", x: 360, y: 250, width: 1200, float: false } },
      { sticker: "marker-highlight", props: { keyword: "漏油", x: 1330, y: 330, width: 240, height: 300, variant: "circle" } },
    ],
  },
  // S05 机制对比: versus-diagram 双图
  S05: {
    layers: [
      { sticker: "versus-diagram", props: {
        leftSrc: "assets/bg/open_cycle_diagram.png",
        rightSrc: "assets/bg/ffsc_diagram.png",
        question: "全流量凭什么一滴不浪费？",
        imgWidth: 640, imgY: 300,
      } },
    ],
  },
  // S06 恐怖环境: emoji 强调
  S06: {
    layers: [
      { sticker: "emoji-pop", props: { emoji: "🔥", keyword: "烧起来", x: 830, y: 340, sizePx: 260 } },
    ],
  },
  // S07 苏美皆败: 列表
  S07: {
    layers: [
      { sticker: "list-flyin", props: { items: ["苏联 试过", "美国 试过", "全都倒在高温富氧"], top: 300, x: 480, width: 960 } },
    ],
  },
  // S08 SX500 合金: 左贴纸右参数卡 (钉"八百三十")
  S08: {
    layers: [
      { sticker: "sticker-image", props: { src: "assets/sticker/alloy_sticker.png", x: 220, y: 300, width: 460 } },
      { sticker: "data-card", props: {
        title: "SX500 超级合金",
        rows: [
          { label: "抗压", value: "830 bar", color: "#FFD54A" },
          { label: "类比", value: "8000米深海" },
          { label: "地位", value: "自研独家", color: "#4ADE80" },
        ],
        keyword: "八百三十", x: 950, y: 260, width: 720,
      } },
    ],
  },
  // S09 推力: 数字滚动 + 猛禽进化链
  S09: {
    layers: [
      { sticker: "number-roll", props: { target: 280, suffix: "吨", keyword: "二百八十", fontSizePx: 200, y: 240 } },
      { sticker: "evolution-chain", props: {
        nodes: [{ label: "Raptor1" }, { label: "Raptor2" }, { label: "Raptor3" }],
        x: 450, y: 720, nodeWidth: 280, startFrame: 20,
      } },
    ],
    sfx: [{ src: "assets/sfx/ding.mp3", frame: 60 }],
  },
  // S10 推重比: 对比条 (轿车 vs 蓝鲸)
  S10: {
    layers: [
      { sticker: "compare-bar", props: {
        left: { label: "发动机自重 ≈ 一台轿车", value: 1, color: "#9AA7C7" },
        right: { label: "推力 ≈ 两头蓝鲸", value: 2, color: "#FFD54A", lead: true },
        suffix: "倍", top: 300, x: 320, barMaxWidth: 1100,
      } },
    ],
  },
  // S11 成本: 3D打印压缩链 (钉"一百万")
  S11: {
    layers: [
      { sticker: "evolution-chain", props: {
        nodes: [
          { label: "2个月", sub: "传统制造" },
          { label: "2-3天", sub: "3D打印" },
          { label: "$100万", sub: "目标成本" },
        ],
        keyword: "一百万", x: 330, y: 420, nodeWidth: 340,
      } },
    ],
    sfx: [{ src: "assets/sfx/ding.mp3", frame: 40 }],
  },
  // S12 中国打法: 挑战者聚光灯, 冠军压暗
  S12: {
    theater: {
      characters: [
        { id: "champ", src: "assets/sticker/champion_idle.png", slot: "left", lit: false, enterFrom: "none" },
        { id: "chal", src: "assets/sticker/challenger_idle.png", slot: "right", lit: true, enterFrom: "none" },
      ],
    },
    layers: [],
  },
  // S13 YF-215: 挑战者角色卡 (钉"二一五")
  S13: {
    theater: {
      characters: [
        { id: "chal", src: "assets/sticker/challenger_idle.png", slot: "right", lit: true, enterFrom: "none", width: 400 },
      ],
    },
    layers: [
      { sticker: "fighter-card", props: {
        name: "YF-215",
        side: "right",
        rows: [
          { label: "称号", value: "国家队王牌" },
          { label: "推力", value: "200吨级" },
          { label: "必杀技", value: "长征九号专配" },
        ],
        keyword: "二一五", x: 100, y: 200, width: 600,
      } },
    ],
  },
  // S14 民营齐发: 列表
  S14: {
    layers: [
      { sticker: "list-flyin", props: { items: ["蓝箭", "星梭", "火圣", "全流量全线爆发"], top: 280, x: 560, width: 800 } },
    ],
  },
  // S15 铜合金上真机: 火箭贴纸
  S15: {
    layers: [
      { sticker: "sticker-image", props: { src: "assets/sticker/rocket_sticker.png", x: 710, y: 220, width: 500 } },
    ],
  },
  // S16 见分晓: 双方对峙 (第二次 VS徽章)
  S16: {
    theater: {
      characters: [
        { id: "champ", src: "assets/sticker/champion_highlight.png", slot: "left", lit: true, enterFrom: "none" },
        { id: "chal", src: "assets/sticker/challenger_idle.png", slot: "right", lit: true, enterFrom: "none" },
      ],
      skin: "versus",
      skinProps: { vsBadge: { startFrame: 12, y: 360 } },
    },
    layers: [],
    sfx: [{ src: "assets/sfx/impact.mp3", frame: 12 }],
  },
  // S17 结尾引导: 大字
  S17: {
    layers: [
      { sticker: "title-pop", props: { text: "谁能笑到最后", fontSizePx: 140, y: 400, color: "#FFD54A" } },
    ],
  },
};
