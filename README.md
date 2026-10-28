# UCD Live Projects (prototype)

A clickable React prototype of a site where UCD students browse live company briefs
across disciplines, download the problem pack and submit within a per-project window.

```bash
npm install
npm run dev      # http://localhost:5173
```

## What works
- Browse 12 sample projects across 9 disciplines. Filter by discipline (multi-select),
  level, your progress and free-text search, and sort by newest, closing soonest or shortest window.
- On a project page, read the full brief and download each file or the whole pack as a .zip.
- The first download asks the student to confirm, then starts that project's clock
  (`windowHours` in `src/data/projects.js`). Downloading again never resets it.
- A live countdown turns amber under 12 hours and red under 1 hour. The upload form
  locks when the window ends.
- "Prototype controls" on each project page skip time forward so you can show each state.

## Prototype limits
- No accounts: progress is stored in `localStorage` (`src/lib/progress.js`), so clearing
  site data resets the clock. In production, `startedAt` must be recorded on the server.
- The downloadable files are generated stand-ins (`src/lib/assets.js`). The brief is a real
  Markdown problem statement; the datasets are small sample CSVs.
- Uploads aren't sent anywhere. Only file names and sizes are kept.

## Structure
```
src/data/projects.js        sample projects and categories
src/lib/progress.js         clock and submission state, status logic
src/lib/assets.js           file generation, zip download
src/components/             list, card pieces, detail, countdown, submission panel
```
