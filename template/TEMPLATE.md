# template — 已验收的 Slide 样片工程

一支用 article_raptor（火箭发动机圣杯竞赛）跑通全管线的完整 Remotion 工程。
**这是换文章复现的最快路径**：替换 script / storyboard / shotPlans / 素材 / 音频即可。

## 结构
```
template/
├── src/
│   ├── index.ts          # 入口
│   ├── Root.tsx          # 注册 Composition, 读 timeline.json
│   ├── Explainer.tsx     # 主合成: 逐句调度舞台+贴纸+字幕
│   ├── shotPlans.ts      # 每句画什么 (归项目 creative)
│   ├── timeline.json     # build_timeline.py 产出 (词级+钉帧)
│   ├── stage/ stickers/ caption/ helpers/   # 通用组件 (copy 自 skill)
│   └── timeline.json
├── public/audio/full.mp3 # 拼接整轨口播
└── package.json
```

## 复现一支新视频 (流程摘要, 详见 ../references/pipeline.md)
1. **阶段0–2**: 读文章→定爆点→写 `work/<slug>/script.json` (编号短句) +
   `storyboard.json` (每句 stage/sticker/pins)。
2. **阶段4**:
   ```bash
   python3 ../scripts/tts_client.py --script work/<slug>/script.json \
     --out-dir work/<slug>/audio --voice zh-CN-YunxiNeural --rate +8%
   python3 ../scripts/build_timeline.py --clips work/<slug>/audio/clips.json \
     --storyboard work/<slug>/storyboard.json --out work/<slug>/timeline.json \
     --audio-out work/<slug>/audio/full.mp3
   ```
3. **素材接入**: 把 timeline.json copy 到 `src/timeline.json`,
   full.mp3 copy 到 `public/audio/full.mp3`, 改 `src/shotPlans.ts` 每句的画面指令。
   (ComfyUI 图片素材见 ../references/comfyui-assets.md, 放在 public/assets/ 后在
   贴纸组件里用 staticFile 引用。)
4. **渲染**:
   ```bash
   npm install
   npx remotion still src/index.ts Explainer out/qa/x.png --frame=N --concurrency=1
   npx remotion render src/index.ts Explainer out/promo.mp4 --concurrency=1
   ```

## 注意
- headless 环境首次需 `npx remotion browser ensure` 下载 Chrome Headless Shell。
- 低核机器加 `--concurrency=1`。
- shotPlans 是**归项目**的创意内容, 不是 skill 通用资产; 通用组件在
  ../components/ 与 ../references/sticker-cards/。
