# tts-timing — Edge TTS 词级时间戳 → 帧级时间轴

全 skill 最关键的工程环节。通用方法论，不含具体文案。

## 一、为什么"先稿后音、时长驱动"
镜头帧数不能拍脑袋写死，必须由**音频实际时长**反推，否则字幕/贴纸和口播错位。
流程刚性顺序：脚本定稿 → 分短句 → 逐句 TTS → 量时长 + 拿词级时间戳 → 回填时间轴。

## 二、Edge TTS 要点
- Edge TTS 通过 `edge-tts` Python 库调用微软在线服务（**需联网**，零费用）。
- 合成时监听 **WordBoundary 事件**，每个词返回 `offset` 和 `duration`，单位
  **100 纳秒（1e-7 秒）** —— 换算秒：`sec = offset / 1e7`；换算帧（30fps）：
  `frame = round(offset / 1e7 * 30)`。
- **分句独立合成**：每个短句单独一次合成，产出 `audio/S01.mp3` + `S01.words.json`。
  一句失败只重试该句（Edge 偶发限流/断连），不整篇重来。
- 推荐音色（中文）：
  - `zh-CN-YunxiNeural` — 年轻男声，解说感强（默认）
  - `zh-CN-YunjianNeural` — 浑厚，财经/硬核向
  - `zh-CN-XiaoxiaoNeural` — 女声，自然
  - 语速用 `--rate`（如 `+8%`）微调，解说通常略快。

## 三、tts_client.py 输出契约
对每个短句输出统一结构（后端 `edge` / 未来 `local_http` 都遵守）：
```json
{
  "id": "S01",
  "audio": "audio/S01.mp3",
  "duration": 3.42,
  "words": [ { "text": "全流量", "offset_s": 0.10, "dur_s": 0.35 }, ... ]
}
```
`offset_s` 是**句内相对秒**（相对该句音频起点）。

## 四、build_timeline.py：合成 timeline.json
把逐句结果拼成整片帧级时间轴（30fps），句间可插呼吸停顿（默认 6–10 帧）：
```json
{
  "fps": 30,
  "audioTrack": "audio/full.mp3",
  "shots": [
    {
      "id": "S01",
      "fromFrame": 0,
      "durationFrames": 103,
      "words": [ { "text": "全流量", "fromFrame": 3, "toFrame": 13 }, ... ],
      "pins": [ { "keyword": "40%", "frame": 47, "sticker": "number-roll" } ]
    }
  ]
}
```
- `fromFrame`：句起点 = 上一句结束 + 呼吸间隔的累计。
- `words[].fromFrame` = `shot.fromFrame + round(offset_s*fps)`（转成**绝对帧**）。
- `pins`：分镜标的关键词 → 在 words 里找到该词 → 取其 fromFrame 作钉帧锚点，
  连同要触发的贴纸配方卡名写入。
- 拼接整轨 `audio/full.mp3`（ffmpeg concat，含句间静音）供 Remotion `<Audio>` 用。

## 五、关键词匹配（钉帧）
分镜给的关键词做**归一化匹配**到 words（去标点、全半角、数字容错）。匹配不到时
回退到该句中点帧并在报告里标注，供人工修正。

## 六、常见坑
- 100ns 单位没换算（时间戳错 1e7 倍）。
- 句内相对秒当成绝对帧用（忘加 shot.fromFrame）。
- 整篇一次合成，一处失败全废。
- 忘拼句间呼吸，口播密不透气。
- 写死镜头帧数不按 duration 反推。
