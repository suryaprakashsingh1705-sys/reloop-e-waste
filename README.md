# ReLoop — React + Vite MVP

ReLoop is a hackathon prototype for the WeMakeDevs Environmental Hacks, Waste & Energy track. It helps people log unused electronics, read safe-handling guidance, and track a device through a simple recovery workflow.

## Tech stack

- React
- Vite
- CSS
- Browser `localStorage` for prototype-only persistence

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

Vite outputs the production website into `dist/`.

## Current features

- Responsive dashboard
- Add an e-waste item and create a recovery passport ID
- Category, condition, estimated weight, notes, and status
- Search and status filters
- Status flow: Logged → Ready for handover → Recovered (confirmation required)
- Browser-local persistence
- Export recovery log as JSON
- Interactive device-specific disposal guidance for phones, laptops, tablets, batteries, cables, and small appliances
- Conditional safety warnings for battery or item damage
- Official Haryana e-waste resource link

## Honest prototype limitations

- Seed records are illustrative and are not real users or verified handovers.
- The weight metric is an estimate of entered/logged material, not confirmed waste diversion or measured environmental impact.
- This version has no backend, shared database, AI image recognition, real pickup booking, authentication, or live recycler availability. Device guidance is general information, not a substitute for manufacturer, local-authority, or specialist instructions.
- The Sonipat facility entry may be dated. Verify current authorization, accepted items, hours, and pickup availability before visiting.
- No AWS deployment has been completed by this repository. For hackathon prize eligibility, the event rules require a qualifying AWS open-source tool or AWS deployment. Do not claim either until completed and verified.

## AWS Amplify Hosting

For a Vite app, connect the GitHub repository to AWS Amplify. Build settings should use:

- Build command: `npm run build`
- Output directory: `dist`

The account owner must sign in and authorize the connection. Never commit AWS credentials, access keys, or `.env` secrets.
