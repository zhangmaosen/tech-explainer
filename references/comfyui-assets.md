# comfyui-assets — 本地 ComfyUI (Qwen-Image) 素材预生成与一致性

通用方法论。素材在分镜后**一次性预生成**，渲染时只用静态图。

## 一、原则
- **预生成，不实时**：绝不在 Remotion 渲染管线里调 ComfyUI。
- **人工筛废片**：出图后人工挑选，角色跨镜头挑一致的一组。
- **分类归档**：`work/<slug>/assets/{bg,characters,stickers}/`，文件名对齐分镜素材需求。

## 二、本机 ComfyUI 实测环境（2026-07 验证）
- Endpoint：`http://100.103.46.96:8188`（4×RTX 3090）
- 模型：**Qwen-Image 2512 fp8**（文生图）+ **Qwen-Image-Edit 2511**（参考图编辑）+
  **Lightning 4步 LoRA** → **1328×1328 约 20–35s/张**
- text encoder：`qwen_2.5_vl_7b_fp8_scaled`（用 **CLIPLoader**，type=`qwen_image`；
  注意不是 DualCLIPLoader）
- **中文理解极强**，出图可直接带中文文字（贴纸上写中文标签效果好）

## 三、两条 workflow（assets/workflows/，已验证可跑）

### default.json — 文生图
Qwen-Image 2512 + Lightning 4步（cfg=1, euler/simple）。用于背景、场景插图、贴纸。

**贴纸 prompt 公式**（实测有效）：
```
flat vector sticker illustration of <主体>, bold thick outlines, simple shapes,
vibrant colors, die-cut sticker style, solid dark background, centered, no text
```
（要文字就把 `no text` 换成 `with Chinese text "XX"`，Qwen 能写好中文。）

### edit_ref.json — 参考图编辑（角色/姿态一致性）
Qwen-Image-Edit + Lightning 4步 + LoadImage 参考图，encode 用
**TextEncodeQwenImageEdit**（注意参数名是 `prompt` 不是 `text`）。
用法：先生成一个角色底图，后续镜头以它为参考图做姿态/场景变化，
**身份（风格/配色/造型）保留良好**。prompt 要点：
- 明确说 `keep the exact same sticker style, die-cut white border`
- 明确禁止 `do not add any text, no extra elements`（否则模型爱加乱码文字和杂元素）

### 透明底（sticker 必做）
生成后用本地 **rembg**（`pip install rembg`）抠图 → RGBA PNG。
实测对 die-cut 贴纸抠得很干净（保留白色描边、去黑底）。
comfyui_client.py 对 `type=sticker` 自动调用。

## 四、素材类型与一致性策略
- **背景 bg**：文生图，一次性出，通常不需要透明底。
- **角色 characters**：首次文生图出底图 → 人工定稿 → 后续镜头走 edit_ref
  以底图为参考图出各姿态；seed 记录进角色设定表。
- **贴纸 stickers**：文生图 + rembg 透明底，逐镜头复用。

## 五、comfyui_client.py 用法
```bash
python3 scripts/comfyui_client.py --manifest work/<slug>/assets_manifest.json \
  --out-dir work/<slug>/assets --url http://100.103.46.96:8188
```
manifest 每项 `{id,type,prompt,ref_image?,seed?,width?,height?,workflow?}`。
断点续跑（已存在跳过）；`--force` 强制重出。

## 六、常见坑
- CLIPLoader type 写错（必须 `qwen_image`，且别用 DualCLIPLoader）。
- edit_ref 的参数名 `prompt`（写 `text` 会 validation 400）。
- 贴纸忘抠透明底，套不进动画。
- edit 时没说"no text"，出来一堆乱码文字。
- edit_ref 爱给角色**加圆形背景/徽章底图**（raptor 验证片实测 3 次里 2 次）：
  提示词加 `keep plain solid dark background, no background graphics, no circular
  backdrop, no halo` 也只能降低概率。**备选策略：姿态变体生成失败就放弃该图，
  用常态图 + 动画（倾斜/压暗/缩放/光池）表达情绪**——见 character-design.md。
- edit_ref 的姿态改动幅度要小（"arms raised" 级），大改姿势几乎必翻车。
- 渲染时实时出图。
