# 🚀 AI-Powered Job Application Tracker

A full-stack web application that helps job seekers track applications, get AI-powered resume feedback, and auto-generate personalized cover letters.

> **Built by:** Kushwanth Kumar Bevara | MCA Student @ Andhra University

---

## 🎯 Problem Statement

Job hunting is messy — tracking applications in Excel, applying to wrong jobs without knowing if your skills match, writing cover letters from scratch. This app solves all of that with AI.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI JD Parser** | Paste any job description → AI extracts skills, salary, experience automatically |
| 📊 **Resume Match Score** | Upload resume text → AI gives match score out of 100 + missing skills |
| ✉️ **Cover Letter Generator** | One-click AI-generated personalized cover letter for each job |
| 📋 **Kanban Board** | Track applications: Applied → Interview → Offer → Rejected |
| 🔐 **JWT Authentication** | Secure login/register with access & refresh tokens |
| 📈 **Dashboard Analytics** | Stats on total jobs, interviews, offers at a glance |

---

## 🛠️ Tech Stack

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

- **Python + Django** — REST API backend
- **Django REST Framework** — API serializers and views
- **PostgreSQL** — Relational database
- **JWT Authentication** — Secure user sessions
- **Groq AI API (LLaMA 3.3)** — AI-powered features

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

- **React.js** — Component-based UI
- **Tailwind CSS** — Modern responsive styling
- **Axios** — API calls with JWT interceptors
- **React Router** — Client-side routing
- **Recharts** — Data visualization

---

## 📁 Project Structure

```
ai-job-tracker/
├── backend/                    # Django REST API
│   ├── config/                 # Project settings & URLs
│   ├── users/                  # Authentication (register, login, profile)
│   ├── jobs/                   # Jobs CRUD + AI features
│   ├── applications/           # Application tracking
│   └── requirements.txt
├── frontend/                   # React Application
│   ├── src/
│   │   ├── pages/              # LoginPage, Dashboard, AddJob, Applications
│   │   ├── context/            # Auth context (JWT management)
│   │   └── utils/              # Axios API config
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 16+
- Groq API Key (free at console.groq.com)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/KushwanthKumarBevara/ai-job-tracker.git
cd ai-job-tracker/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
DB_NAME=jobtracker
DB_USER=jobuser
DB_PASSWORD=job1234
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
GROQ_API_KEY=your-groq-api-key

# Setup database
psql -U postgres
CREATE DATABASE jobtracker;
CREATE USER jobuser WITH PASSWORD 'job1234';
GRANT ALL PRIVILEGES ON DATABASE jobtracker TO jobuser;
\q

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | ❌ |
| POST | `/api/auth/login/` | Login + get JWT | ❌ |
| GET | `/api/jobs/` | Get all jobs | ✅ |
| POST | `/api/jobs/` | Create new job | ✅ |
| POST | `/api/jobs/parse-jd/` | AI parse job description | ✅ |
| POST | `/api/jobs/match-resume/` | AI resume match score | ✅ |
| POST | `/api/jobs/cover-letter/` | AI generate cover letter | ✅ |
| GET | `/api/applications/` | Get all applications | ✅ |
| POST | `/api/applications/` | Create application | ✅ |
| PATCH | `/api/applications/:id/` | Update status | ✅ |
| DELETE | `/api/applications/:id/` | Delete application | ✅ |

---

## 🤖 AI Features — How They Work

### 1. JD Parser
Paste any job description → sends to LLaMA 3.3 via Groq API → returns structured JSON with skills, salary, experience, role.

### 2. Resume Match Score
Sends job description + resume text to AI → returns match score (0-100), matching skills, missing skills, and recommendation.

### 3. Cover Letter Generator
Sends job details + resume → AI writes a personalized 3-paragraph cover letter specific to the company and role.

---

## 🗄️ Database Schema

```sql
-- Users
users (id, username, email, password, resume_url, created_at)

-- Jobs
jobs (id, user_id, company_name, role, job_description, required_skills, salary_range, location, created_at)

-- Applications
applications (id, user_id, job_id, status, match_score, cover_letter, notes, applied_date, follow_up_date)
```

---

## 💡 Key Technical Decisions

- **Django over Node.js** — Demonstrates multi-stack capability; Python ecosystem better for AI integration
- **PostgreSQL** — Relational data with foreign keys perfect for job/application relationships
- **Groq API (LLaMA 3.3)** — Free tier, fast inference, reliable JSON responses
- **JWT with refresh tokens** — Auto-refresh prevents session expiry during active use
- **Tailwind CSS** — Rapid UI development without custom CSS files

---

## 👨‍💻 Author

**Kushwanth Kumar Bevara**
- 📧 kushwanth2001@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/KushwanthKumar)
- 🐙 [GitHub](https://github.com/kushwanth-kumar-9b0710204)
- 📍 Visakhapatnam, India

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If this project helped you, please give it a star!**
