# 🔐 AuthFlow

**Secure authentication, email verification, and session management in a full-stack application.**

AuthFlow is a web application built to demonstrate an authentication system using modern technologies, a separated frontend and backend architecture, and security best practices.

The project allows users to create an account, verify their email address, sign in, and access a protected private area using JWT-based authentication and HTTP-only cookies.

🌐 **Live application:** [Access AuthFlow](https://auth-flow-mu-ten.vercel.app)

![AuthFlow application screenshot](frontend/public/AuthFlow.jpeg)

## ✨ Features

- 📝 User registration.
- 📧 Email verification through a confirmation link.
- 🔑 Login with credential validation.
- 🍪 JWT authentication using HTTP-only cookies.
- 🛡️ Protected routes.
- 👤 Retrieval of authenticated user information.
- 🚪 Logout and session termination.
- ✅ Backend input validation.
- 🗄️ PostgreSQL data persistence.
- 🔄 Database models and migrations managed with Prisma ORM.
- 🔀 Next.js API proxy for forwarding requests to the backend.
- 📱 Responsive interface for desktop and mobile devices.

## 🖥️ Tech Stack

### Frontend

- Next.js 16
- React 19
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
- cookie-parser

### Database and Services

- PostgreSQL
- Prisma ORM
- Neon — managed PostgreSQL database
- Brevo — transactional email delivery

### Tools and Deployment

- Git and GitHub
- Docker
- npm
- Vercel — frontend deployment
- Render — backend deployment

## 🏗️ Project Architecture

AuthFlow is organized into two main applications: a frontend and a backend. Data persistence is handled by PostgreSQL, with database access managed through Prisma ORM.

```text
AuthFlow/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── [...path]/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── lib/
│   │       └── api.ts
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

- **Frontend:** Built with Next.js, React, TypeScript, and Tailwind CSS 4. It contains the login, registration, email verification, and private dashboard pages.
- **Next.js API Proxy:** The `src/app/api/[...path]/route.ts` route receives frontend requests and forwards them to the backend API.
- **Backend:** A REST API built with NestJS and TypeScript. It handles authentication, input validation, email delivery, and business logic.
- **Prisma ORM:** Manages PostgreSQL access, database models, and migrations.
- **PostgreSQL:** Stores user data and the information required by the application.

The proxy allows the browser to communicate with the frontend's own domain while Next.js forwards requests to the backend. This architecture helps avoid authentication issues related to cookies shared across different domains.

## 🔐 Security

The project implements several mechanisms to help protect user data and sessions:

- Passwords stored as bcrypt hashes.
- JSON Web Token (JWT)-based authentication.
- HTTP-only cookies to reduce direct token exposure to browser JavaScript.
- Cookies configured for HTTPS in production.
- Validation of incoming API data.
- CORS configuration to control permitted origins.
- Private routes requiring valid authentication.
- Email verification to validate registered email addresses.
- Environment variables for credentials, URLs, and secrets.
- A Next.js proxy for forwarding authentication requests.

The authentication token does not need to be stored in `localStorage`, reducing its direct exposure to JavaScript running in the browser.

Production security also depends on correctly configuring cookies, HTTPS, CORS, secrets, and access permissions.

## ⚙️ Running the Project Locally

### Prerequisites

Before getting started, install or configure:

- Node.js and npm.
- PostgreSQL 16 or Docker.
- Git.
- A Brevo account and a valid API key for email delivery.

### 1. Clone the Repository

Replace the example URL with the actual GitHub repository URL.

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

Create a `.env` file in the `backend` directory using the following example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5433/authflow?schema=public"
PORT=3000
FRONTEND_URL="http://localhost:3001"
BREVO_API_KEY="YOUR_BREVO_API_KEY"
EMAIL_FROM="AuthFlow <verified-sender@yourdomain.com>"
JWT_SECRET="A_STRONG_RANDOM_SECRET"
```

Replace the example values with your local configuration.

**Important:**

- Port `5433` is only an example. Use the port where your PostgreSQL instance is actually available.
- The `EMAIL_FROM` address must be an authorized sender in your email service.
- Never commit your `.env` file or expose API keys and secrets.
- Ensure the variables match the configuration expected by the backend.

With the database running, generate the Prisma client:

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

The API route prefix is `/api`.

### 3. Configure the Frontend

Open another terminal, return to the project root, and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
API_URL="http://localhost:3000/api"
```

This variable tells the Next.js proxy where to find the local backend.

The frontend uses the `/api` route on its own domain. The `src/lib/api.ts` file should therefore contain:

```typescript
export const API_URL = '/api';
```

Start the frontend on port `3001`:

```bash
npm run dev -- --port 3001
```

Open the application at:

`http://localhost:3001`

### 4. Validate the Production Build

To check whether the frontend compiles successfully for production, run:

```bash
npm run build
```

Both the backend and frontend should be running to test the complete authentication flow locally.

## 🔌 API Endpoints

The API provides the following authentication routes:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Registers a user |
| `GET` | `/api/auth/verify-email?token=...` | Verifies an email address |
| `POST` | `/api/auth/login` | Authenticates a user |
| `POST` | `/api/auth/logout` | Ends the session |
| `GET` | `/api/auth/me` | Retrieves the authenticated user |

Protected routes require a valid session. From the frontend, requests pass through the Next.js proxy, which forwards them to the backend.

## 🔄 Authentication Flow

1. The user completes the registration form.
2. The backend validates the data and creates the account.
3. An email containing a verification link is sent.
4. The user verifies their email address.
5. The user signs in with their credentials.
6. The backend validates the credentials and sets the authentication cookie.
7. The frontend forwards requests through the Next.js proxy.
8. The dashboard retrieves the authenticated user's information.
9. The user can end the session by logging out.

## 🌍 Deployment

The project is deployed using separate services for the frontend, backend, database, and email delivery.

| Component | Service |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon |
| Email delivery | Brevo |

### Live Application

- **Frontend:** [https://auth-flow-mu-ten.vercel.app](https://auth-flow-mu-ten.vercel.app)
- **Backend:** [https://authflow-api-9kda.onrender.com](https://authflow-api-9kda.onrender.com)

### Production Configuration

On Vercel, the `NEXT_PUBLIC_API_URL` environment variable should point to the backend, including the `/api` prefix:

```env
NEXT_PUBLIC_API_URL="https://authflow-api-9kda.onrender.com/api"
```

The proxy uses `API_URL` when configured and otherwise falls back to `NEXT_PUBLIC_API_URL`.

On Render, the `FRONTEND_URL` variable must exactly match the frontend origin:

```env
FRONTEND_URL="https://auth-flow-mu-ten.vercel.app"
```

Configure the remaining environment variables according to your production services.

Cookie settings must be compatible with HTTPS and the chosen authentication architecture. Changes to environment variables may require a new deployment.

## 📌 Project Goals

AuthFlow was developed to strengthen full-stack web development skills, including:

- Building interfaces with Next.js and React.
- Developing REST APIs with NestJS.
- Implementing JWT authentication and HTTP-only cookies.
- Protecting routes and managing sessions.
- Integrating PostgreSQL and Prisma ORM.
- Sending transactional emails.
- Applying input validation and security best practices.
- Connecting frontend and backend applications through a proxy.
- Configuring environment variables and deploying applications to production.

## 👨‍💻 Author

**Wesley Rodrigues**

Full Stack Web Developer

- GitHub: [dev-ley](https://github.com/dev-ley)
- LinkedIn: [wr-dev](https://www.linkedin.com/in/wr-dev/)

---

Developed as a learning and portfolio project, focusing on authentication, security, code organization, and full-stack development best practices.
