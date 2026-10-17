# 🔐 AuthFlow

**Secure authentication, email verification, and session management in a full-stack application.**

AuthFlow is a web application built to demonstrate an authentication system using modern technologies, a clear separation between frontend and backend, and security best practices.

Users can create an account, verify their email address, sign in, and access a private dashboard protected by HTTP-only cookie-based authentication.

## ✨ Features

- 📝 User registration.
- 📧 Email verification through a verification link.
- 🔑 Login with credential validation.
- 🍪 JWT authentication stored in an HTTP-only cookie.
- 🛡️ Protected private routes.
- 👤 Authenticated user profile retrieval.
- 🚪 Logout and session termination.
- ✅ Backend request validation.
- 🗄️ PostgreSQL database integration.
- 🔄 Database schema and migrations managed with Prisma ORM.

## 🖥️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS 4

### Backend

- Node.js
- NestJS
- TypeScript
- Passport
- JWT
- bcrypt
- class-validator
- class-transformer

### Database and Services

- PostgreSQL
- Prisma ORM
- Brevo — email delivery

### Tools

- Git and GitHub
- Docker
- npm

## 🏗️ Project Architecture

AuthFlow is organized into two main applications: frontend and backend. PostgreSQL provides persistent data storage, while Prisma ORM manages database access.

```text
AuthFlow/
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── register/
│   │       │   └── page.tsx
│   │       ├── verify-email/
│   │       │   └── page.tsx
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── email/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

### Application Structure

- **Frontend:** built with Next.js, React, TypeScript, and Tailwind CSS 4. It contains the login, registration, email verification, and private dashboard pages.
- **Backend:** a REST API built with NestJS and TypeScript. It handles authentication, request validation, email delivery, and business logic.
- **Prisma:** manages PostgreSQL access, database models, and migrations.
- **PostgreSQL:** stores user data and other information required by the application.

The frontend communicates with the backend through HTTP requests. The backend handles authentication and database access. This separation improves maintainability and allows each component to be deployed independently.

## 🔐 Security

The project implements several mechanisms to help protect user data and sessions:

- Passwords stored as bcrypt hashes.
- JSON Web Token (JWT) authentication.
- HTTP-only cookies to reduce token exposure to browser JavaScript.
- Cookies configured for secure use in production.
- Request validation on the backend.
- CORS configuration to control allowed origins.
- Protected routes requiring authentication.
- Email verification for registered addresses.
- Environment variables for application configuration and secrets.

Production deployment should use HTTPS, strong secrets, and a cookie policy compatible with the frontend and backend domains.

## ⚙️ Run Locally

### Prerequisites

Make sure you have installed or configured:

- Node.js and npm.
- PostgreSQL 16 or Docker.
- Git.
- A Brevo account and a valid API key for email delivery.

### 1. Clone the Repository

After publishing the project on GitHub, run:

```bash
git clone <REPOSITORY_URL>
cd AuthFlow
```

### 2. Configure the Backend

Navigate to the backend directory and install the dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory using the following template:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5433/authflow?schema=public"
PORT=3000
FRONTEND_URL="http://localhost:3001"
BREVO_API_KEY="YOUR_BREVO_API_KEY"
EMAIL_FROM="AuthFlow <verified-sender@yourdomain.com>"
JWT_SECRET="A_STRONG_RANDOM_SECRET"
```

Replace the example values with your local configuration. The `EMAIL_FROM` address must be an authorized sender in your email service.

**Important:** PostgreSQL must be running, and the database connection string must match your local setup.

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the existing migrations:

```bash
npx prisma migrate deploy
```

Start the backend in development mode:

```bash
npm run start:dev
```

By default, the backend will be available at:

`http://localhost:3000`

The API uses `/api` as its global route prefix.

### 3. Configure the Frontend

Open another terminal, return to the project root, and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the application:

```bash
npm run dev -- --port 3001
```

The frontend will be available at:

`http://localhost:3001`

**Note:** Before running the frontend, ensure that its API requests point to the local backend. For production, configure the API URL through an environment variable.

## 🔌 API Endpoints

The API provides the following authentication endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `GET` | `/api/auth/verify-email?token=...` | Verify an email address |
| `POST` | `/api/auth/login` | Authenticate a user |
| `POST` | `/api/auth/logout` | End the session |
| `GET` | `/api/auth/me` | Retrieve the authenticated user |

Endpoints that require an authenticated session must be called with the appropriate cookie credentials.

## 🔄 Authentication Flow

1. The user completes the registration form.
2. The backend validates the submitted data and creates the account.
3. An email containing a verification link is sent.
4. The user verifies their email address.
5. The user signs in with their credentials.
6. The backend validates the login and sets the authentication cookie.
7. The frontend retrieves the user's information and grants access to the private dashboard.
8. The user can end the session by logging out.

## 🌍 Deployment

The project is structured to support independent deployment of its components:

- **Frontend:** a platform compatible with Next.js.
- **Backend:** a platform compatible with Node.js and NestJS.
- **Database:** a managed PostgreSQL service.

Before deployment, configure production environment variables, database connectivity, email delivery, CORS, and authentication cookies.

Production URLs must replace local development addresses. Cookie settings must be appropriate for the relationship between the frontend and backend domains.

## 📌 Project Goals

AuthFlow was developed to strengthen full-stack web development skills, including:

- Building interfaces with Next.js and React.
- Developing REST APIs with NestJS.
- Implementing user authentication.
- Integrating PostgreSQL and Prisma.
- Sending transactional emails.
- Validating requests and protecting routes.
- Structuring and maintaining separate applications.
- Preparing applications for deployment.

## 👨‍💻 Author

**Wesley Rodrigues**

Full-Stack Web Developer

- GitHub: [dev-ley](https://github.com/dev-ley)
- LinkedIn: [wr-dev](https://www.linkedin.com/in/wr-dev/)

---

Built as a learning and portfolio project, focusing on authentication, code organization, and full-stack development best practices.
