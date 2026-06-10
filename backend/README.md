# CF BOT Feedback API

Backend for the CF BOT (LINE OA) feedback survey. Receives submissions from the
frontend (`SurveyForm.tsx`) and stores them in MongoDB.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGODB_URI etc.
npm run dev
```

## Scripts

- `npm run dev` – run with hot reload (ts-node-dev)
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled server (`dist/server.js`)
- `npm run lint` – type-check only (`tsc --noEmit`)

## API

- `GET /health` – health check
- `POST /api/feedback` – submit a survey response
  ```json
  {
    "submittedAt": "2026-06-10T10:00:00.000Z",
    "lang": "th",
    "answers": { "q1_team": "...", "q9_satisfaction_matrix": { "ease_of_use": 5 }, "...": "..." }
  }
  ```
- `GET /api/feedback?page=1&limit=20` – list submissions (paginated)

## Structure

```
src/
├── server.ts           # entry point
├── app.ts               # express app + routes
├── config/env.ts        # env vars
├── db/mongo.ts          # MongoDB connection
├── models/Feedback.ts   # mongoose schema
├── controllers/         # request handlers
├── routes/               # route definitions
└── types/feedback.ts    # shared types (mirrors survey.ts answer shapes)
```

Answer shapes per question type follow `src/app/data/survey.ts` in the frontend
(`SECTIONS`): `text`/`textarea`/`radio` → string, `checkbox`/`checkboxLimit`/`ranking`
→ string[], `matrix` → `{ [rowId]: 1-5 }`.
