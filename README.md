# 60-Day Hacker Tracker: Elite Placement Preparation System

A production-ready gamified 60-day curriculum tracker built with the modern stack:
Next.js (App Router), Tailwind CSS v4, FastAPI, PostgreSQL, and Docker.

## Project Structure
```text
/
├── backend/
│   ├── app/
│   │   ├── main.py        - FastAPI Application
│   │   ├── models.py      - SQLAlchemy DB Models
│   │   ├── schemas.py     - Pydantic Schemas
│   │   ├── routers/       - auth.py, tracker.py
│   │   └── utils/         - Gamification logic + JWT
│   ├── scripts/
│   │   └── seed.py        - Seed the DB with 60 Days JSON
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/           - Next.js Routes (page.tsx, dashboard, tracker, etc.)
│   │   ├── components/    - Reusable UI (Navbar.tsx)
│   │   └── lib/           - API client and Auth context
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Setup Instructions

### Environment Variables (.env)
You do not strictly need a `.env` to run this locally via Docker, as `docker-compose.yml` provides the defaults. However, for production deployment, create `.env` in the backend root:
```env
DATABASE_URL=postgresql://user:pass@db:5432/mydb
SECRET_KEY=your_highly_secure_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```
And in `frontend/.env.local` for local dev (if not using docker):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Run Locally with Docker
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up -d --build
```
This single command spins up PostgreSQL, FastAPI Backend, Next.js Frontend, and automatically runs the database seeding script for the entire 60 days.

- **Frontend Application**: `http://localhost:3000`
- **FastAPI Backend Swagger Docs**: `http://localhost:8000/docs`

---

## Deployment Strategy (MANDATORY REQUIREMENT)

### Database: Supabase / Neon
1. Create a free Postgres database on [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com).
2. Note the generated `DATABASE_URL` for your Backend deployment.

### Backend: Render / Railway
1. Push this repository to GitHub.
2. Sign up on [Render.com](https://render.com/).
3. Click "New Web Service" -> connect your GitHub repo.
4. Set Root Directory to `backend/`.
5. Environment: Docker or Python (Docker recommended since Dockerfile is provided).
6. Set Environment Variables:
   - `DATABASE_URL` = (From Supabase / Neon)
   - `SECRET_KEY` = (A secure random string)
7. Deploy. Note your live backend URL (e.g., `https://hacker-api.onrender.com`).

### Frontend: Vercel
1. Go to [Vercel.com](https://vercel.com/) and click "Add New Project".
2. Select your GitHub repository.
3. Set the "Framework Preset" to Next.js.
4. Set the Root Directory to `frontend/`.
5. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://hacker-api.onrender.com/api` (Your Render URL).
6. Deploy.

---

## API Endpoints List

### Auth (`/api/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Authenticate and receive a JWT token (Form Data).
- `GET /me`: Get current logged-in user details.

### Tracker (`/api/tracker`)
- `GET /days`: Get all 60 days of the roadmap + user's current progress.
- `GET /days/{day_number}`: Get a specific day's tasks + progress.
- `POST /progress/{day_number}`: Update a day's progress (dsa, ml, dev, deploy completions). Automatically calculates and updates the gamified XP and levels on completion.

---

## Advanced Gamification Features
1. **Experience (XP)**: +100 for each completed day.
2. **Streak Tracking**: Continuous completion triggers streak bonuses.
3. **Levels**: User scales from Lv1 to Lv10 based on XP thresholds (e.g., Lv2 at 200 XP).
4. **Analytics**: Cumulative velocity and area charts provided directly in the tracker.
