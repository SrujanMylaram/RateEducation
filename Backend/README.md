# Backend (student-feedback-system -> Backend)

Minimal Express + Mongoose scaffold for a student feedback system.

Setup

1. Copy `.env.example` to `.env` and edit values.
2. Install dependencies: `npm install`.
3. Start server: `npm run dev` (requires nodemon) or `npm start`.

API endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/feedback (requires Bearer token)
- POST /api/feedback (requires Bearer token)
