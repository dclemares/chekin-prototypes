# Chekin — UX Prototypes

Static HTML/CSS mockups (no build, no app logic, mock data) of redesigned Chekin surfaces, layered on top of the existing `@chekinapp/tokens` design system.

Four prototypes live here, behind a common chooser at the root `index.html` ([GitHub Pages](https://invibeme.github.io/chekin-prototypes/)):

- **`dashboard-deprecated/`** — _(deprecated)_ the first host-side dashboard redesign: action-queue Home, bookings pipeline with clickable KPI filters, table-based properties, property workspace and workspace settings with separated views, unified documents hub, billing, 7 switchable design variants. See `dashboard-deprecated/UX-AUDIT.md` for the audit and "what changed and why". Kept for reference — a new dashboard prototype is being built on the Fable design and will supersede it.
- **`guestapp/`** — the guest-side Redesign 2.0 flows. See **[`guestapp/README.md`](guestapp/README.md)** for the file-by-file index and the ground rules, and **[`guestapp/SPEC.md`](guestapp/SPEC.md)** for the flow spec.
- **`guestapp/sdk/`** — the **embeddable Guest SDK (ChekinPro)** in a neutral skin, shown inside a mock partner website.
- **`guestapp/sdk-guestapp/`** — the same SDK flows in the guestapp's design language. See below.

## Guest SDK prototypes

The SDK is the same product as the guestapp, but rendered **inside a partner's page**, so it gets its own design study — two candidate surfaces, drawn from **markup-identical** pages that differ only in `shared.css`:

- **`guestapp/sdk/` — neutral.** The language of the hosts-sdk in `dashboard-chekin`: muted slate `#505077`, the host's **system font stack** (an SDK must not force a webfont download on the partner), no photography, no gradients or glass, depth from 1px borders.
- **`guestapp/sdk-guestapp/` — guestapp style.** Poppins, Chekin blue `#385bf8`, brand gradients, a glass widget header (chrome-only), rounder radii and real elevation.

A **Design: Neutral · Guestapp** toggle on every flow page jumps to the *same screen* in the other skin — the two folders share filenames and screen ids — so the pair doubles as a live demo of what a `guest-sdk.css` surface file in `@chekinapp/tokens` (beside `guestapp.css`) would control.

**Scope** (confirmed with the team): home hub · guests summary · guest form (police field sets, `hiddenSections`, `prefillData`, signature) · autofill by OCR · identity verification (+ QR handoff to phone, + QR-IV on property) · property link · guidebooks & FAQ · remote access & keys · errors & recovery. **Deliberately excluded**, because the Guest SDK does not carry them: payments, tourist taxes, deposits/property protection, upselling, chat, check-out, eSIM, instant check-in/auth, kiosk.

Conventions specific to these two folders:

- The mock partner site ("Nordica Stays") carries its **own green brand**. The **Widget accent: Neutral · Host brand** toggle repoints one CSS variable so the widget adopts that green — standing in for the SDK's real `styles` / `stylesLink` injection.
- An **integration event console** under each frame logs the ChekinPro callbacks (`onGuestRegistered`, `onIVFinished`, `onError`, `onScreenChanged`…) as you click through, and every page ends with a note naming the config options behind it (`mode`, `hiddenSections`, `redirectIVQrUrl`…).
- **Everything stays inside the widget box** — sheets, modals, spinners and crash states — mirroring the real SDK's iframe. The partner page never breaks.
- The **Embed: Desktop · Mobile** toggle narrows the same DOM to a phone-width host page; there are no separate mobile files.
- The in-widget **language chip** appears on every stable screen (guests read legal text), while the **menu button** appears only on `mode: "ALL"` pages — scoped modes like `ONLY_GUEST_FORM` and `IV_ONLY` stay single-purpose by contract.
- `flow.js` and `modals.js` are copied **verbatim** from `guestapp/`; `chrome.js` (toggles, sheets, event console) is shared byte-for-byte by both variants.

## How to view

Open the root `index.html` in a browser and pick a surface — or open `guestapp/index.html` directly; it links to all guest prototypes and documents every proposed change with its rationale.

**Proposal vs current.** Where a feature has two prototypes, the one marked **Proposal** is a redesign
proposal shown *beside* the **current** shipped variant — it is not the main variant, and nothing is
decided until it is chosen. The floating nav and `index.html` badge them the same way.

One canonical prototype per feature and form factor — organized by feature, with 📱 mobile and 🖥 desktop grouped together. Most are click-through flows; two are static screen sets (Home, desktop registration). `index.html` and the floating nav on every page follow the same feature-first grouping.

## Where the docs live

Each prototype folder documents itself, so there is exactly one description of any given file:

| Doc | Covers |
| --- | --- |
| [`guestapp/README.md`](guestapp/README.md) | The guest-side file index (every flow page and stylesheet, with its rationale) and the design ground rules — no colors outside `@chekinapp/tokens`, glass is chrome-only, motion respects `prefers-reduced-motion` |
| [`guestapp/SPEC.md`](guestapp/SPEC.md) | **Flow spec for AI agents** — states, transitions and CTA decision tables. Its sync contract requires it to be updated in the same commit as any change to a `guestapp/` prototype |
| [`dashboard-deprecated/UX-AUDIT.md`](dashboard-deprecated/UX-AUDIT.md) | The deprecated host dashboard: the audit, and what changed and why |

`guestapp/` is synced from the `prototype/` folder of the private guestapp repo, so treat its docs as the maintained copy — do not fork their content up to this level.
