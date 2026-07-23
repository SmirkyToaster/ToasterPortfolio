# GitHub Actions Setup Guide

This document describes how to configure and test the YouTube video fetching workflow on GitHub.

## Prerequisites
- Node.js 16+ (for local testing)
- A YouTube Data API v3 key (from Google Cloud Console)
- Your YouTube channel ID (starts with `UC...`)

## Step 1: Get your YouTube credentials

### YouTube Data API v3 key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the YouTube Data API v3
4. Create a new API key (credentials)
5. Restrict the key:
   - **API restrictions**: Select "YouTube Data API v3" only
   - **Application restrictions**: Leave as "None" (the workflow runs server-side)
6. Copy the key — you'll add it to GitHub Secrets

### Your YouTube channel ID
1. Go to your YouTube channel
2. In the URL bar, grab the channel ID after `/channel/` or look in channel settings
3. It looks like: `UCxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add secrets to GitHub

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add two secrets:
   - **Name**: `YT_API_KEY` | **Value**: (paste your API key)
   - **Name**: `YT_CHANNEL_ID` | **Value**: (paste your channel ID)
4. Save both

## Step 3: Test locally (optional but recommended)

Before pushing to GitHub, test the fetch script locally to ensure your credentials work.

### PowerShell
```powershell
$env:YT_API_KEY    = 'YOUR_REAL_API_KEY'
$env:YT_CHANNEL_ID = 'UCxxxxxxxxxxxxxxxxxxxxxxxx'
node scripts/fetch-youtube.js
```

### Bash / macOS / WSL
```bash
export YT_API_KEY='YOUR_REAL_API_KEY'
export YT_CHANNEL_ID='UCxxxxxxxxxxxxxxxxxxxxxxxx'
node scripts/fetch-youtube.js
```

**Success**: You should see `Wrote data/videos.json` and the file should contain your recent videos.

**Errors**:
- "Missing YT_API_KEY or YT_CHANNEL_ID" — you didn't set the env vars
- "YouTube API returned 403" — API key not enabled for YouTube Data API v3 or restricted incorrectly
- "YouTube API returned 400" — invalid channel ID

## Step 4: Commit and push

Once local testing passes:
```bash
git add .
git commit -m "chore: add YouTube video fetching workflow"
git push origin main
```

## Step 5: Run the workflow

### Automatic runs (already configured)
- **On push to `main`** — workflow runs automatically
- **Weekly schedule** — Sunday 00:00 UTC (can be changed in `.github/workflows/fetch-youtube.yml`)

### Manual trigger
1. Go to your repo on GitHub
2. Click **Actions** tab
3. Select **Fetch YouTube videos** workflow
4. Click **Run workflow** (top right)
5. Choose branch (`main`) and click **Run workflow**

The workflow will run immediately and commit `data/videos.json` if there are changes.

## Step 6: Inspect logs

After the workflow runs:
1. Go to **Actions** → **Fetch YouTube videos**
2. Click the latest run
3. Expand **Fetch YouTube videos** job to see detailed logs
4. Check for errors or success message "Wrote data/videos.json"

## Troubleshooting

### Workflow fails with "Missing YT_API_KEY or YT_CHANNEL_ID"
- Check that both secrets are added in repo Settings → Secrets
- Secret names must be exact: `YT_API_KEY` and `YT_CHANNEL_ID`
- If you just added them, they may take a moment to be available; try the workflow again

### "Failed to push" error
- The workflow uses the default GitHub token which has limited permissions
- Make sure your repo doesn't have branch protections that block automated commits
- If you have status checks required, add `[skip ci]` to the commit message (already in workflow)

### "YouTube API returned 403" or "quota exceeded"
- API key may not be enabled for YouTube Data API v3 in Google Cloud
- Or you've exceeded your daily quota (default is 10,000 units/day; one search uses ~100 units)
- Check your API quota in Google Cloud Console

### `data/videos.json` not updating
- Check workflow logs for errors
- Verify the fetch script is writing to the correct path (`data/videos.json`)
- If there are no new videos, the workflow still commits but `data/videos.json` may be identical

## Configuration

### Change the schedule
Edit `.github/workflows/fetch-youtube.yml`:
```yaml
schedule:
  - cron: '0 0 * * 0'  # Sunday 00:00 UTC
```

Cron format: `minute hour day-of-month month day-of-week`
- `0 0 * * 0` = Sunday midnight
- `0 9 * * *` = daily at 09:00 UTC
- `0 */6 * * *` = every 6 hours

[Cron syntax guide](https://crontab.guru/)

### Change max videos fetched
Edit `scripts/fetch-youtube.js`:
```javascript
const MAX_RESULTS = process.env.MAX_RESULTS || 8;
```

Or set `MAX_RESULTS` env var in the workflow step (default is 8).

## Security notes
- API keys are stored in GitHub Secrets — they are encrypted and only accessible to the workflow
- The key is never logged or exposed in workflow output
- Rotate your API key periodically
- Monitor usage in Google Cloud Console

## Next steps
Once the workflow is running:
- The site will automatically load your latest videos from `data/videos.json`
- Deploy to GitHub Pages
- On each scheduled run (or push), videos will refresh automatically
