"""Render dashboard.html from data/ and dashboard_template.html.

    python build_dashboard.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
DATA = ROOT / "data"
RUNS = ["pro", "flash"]

LINES = [
    # (tag, title, unit, note)
    ("dynsam/avg@n", "Pass rate на трейне (avg@n)", "ratio", "Доля успешных попыток на промпт"),
    ("critic/rewards/mean", "Средняя награда", "ratio", "По траекториям, на которых учились"),
    ("dynsam/passrate/one", "Задачи решены всегда", "pct", "Доля промптов, где все n попыток прошли"),
    ("dynsam/passrate/zero", "Задачи не решены ни разу", "pct", "Доля промптов без единого успеха"),
    ("ctx_total_length/mean", "Длина траектории", "tokens", "Промпт + ответ, токенов"),
    ("dynsam/agg_turn/mean", "Ходов агента на траекторию", "num", ""),
    ("timing_s/step", "Длительность шага", "hours", "Генерация роллаутов + трейнер"),
    ("actor/entropy_loss", "Энтропия политики", "num3", "На токен"),
    ("train_infer_diff/new_infer/kl", "KL train ↔ inference", "sci", "Рассогласование логпробов движков"),
    ("partial/avg_staleness", "Staleness (асинхронность)", "num", "Версий политики между сэмплом и обучением"),
    ("penalty/stage_credit_group/select_hack_attempt_rate", "Попытки reward hacking", "pct",
     "Доля групп, где судья пометил попытку взлома награды"),
    ("env/active", "Активных песочниц", "int", "Окружений в работе на шаг"),
]

HACK_HARNESSES = ["harness-A", "harness-B", "harness-C", "harness-D"]


def load(name):
    return json.loads((DATA / name).read_text())


def rnd(xs, nd=5):
    return [None if x is None else round(x, nd) for x in xs]


def main():
    status = {r: load(f"{r}_status.json") for r in RUNS}
    series = {r: load(f"{r}_series.json")["series"] for r in RUNS}

    lines = [{"tag": t, "title": title, "unit": unit, "note": note,
              "data": {r: rnd(series[r].get(t, [])) for r in RUNS}} for t, title, unit, note in LINES]

    benches = [{"title": b["title"], "note": b.get("note", ""),
                "data": {r: {int(k): v for k, v in b["results"].get(r, {}).items()} for r in RUNS}}
               for b in load("benchmarks.json")["benchmarks"]]

    pr = "train/passrate/avg_passrate/"
    datasets = []
    for t in sorted({t for r in RUNS for t in series[r] if t.startswith(pr)}):
        datasets.append({"name": t[len(pr):], "data": {r: rnd(series[r].get(t, []), 4) for r in RUNS}})

    hp = "train/harness/"
    harnesses = sorted({t.split("/")[2] for r in RUNS for t in series[r] if t.startswith(hp)},
                       key=lambda h: (len(h.split("-")[1]), h))
    mix = []
    for h in harnesses:
        row = {"name": h}
        for r in RUNS:
            total = sum(x for x in series[r].get(f"{hp}{h}/training/rollouts", []) if x)
            row[r] = total
        mix.append(row)
    for r in RUNS:
        s = sum(m[r] for m in mix)
        for m in mix:
            m[r] = round(m[r] / s, 5) if s else 0

    hack = []
    for h in HACK_HARNESSES:
        row = {"name": h}
        for r in RUNS:
            xs = [x for x in series[r].get(f"penalty/stage_credit_group/harness/{h}/select_hack_attempt_rate", [])
                  if x is not None]
            row[r] = round(sum(xs) / len(xs), 4) if xs else None
        hack.append(row)

    runs = {}
    for r in RUNS:
        s = status[r]
        runs[r] = {
            "label": s["run"]["label"], "hours": round((s["run"]["end"] - s["run"]["start"]) / 3600, 1),
            "cost": s["cost"]["so_far"], "tokens": s["totals"]["tokens_cum"],
            "trajectories": s["totals"]["trained_cum"], "sandboxes": s["totals"]["sandboxes_cum"],
            "restarts": s["totals"]["restarts"], "steps": s["step"]["last"],
        }

    notices = sorted(load("notices.json")["notices"], key=lambda n: n["t"])
    payload = {"runs": runs, "lines": lines, "benches": benches, "datasets": datasets,
               "mix": mix, "hack": hack, "notices": [{"t": n["t"], "text": n["text"]} for n in notices]}

    html = (ROOT / "dashboard_template.html").read_text()
    html = html.replace("/*__DATA__*/null", json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    (ROOT / "dashboard.html").write_text(html)
    print(f"wrote dashboard.html ({len(html) // 1024} KB)")


if __name__ == "__main__":
    main()
