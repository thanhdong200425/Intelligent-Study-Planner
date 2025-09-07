# Project Progress Description

I am building an **Intelligent Study Planner & Habit Tracker** — an app that combines a calendar, to-do list, and productivity coach.

---

## 🎯 Objectives
- Help students manage study tasks, deadlines, and habits.  
- Provide **smart scheduling** (adaptive plans, auto-reschedule).  
- Track **habits and focus sessions** with notes and streaks.  
- Generate **analytics & insights** on productivity.  
- Prepare for **future AI/ML features** like task duration prediction and personalized study recommendations.  

---

## ✅ Phase 1 (Core MVP)
- Built **front-end (Next.js)** for initial UI (basic planning + logging).  
- Added **manual input flows**:  
  - Courses, tasks, deadlines, availability windows.  
  - Generate simple study plans with time blocks.  
  - Log study sessions with actual minutes and notes.  
- Provided **habit tracking** basics with streaks and daily check-ins.  
- Exported **weekly calendar view** with study/break blocks.  
- Delivered **initial insights** (planned vs actual, skipped tasks).  

---

## 🚀 Phase 2 (Backend Foundation – Pre-ML)

### Tech Stack
- **Backend:** NestJS (modular APIs, Swagger docs).  
- **Database:** PostgreSQL (Prisma ORM).  
- **Cache/Jobs:** Redis + BullMQ.  
- **Deployment:** Docker Compose on DigitalOcean droplet (Nginx reverse proxy, HTTPS).  
- **Auth (for MVP):** simple API key / header guard (JWT later).  

### Backend Features
- Full **CRUD APIs**: users, courses, deadlines, tasks, availability, habits.  
- **Planner v0 (deterministic):**  
  - Greedy scheduling based on priority + due dates.  
  - 50m focus / 10m break blocks with spillover handling.  
  - Rolling reschedule for missed sessions.  
- **Sessions API:** start/stop/cancel timers, log actual minutes.  
- **Weekly Analytics API:** planned vs actual time, overdue tasks, per-course breakdown, habit streaks, rule-based insights.  
- **Background Jobs:**  
  - Auto weekly plan generation (Sunday night).  
  - Hourly catch-up for missed tasks.  
  - Daily analytics snapshot.  
- **Infrastructure:**  
  - Health checks for DB + Redis.  
  - Logging, error filters, CORS setup.  
  - Seed script for demo user + sample data.  

---

👉 With this, the app has a **solid backend foundation** for scheduling, habits, sessions, and analytics — ready to integrate **ML features (Phase 3)** such as task duration prediction, adaptive reminders, and personalized study recommendations.
