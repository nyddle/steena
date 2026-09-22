"""Build REPORT.md from the dashboard snapshot in data/ (run fetch.py first).

    python analyze.py
"""
import json
import pathlib
import statistics
from datetime import datetime, timezone

DATA = pathlib.Path(__file__).parent / "data"
RUNS = ["pro", "flash"]


def load(name):
    return json.loads((DATA / name).read_text())


def clean(xs):
    return [x for x in xs if x is not None]


def head(xs, k=3):
    xs = clean(xs[:k])
    return statistics.mean(xs) if xs else None


def tail(xs, k=3):
    xs = clean(xs[-k:])
    return statistics.mean(xs) if xs else None


def fmt(x, spec=".3f"):
    return "—" if x is None else format(x, spec)


def table(header, rows):
    out = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows]
    return "\n".join(out)


def first_last_table(series, tags, label=lambda t: t, spec=".3f"):
    rows = []
    for t in tags:
        rows.append([f"`{label(t)}`"] + [
            f"{fmt(head(series[r].get(t, [])), spec)} → {fmt(tail(series[r].get(t, [])), spec)}"
            for r in RUNS
        ])
    return table(["metric", *[f"{r} (steps 1-3 → 28-30)" for r in RUNS]], rows)


def main():
    cfg = load("runs.json")
    status = {r: load(f"{r}_status.json") for r in RUNS}
    series = {r: load(f"{r}_series.json")["series"] for r in RUNS}
    desc = cfg.get("descriptions", {})
    out = ["# MiMo-V2.6 RL runs — snapshot analysis", ""]
    out.append(f"Source: <https://mimo.xiaomi.com/rl> (public API), fetched "
               f"{datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC. "
               "All numbers below are computed from `data/`.\n")

    # Run overview
    rows = []
    for r in RUNS:
        s = status[r]
        run, tot = s["run"], s["totals"]
        hours = (run["end"] - run["start"]) / 3600
        rows.append([
            run["label"], s["step"]["last"], f"{hours:.0f} h", f"${s['cost']['so_far'] / 1e6:.2f}M",
            f"${s['cost']['rate_per_s'] * 3600:,.0f}/h", f"{tot['tokens_cum'] / 1e9:.0f}B",
            f"{tot['trained_cum']:,.0f}", f"{tot['sandboxes_cum']:,.0f}", tot["restarts"],
        ])
    out += ["## Runs", table(
        ["run", "steps", "wall", "cost", "burn", "tokens", "trajectories", "sandboxes", "restarts"], rows), ""]

    # Headline dynamics
    core = [t for t in cfg["pins"] if all(t in series[r] for r in RUNS)]
    out += ["## Core training dynamics", first_last_table(series, core), ""]
    out += ["Definitions from the dashboard:", ""]
    out += [f"- `{t}` — {desc[t]}" for t in core if t in desc] + [""]

    # Per-source / per-dataset train pass rate
    pr = "train/passrate/avg_passrate/"
    ds_tags = sorted({t for r in RUNS for t in series[r] if t.startswith(pr)})
    out += ["## Train pass rate per dataset",
            "Dataset ids are anonymised by Xiaomi (`<domain>/dataset-xxxx`).", "",
            first_last_table(series, ds_tags, label=lambda t: t[len(pr):]), ""]

    # Harness mix
    hp = "train/harness/"
    harnesses = sorted({t.split("/")[2] for r in RUNS for t in series[r] if t.startswith(hp)})
    rows = []
    for h in harnesses:
        row = [f"`{h}`"]
        for r in RUNS:
            roll = clean(series[r].get(f"{hp}{h}/training/rollouts", []))
            share = series[r].get(f"{hp}{h}/training/trained_rollout_share", [])
            nz = series[r].get(f"{hp}{h}/training/nonzero_adv_rate", [])
            row.append(f"{sum(roll):,.0f} / {fmt(statistics.mean(clean(share)) if clean(share) else None, '.2f')}"
                       f" / {fmt(statistics.mean(clean(nz)) if clean(nz) else None, '.2f')}")
        rows.append(row)
    out += ["## Harness mix",
            "Harness names are anonymised (`harness-A` … ; `-pw` suffix looks like a variant of the same harness). "
            "Cells: total rollouts / mean trained-rollout share / mean non-zero-advantage rate.", "",
            table(["harness", *RUNS], rows), ""]

    # Groupwise grader + reward-hacking screen
    gp = "penalty/stage_credit_group/"
    grader = ["end2end_success_rate", "groups_judged", "select_hack_attempt_rate", "select_r1_rate",
              "select_r2_rate", "select_r3_rate", "select_pass_turns_mean", "time_total_sec_mean"]
    out += ["## Groupwise agentic grader (GAR) and reward-hacking screen",
            "From `penalty/stage_credit_group/*` — the online judge that re-ranks passing rollouts inside a group. "
            "`select_hack_attempt_rate` is the share of judged groups where the judge flagged a hack attempt.", "",
            first_last_table(series, [gp + g for g in grader], label=lambda t: t[len(gp):]), ""]
    rows = []
    for h in harnesses:
        t = f"{gp}harness/{h}/select_hack_attempt_rate"
        if any(t in series[r] for r in RUNS):
            rows.append([f"`{h}`"] + [
                f"{fmt(statistics.mean(clean(series[r].get(t, []))) if clean(series[r].get(t, [])) else None, '.2f')}"
                for r in RUNS])
    out += ["Mean hack-attempt rate per harness:", "", table(["harness", *RUNS], rows), ""]

    # Lengths and turns
    lens = ["ctx_response_length/mean", "ctx_total_length/mean", "dynsam/agg_turn/mean",
            "train/spec_accept_length/token_mean", "env/possible_leak", "env/total_error"]
    out += ["## Lengths, turns, env", first_last_table(
        series, [t for t in lens if all(t in series[r] for r in RUNS)], spec=",.2f"), ""]

    # Benchmarks
    rows = []
    for b in load("benchmarks.json")["benchmarks"]:
        for r in RUNS:
            res = b["results"].get(r, {})
            if not res:
                continue
            steps = sorted(res, key=int)
            best = max(steps, key=lambda s: res[s])
            rows.append([f"{b['title']} ({b.get('note', '')})", r, f"{res[steps[0]]:.2f} @{steps[0]}",
                         f"{res[steps[-1]]:.2f} @{steps[-1]}", f"{res[best]:.2f} @{best}"])
    out += ["## Held-out benchmarks during training", table(["benchmark", "run", "first", "last", "best"], rows), ""]

    # Operator notices
    out += ["## Operator notices (as posted)", ""]
    for n in sorted(load("notices.json")["notices"], key=lambda n: n["t"]):
        out.append(f"- {datetime.fromtimestamp(n['t'], timezone.utc):%m-%d %H:%M} UTC — {n['text']}")
    out.append("")

    # Namespace inventory
    rows = []
    for ns in sorted({t.split("/")[0] for r in RUNS for t in series[r]}):
        rows.append([f"`{ns}`"] + [sum(t.split("/")[0] == ns for t in series[r]) for r in RUNS])
    out += ["## Metric inventory", table(["namespace", *RUNS], rows), ""]

    (pathlib.Path(__file__).parent / "REPORT.md").write_text("\n".join(out))
    print("wrote REPORT.md")


if __name__ == "__main__":
    main()
