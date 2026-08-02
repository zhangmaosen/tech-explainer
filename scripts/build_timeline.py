#!/usr/bin/env python3
"""build_timeline — 逐句词级时间戳 → 帧级 timeline.json + 拼接整轨音频。

输入:
  --clips work/<slug>/audio/clips.json   (tts_client 产出)
  --storyboard work/<slug>/storyboard.json (可选, 提供每句 stage/pins 关键词)
输出:
  --out work/<slug>/timeline.json
  --audio-out work/<slug>/audio/full.mp3  (句间插呼吸静音)

storyboard.json 每句形如:
  { "id":"S01", "stage":"slide", "sticker":"title-pop",
    "pins":[ {"keyword":"40%","sticker":"number-roll"} ] }
"""
import argparse, json, os, subprocess, sys, re

def norm(s):
    return re.sub(r"[\s,.%，。、！？!?:：;；]+", "", s).lower()

PUNCT = re.compile(r"[,.%，。、！？!?:：;；·…—\-《》<>\"'“”‘’()（）]")

def strip_punct(s):
    return PUNCT.sub("", s)

def find_word_frame(words_abs, keyword):
    """在绝对帧词表里模糊匹配关键词, 返回其 fromFrame; 匹配不到返回 None。"""
    k = norm(keyword)
    if not k:
        return None
    # 先整词, 再包含匹配
    for w in words_abs:
        if norm(w["text"]) == k:
            return w["fromFrame"]
    for w in words_abs:
        if k in norm(w["text"]) or norm(w["text"]) in k:
            return w["fromFrame"]
    return None

def chunk_words(words_abs, max_chars=13):
    """把一句的词按 ≤max_chars 切成字幕显示组。组内保留逐词帧号用于高亮。
    返回 [{fromFrame,toFrame,words:[{text,fromFrame,toFrame}]}]。文本已去标点。"""
    clean = [{"text": strip_punct(w["text"]),
              "fromFrame": w["fromFrame"], "toFrame": w["toFrame"]}
             for w in words_abs]
    clean = [w for w in clean if w["text"]]
    chunks, cur, cur_len = [], [], 0
    for w in clean:
        wlen = len(w["text"])
        # 超长单词(如英文/数字串) 单独成组
        if cur and cur_len + wlen > max_chars:
            chunks.append(cur); cur, cur_len = [], 0
        cur.append(w); cur_len += wlen
    if cur:
        chunks.append(cur)
    # 尾部再平衡: 末组 ≤3 字时, 从上一组挪词补齐, 避免单字/两字孤屏
    while len(chunks) > 1 and sum(len(w["text"]) for w in chunks[-1]) <= 3:
        prev, tail = chunks[-2], chunks[-1]
        if sum(len(w["text"]) for w in prev) <= 5:
            prev.extend(tail)
            chunks.pop()
            break
        tail.insert(0, prev.pop())
    out = []
    for c in chunks:
        out.append({
            "fromFrame": c[0]["fromFrame"],
            "toFrame": c[-1]["toFrame"],
            "text": "".join(w["text"] for w in c),
            "words": c,
        })
    return out

def main(a):
    fps = a.fps
    gap = a.gap_frames
    with open(a.clips, encoding="utf-8") as f:
        clips = json.load(f)
    sb = {}
    if a.storyboard and os.path.exists(a.storyboard):
        with open(a.storyboard, encoding="utf-8") as f:
            for item in json.load(f):
                sb[item["id"]] = item

    shots, cursor = [], 0
    silence_paths, concat_parts = [], []
    audio_dir = os.path.dirname(a.clips)

    for c in clips:
        dur_frames = max(1, round(c["duration"] * fps))
        # 词级绝对帧
        words_abs = []
        for w in c.get("words", []):
            wf = cursor + round(w["offset_s"] * fps)
            wt = cursor + round((w["offset_s"] + w["dur_s"]) * fps)
            words_abs.append({"text": w["text"], "fromFrame": wf,
                              "toFrame": max(wf + 1, wt)})
        # 钉帧: 关键词 → 帧
        pins = []
        meta = sb.get(c["id"], {})
        for pin in meta.get("pins", []):
            frame = find_word_frame(words_abs, pin["keyword"])
            if frame is None:
                frame = cursor + dur_frames // 2  # 回退到句中点
                print(f"[warn] pin keyword '{pin['keyword']}' not matched in "
                      f"{c['id']}, fallback to midpoint", file=sys.stderr)
            pins.append({"keyword": pin["keyword"],
                         "sticker": pin.get("sticker"), "frame": frame})

        shots.append({
            "id": c["id"], "text": c["text"],
            "fromFrame": cursor, "durationFrames": dur_frames,
            "stage": meta.get("stage"), "sticker": meta.get("sticker"),
            "words": words_abs, "chunks": chunk_words(words_abs, a.max_chars),
            "pins": pins,
            "audio": c["audio"],
        })
        concat_parts.append(os.path.join(audio_dir, c["audio"]))
        cursor += dur_frames
        # 句间呼吸静音
        if gap > 0:
            sil = os.path.join(audio_dir, f"_sil_{c['id']}.mp3")
            subprocess.run(
                ["ffmpeg", "-y", "-f", "lavfi", "-i",
                 "anullsrc=r=24000:cl=mono", "-t", f"{gap/fps:.3f}",
                 "-q:a", "9", sil],
                capture_output=True)
            silence_paths.append(sil)
            concat_parts.append(sil)
            cursor += gap

    timeline = {"fps": fps, "width": 1080, "height": 1920,
                "totalFrames": cursor, "audioTrack": "audio/full.mp3",
                "shots": shots}
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=2)

    # 拼接整轨
    if a.audio_out:
        listfile = os.path.join(audio_dir, "_concat.txt")
        with open(listfile, "w") as f:
            for p in concat_parts:
                f.write(f"file '{os.path.abspath(p)}'\n")
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listfile,
             "-c:a", "libmp3lame", "-q:a", "4", a.audio_out],
            capture_output=True)
        for s in silence_paths:
            os.path.exists(s) and os.remove(s)

    print(f"[ok] timeline: {len(shots)} shots, {cursor} frames "
          f"({cursor/fps:.1f}s) -> {a.out}", file=sys.stderr)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--clips", required=True)
    p.add_argument("--storyboard", default=None)
    p.add_argument("--out", required=True)
    p.add_argument("--audio-out", default=None)
    p.add_argument("--fps", type=int, default=30)
    p.add_argument("--gap-frames", type=int, default=8)
    p.add_argument("--max-chars", type=int, default=13,
                   help="字幕每组最大字数 (单行快翻)")
    main(p.parse_args())
