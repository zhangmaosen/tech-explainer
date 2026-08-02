#!/usr/bin/env python3
"""comfyui_client — 本地 ComfyUI (Qwen-Image) 素材预生成。

已验证 workflow (assets/workflows/):
  default.json  — Qwen-Image 2512 fp8 + Lightning 4步 LoRA, 文生图 (~20s/张 @1328)
  edit_ref.json — Qwen-Image-Edit 2511 + Lightning, 参考图编辑 (角色/姿态一致性)

素材类型 (manifest item.type):
  bg / character / sticker — sticker 生成后自动 rembg 抠透明底 (RGBA PNG)

manifest 每项:
  { "id","type":"bg|character|sticker","prompt",
    "ref_image":null|"<本地图片路径, 角色一致性用>",
    "seed":null|int, "width":1328, "height":1328, "workflow":"default|edit_ref" }
  type=character 且给了 ref_image → 自动切 edit_ref workflow。

用法:
  python3 comfyui_client.py --manifest m.json --out-dir work/<slug>/assets \\
      [--url http://127.0.0.1:8188] [--force]
"""
import argparse, json, os, sys, time, uuid, urllib.request, urllib.parse, urllib.error

WORKFLOWS = {
    "default": "default.json",
    "edit_ref": "edit_ref.json",
}
DEFAULT_SIZE = 1328


def http_post(url, payload, timeout=15):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=timeout))


def http_get(url, timeout=60):
    return urllib.request.urlopen(url, timeout=timeout).read()


def upload_image(base, path):
    boundary = uuid.uuid4().hex
    with open(path, "rb") as f:
        data = f.read()
    body = (f"--{boundary}\r\n".encode()
            + f'Content-Disposition: form-data; name="image"; filename="{os.path.basename(path)}"\r\n'.encode()
            + b"Content-Type: image/png\r\n\r\n" + data + b"\r\n"
            + f"--{boundary}--\r\n".encode())
    req = urllib.request.Request(base + "/upload/image", data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.load(urllib.request.urlopen(req, timeout=60))["name"]


def load_workflow(item, base):
    """读模板并注入 prompt / seed / size / 参考图。"""
    wf_name = item.get("workflow")
    ref = item.get("ref_image")
    if not wf_name:
        wf_name = "edit_ref" if ref else "default"
    tmpl = os.path.join(os.path.dirname(__file__), "..", "assets",
                        "workflows", WORKFLOWS[wf_name])
    with open(tmpl) as f:
        wf = json.load(f)
    wf["6"]["inputs"]["prompt" if wf_name == "edit_ref" else "text"] = item["prompt"]
    if item.get("seed") is not None:
        wf["3"]["inputs"]["seed"] = item["seed"]
    else:
        wf["3"]["inputs"]["seed"] = uuid.uuid4().int % (2**63)
    w = item.get("width", DEFAULT_SIZE)
    h = item.get("height", DEFAULT_SIZE)
    wf["5"]["inputs"]["width"] = w
    wf["5"]["inputs"]["height"] = h
    if wf_name == "edit_ref":
        if not ref:
            raise ValueError("edit_ref workflow 需要 ref_image")
        wf["14"]["inputs"]["image"] = upload_image(base, ref)
    return wf


def wait_and_fetch(base, prompt_id, out_path, poll=2.0, timeout=300):
    t0 = time.time()
    while time.time() - t0 < timeout:
        hist = json.loads(http_get(f"{base}/history/{prompt_id}"))
        if prompt_id in hist:
            for node in hist[prompt_id]["outputs"].values():
                for img in node.get("images", []):
                    q = urllib.parse.urlencode(
                        {"filename": img["filename"],
                         "subfolder": img.get("subfolder", ""),
                         "type": img.get("type", "output")})
                    with open(out_path, "wb") as f:
                        f.write(http_get(f"{base}/view?{q}"))
                    return True
            return False
        time.sleep(poll)
    return False


def make_transparent(path):
    """rembg 抠图 → RGBA。用于 sticker 类型。"""
    try:
        from rembg import remove
        from PIL import Image
        img = Image.open(path)
        remove(img).save(path)
        return True
    except Exception as e:
        print(f"[warn] rembg failed on {path}: {e}", file=sys.stderr)
        return False


def main(a):
    os.makedirs(a.out_dir, exist_ok=True)
    base = a.url.rstrip("/")
    with open(a.manifest, encoding="utf-8") as f:
        items = json.load(f)
    client_id = uuid.uuid4().hex
    done, failed = [], []
    for it in items:
        out_path = os.path.join(a.out_dir, it["type"], f"{it['id']}.png")
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        if os.path.exists(out_path) and not a.force:
            print(f"[skip] {it['id']} exists", file=sys.stderr)
            done.append(out_path); continue
        try:
            wf = load_workflow(it, base)
            pid = http_post(base + "/prompt",
                            {"prompt": wf, "client_id": client_id})["prompt_id"]
            ok = wait_and_fetch(base, pid, out_path)
            if ok and it["type"] == "sticker":
                make_transparent(out_path)
            print(f"[{'ok' if ok else 'fail'}] {it['id']} -> {out_path}", file=sys.stderr)
            (done if ok else failed).append(out_path)
        except urllib.error.HTTPError as e:
            print(f"[http-err] {it['id']}: {e.read().decode()[:300]}", file=sys.stderr)
            failed.append(out_path)
        except Exception as e:
            print(f"[err] {it['id']}: {e}", file=sys.stderr)
            failed.append(out_path)
    print(json.dumps({"done": done, "failed": failed}, ensure_ascii=False))
    if failed:
        sys.exit(2)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", required=True)
    p.add_argument("--out-dir", required=True)
    p.add_argument("--url", default="http://127.0.0.1:8188")
    p.add_argument("--force", action="store_true")
    main(p.parse_args())
