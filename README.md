# Employee Management System (EMS)

A full-stack Employee Management System built with **Spring Boot** (REST API) and **React** (UI). It covers the complete employee lifecycle — from onboarding and attendance to payroll, leave, and performance tracking — with role-based access control and JWT authentication.

---

## Project Structure

```
employee-management-system/
├── api/        # Spring Boot backend (Java 21, Maven)
└── ui/         # React frontend (Vite, Tailwind CSS)
```

---

## Features

- **Authentication** — JWT-based login, registration, and refresh token support
- **Employee Management** — Add, edit, view, and manage employee profiles and details
- **Department & Designation** — Manage org structure with departments and designations
- **Attendance** — Track daily attendance records
- **Leave Management** — Apply for leave, manage leave types, approve/reject requests
- **Payroll** — Generate and manage employee payroll
- **Performance** — Record and review employee performance
- **Reports** — View and export reports across modules
- **Dashboard** — Summary stats and charts (bar, line, pie) at a glance
- **Admin Panel** — Admin-level user and system management
- **Audit Logs** — Track system-level changes

---

## Tech Stack

### Backend — `api/`

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language |
| Spring Boot | 3.2.0 | Framework |
| Spring Security | — | Authentication & Authorization |
| Spring Data JPA | — | ORM / Database access |
| MySQL | — | Relational database |
| JWT (jjwt) | 0.12.3 | Token-based auth |
| MapStruct | 1.5.5 | DTO mapping |
| Lombok | 1.18.30 | Boilerplate reduction |
| SpringDoc OpenAPI | 2.3.0 | Swagger UI / API docs |
| Maven | — | Build tool |

### Frontend — `ui/`

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI library |
| Vite | 5.2 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling |
| Redux Toolkit | 2.2 | State management |
| React Router DOM | 6.22 | Client-side routing |
| Axios | 1.6 | HTTP client |
| React Hook Form + Zod | 7.51 / 3.22 | Form handling & validation |
| Recharts | 2.12 | Charts & data visualization |
| TanStack Query | 5.28 | Server state & data fetching |
| React Hot Toast | 2.4 | Notifications |
| React Icons | 5.0 | Icon library |
| date-fns | 3.6 | Date utilities |

---

## Prerequisites

Make sure you have the following installed:

- Java 21+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

---

## Getting Started

### 1. Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE ems_db;
```

### 2. Backend Setup

```bash
cd api
```

Update database credentials in `src/main/resources/application.yml` if needed:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ems_db
    username: root
    password: root
```

Run the application:

```bash
mvn spring-boot:run
```

The API will start at: `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

API Docs: `http://localhost:8080/api-docs`

### 3. Frontend Setup

```bash
cd ui
npm install
npm run dev
```

The UI will start at: `http://localhost:5173`

---

## API Overview

| Module | Base Path |
|---|---|
| Authentication | `/api/auth` |
| Employees | `/api/employees` |
| Departments | `/api/departments` |
| Designations | `/api/designations` |
| Attendance | `/api/attendance` |
| Leaves | `/api/leaves` |
| Payroll | `/api/payroll` |
| Performance | `/api/performance` |
| Reports | `/api/reports` |
| Dashboard | `/api/dashboard` |

> Full interactive API documentation is available via Swagger UI once the backend is running.

---

## JWT Configuration

Token settings are in `application.yml`:

| Setting | Value |
|---|---|
| Access token expiry | 24 hours |
| Refresh token expiry | 7 days |

---

## Build for Production

**Backend:**
```bash
cd api
mvn clean package
java -jar target/ems-backend-1.0.0.jar
```

**Frontend:**
```bash
cd ui
npm run build
```

The built files will be in `ui/dist/`.

---

## License

This project is for educational and internal use.
