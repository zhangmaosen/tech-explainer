---
name: flow-diagram
用途: 原理/机制拆解示意图, 机制解释段的核心视觉
能量: 中
建议时长: 整个机制段 (3-5 句) 持续在屏, marker 逐步圈画
所需素材: ComfyUI 生成的简化流程示意图 PNG
钉帧: 每个讲解步骤锚到对应词, marker 跟到当前讲的部件
---

# flow-diagram — 原理拆解示意图

## 语义
机制解释段("原来如此"时刻)的主视觉：一张简化的流程示意图(如 燃料→预燃室→
涡轮→燃烧室)，口播讲到哪个部件，marker 圈画就移动到哪个部件。观众"学到感"
主要来自这段。

## 素材生成(Qwen-Image, 可直接带中文标签)
```
simple flat vector flow diagram of <主题>: <节点1> arrow to <节点2> arrow to <节点3>,
minimal icon style, bold outlines, dark navy background, cyan and orange accents,
clean layout, with Chinese labels "标签1" "标签2"
```
- Qwen 中文渲染可靠，节点直接带中文标签，免后期叠字。
- 生成后人工检查标签无乱码；节点少而清(3-5 个)。

## 参数
- 示意图整段在屏(跨多句)，居中偏上，占屏 50-60%。
- marker-highlight 逐步圈画: 口播到部件 i 时, 圈从上一个部件移到当前部件,
  钉到该部件被读到的词帧。
- 部件可随讲解逐个"点亮"(由暗到亮), 未讲的保持暗淡——制造跟随感。
- 字幕在图下方安全区。

## 已知坑
- 示意图信息过密(节点>5) 在小屏读不清。
- 全程静态无跟随(marker不动) = 退化成贴图, 失去讲解感。
- 中文标签乱码没检查就上线。
- 机制段塞两个以上机制(讲不透, 见 H5 判据)。

## 参考实现
StickerImage (图) + MarkerHighlight (圈画), 钉帧驱动
