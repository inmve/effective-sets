# Search demand: what people type (Google autocomplete, 2026-11-13)

Method: Google suggestqueries (en-US, ru-RU), forms `X` / `X online` / `X app` / `X free`
(ru: `X` / `X приложение` / `X онлайн`). Counts = number of suggestions returned (max 10), not volumes.
Earlier Trends numbers (× "guitar tuner", worldwide): `~/Code/demand-research/report.md` (2026-10-29).
Script: Claude's scratchpad `suggest.py`; raw output kept below.

## Reading
- **Trackers are a crowded, live search:** `workout tracker`, `workout log`, `workout tracker app` return 10 suggestions in every form ("…app free", "…template", "…reddit"). Russian: «дневник тренировок» 10/8 («приложение», «шаблон», «excel шаблон»), «приложение для тренировок в зале».
- **The idea behind our numbers is searched as a question, not a tool:** `sets per muscle group (per week)`, `weekly sets per muscle group`, «сколько подходов на мышцу в неделю» — 10 suggestions, but 0 for "app/online/free". People want the answer (how many sets), not a calculator. A page that answers it *with your own numbers* is the bridge.
- **`training volume calculator`** 8/3 ("workout volume calculator app"); `hypertrophy volume calculator` 0 — the phrase people use is "volume".
- **Muscle map:** `muscle heatmap` 10/4 (svg, coros, garmin), `workout muscle map` / `exercise muscle map` 10. `muscle heat map workout` 0. Earlier Trends: "muscle map workout" ≈ 0.005× guitar tuner — small.
- **Share card:** people search *captions and ideas* (`gym instagram story captions/ideas`), not a card maker. `workout summary` is mostly Apple Watch.
- **Exercise database is searched, also as an API:** `exercise database` 10/5/10/2 ("by muscle group", "free", "download"), `exercise database api` 9 ("free", "workout database api"), «база упражнений» 10 («в зале», «на плечи»). Supports Ivan's bet on an open base.
- **Calisthenics:** `calisthenics tracker` 10/10/5 ("app", "notion", "reddit"); `calisthenics app` 10 everywhere.
- **Competitor-alternative:** `strong app alternative` ("reddit", "free"); `hevy alternative` is swallowed by "heavy alternative" music.
- **Informational giants:** `muscles worked in …`, «какие мышцы работают при подтягивании» — reference queries, big (Trends 0.73× guitar tuner for "muscles worked"), a way in for exercise pages of the base.

## Raw
```
sets per muscle group              10/0/0/0  | per week; ; per workout; per week reddit
weekly sets per muscle group       10/0/0/0  | ; reddit; for each muscle group; optimal weekly sets per muscle group
weekly volume calculator           3/0/0/0   | ; weekly net volume stimulus calculator; how much volume per week
training volume calculator         8/3/0/0   | ; workout volume calculator; workout volume calculator app; total training volume calculator
hypertrophy volume calculator      0/0/0/0
effective reps                     10/0/0/0  | effective reps model; ; training; per week
muscle heatmap                     10/4/0/0  | ; svg; coros; garmin
muscle heat map workout            0/0/0/0
workout muscle map                 10/0/0/0  | ; exercise muscle map; fitness muscle map; training muscle map
workout recap                      4/5/0/0   | ; weekly workout recap; apple workout recap
workout summary                    5/10/7/4  | ; iphone; apple watch; exercise summary
workout share                      10/10/0/0 | ; price; app; reddit
workout card                       10/10/10/3| cardigan; cards; cards deck; cardio (noise)
workout instagram story            10/0/0/0  | ; captions; song; ideas
gym instagram story                10/0/0/0  | captions; ideas; ; ideas men
workout tracker                    10/10/10/10 | ; app; template; app free
workout log                        10/10/10/10 | ; app; book; template
workout tracker app                10/10/10/8 | ; free; reddit; free reddit
hevy alternative                   10/10/6/0 | heavy alternative (music, noise)
strong app alternative             10/0/6/0  | ; reddit; free; alternative exercises
calisthenics tracker               10/10/5/0 | ; app; notion; app reddit
calisthenics app                   10/10/10/6| ; free; reddit; review
exercise database                  10/5/10/2 | ; by muscle group; free; download
exercise database api              9/0/2/0   | ; free; exercise library api; workout database api
exercise library json              2/0/0/0   | exercise database json
muscles worked                     10/2/10/0 | in deadlift; in pull ups; in push ups; by squats
what muscles does                  10/6/10/0 | a rowing machine work; bench press work; deadlift work
rir training                       10/0/0/0  | ; meaning; reddit; method
rpe calculator                     10/4/0/3  | ; running; app; powerlifting
сколько подходов на мышцу          5/0/0     | в неделю; за тренировку; сколько должно быть подходов на мышцу в неделю
подходов в неделю на группу мышц   7/0/0     | сколько подходов в неделю на группу мышц; на одну группу; на каждую группу
объем тренировок                   3/0/0     | ; это; для натурала
дневник тренировок                 10/8/1    | ; приложение; шаблон; excel шаблон
приложение для тренировок          10/0/1    | в зале; ; дома; дома бесплатно
трекер тренировок                  10/1/1    | ; на месяц; распечатать; приложение
какие мышцы работают               10/0/0    | при подтягивании; при езде на велосипеде; при отжимании
калистеника приложение             1/0/0
база упражнений                    10/0/0    | в зале; ; на плечи; на спину
```
