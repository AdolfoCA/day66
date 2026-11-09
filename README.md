# Day 66

Adolfo's personal app for 66 days: train every day, eat to plan, no alcohol, five minutes of scene rehearsal, in bed by 23:00. One page, no framework, no build step.

## What is here

- `index.html`: the whole app (mission screen, Today, Train, Eat, Scene, Mirror, Settings).
- `api/claude.js`: one Vercel function. The phone sends a meal photo and a prompt; the function asks Claude with the key kept on the server and returns JSON.
- `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png`: so the site installs on the phone's home screen and opens full screen.

Data is kept on the device (browser storage) in this version. Settings has Copy and Paste to move it between devices. Inside a Claude artifact the same file uses the artifact's own storage and Claude access instead.

## Deploy on Vercel

1. vercel.com, Add New, Project, import `AdolfoCA/day66`. Framework preset: Other. No build command, no output directory. Deploy.
2. Project, Settings, Environment Variables: add `ANTHROPIC_API_KEY` (from the Anthropic console). Optional: `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`) and `ANTHROPIC_MODEL_QUICK` (default `claude-haiku-5-5`). Redeploy once after adding the key.
3. On the iPhone: open the Vercel URL in Safari, Share, Add to Home Screen.

## Run locally

    npx vercel dev

## Spelling and voice

British spelling everywhere. Sentence case, plain verbs, no exclamation marks, no emoji, no em dashes. The app only ever shows Adolfo's own sentences.
