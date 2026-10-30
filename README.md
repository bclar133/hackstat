# Hack Stat

**Golf stats for hackers.** A responsive, installable golf scorebook in shades of green.

## Features

- Online course-name autocomplete, tee selection and scorecard autofill where published data is available.
- A sourced Maleny Black/Mountain 18-hole scorecard, available even if online search is down.
- Courses and separate tee sets, with 9- or 18-hole scorecards.
- One home club and starred clubs: home first, stars next, then alphabetical, across course cards and selectors. Preferences apply to all saved tee sets at a club and are included in backups.
- Hole-by-hole scores, fairways, greens in regulation, putts, penalties, up-and-downs and sand saves.
- Gross score, manually entered handicaps and nett score.
- Eagle-putt opportunities, scoring trends, weighted percentages and sortable round history.
- Gross eclectic per course and tee set, with dates and links to the contributing rounds.
- Separate example and personal scorebooks, local autosave, JSON backup/restore and per-hole CSV export.
- Optional tee club, approach distance, first-putt distance, conditions and round notes.
- Android home-screen icons, maskable icon and an Apple touch icon.

## Test on Android

1. Open https://hack-stat.newretreads.chatgpt.site in Chrome and sign in using the account that owns the private app.
2. Explore the sample data, then choose **Use my own data**.
3. Add a course and start a round. Record a few holes, close the app and reopen it to check autosave.
4. In Chrome's menu, use **Install and create shortcut → Install**, **Add to Home screen** or **Install app**, depending on the browser version and what it offers.
5. Open the home-screen icon. After an online visit, test a saved round with airplane mode enabled. The private-site authentication gate may still require an internet connection; end-to-end offline launch is not guaranteed on this host.
6. Finish a round, inspect the eclectic and export a backup. Restore into sample mode first if you want to trial the restore flow without replacing your personal scorebook.

The browser version does not require an APK or Play Store release. It is not a native Android or iOS build. Rounds stay in the browser/device where they were entered; there is no automatic cloud sync. Export a backup before clearing browser data, changing device or moving to a different hosting domain.

## Source and hosting

The static web app is in `dist/`; no build step or package installation is required. Point static hosting at `dist` and serve over HTTPS for service-worker/home-screen capabilities. Cloudflare Pages can use no build command and `dist` as the output directory.

This GitHub repository contains the portable source. The existing private demo is published separately through ChatGPT Sites; committing here does not automatically redeploy that hosted app. No public hosting or GitHub Pages deployment is configured by this change.

Local preview:

```sh
python3 -m http.server 8000 --directory dist
```

Then open http://localhost:8000. Testing from another device on a plain LAN HTTP address will not provide all HTTPS-only PWA capabilities.

## Checks

```sh
node --check dist/app.js
node tests/stats.cjs
node tests/course-lookup.cjs
```

The checks cover score totals, nett, weighted percentages, GIR, eagle opportunities, opportunity denominators, eclectic, impossible-score validation, backup validation, CSV safety, view generation and separate local persistence. They do not replace browser or physical-device testing.

## Course search

In **Courses → Add course / tees**, type three or more letters in the course name. Search is debounced and combines a small, clearly labelled saved web-scorecard catalogue with live OpenGolfAPI results. Choose a result, choose the exact tee/rating category, review the populated table, and save. `Male` finds Maleny Golf Club and fills the published Black/Mountain 18-hole card.

OpenGolfAPI currently requires no key for course reads and allows browser CORS requests. Some courses have full hole/tee data; others are directory-only. Missing values are left blank with a clear explanation. Saved courses and existing round snapshots are preserved. This feature searches a structured online golf directory, rather than scraping arbitrary websites or claiming every web result has a complete scorecard. See [ATTRIBUTION.md](ATTRIBUTION.md) for data sources, licensing and the Maleny fallback’s provenance.

## Branding

`dist/brand/hackstat-line-graph.webp` contains the new golf ball combined with two green line graphs. The app uses `icon-line-192.png`, `icon-line-512.png`, `icon-line-maskable-512.png` and `apple-touch-line.png`. The manifest and service-worker cache have been updated so new installs use these assets. Existing installed icons may take time to update through Chrome.
