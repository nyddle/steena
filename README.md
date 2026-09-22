# MiMo-V2.6 RL — что Xiaomi реально выложили

Разбор релиза <https://mimo.xiaomi.com/mimo-v2-6> (22.09.2026) и снимок публичных логов RL-обучения.

- `fetch.py` — выкачивает всё из публичного API дашборда <https://mimo.xiaomi.com/rl> в `data/` (только stdlib).
- `analyze.py` — строит `REPORT.md` с таблицами по данным из `data/`.
- `build_dashboard.py` + `dashboard_template.html` → `dashboard.html` — интерактивный дашборд с графиками (hover, таблицы, светлая/тёмная тема).
- `data/` — снимок на 2026-09-22: конфиг, статус, ~2000 метрик × 30 шагов для каждого рана (pro, flash), бенчмарки, заметки операторов.

```bash
python fetch.py && python analyze.py && python build_dashboard.py
```

## Что выложено на самом деле (на 22.09.2026)

| Заявлено | Где | Статус |
|---|---|---|
| Веса MiMo-V2.6-Pro-RL, Flash-RL, Distill-Qwen-9B | HF `XiaomiMiMo/*` | ✅ есть |
| Техрепорт (44 стр.) | `MiMo_V2_6_technical_report.pdf` в HF-репо Pro-RL | ✅ есть |
| «Training dynamics» — логи обоих RL-ранов | `mimo.xiaomi.com/rl` (JSON API) | ✅ есть, ~2000 метрик/шаг, по датасетам и харнесам |
| RL-окружения (~7k задач + верификаторы: code 3k, visual 2k, cyber 1k, general 1k, music ~1k) | — | ❌ публичной ссылки не нашёл (ни HF datasets, ни GitHub, ни ModelScope) |
| RL-фреймворк и mini-harnesses | — | ❌ ссылки нет ни в статье, ни в репорте, ни в model card |
| Трейсы / траектории (~750k на ран) | — | ❌ не выложены; в логах имена датасетов и харнесов анонимизированы |

Важно: выложенные окружения — это набор для 9B-дистиллята (секция 7 репорта), а не те задачи, на которых учили Pro/Flash.
