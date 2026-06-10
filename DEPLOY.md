# Deploy (1 GitHub repo, 2 Vercel projects)

This repo contains two apps: `frontend` (Next.js) and `backend` (Express + MongoDB,
deployed as a Vercel serverless function via `backend/api/index.ts`).
They deploy as **two separate Vercel projects from the same repo**.

## 1. Backend → Vercel project #2

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import this repo again (a second project).
3. Set **Root Directory = `backend`**.
4. Framework Preset: "Other" is fine (the project has `backend/vercel.json` +
   `backend/api/index.ts`, which Vercel picks up as a serverless function;
   `backend/public/index.html` satisfies the default Output Directory check).
5. Add environment variables (Project Settings → Environment Variables):
   - `MONGODB_URI` – your MongoDB Atlas connection string
   - `CORS_ORIGIN` – your Vercel **frontend** URL (set after step 2 below), e.g.
     `https://kkp-cf-bot-form.vercel.app`
   - `NODE_ENV` = `production`
6. Deploy. Note the resulting URL, e.g. `https://kkp-cf-bot-form-backend.vercel.app`.
   Check `https://<that-url>/health` returns `{"status":"ok"}`.

## 2. Frontend → Vercel project #1

1. In Vercel: **Add New → Project**, import this repo.
2. Set **Root Directory = `frontend`**.
3. Framework Preset = "Next.js".
4. Add environment variables (Project Settings → Environment Variables):
   - `BACKEND_API_URL` = the backend URL from step 1.6, e.g.
     `https://kkp-cf-bot-form-backend.vercel.app`
   - `AUTH_SECRET` = a long random string (used to sign the admin session cookie —
     reuse the value from `frontend/.env.local` or generate a new one)
   - Leave `NEXT_PUBLIC_API_URL` unset (the `/api/feedback` rewrite handles it).
5. Deploy. Note the resulting URL, e.g. `https://kkp-cf-bot-form.vercel.app`.

## 3. Connect them

Go back to the **backend** project and set `CORS_ORIGIN` to the frontend URL
from step 2.5, then redeploy (Vercel redeploys automatically on env var save,
or trigger it manually from the Deployments tab).

## 4. Seed an admin user

Run this once, locally, pointed at the production database:

```
cd backend
MONGODB_URI="<your Atlas connection string>" npm run seed:admin -- <username> <password>
```

## How requests flow in production

- Browser → `https://your-frontend.vercel.app/api/feedback` (same-origin)
- Vercel rewrite (`frontend/next.config.ts`) → `https://your-backend.vercel.app/api/feedback`
- `/dashboard` admin login (`/api/admin/login`, `/api/admin/logout`) are Next.js
  routes that call the backend's `/api/admin/login` directly via `BACKEND_API_URL`
  (server-side, no CORS involved).
- Inside the backend project, `backend/vercel.json` rewrites every path to the
  single `backend/api/index.ts` function, which wraps the Express app
  (`backend/src/app.ts`) and reuses one MongoDB connection across warm invocations.

## Alternative: backend on Render

`render.yaml` (repo root) is still included if you'd rather run the backend as a
persistent Express server on Render instead of Vercel serverless functions:

1. In Render: **New → Blueprint**, select this repo. It detects `render.yaml`
   (root = `backend`).
2. Set the env vars Render asks for: `MONGODB_URI`, `CORS_ORIGIN`,
   `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
3. Use the resulting `https://<name>.onrender.com` URL as `BACKEND_API_URL` in
   the frontend project instead of the Vercel backend URL.

Render's free tier spins down after inactivity (~30–60s cold start on the first
request); Vercel serverless functions have much shorter cold starts but each
invocation may open a new MongoDB connection if the function instance isn't warm.
