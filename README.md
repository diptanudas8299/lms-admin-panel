# 📘 Student Learning Management System – Admin Dashboard

A full-stack **MERN-based Admin Panel** for managing a Student Learning Management System (LMS).  
This application enables an **Admin** to securely manage **Teachers, Courses, Classes, Students, and Parents** through a clean and responsive dashboard.

---

## 🚀 Live Demo

- **Frontend (Admin Panel):** [https://<your-frontend-url>](https://lms-admin-panel-phi.vercel.app/#/login)
- **Backend API:** https://[<your-backend-url>](https://lms-admin-panel-sy1r.onrender.com)

> Live URLs will be updated after deployment.

---

## 🔐 Admin Login

- **Login URL:** `/login`

### Test Admin Credentials
Email: admin@lms2.com
Password: admin123

⚠️ These credentials are for testing only.  
Admin registration is intentionally disabled in production.

---
## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)

### Admin Dashboard
![Dashboard](./screenshots/dashboard.png)

### Teacher Management
![Teacher Management](./screenshots/teachers.png)


## 🧩 Features

### ✅ Authentication & Security
- JWT-based admin authentication
- Protected admin-only routes
- Password hashing using bcrypt
- Rate limiting & HTTP security headers (Helmet)

### ✅ Teacher Management
- Create / Read / Update / Delete teachers
- Profile image upload
- Assign multiple subjects
- Active / Inactive status
- Search & pagination

### ✅ Course Management
- CRUD operations
- Assign courses to teachers
- Class-level filtering
- Price & duration management
- Search & pagination

### ✅ Class Management
- Link classes to courses & teachers
- Schedule (day & time)
- Maximum student limits
- Active / Completed status
- Filtering by course & teacher

### ✅ Students & Parents
- View enrolled students
- Class-based filtering
- Parent–student relationship mapping
- Pagination support

### ✅ Dashboard
- System statistics overview
- Recent activity summary
- Responsive UI (desktop & mobile-friendly)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- Helmet & Express Rate Limit

---

## 📂 Project Structure
lms-admin-panel/
│
├── backend/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ ├── server.js
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── context/
│ │ ├── layouts/
│ │ ├── pages/
│ │ └── routes/
│ ├── vite.config.js
│ └── .env.example
│
└── README.md
---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/diptanudas8299/lms-admin-panel.git
cd lms-admin-panel2️⃣ Backend Setup
cd backend
npm install


Create .env file:

MONGO_URI=mongodb://127.0.0.1:27017/lms_admin
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173


Run backend:

npm run dev


Backend runs at:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev


Frontend runs at:

http://localhost:5173

🔗 API Endpoints (Sample)
Auth

POST /api/auth/login

Teachers

GET /api/teachers

POST /api/teachers

PUT /api/teachers/:id

DELETE /api/teachers/:id

Courses

GET /api/courses

POST /api/courses

PUT /api/courses/:id

DELETE /api/courses/:id

Classes

GET /api/classes

POST /api/classes

PUT /api/classes/:id

DELETE /api/classes/:id

Dashboard

GET /api/dashboard/stats

🌍 Deployment
Backend

Deployed on Render

Uses MongoDB Atlas

Environment variables configured in Render dashboard

Frontend

Deployed on Vercel

Connected to deployed backend API

📸 Screenshots / Demo

Add screenshots or demo video link after deployment.

🧪 Evaluation Checklist (Requirement Match)

✔ Clean folder structure
✔ Protected admin routes
✔ CRUD for Teachers, Courses, Classes
✔ Pagination & search
✔ Secure authentication
✔ Responsive UI
✔ Deployed frontend & backend
✔ Professional documentation

⏱️ Time Duration

2 days (as per assignment requirement)

👤 Author

Diptanu Das
MERN Stack Developer


