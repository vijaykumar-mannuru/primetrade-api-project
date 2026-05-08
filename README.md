# ⚡ PrimeTrade – Scalable REST API with Auth & RBAC

A production-ready backend API with JWT authentication, role-based access control, full CRUD for tasks, and a React frontend — built for the PrimeTrade internship assignment.

---

## 🚀 Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Logging | Winston + Morgan |
| Security | Helmet, CORS, Rate Limiting |
| Frontend | React.js + React Router |
| Deployment | Docker + Docker Compose |

---

## 📁 Project Structure

```
primetrade-api/
├── backend/
│   ├── src/
│   │   ├── config/          # DB + Swagger config
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   └── utils/           # Logger
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/             # Axios client
│       ├── components/      # Reusable components
│       ├── context/         # React Context (Auth)
│       └── pages/           # Login, Register, Dashboard, Admin
├── docker-compose.yml
└── PrimeTrade_API.postman_collection.json
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env        # Edit with your values
npm install
npm run dev                 # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                   # Starts on http://localhost:3000
```

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## 📚 API Documentation

Visit **http://localhost:5000/api-docs** for interactive Swagger UI.

Import `PrimeTrade_API.postman_collection.json` into Postman for pre-built requests.

---

## 🔐 API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Private | Get current user |

### Tasks (`/api/v1/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Private | List tasks (paginated, filtered) |
| GET | `/:id` | Private | Get single task |
| POST | `/` | Private | Create task |
| PUT | `/:id` | Private | Update task |
| DELETE | `/:id` | Private | Delete task |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Platform statistics |
| GET | `/users` | Admin | All users |
| PATCH | `/users/:id/toggle` | Admin | Activate/deactivate user |

---

## 🛡️ Security Practices

- **Password hashing** with bcryptjs (salt rounds: 12)
- **JWT** tokens with expiry (7 days, configurable)
- **Helmet** for HTTP security headers
- **CORS** with whitelisted origins
- **Rate limiting** — 100 requests / 15 min per IP
- **Input validation** on all endpoints via express-validator
- **Role-based access control** — user vs admin guards on routes
- **Global error handler** — no stack traces leaked to clients

---

## 📈 Scalability Notes

### Current Architecture
- MVC pattern with clear separation of concerns
- Mongoose indexes on frequently queried fields
- Pagination on list endpoints

### How to Scale

| Challenge | Solution |
|---|---|
| High traffic | Horizontal scaling behind a load balancer (NGINX / AWS ALB) |
| Session management | Stateless JWT — no server-side sessions |
| Database bottleneck | MongoDB Atlas auto-scaling, read replicas |
| Caching | Redis for frequently read data (e.g., user profiles, stats) |
| Microservices | Split auth, tasks, notifications into separate services |
| Async tasks | BullMQ + Redis for background jobs |
| Logging | Ship Winston logs to Datadog / CloudWatch |
| Containerization | Docker + Kubernetes for orchestration |

---

## 🧪 Test Credentials

After registering via `/api/v1/auth/register`, use:
- **user role** — default for all registrations
- **admin role** — set `"role": "admin"` in register body (dev only)

---

## 👤 Author

MANNURU VIJAY KUMAR
