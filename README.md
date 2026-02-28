# 💳 PayLater — Buy Now, Pay Later Service

A full-stack **Pay-Later** web application built with **FastAPI** (backend) and **React + Vite** (frontend). Users can make purchases on credit, merchants are charged a fee, and users can pay back their dues over time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI, SQLAlchemy, Alembic, PyMySQL |
| **Database** | MySQL 8.0 |
| **Auth** | JWT (python-jose), bcrypt |
| **Frontend** | React 18, Vite, Bootstrap 5, Axios |
| **Styling** | Vanilla CSS (dark theme, glassmorphism) |

---

## 📁 Project Structure

```
Paylater/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # JWT auth dependency
│   │   │   └── routes/
│   │   │       ├── auth.py          # /auth/register, /auth/login
│   │   │       ├── users.py         # /users/me, /users/
│   │   │       ├── merchants.py     # /merchants/ CRUD
│   │   │       ├── transactions.py  # /transactions/ CRUD
│   │   │       ├── paybacks.py      # /paybacks/
│   │   │       └── reports.py       # /reports/*
│   │   ├── core/
│   │   │   ├── config.py            # App settings (.env)
│   │   │   ├── database.py          # SQLAlchemy engine & session
│   │   │   └── security.py          # Password hash, JWT tokens
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/                # Business logic
│   │   └── main.py                  # FastAPI app entry point
│   ├── alembic/                     # Database migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env                         # ⚠️ Not committed to Git
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios client + API modules
│   │   ├── components/              # Sidebar, StatCard, ProtectedRoute
│   │   ├── contexts/                # AuthContext (JWT state)
│   │   └── pages/                   # Landing, SignIn, SignUp, Dashboard,
│   │                                #   Merchants, Transactions, Paybacks, Reports
│   ├── .env                         # VITE_API_URL (auto-updated by update_ip.py)
│   └── package.json
├── update_ip.py                     # Auto-detects IP & updates frontend/.env
├── start.sh                         # One-command dev launcher (Git Bash)
└── README.md
```

---

## ⚙️ Setup (First Time)

### Prerequisites
- Python 3.13+
- Node.js 18+
- MySQL 8.0 (running as a service)
- Git Bash (for `start.sh`)

### 1. Clone the repo
```bash
git clone https://github.com/GeethaSatyaSree/Paylater.git
cd Paylater
```

### 2. Set up MySQL database
In **MySQL Workbench**, run:
```sql
CREATE DATABASE IF NOT EXISTS paylater CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP USER IF EXISTS 'Geetha'@'localhost';
CREATE USER 'Geetha'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON paylater.* TO 'Geetha'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure backend environment
Edit `backend/.env`:
```env
DATABASE_URL=mysql+pymysql://Geetha:your_password@localhost:3306/paylater
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 4. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 5. Run database migrations
```bash
cd backend
python -m alembic revision --autogenerate -m "initial_tables"
python -m alembic upgrade head
```

### 6. Install frontend dependencies
```bash
cd frontend
npm install
```

---

## 🚀 Running the App (Daily)

### Option A — One command (recommended)
```bash
# From project root in Git Bash:
bash start.sh
```
✅ Auto-detects your local IP, updates frontend config, and starts both servers.

### Option B — Two separate terminals

**Terminal 1 — Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev -- --host
```

### 🌐 Access the App
| URL | Description |
|---|---|
| `http://localhost:5173` | Frontend (React app) |
| `http://localhost:8000/docs` | Backend API (Swagger UI) |
| `http://localhost:8000/redoc` | Backend API (ReDoc) |
| `http://<your-ip>:5173` | Access from phone/tablet |

---

## 🔄 If your IP changes
When your WiFi reconnects and your IP changes, run:
```bash
python update_ip.py
```
This auto-detects your new local IP and updates `frontend/.env` instantly.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login, get JWT token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/me` | Get current user profile |
| `GET` | `/users/` | List all users |

### Merchants
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/merchants/` | List all merchants |
| `POST` | `/merchants/` | Create merchant |
| `PUT` | `/merchants/{id}/fee` | Update merchant fee |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/transactions/` | Create transaction (checks credit limit) |
| `GET` | `/transactions/my` | My transactions |
| `GET` | `/transactions/` | All transactions |

### Paybacks
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/paybacks/` | Record a payback |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports/merchant-fee/{merchant_id}` | Fee collected by merchant |
| `GET` | `/reports/user-dues/{user_id}` | User's outstanding dues |
| `GET` | `/reports/users-at-limit` | Users at credit limit |
| `GET` | `/reports/total-dues` | Total dues across all users |

---

## 🔐 Security Notes

- `backend/.env` is in `.gitignore` — **never committed to GitHub**
- All passwords are hashed with **bcrypt**
- API routes are protected with **JWT Bearer tokens**
- CORS is configured for local development only
- MySQL is only accessible on `localhost` — not exposed to internet
- Running on local LAN (`192.168.x.x`) — not accessible from public internet

---

## 🗃️ Database Schema

```
users           → id, name, email, hashed_password, credit_limit, created_at
merchants       → id, name, fee_percentage, created_at
transactions    → id, user_id, merchant_id, amount, fee, status, rejection_reason, created_at
paybacks        → id, user_id, amount, created_at
alembic_version → version_num (migration tracking)
```

---

## 👩‍💻 Author

**V Geetha Satya Sree**  
GitHub: [GeethaSatyaSree/Paylater](https://github.com/GeethaSatyaSree/Paylater)