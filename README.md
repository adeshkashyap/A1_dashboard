# EstateFlow — Real Estate CRM UI Kit

Premium React UI demo for real-estate dealers and agencies.  
Use it as a **marketplace template**, client pitch, or starting point for your own CRM product.

All data is **local**: seeded dummy data + `localStorage`. No backend, Supabase, Lovable, or API keys required.

---

## What’s included

### Marketing site
- Sticky glass navbar with section anchors (Features, How it works, Results, Pricing, FAQ)
- Hero with live WhatsApp-style demo chat
- Trust strip, problem → solution, how-it-works steps
- Features grid, results / case study, pricing, FAQ accordion, final CTA
- Light & dark theme toggle

### Admin dashboard (full demo shell)
| Area | What you get |
|------|----------------|
| **Dashboard** | KPIs, charts, recent leads, quick actions, onboarding tour |
| **Properties** | Grid / table, create / edit / delete, **detail drawer** |
| **Leads** | Kanban board with drag status updates |
| **Visits** | Week calendar + list, Scheduled / Completed / Cancelled |
| **Clients / Team / Reports / Settings** | Polished demo surfaces |
| **WhatsApp** | Mock connection status (UI only) |
| **Notifications** | Header popover with demo alerts |

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:3000` or `http://localhost:5173`).

1. Landing → **Try Demo** / **Login**
2. Click **Enter Demo Dashboard** (one click — no OTP)
3. Explore Properties, Visits, Leads, Team, etc.

Demo user is seeded as **Alex Morgan** (`demo@estateflow.app`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

---

## Tech stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** for data hooks
- **Framer Motion** on the landing page
- **Recharts** on dashboard charts
- **next-themes** for light / dark

---

## Project map

```
src/
  pages/                 # Landing, Auth, Dashboard, Properties, Leads, Visits, …
  components/
    landing/             # Marketing sections
    layout/              # Sidebar, header, notifications
    properties/          # Modals + detail sheet
    theme/               # ThemeProvider + ThemeToggle
  lib/
    api-client.ts        # localStorage “API” (leads, properties, visits, …)
    dummy-data.ts        # Seeded demo content
    types.ts             # Shared TypeScript types
public/                  # Favicon + static assets
```

---

## How data works

- First load seeds data into `localStorage` (versioned key `estateflow_seeded_v3`).
- Create / update / delete on leads, properties, visits, team, etc. persists in the browser.
- To **reset the demo**, clear site data for this origin (or remove keys starting with `estateflow_`).

There is **no real WhatsApp, payments, or email** integration — those UIs are demo-only.

---

## Customization tips

### White-label the brand
Search the codebase for `EstateFlow` and replace with your product name (navbar, sidebar, landing, `index.html` title/meta).

### Colors & fonts
- Tokens live in `src/index.css` (`:root` / `.dark`)
- Display font: **Fraunces** · Body: **DM Sans** (see `index.css` + `tailwind.config.ts`)

### Dummy content
Edit `src/lib/dummy-data.ts` — properties, leads, visits, reps, pricing plans.

### Favicon
Replace files in `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`).

---

## Buyer checklist

- [ ] Run `npm install` && `npm run dev`
- [ ] Walk landing anchors + light/dark
- [ ] Open demo dashboard → Properties detail → Visits → Leads → Team
- [ ] Swap brand name / colors before shipping to a client
- [ ] Wire your own backend when you’re ready (replace `src/lib/api-client.ts`)

---

## License / usage

You purchased this UI kit for your projects.  
Use it in client work or your own SaaS. Do **not** resell the template as-is on marketplaces without your own substantial modifications and rights clearance.

---

## Support

Questions about setup or structure: open an issue on the repo you received, or contact the seller through the marketplace where you bought EstateFlow.
