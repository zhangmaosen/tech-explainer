---
name: sticker-image
用途: ComfyUI 预生成的 PNG 贴纸 (透明底) 弹入画面, 配口播主体
能量: 中
建议时长: 10-14f 弹入 + 落定后轻微浮动
所需素材: sticker 类 PNG (comfyui_client 生成+rembg)
钉帧: 锚到对应主体词
---

# sticker-image — 预生成贴纸贴入

## 语义
把 Qwen-Image 生成的贴纸 (火箭/国旗/奖杯/汽车等) 以弹入动画贴到画面中上部,
作为口播主体的视觉具象。是整个 skill "贴纸解说"风格的核心载体。

## 参数
- 弹入: scale 0.5→1.0 过冲, 10-12f, 可带轻旋转。
- 落定后轻微上下浮动 (sin, ±10px), 增加"活"感。
- 尺寸 400-500px 宽, 居中或偏侧; 与下方文字/数字构图。
- drop-shadow 增强立体感。
- 可与 title-pop/number-roll 同屏: 贴纸在上 (y≈480-700), 文字在下。

## 已知坑
- 素材必须透明底 (RGBA), 否则黑底方块穿帮。
- 一屏贴纸别超过 2 个主体 (拥挤)。
- 浮动幅度别大 (±10px 内), 大浮动晃眼。
- 素材来源: 必须阶段3预生成, 渲染时不再出图。

## 参考实现
components/stickers/StickerImage.tsx
