# tech-explainer

把一篇科技/财经文章，改造成面向视频号大众传播的**竖屏（9:16）口播解说视频**：
大幅重构、只取一个爆点，口播用 Edge TTS（词级时间戳），画面用贴纸动画（Remotion 渲染），
素材用本地 ComfyUI 预生成。三种舞台隐喻（陈列 / 舞台剧 / 地图）。

> 输入：一篇科技/财经文章
> 输出：1080×1920 竖屏 mp4，黄金 3 秒钩子 + 单点爆破 + 卡拉OK词级字幕 + 音画钉帧

## 快速开始

把本仓库交给 Agent（Claude Code / Codex 等），让它安装为 skill；或手动：

```bash
git clone <repo>
ln -s "$(pwd)/tech-explainer" ~/.claude/skills/tech-explainer   # Claude Code
# 或
ln -s "$(pwd)/tech-explainer" ~/.codex/skills/tech-explainer    # Codex
```

然后对 Agent 说：

```
用 tech-explainer 把这篇文章做成视频号解说视频：<文章路径或链接>
```

## 依赖（首跑 `scripts/setup.py` 预检）
- Node 18+ / npx / ffmpeg（Remotion 渲染）
- `pip install edge-tts`（配音，**需联网**，免费）
- 本地 ComfyUI HTTP（可选，图片素材预生成；缺了可先纯文字/程序贴纸跑通）

## 六阶段流水线
`references/pipeline.md`：爆点提取 → 脚本 → 分镜 → 素材预生成 → 配音时间轴 → 渲染 → 自检。
详见 `SKILL.md`（Agent 入口）与 `references/` 全套方法论文档。

## 仓库结构
```
tech-explainer/
├── SKILL.md                 # Agent 入口 + 铁律 + 何时读哪个文件
├── references/
│   ├── pipeline.md          # 六阶段流水线
│   ├── hook-and-script.md   # 爆点提取 + 视频号爆款脚本结构
│   ├── stages/              # slide / theater / map 三种舞台规范
│   ├── sticker-cards/       # 贴纸配方卡（title-pop, number-roll, list-flyin…）
│   ├── tts-timing.md        # Edge TTS 词级时间戳 → 帧级时间轴
│   ├── comfyui-assets.md    # ComfyUI 预生成 + 参考图一致性
│   ├── caption-rules.md     # 卡拉OK式句内词高亮 + 竖屏可读性
│   └── douyin-video-rules.md# 视频号爆款判例式自检准则
├── components/              # 通用 Remotion 组件（stage/stickers/caption/helpers）
├── scripts/                 # tts_client / comfyui_client / build_timeline / setup
├── template/                # 已验收的 Slide 完整样片工程（换文章复现入口）
└── assets/                  # 音频/字体/workflows 占位
```

## 三种舞台（实现分里程碑）
- **Slide 陈列**（已实现）：数据罗列/对比/要点拆解，最稳。
- **Theater 舞台剧**（设计已定，里程碑2）：冲突/拟人叙事。
- **Map 地图引导**（设计已定，里程碑3）：流程/发展史/因果链。

## 通用性原则
skill 本体零文章特化：爆点/脚本/舞台判断/配方卡/组件全是通用方法论与词汇；
某篇文章的产物（脚本/素材/成片）归项目工作目录，只有通用规则改进才回流 skill。
详见 `SKILL.md` 的"迭代与打磨纪律"。

## 样片
`template/` 是用 article_raptor（火箭发动机圣杯竞赛）跑通的 77s Slide 成片。

MIT License.
