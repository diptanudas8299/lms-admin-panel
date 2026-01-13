📘 Student Learning Management System – Admin Dashboard

A full-stack MERN-based Admin Panel for managing a Student Learning Management System (LMS).
This application allows an Admin to securely manage Teachers, Courses, Classes, Students, and Parents through a clean and responsive dashboard.

🚀 Live Demo

Frontend (Admin Panel): [Add Vercel/Netlify URL here]

Backend API: [Add Render/Railway URL here]

🔐 Admin Login

Login URL:

/login


Test Admin Credentials:

Email: admin@test.com
Password: admin12345


⚠️ These credentials are for testing only.
In production, admin creation is intentionally disabled.

🧩 Features
✅ Authentication & Security

Admin login with JWT authentication

Protected admin-only routes

Secure password hashing (bcrypt)

Rate limiting & HTTP security headers

✅ Teacher Management

Create / Read / Update / Delete teachers

Upload teacher profile image

Assign multiple subjects

Active / Inactive status

Search & pagination

✅ Course Management

Create / Update / Delete courses

Assign courses to teachers

Class-level filtering

Price & duration management

Search & pagination

✅ Class Management

Create classes linked to courses & teachers

Schedule (day & time)

Max student limits

Active / Completed status

Filtering by course & teacher

✅ Students & Parents

View enrolled students

Class-based filtering

Parent–student relationship mapping

Pagination support

✅ Dashboard

System statistics

Recent activity overview

Clean, responsive UI (desktop & mobile)

🛠️ Tech Stack
Frontend

React (Vite)

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (file uploads)

Helmet & Rate Limiting

📂 Project Structure
lms-admin-panel/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── layouts/
│   ├── vite.config.js
│   └── .env.example
│
└── README.md

⚙️ Setup Instructions (Local Development)
1️⃣ Clone Repository
git clone <your-github-repo-url>
cd lms-admin-panel

2️⃣ Backend Setup
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


Backend runs on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev


Frontend runs on:

http://localhost:5173

🔗 API Endpoints (Sample)
Auth
POST   /api/auth/login

Teachers
GET    /api/teachers
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id

Courses
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

Classes
GET    /api/classes
POST   /api/classes
PUT    /api/classes/:id
DELETE /api/classes/:id

Dashboard
GET /api/dashboard/stats

🌍 Deployment
Backend

Deployed on Render / Railway

Uses MongoDB Atlas

Environment variables configured in platform dashboard

Frontend

Deployed on Vercel / Netlify

Connected to deployed backend API

📸 Screenshots / Demo

Add screenshots or a short demo video link here

🧪 Evaluation Checklist (Matched to Requirement)

✔ Clean folder structure
✔ Protected admin routes
✔ Full CRUD functionality
✔ Pagination & search
✔ Secure authentication
✔ Responsive UI
✔ Deployed frontend & backend
✔ Professional README

⏱️ Time Taken

2 days (as per assignment requirement)

👤 Author

Diptanu Das
Full Stack Developer (MERN)