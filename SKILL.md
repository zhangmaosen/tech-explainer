---
name: tech-explainer
description: 把一篇科技或财经文章改造成面向大众传播的口播解说视频（默认 16:9 横屏 · 口播+贴纸动画，画布可切 9:16/3:4）。大幅重构文章、只取一个爆点，用 Remotion 渲染、Edge TTS 词级配音、本地 ComfyUI 预生成素材。三种舞台隐喻（陈列/舞台剧/地图）。当用户要求"把这篇文章做成解说视频/科技视频号/财经短视频"，或点名 tech-explainer 时使用。Turn a tech or finance article into a narrated explainer video (16:9 landscape by default, configurable to 9:16/3:4): TTS voiceover + sticker animation, Remotion render, Edge TTS word-level timing, local ComfyUI pre-generated assets, three stage metaphors.
---

# tech-explainer：文章 → 视频号科技解说视频

一个自包含的制作能力库：把任意科技/财经文章，**大幅重构、只取一个爆点**，做成
口播解说视频。**画布三预设：h169 横屏 1920×1080（默认主力）/ v916 竖屏 1080×1920 /
v34 折中**，由 timeline 的 `canvas` 字段驱动，版式规范见 `references/layouts/h169.md`。
口播用 Edge TTS（返回词级时间戳），画面用贴纸动画（Remotion 渲染），素材用本地
ComfyUI 预生成。三种舞台隐喻可选。

**核心目标**：产出**符合视频号爆款方法论**的高质量成片——不承诺具体流量数字，
skill 能控制的是钩子、结构、节奏、信息密度、情绪曲线、可读性和音画钉帧。

## 铁律（先读，违反即返工）

1. **文章是素材不是剧本。** 一篇科技/财经文章逻辑是"论证严谨、信息密集"，视频号
   爆款逻辑是"3 秒钩子、单点爆破、情绪先行"。**从文章里抽取一个最反直觉/最戳
   痛点的核心冲突做单点爆破**，其余信息按是否服务这个爆点来取舍。照着文章念＝
   完播率归零。

2. **通用性是硬约束。** 本 skill 对任意科技/财经文章都要能跑。爆点提取、脚本
   结构、舞台判断、配方卡、组件全部是**方法论/判据/通用词汇**，与具体文章解耦。
   **严禁把某篇文章的内容、角色、数值硬编码进 skill 本体**（见"迭代与打磨纪律"）。

3. **先稿后音，时长驱动排轴。** 脚本定稿→分短句→逐句 Edge TTS 出音频→拿到
   WordBoundary 词级时间戳→用实际音频时长回填 Remotion 时间轴。**镜头帧数由
   音频时长反推，绝不写死。** 字幕和贴纸都锚到词级时间戳。

4. **词级时间戳双用途**：(a) 字幕一屏一句、**句内当前词高亮**（卡拉OK式）；
   (b) 关键贴纸/数字/动画**锚定到关键词时间戳爆出**（音画钉帧）。

5. **素材预生成，渲染时只用静态图。** ComfyUI 在分镜后一次性出图，人工筛废片；
   反复出现的角色靠**参考图锁一致性**。绝不在 Remotion 渲染管线里实时调 ComfyUI。

6. **抽卡适配，不从零写。** 贴纸/舞台组件是预制的（`components/` + `sticker-cards/`
   配方卡）。Claude 每个镜头"抽卡+适配参数"，不每次现写 TSX——这是低成本的前提。

7. **字幕可读性是硬门槛。** 很多人静音刷，字幕必须硬烧、够大（见
   `caption-rules.md`，各画布预设同标准）；黄金 3 秒钩子决定完播。

8. **确定性渲染**：禁 `Date.now()`/`Math.random()`，一切伪随机固定种子。

## 三种舞台隐喻

根据文章**叙事逻辑**动态判断用哪种舞台（不是按文章题材写死映射）：

- **陈列类 Slide**（`stages/slide.md`）：平面、无纵深、元素逐条陈列。适合
  **数据罗列、参数对比、观点并列、榜单**。最稳，第一版主力。
- **舞台剧类 Theater**（`stages/theater.md`）：固定机位单目舞台（通用底盘：多层
  布景+角色调度+聚光灯），角色贴纸进出场。适合**冲突、博弈、拟人化叙事**。
  第一套皮肤 **versus**（`skins/versus.md`：对决横幅/VS徽章/角色卡/进化链）；
  拟人角色设计见 `character-design.md`。
- **地图引导类 Map**（`stages/map.md`）：大画布 + 镜头沿路径平移缩放，节点讲段落。
  适合**流程、发展史、因果链条、"一步步带你走"**。

三种共用阶段 0–4（脚本/素材/配音/时间轴）与字幕、配音层，只有舞台渲染组件不同。

## 六阶段工作流

按 `references/pipeline.md` 从阶段 0 连续执行：

| 阶段 | 做什么 | 读 |
|------|--------|----|
| 0 文章理解与爆点提取 | 抽唯一爆点、定钩子/受众/情绪/舞台类型/**画布** | hook-and-script.md, layouts/ |
| 1 脚本创作 | 视频号结构口播稿，短句，60–120s | hook-and-script.md |
| 2 分镜设计 | 短句→舞台/皮肤/贴纸配方卡+画面+字幕+关键词钉帧+素材清单+角色设定表 | stages/*, skins/*, sticker-cards/ |
| 3 素材预生成 | ComfyUI 一次性出图 + 参考图锁一致性 | comfyui-assets.md, character-design.md |
| 4 配音与时间轴 | 逐句 Edge TTS→词级时间戳→回填帧级时间轴 | tts-timing.md |
| 5 Remotion 渲染 | 抽舞台+贴纸组件适配，卡拉OK字幕，画布预设 | stages/*, layouts/*, caption-rules.md |
| 6 自检 | 对照爆款准则逐条过，带帧号报告 | douyin-video-rules.md |

## 何时读哪个文件

| 时机 | 读 |
|------|----|
| 项目启动 | pipeline.md 全文 |
| 爆点提取 + 写稿 | hook-and-script.md |
| 判断舞台类型 + 分镜 | stages/ 三个规范 + skins/ + sticker-cards/ 全部 frontmatter |
| 选画布/横竖屏版式 | layouts/h169.md（含竖屏附录） |
| 拟人角色设计 | character-design.md |
| 逐镜头实现 | 选中的配方卡全文 + 对应 components/ 组件 |
| 配音与时间轴 | tts-timing.md |
| 素材预生成 | comfyui-assets.md |
| 字幕实现 | caption-rules.md |
| 自检 | douyin-video-rules.md 全文过 checklist |

## 脚本（scripts/）

- `scripts/setup.py` — 预检 remotion / ffmpeg / edge-tts / comfyui 连通性。
- `scripts/tts_client.py` — Edge TTS 适配层：分句合成，返回 `{音频, 词级时间戳}`；
  后端可切 `edge`（默认）/ `local_http`（后期）。失败单句重试。
- `scripts/comfyui_client.py` — ComfyUI HTTP 适配层 + 预生成编排 + 参考图一致性。
- `scripts/build_timeline.py` — 把逐句词级时间戳合成为帧级时间轴 json
  （字幕锚点 + 贴纸钉帧锚点），供 Remotion 读取；`--canvas` 选画布预设。

## 资产使用方式

- `components/` 组件 **copy 进 Remotion 工程**后适配，不 import 本库。
- `template/` 是一支验收过的 Theater(versus)+Slide 混合样片（h169），换素材复现最快。
- 音频 `assets/audio/`、字体 `assets/fonts/`、音效 `assets/sfx/` 直接复制。

## 迭代与打磨纪律（保证通用性）

用真实文章实操打磨时，产物严格分两类：

- **归项目（不进 skill）**：某篇文章的脚本、素材、成片、时间轴——放实操工作目录。
- **归 skill（通用沉淀）**：新准则、新配方卡、组件能力改进、方法论修正——才提交
  进本仓库，且必须写成**抽象规则/通用配方**（判例只作佐证）。

**严禁**把某篇文章的具体内容、角色名、数值、结论写进任何 references/ 或 components/
文件作为默认值。判断标准：换一篇完全不同题材的文章，这条改动还成立吗？不成立就
是文章特化，不许进 skill。
