# skins/versus — 对决皮肤（Theater 第一套皮肤）

**框架**：街机对决——卫冕冠军 vs 挑战者，左右对峙 + 中央 VS。
**适用**：两方博弈叙事（两代产品/两家公司/两种技术路线/中美对标）。
**底盘**：TheaterStage；皮肤只加装饰层 + 提供配方卡。

## 皮肤组件

- **VersusBanner**：顶部左右斜切色板（左红右蓝为默认，可换色），各自称号
  （如"卫冕冠军"/"挑战者"），滑入 12f。可锚 pins 关键词。
- **VsBadge**：中央 VS 徽章砸屏（scale 2.2→1，落定 6f 震屏余韵），锚"对决/对阵"
  类关键词帧，配 SFX impact。

storyboard 写法：
```json
"theater": {
  "characters": [ ... ],
  "skin": "versus",
  "skinProps": {
    "banner": { "leftLabel": "卫冕冠军", "rightLabel": "挑战者" },
    "vsBadge": { "keyword": "对决" }
  }
}
```

## 配方卡

- **fighter-card**（`skins/versus/FighterCard.tsx`）：角色参数卡 = DataCard 对决特化。
  行项惯例：代号（卡标题）/ 称号 / 战绩 / 必杀技（=该实体的核心优势知识点）。
  ≤4 行；左角色暖色、右角色冷色。用法：角色被介绍的句子里，卡在角色同侧弹出。
- **evolution-chain**（`skins/versus/EvolutionChain.tsx`）：进化链 Lv.1→Lv.MAX，
  2–4 节点错峰弹出，末节点高亮。用于"迭代史"叙事句。

## 克制条款（防 P2/Q4）

- 像素风、霓虹满屏 HUD、combo 计数、倒计时：**不取**（太闹，违反 V2）。
- VS 徽章全片至多砸 1–2 次；banner 在首个对决句出现后可省略。
- 光效：VS 徽章一次光晕 + fighter-card 无边光；不群发。
- 角色不配音、无气泡；旁白仍是裁判式解说。
- 版式：fighter-card 放角色**上方或外侧**（卡宽 ≤520 时 x 贴边 80），别压角色本体；
  evolution-chain 总长 = n×nodeWidth + (n-1)×90，放右下角时预留右边界 ≥60。

## SFX 约定

- 角色进场：whoosh；VS 徽章/fighter-card 弹出：impact；进化链节点落定：ding。
- 音效文件在 `assets/sfx/`（项目 public/assets/sfx/），由 shot plan 的 `sfx` 字段
  按帧触发，volume 0.6。
