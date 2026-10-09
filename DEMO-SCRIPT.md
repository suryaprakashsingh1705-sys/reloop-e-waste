# ReLoop — 3-minute judging demo script

**Do not claim unimplemented features.** This script is for the current front-end prototype. Update the AWS section only after deployment/integration is verified.

## 0:00–0:20 — The problem
“Unused phones, laptops and batteries often stay forgotten in drawers or enter mixed waste because people don't know the next safe step. ReLoop helps turn that uncertainty into a trackable recovery action.”

## 0:20–0:45 — The dashboard
Show the recovery queue and explain that the sample records are demo data. The metric is estimated logged device weight, not independently verified waste diversion.

## 0:45–1:25 — Add a device
Click **Log e-waste**. Add an old phone or laptop, choose the category and condition, enter an approximate weight, then create a recovery passport. Show that the item appears in the list and metrics update.

## 1:25–1:55 — Track a next step
Search/filter the list. Mark an item **Ready for handover**. Explain that it means the user is preparing the item, not that a pickup has been booked. Only mark **Recovered** after a real handover; the app asks for confirmation.

## 1:55–2:20 — Safety and local verification
Show the data-safety and battery guidance. Open the Haryana e-waste resources link. Explain that public recycler listings can become outdated and users should verify current CPCB registration and accepted device types before visiting.

## 2:20–2:40 — Export and continuity
Export the recovery log as JSON. Explain that this version stores data in the current browser; it is not yet a multi-user backend.

## 2:40–3:00 — Environmental impact and next steps
“ReLoop makes the recovery journey visible, from logging a device to preparing it for an appropriate collection route. Our next validation step is to verify local collection partners and connect the prototype to reliable shared storage.”

## AWS note
The current static prototype has **not** been deployed to AWS yet. Do not state that it is AWS-powered until the team has deployed it or integrated a qualifying AWS open-source tool and can demonstrate that integration.
