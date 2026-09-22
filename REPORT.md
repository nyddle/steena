# MiMo-V2.6 RL runs — snapshot analysis

Source: <https://mimo.xiaomi.com/rl> (public API), fetched 2026-09-22 18:11 UTC. All numbers below are computed from `data/`.

## Runs
| run | steps | wall | cost | burn | tokens | trajectories | sandboxes | restarts |
|---|---|---|---|---|---|---|---|---|
| mimo-v2.6-pro | 30 | 127 h | $2.62M | $20,556/h | 75B | 752,640 | 3,560,844 | 14 |
| mimo-v2.6-flash | 30 | 83 h | $0.85M | $10,278/h | 81B | 752,640 | 6,859,919 | 5 |

## Core training dynamics
| metric | pro (steps 1-3 → 28-30) | flash (steps 1-3 → 28-30) |
|---|---|---|
| `dynsam/avg@n` | 0.562 → 0.627 | 0.518 → 0.650 |
| `critic/rewards/mean` | 0.557 → 0.595 | 0.532 → 0.595 |
| `actor/entropy_loss` | 0.386 → 0.464 | 0.412 → 0.469 |
| `actor/pg_loss` | 0.003 → 0.012 | 0.002 → 0.016 |
| `actor/grad_norm` | 0.006 → 0.005 | 0.006 → 0.006 |
| `train_infer_diff/new_infer/kl` | 0.003 → 0.005 | 0.004 → 0.008 |
| `ctx_total_length/mean` | 71867.133 → 131446.333 | 75958.067 → 135397.000 |
| `dynsam/agg_turn/mean` | 45.401 → 44.610 | 51.104 → 61.577 |
| `perf/total_num_tokens` | 1795533333.333 → 3292376666.667 | 1896970000.000 → 3383376666.667 |
| `timing_s/step` | 8429.847 → 18736.333 | 6101.570 → 11340.000 |
| `timing_s/outer_gen` | 5501.433 → 9344.623 | 3789.433 → 6123.497 |
| `timing_s/trainer_ops` | 2759.653 → 9085.513 | 2150.077 → 4958.360 |
| `dynsam/passrate/zero` | 0.153 → 0.135 | 0.160 → 0.144 |
| `dynsam/passrate/one` | 0.178 → 0.251 | 0.131 → 0.305 |
| `dynsam/infra_error/seq_rate` | 0.006 → 0.006 | 0.005 → 0.006 |
| `env/active` | 25285.000 → 19037.000 | 38428.000 → 38675.000 |
| `partial/avg_staleness` | 0.081 → 0.259 | 0.344 → 0.804 |
| `dynsam/num_measurable` | 3640.333 → 3259.000 | 3134.667 → 3610.333 |

Definitions from the dashboard:

- `dynsam/avg@n` — mean pass rate: for each prompt sampled this step, the fraction of its n attempts that succeed, averaged over prompts
- `critic/rewards/mean` — mean reward over trajectories trained on this step
- `actor/entropy_loss` — mean per-token entropy of the policy
- `actor/pg_loss` — clipped policy-gradient objective
- `actor/grad_norm` — global gradient norm before clipping
- `train_infer_diff/new_infer/kl` — KL between inference-engine and trainer log-probs on the same tokens
- `ctx_total_length/mean` — total context length per trajectory (prompt + response), in tokens
- `dynsam/agg_turn/mean` — agent turns per trajectory
- `perf/total_num_tokens` — tokens trained on this step
- `timing_s/step` — wall-clock of the whole step
- `timing_s/outer_gen` — wall-clock of rollout generation
- `timing_s/trainer_ops` — wall-clock of the trainer
- `dynsam/passrate/zero` — share of prompts where no attempt succeeded
- `dynsam/passrate/one` — share of prompts where every attempt succeeded
- `dynsam/infra_error/seq_rate` — share of sequences lost to infrastructure failures
- `env/active` — sandbox environments in flight
- `partial/avg_staleness` — policy versions between sampling and training, on average
- `dynsam/num_measurable` — prompts with a measurable pass rate this step; per data source under dynsam/<source>/num_measurable

## Train pass rate per dataset
Dataset ids are anonymised by Xiaomi (`<domain>/dataset-xxxx`).

| metric | pro (steps 1-3 → 28-30) | flash (steps 1-3 → 28-30) |
|---|---|---|
| `chat/dataset-8kb6` | 0.432 → 0.492 | 0.408 → 0.425 |
| `chat/dataset-eup7` | 0.462 → 0.512 | 0.397 → 0.466 |
| `chat/dataset-lm3t` | 0.467 → 0.499 | 0.445 → 0.498 |
| `code/dataset-4onq` | 0.610 → 0.594 | 0.508 → 0.600 |
| `code/dataset-bvg7` | 0.603 → 0.638 | 0.598 → 0.577 |
| `code/dataset-dnpn` | 0.600 → 0.585 | 0.594 → 0.640 |
| `code/dataset-m1dt` | 0.550 → 0.662 | 0.512 → 0.672 |
| `code/dataset-obg8` | 0.528 → 0.540 | 0.552 → 0.542 |
| `code/dataset-sin0` | 0.611 → 0.627 | 0.610 → 0.609 |
| `code/dataset-ta4j` | 0.613 → 0.627 | 0.531 → 0.593 |
| `code/dataset-v7yx` | 0.599 → 0.583 | 0.557 → 0.560 |
| `code/dataset-x7wh` | 0.582 → 0.649 | 0.530 → 0.616 |
| `code/dataset-yfch` | 0.626 → 0.701 | 0.535 → 0.763 |
| `code/dataset-zg6q` | 0.535 → 0.606 | 0.529 → 0.577 |
| `cyber/dataset-9aui` | 0.589 → — | 0.452 → 0.708 |
| `general/dataset-1doa` | 0.526 → 0.581 | 0.577 → 0.578 |
| `general/dataset-5610` | 0.547 → 0.559 | 0.528 → 0.487 |
| `general/dataset-epqd` | 0.619 → 0.588 | 0.606 → 0.621 |
| `general/dataset-trla` | 0.520 → 0.541 | 0.472 → 0.526 |
| `visual/dataset-053e` | 0.502 → 0.594 | 0.537 → 0.610 |
| `visual/dataset-gtav` | 0.000 → 0.075 | 0.091 → 0.186 |
| `visual/dataset-jzd3` | 0.430 → 0.493 | 0.375 → 0.482 |
| `visual/dataset-ol8x` | 0.000 → 0.151 | 0.169 → 0.418 |
| `visual/dataset-pt5v` | 0.719 → 0.797 | 0.626 → 0.713 |
| `visual/dataset-ve5o` | 0.840 → 0.912 | 0.752 → 0.893 |

## Harness mix
Harness names are anonymised (`harness-A` … ; `-pw` suffix looks like a variant of the same harness). Cells: total rollouts / mean trained-rollout share / mean non-zero-advantage rate.

| harness | pro | flash |
|---|---|---|
| `harness-A` | 105,314 / 0.16 / 0.98 | 104,467 / 0.16 / 0.98 |
| `harness-A-pw` | 5,513 / 0.01 / 0.98 | 4,825 / 0.01 / 0.99 |
| `harness-B` | 103,817 / 0.16 / 0.98 | 105,178 / 0.16 / 0.98 |
| `harness-C` | 105,864 / 0.16 / 0.98 | 104,860 / 0.15 / 0.98 |
| `harness-D` | 103,358 / 0.16 / 0.98 | 102,765 / 0.15 / 0.98 |
| `harness-D-pw` | 5,525 / 0.01 / 0.99 | 5,156 / 0.01 / 0.99 |
| `harness-E` | 14,657 / 0.02 / 1.00 | 15,599 / 0.02 / 1.00 |
| `harness-F` | 16,138 / 0.02 / 1.00 | 15,195 / 0.02 / 1.00 |
| `harness-G-pw` | 5,871 / 0.01 / 0.99 | 4,800 / 0.01 / 0.99 |
| `harness-H` | 73,624 / 0.11 / 1.00 | 73,517 / 0.11 / 1.00 |
| `harness-I` | 3,576 / 0.01 / 1.00 | 3,445 / 0.01 / 1.00 |
| `harness-J` | 4,943 / 0.01 / 1.00 | 5,109 / 0.01 / 1.00 |
| `harness-K` | 4,901 / 0.01 / 1.00 | 4,773 / 0.01 / 1.00 |
| `harness-L` | 5,311 / 0.01 / 1.00 | 4,920 / 0.01 / 1.00 |
| `harness-M` | 4,795 / 0.01 / 1.00 | 5,168 / 0.01 / 1.00 |
| `harness-N` | 4,905 / 0.01 / 1.00 | 4,915 / 0.01 / 1.00 |
| `harness-O` | 5,837 / 0.01 / 1.00 | 4,760 / 0.01 / 1.00 |
| `harness-P` | 5,625 / 0.01 / 1.00 | 5,048 / 0.01 / 1.00 |
| `harness-Q` | 5,893 / 0.01 / 1.00 | 4,875 / 0.01 / 1.00 |
| `harness-R` | 14,332 / 0.05 / 1.00 | 30,292 / 0.05 / 1.00 |
| `harness-S` | 15,018 / 0.02 / 1.00 | 15,021 / 0.02 / 1.00 |
| `harness-T` | 30,778 / 0.05 / 1.00 | 30,782 / 0.05 / 1.00 |
| `harness-U` | 15,020 / 0.02 / 1.00 | 15,008 / 0.02 / 1.00 |

## Groupwise agentic grader (GAR) and reward-hacking screen
From `penalty/stage_credit_group/*` — the online judge that re-ranks passing rollouts inside a group. `select_hack_attempt_rate` is the share of judged groups where the judge flagged a hack attempt.

| metric | pro (steps 1-3 → 28-30) | flash (steps 1-3 → 28-30) |
|---|---|---|
| `end2end_success_rate` | 0.962 → 0.960 | 0.959 → 0.957 |
| `groups_judged` | 1036.667 → 909.667 | 945.333 → 917.333 |
| `select_hack_attempt_rate` | 0.364 → 0.382 | 0.385 → 0.490 |
| `select_r1_rate` | 0.045 → 0.077 | 0.044 → 0.061 |
| `select_r2_rate` | 0.029 → 0.017 | 0.028 → 0.019 |
| `select_r3_rate` | 0.018 → 0.023 | 0.020 → 0.027 |
| `select_pass_turns_mean` | 46.744 → 52.904 | 52.992 → 67.881 |
| `time_total_sec_mean` | 605.691 → 580.582 | 537.058 → 568.894 |

Mean hack-attempt rate per harness:

| harness | pro | flash |
|---|---|---|
| `harness-A` | 0.45 | 0.48 |
| `harness-B` | 0.43 | 0.48 |
| `harness-C` | 0.46 | 0.53 |
| `harness-D` | 0.25 | 0.28 |

## Lengths, turns, env
| metric | pro (steps 1-3 → 28-30) | flash (steps 1-3 → 28-30) |
|---|---|---|
| `ctx_response_length/mean` | 67,718.60 → 127,140.33 | 71,818.03 → 131,148.00 |
| `ctx_total_length/mean` | 71,867.13 → 131,446.33 | 75,958.07 → 135,397.00 |
| `dynsam/agg_turn/mean` | 45.40 → 44.61 | 51.10 → 61.58 |
| `train/spec_accept_length/token_mean` | 3.53 → 3.22 | 2.85 → 2.67 |
| `env/possible_leak` | 0.00 → 0.00 | 0.00 → 0.00 |
| `env/total_error` | 0.00 → 2.00 | 16.33 → 71.33 |

## Held-out benchmarks during training
| benchmark | run | first | last | best |
|---|---|---|---|---|
| DeepSWE v1.1 (mini-swe-agent, avg@3) | pro | 58.41 @1 | 72.57 @30 | 72.57 @26 |
| DeepSWE v1.1 (mini-swe-agent, avg@3) | flash | 48.67 @1 | 65.68 @30 | 67.86 @28 |
| In-house Coding Bench (avg@3) | pro | 57.54 @1 | 65.43 @29 | 65.43 @29 |
| In-house Coding Bench (avg@3) | flash | 53.83 @1 | 62.87 @30 | 62.91 @28 |
| AutomationBench v1.0.6 (avg@3) | pro | 45.20 @1 | 53.10 @29 | 53.10 @29 |
| AutomationBench v1.0.6 (avg@3) | flash | 44.80 @1 | 52.70 @30 | 52.80 @29 |

## Operator notices (as posted)

- 09-16 17:58 UTC — we have updated the latest deepswe results for flash step 12 & pro step 8. we will keep posting as the offline evaluation results come out.
- 09-16 20:08 UTC — the mimo-v2.6-pro run is restarting due to a vram issue on one node.
- 09-17 02:27 UTC — we restarted the flash run from step 15. reason: a type of infra error on one of datasets was not correctly detected over the past ~3 hours.
- 09-17 12:20 UTC — there was a network connectivity issue between the pro training cluster and the grader deployment. we have restarted the run. we also removed the cyber dataset from the upcoming pro run, since we observed some bad patterns in the rollout logs.
- 09-18 03:49 UTC — the pro run restarted at step 17 due to a GPU OOM issue caused by expert load imbalance. we have adjusted the training parallelism strategy.
- 09-19 10:14 UTC — we filtered out tasks that are relatively easy for the current pro model.

## Metric inventory
| namespace | pro | flash |
|---|---|---|
| `actor` | 257 | 256 |
| `critic` | 324 | 324 |
| `ctx_prompt_length` | 81 | 81 |
| `ctx_response_length` | 81 | 81 |
| `ctx_total_length` | 108 | 108 |
| `dynsam` | 83 | 83 |
| `env` | 15 | 15 |
| `partial` | 337 | 385 |
| `penalty` | 535 | 521 |
| `perf` | 1 | 1 |
| `timing_s` | 3 | 3 |
| `train` | 191 | 191 |
| `train_infer_diff` | 11 | 11 |
| `training` | 2 | 2 |
