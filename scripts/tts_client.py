#!/usr/bin/env python3
"""tts_client — 分句 TTS 适配层。

后端:
  - edge (默认): edge-tts 在线服务, 返回音频 + WordBoundary 词级时间戳 (需联网)
  - local_http (后期): 本地 HTTP TTS 服务 (endpoint 由用户提供后接入)

统一输出契约 (每句一个 dict):
  { "id", "audio", "duration", "words": [ {"text","offset_s","dur_s"}, ... ] }

用法:
  python3 tts_client.py --script script.json --out-dir work/<slug>/audio \\
      [--backend edge] [--voice zh-CN-YunxiNeural] [--rate +8%]

script.json 形如: [ {"id":"S01","text":"..."}, ... ]
每句产出:  <out>/S01.mp3  和  <out>/S01.words.json (词级时间戳)
并打印汇总 clips.json 到 stdout (供 build_timeline 使用)。
"""
import argparse, asyncio, json, os, subprocess, sys, re

WORD_100NS = 1e7  # WordBoundary offset/duration 单位: 100 纳秒


def ffprobe_duration(path: str) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return 0.0


async def synth_edge(text, out_mp3, voice, rate):
    """用 edge-tts 合成一句, 收集 WordBoundary 词级时间戳。"""
    import edge_tts
    # 中文必须显式 boundary='WordBoundary', 否则只返回 SentenceBoundary (整句无词级)
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate,
                                       boundary="WordBoundary")
    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "offset_s": round(chunk["offset"] / WORD_100NS, 4),
                    "dur_s": round(chunk["duration"] / WORD_100NS, 4),
                })
    return words


async def synth_one(clip, out_dir, backend, voice, rate, retries=3):
    sid, text = clip["id"], clip["text"]
    out_mp3 = os.path.join(out_dir, f"{sid}.mp3")
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            if backend == "edge":
                words = await synth_edge(text, out_mp3, voice, rate)
            else:
                raise NotImplementedError(
                    "local_http 后端待用户提供 endpoint 后接入")
            dur = ffprobe_duration(out_mp3)
            if dur <= 0:
                raise RuntimeError("empty audio")
            with open(os.path.join(out_dir, f"{sid}.words.json"), "w") as f:
                json.dump(words, f, ensure_ascii=False, indent=2)
            print(f"[ok] {sid} {dur:.2f}s {len(words)} words", file=sys.stderr)
            return {"id": sid, "text": text, "audio": f"{sid}.mp3",
                    "duration": round(dur, 3), "words": words}
        except Exception as e:  # noqa
            last_err = e
            print(f"[retry {attempt}] {sid}: {e}", file=sys.stderr)
            await asyncio.sleep(1.2 * attempt)
    raise RuntimeError(f"{sid} failed after {retries} tries: {last_err}")


async def main_async(a):
    os.makedirs(a.out_dir, exist_ok=True)
    with open(a.script, encoding="utf-8") as f:
        clips = json.load(f)
    results = []
    for clip in clips:  # 顺序合成, 单句失败只重试该句
        results.append(await synth_one(clip, a.out_dir, a.backend, a.voice, a.rate))
    with open(os.path.join(a.out_dir, "clips.json"), "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(json.dumps(results, ensure_ascii=False))


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--script", required=True)
    p.add_argument("--out-dir", required=True)
    p.add_argument("--backend", default="edge", choices=["edge", "local_http"])
    p.add_argument("--voice", default="zh-CN-YunxiNeural")
    p.add_argument("--rate", default="+8%")
    args = p.parse_args()
    asyncio.run(main_async(args))
