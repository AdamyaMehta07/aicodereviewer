# AiCodeReviewer — Server (Backend)

Express + MongoDB + JWT backend API.

## Stack
Node.js, Express, MongoDB Atlas, Mongoose, JWT, Bcrypt, Helmet, CORS, express-rate-limit, express-validator.

## MongoDB Atlas Setup (Step by Step)

1. Go to https://cloud.mongodb.com and sign up (free)
2. Click **New Project** → name it `aicodereviewer` → Create
3. Click **Create a deployment** → choose **M0 Free** tier → pick any region → Create
4. Under **Security → Database Access** → Add New Database User
   - Username: `aicodereviewer`
   - Password: generate a strong one, copy it
   - Role: Read and write to any database
5. Under **Security → Network Access** → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
6. Under **Deployment → Database** → Connect → Drivers → Node.js
7. Copy the connection string, replace `<password>` with your actual password
8. Add `/aicodereviewer` before the `?` in the connection string

Final MONGODB_URI looks like:
```
mongodb+srv://aicodereviewer:yourpassword@cluster0.abc123.mongodb.net/aicodereviewer?retryWrites=true&w=majority
```

## Getting Started

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env
npm run dev
```

Server runs at `http://localhost:5000`

Test it: `http://localhost:5000/api/health`

## Generate JWT Secret

Run this in your terminal and paste the output into JWT_SECRET in .env:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Endpoints

### Auth
| Method | Route | Protected | Description |
|--------|-------|-----------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login and get token |
| GET | /api/auth/me | Yes | Get current user |
| PUT | /api/auth/update-profile | Yes | Update name/bio/role |
| PUT | /api/auth/change-password | Yes | Change password |

### Projects
| Method | Route | Protected | Description |
|--------|-------|-----------|-------------|
| POST | /api/projects | Yes | Create new project |
| GET | /api/projects | Yes | Get all my projects |
| GET | /api/projects/:id | Yes | Get single project |
| DELETE | /api/projects/:id | Yes | Delete project |

### Portfolio
| Method | Route | Protected | Description |
|--------|-------|-----------|-------------|
| GET | /api/portfolio | Yes | Get my portfolio |
| PUT | /api/portfolio/featured | Yes | Update featured projects |
| GET | /api/portfolio/public/:slug | No | Get public portfolio |
