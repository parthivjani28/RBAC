

# Task Management System – RBAC Challenge



## Table of Contents
- [Setup Instructions](#setup-instructions)
- [.env Setup](#env-setup)
- [Architecture Overview](#architecture-overview)
- [Data Model Explanation](#data-model-explanation)
- [Access Control Implementation](#access-control-implementation)
- [API Docs](#api-docs)
- [Testing & Results](#testing--results)
- [Features](#features)
- [Future Considerations](#future-considerations)

---



## Setup Instructions

### 1. Nx Monorepo (`rbac-challenge`)
```sh
cd rbac-challenge
npm install
npx nx run-many --target=build --all
npx nx serve api
```

### 2. Backend (`task-backend`)
```sh
cd task-backend
npm install
cp .env.example .env # Edit secrets and DB config as needed
npm run start:dev
# (Optional) npm run seed
```

### 3. Frontend (`task-dashboard`)
```sh
cd task-dashboard
npm install
cp .env.example .env # If required for API base URL
ng serve
# Access at http://localhost:4200
```

---

## .env Setup

Create a `.env` file in both `task-backend` and (if needed) `task-dashboard`:

**task-backend/.env**
```
JWT_SECRET=your_jwt_secret
DB_TYPE=sqlite
DB_PATH=./mydatabase.db
# Add other DB or mail configs as needed
```

**task-dashboard/.env** (if API URL or other env needed)
```
API_BASE_URL=http://localhost:3000
```

---

## .env Setup

Create a `.env` file in both `task-backend` and (if needed) `task-dashboard`:

**task-backend/.env**
```
JWT_SECRET=your_jwt_secret
DB_TYPE=sqlite
DB_PATH=./mydatabase.db
# Add other DB or mail configs as needed
```

**task-dashboard/.env** (if API URL or other env needed)
```
API_BASE_URL=http://localhost:3000
```

---

---



## Architecture Overview

This project uses an Nx monorepo for scalable, maintainable code organization. The rationale:
- **Separation of concerns**: Isolates backend, frontend, and shared logic.
- **Code sharing**: Shared libraries for auth, data models, and utilities.
- **Scalability**: Easy to add new apps or libraries as the system grows.

**Monorepo Layout:**
- `rbac-challenge/` (Nx root)
  - `apps/api/` – Backend API (NestJS, placeholder for future integration)
  - `apps/dashboard/` – Angular frontend (placeholder)
  - `libs/auth/` – Shared authentication logic (JWT, guards, decorators)
  - `libs/data/` – Shared data models and DB logic
- `task-backend/` – Main working backend (NestJS, TypeORM, SQLite)
- `task-dashboard/` – Main working frontend (Angular, NgRx)

**Shared Libraries/Modules:**
- `libs/auth`: JWT utilities, guards, role/permission decorators
- `libs/data`: TypeORM entities, DTOs, validation logic

> **Current State:** Backend and frontend run as separate projects. Nx monorepo is prepared for future full-stack integration.

---

---



## Data Model Explanation

The system uses a relational schema for RBAC and task management. Key entities:

- **User**: id, username, passwordHash, roles, organizationId
- **Role**: id, name, permissions
- **Permission**: id, action, resource
- **Task**: id, title, description, assignedTo, organizationId
- **Organization**: id, name, parentId (for hierarchy)

**ERD / Diagram:**
![ERD](docs/erd-placeholder.png)
_A full ERD will be added here. See code for entity details._

---


## Access Control Implementation

- **Roles & Permissions**: Users are assigned roles; roles have permissions (e.g., `create_task`, `delete_user`).
- **Organization Hierarchy**: Each user and task belongs to an organization. Hierarchies allow for delegated admin.
- **JWT Auth**: On login, users receive a JWT. All protected endpoints require a valid JWT.
- **Integration**: Guards and decorators check JWT and permissions before allowing access to endpoints.

**How it works:**
- Only users with the correct permission in their org can perform actions (e.g., only users with `delete_task` can delete tasks in their org).
- Admins can manage users/roles within their org or delegated orgs.
- JWT tokens are checked on every protected endpoint. Custom guards and decorators enforce RBAC at the controller/service level.

---



## API Docs

### Endpoints

- `POST /auth/login` – User login
- `POST /auth/register` – Register user
- `GET /tasks` – List tasks
- `POST /tasks` – Create task
- `PUT /tasks/:id` – Update task
- `GET /users` – List users (admin only)
- `POST /roles` – Create role (admin only)

### Sample Requests & Responses

#### Register
**Request:**
```http
POST /auth/register
{
  "email": "test@example.com",
  "password": "testpassword",
  "organizationId": 1,
  "role": "Admin"
}
```
**Response:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "organizationId": 1,
  "role": "Admin"
}
```

#### Login
**Request:**
```http
POST /auth/login
{
  "email": "test@example.com",
  "password": "testpassword"
}
```
**Response:**
```json
{
  "access_token": "<JWT>"
}
```

#### Create Task (Owner)
**Request:**
```http
POST /tasks
Authorization: Bearer <ownerToken>
{
  "title": "Owner Task"
}
```
**Response:**
```json
{
  "id": 1,
  "title": "Owner Task",
  ...
}
```

#### Update Task (Owner)
**Request:**
```http
PUT /tasks/1
Authorization: Bearer <ownerToken>
{
  "title": "Updated by Owner"
}
```
**Response:**
```json
{
  "id": 1,
  "title": "Updated by Owner",
  ...
}
```

#### Update Task (Viewer, Forbidden)
**Request:**
```http
PUT /tasks/1
Authorization: Bearer <viewerToken>
{
  "title": "Hacked"
}
```
**Response:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### Postman Screenshots

<details>


![Login](Postman/1.png)
![Register](Postman/2.png)
![Get Tasks](Postman/3.png)
![Create Task](Postman/4.png)
![Update Task](Postman/5.png)
![Forbidden Update](Postman/6.png)
![Get Users](Postman/7.png)
![Create Role](Postman/8.png)
![Other](Postman/9.png)
![Other2](Postman/10.png)

</details>

---

---



## Testing & Results

Automated e2e tests are provided for authentication and RBAC task operations. Example test cases:

**Auth e2e:**
- Register user
- Login with correct/wrong credentials

**Tasks RBAC e2e:**
- Owner can create and update tasks
- Viewer cannot update owner tasks (403)

**Sample Jest e2e Output:**
```
PASS  test/auth.e2e-spec.ts
  AuthController (e2e)
    ✓ /auth/login (POST) - fail with wrong credentials (xx ms)
    ✓ /auth/login (POST) - success (xx ms)

PASS  test/tasks.e2e-spec.ts
  Tasks RBAC (e2e)
    ✓ Owner can create a task (xx ms)
    ✓ Viewer cannot update owner task (xx ms)
    ✓ Owner can update own task (xx ms)

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

---

## Features

### Implemented
- User authentication (JWT)
- Role-based access control (RBAC)
- Task CRUD (backend)
- Angular dashboard (frontend, dummy data)
- Nx monorepo structure for future scalability

### Pending / In Progress
- Connect frontend to backend API
- Use Nx monorepo for full-stack integration
- UI enhancements (drag-and-drop, dark mode)
- Advanced state management (NgRx)
- Audit logging, rate limiting, 2FA
- Comprehensive tests and CI/CD

---

---



## Future Considerations

- **Advanced Role Delegation**: Support for delegated admin, org-level role inheritance
- **Production Security**: JWT refresh tokens, CSRF protection, RBAC caching
- **Efficient Permission Checks**: Caching, query optimization for large orgs
- **Scalability**: PostgreSQL, Redis, microservices
- **UI/UX**: Drag-and-drop, dark mode, responsive design
- **Testing & CI/CD**: More unit/e2e tests, automated pipelines

---


# Notes
- For detailed API docs, see Swagger at `/api/docs` (if enabled).
- For questions or issues, please open a GitHub issue.
