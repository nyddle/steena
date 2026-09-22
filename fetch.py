"""Snapshot the public MiMo-V2.6 RL training dashboard (https://mimo.xiaomi.com/rl).

Pulls run config, status, notices, benchmarks and every logged metric series
for both runs into data/. Stdlib only.

    python fetch.py
"""
import json
import pathlib
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API = "https://mimo.xiaomi.com/rl/api/"
OUT = pathlib.Path(__file__).parent / "data"
BATCH = 96  # same chunk size the dashboard uses


def get(path, **params):
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)


def dump(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=1))


def fetch_run(run):
    status = get("status", run=run)
    version = status["version"]
    tags = get("tags", run=run, v=version)["tags"]
    chunks = [tags[i:i + BATCH] for i in range(0, len(tags), BATCH)]

    def pull(chunk):
        return get("series", run=run, v=version, tags=",".join(chunk))

    series, steps, walls = {}, None, None
    with ThreadPoolExecutor(8) as pool:
        for part in pool.map(pull, chunks):
            series.update(part["series"])
            steps, walls = part["steps"], part["walls"]
    dump(f"{run}_status.json", status)
    dump(f"{run}_live.json", get("live", run=run))
    dump(f"{run}_series.json", {"run": run, "version": version, "steps": steps, "walls": walls, "series": series})
    print(f"{run}: {len(tags)} tags, {len(series)} series")


def main():
    OUT.mkdir(exist_ok=True)
    cfg = get("runs")
    dump("runs.json", cfg)
    dump("notices.json", get("notices"))
    dump("benchmarks.json", get("benchmarks"))
    for run in cfg["runs"]:
        fetch_run(run["key"])


if __name__ == "__main__":
    main()
