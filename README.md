# 🚀 60-Day Hacker Tracker: Elite Silicon Valley Prep

A production-ready, gamified 60-day performance tracking system designed for top-tier placement preparation. Built with an elite tech stack focused on speed, aesthetic, and scalability.

![Roadmap Preview](https://raw.githubusercontent.com/nishantrs0404/60-day-hacker-tracker/main/frontend/public/globe.svg) *Project uses a high-performance Neon/Vercel/Render architecture.*

## ✨ Key Features

- **🎮 Gamified Progress**: Earn XP, level up (Lv1 - Lv10), and maintain streaks as you complete daily tasks.
- **🔒 Daily Execution Protocol**: 60-day curriculum with locked/unlocked progress logic to keep you focused.
- **📖 Full Roadmap Preview**: A separate read-only view of the entire 60-day plan (DSA, ML, Dev, Deploy) with search and week-based filters.
- **📊 Real-time Analytics**: Cumulative velocity tracking and performance visualizations.
- **🔐 Secure Authentication**: JWT-based auth with enterprise-grade password hashing (bcrypt).
- **📱 Responsive Glassmorphism UI**: Stunning dark-mode dashboard optimized for all devices.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend**: [FastAPI (Python 3.11)](https://fastapi.tiangolo.com/) + [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Cloud-ready with [Neon](https://neon.tech))
- **Deployment**: [Docker](https://www.docker.com/) + Docker Compose

---

## 🚀 Quick Start

### 1. Requirements
- Docker & Docker Compose installed.

### 2. Launch
Clone and run in a single command:
```bash
docker-compose up -d --build
```
This command automatically builds the environment and seeds the 60-day curriculum.

### 3. Access
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📂 Project Architecture
```text
/
├── backend/            # FastAPI Project
│   ├── app/            # Core logic (Auth, Tracker, Gamification)
│   ├── scripts/        # Seeding logic
│   └── roadmap.json    # The 60-day curiculum
├── frontend/           # Next.js 16 Project
│   └── src/app/        # Dashboard, Roadmap, Tracker routes
└── docker-compose.yml  # Full-stack orchestration
```

## 🌐 Deployment Plan
1. **Database**: Link a free [Neon PostgreSQL](https://neon.tech) instance.
2. **Backend**: Deploy the `backend/` folder to [Render](https://render.com) using the provided Dockerfile.
3. **Frontend**: Deploy the `frontend/` folder to [Vercel](https://vercel.com) with the `NEXT_PUBLIC_API_URL` pointing to your Render backend.

---

## 🤝 Contribution
The project is optimized for high-velocity development. Ensure all changes are containerized and verified via the Docker compose environment before pushing.

---
*Created by [Nishant Raushan](https://github.com/nishantrs0404).*
