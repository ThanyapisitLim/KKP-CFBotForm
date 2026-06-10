# Deploy (1 GitHub repo, 2 services)

This repo contains two apps: `frontend` (Next.js) and `backend` (Express + MongoDB).
They deploy as **two separate services from the same repo**.

## 1. Backend → Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, select this repo. Render will detect `render.yaml`
   (root of repo) and create a web service with **Root Directory = `backend`**.
3. Set the env vars Render asks for (marked `sync: false` in `render.yaml`):
   - `MONGODB_URI` – your MongoDB Atlas connection string
   - `CORS_ORIGIN` – your Vercel frontend URL (set after step 2 below), e.g.
     `https://cf-bot-feedback.vercel.app`
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` – only needed if you run `npm run seed:admin`
4. Deploy. Note the resulting URL, e.g. `https://cf-bot-feedback-backend.onrender.com`.
5. Run the admin seed once (Render Shell or locally pointed at the prod `MONGODB_URI`):
   ```
   npm run seed:admin -- <username> <password>
   ```

## 2. Frontend → Vercel

1. In Vercel: **Add New → Project**, import this repo.
2. Set **Root Directory = `frontend`** (Vercel asks for this during import, or
   change it later in Project Settings → General).
3. Add environment variables (Project Settings → Environment Variables):
   - `BACKEND_API_URL` = the Render URL from step 1.4, e.g.
     `https://cf-bot-feedback-backend.onrender.com`
   - `AUTH_SECRET` = a long random string (used to sign the admin session cookie —
     reuse the value from `frontend/.env.local` or generate a new one)
   - Leave `NEXT_PUBLIC_API_URL` unset (the `/api/feedback` rewrite handles it).
4. Deploy. Note the resulting URL, e.g. `https://cf-bot-feedback.vercel.app`.

## 3. Connect them

Go back to Render and set `CORS_ORIGIN` to the Vercel URL from step 2.4, then
redeploy the backend (or it will auto-redeploy on env var save).

## How requests flow in production

- Browser → `https://your-app.vercel.app/api/feedback` (same-origin)
- Vercel rewrite (`next.config.ts`) → `https://your-backend.onrender.com/api/feedback`
- `/dashboard` admin login (`/api/admin/login`, `/api/admin/logout`) are Next.js
  routes that call the backend's `/api/admin/login` directly via `BACKEND_API_URL`
  (server-side, no CORS involved).

## Free-tier note

Render's free web services spin down after inactivity and take ~30–60s to wake up
on the first request. If that's an issue, upgrade the backend plan or ping
`/health` periodically.
