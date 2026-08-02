#!/usr/bin/env python3
"""setup — 预检 tech-explainer 依赖与本地服务连通性。

检查: node/npx, ffmpeg/ffprobe, edge-tts (python 库), 可选 ComfyUI HTTP。
用法: python3 setup.py [--check] [--comfyui-url http://127.0.0.1:8188]
--check: 静默, 仅退出码 (0 ok)。否则打印人类可读报告 + 修复建议。
"""
import argparse, json, shutil, subprocess, sys, urllib.request

def has(cmd):
    return shutil.which(cmd) is not None

def edge_tts_ok():
    try:
        import edge_tts  # noqa
        return True
    except Exception:
        return False

def comfyui_ok(url):
    try:
        with urllib.request.urlopen(url.rstrip("/") + "/system_stats", timeout=3) as r:
            return r.status == 200
    except Exception:
        return False

def main(a):
    report = {
        "node": has("node"), "npx": has("npx"),
        "ffmpeg": has("ffmpeg"), "ffprobe": has("ffprobe"),
        "edge_tts": edge_tts_ok(),
    }
    if a.comfyui_url:
        report["comfyui"] = comfyui_ok(a.comfyui_url)

    core_ok = all([report["node"], report["npx"], report["ffmpeg"],
                   report["ffprobe"], report["edge_tts"]])

    if a.check:
        sys.exit(0 if core_ok else 2)

    print(json.dumps(report, indent=2))
    fixes = []
    if not report["ffmpeg"] or not report["ffprobe"]:
        fixes.append("安装 ffmpeg: sudo apt install ffmpeg  (macOS: brew install ffmpeg)")
    if not report["node"] or not report["npx"]:
        fixes.append("安装 Node.js 18+ (含 npx)")
    if not report["edge_tts"]:
        fixes.append("安装 edge-tts: pip install edge-tts")
    if a.comfyui_url and not report.get("comfyui"):
        fixes.append(f"ComfyUI 未连通 ({a.comfyui_url}); 启动本地 ComfyUI 或改用 --comfyui-url")
    if fixes:
        print("\n需要修复:")
        for f in fixes:
            print("  - " + f)
    else:
        print("\n全部就绪。")
    sys.exit(0 if core_ok else 2)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--check", action="store_true")
    p.add_argument("--comfyui-url", default=None)
    main(p.parse_args())
