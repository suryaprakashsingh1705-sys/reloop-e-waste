# ReLoop — E-Waste Recovery Platform

A responsive hackathon MVP for the WeMakeDevs Environmental Hacks, Waste & Energy track. ReLoop helps users log unused electronics, follow safer handling guidance, identify appropriate recovery routes, and track a device through a simple recovery workflow.

## Current MVP features

- Responsive dashboard and mobile layout
- Add an e-waste device and create a recovery passport ID
- Device categories, condition, approximate weight, notes, and status
- Search and status filters
- Status workflow: Logged → Ready for handover → Recovered
- Browser-local persistence with `localStorage`
- Estimated material weight based on entered or default weights (not a measured environmental impact)
- Export recovery log to JSON
- Safer disposal guidance and link to the Central Pollution Control Board website
- Explicit disclaimer that demo entries and recovery options are not verified real-world recycler listings

## Run locally

This is currently a static front-end prototype and needs no build step or package installation.

1. Open `index.html` in a browser, or serve the folder using a local static server.
2. All interactions work in the browser; recovery records are stored in that browser's local storage.
3. Use the `Export recovery log` control to download your current entries.

## Important demo integrity notes

- The initial three entries are seeded examples. They are not real users, verified handovers, or verified environmental impact.
- The weight metric sums entered/default device weights. It should be described as *estimated material weight logged*, not as confirmed waste diverted.
- The current prototype does not use AI image recognition, a backend, a shared database, real pickup booking, or live recycler availability.
- Before final judging, replace the sample records with a clearly explained live demo flow and add verified local recycling information if the team can validate it.

## Hackathon requirements to address before submission

The event page states that prize eligibility requires either at least one qualifying AWS open-source tool or deployment on AWS. It also calls for a recorded three-minute demo video. This repository has not yet been deployed to AWS, and AWS integration is not yet implemented. Do not claim either until the team completes and verifies it.

Suggested static hosting path: AWS Amplify Hosting. The owner of the AWS account must sign in, connect/upload this project, deploy it, and test the public URL. Never commit AWS keys or other secrets to this repository.

## Suggested next build steps

1. Validate the user journey with the team and replace seed data with a deliberate demo script.
2. Verify one or more authorized local e-waste collection routes from official sources; record source links and access dates.
3. Add a backend/database if the judging demo needs shared, cross-device records.
4. Deploy on AWS or integrate a qualifying AWS open-source project, then verify it actually runs.
5. Record a three-minute demo: problem (20s), user flow (100s), AWS usage (20s), impact and limitations (20s).
