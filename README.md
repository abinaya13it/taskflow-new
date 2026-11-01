# TaskFlow Pro — Java Full Stack Application

TaskFlow Pro is a modern Java Full Stack web application built with **Spring Boot 3 (Java 17)**, **Spring Data JPA**, **Hibernate**, and **React 19 (Vite)**.

---

## 🏗️ Architecture Overview

```mermaid
graph LR
    subgraph Frontend ["Frontend (taskflow-pro)"]
        UI["React 19 + Vite"]
        Axios["Axios REST Client"]
    end

    subgraph Backend ["Backend (taskflow-backend)"]
        Controller["Spring Boot 3 REST Controllers"]
        Service["Business Logic Services"]
        Repo["Spring Data JPA Repositories"]
        Security["BCrypt Security & Validation"]
    end

    subgraph Database ["Database Layer"]
        MySQL[("MySQL 8.0 / PostgreSQL")]
        H2[("H2 In-Memory (Dev/Test)")]
    end

    UI --> Axios
    Axios -->|HTTP / JSON (Port 5000)| Controller
    Controller --> Service
    Service --> Security
    Service --> Repo
    Repo --> MySQL
    Repo --> H2
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java 17** (or later)
- **Apache Maven 3.8+**
- **Node.js 18+** & npm
- **MySQL 8.0** (optional — zero-configuration H2 in-memory mode is available immediately)

---

### 2. Running the Java Spring Boot Backend

Navigate to `taskflow-backend`:
```powershell
cd taskflow-backend
```

#### Option A: Run with In-Memory H2 Database (Instant Zero-Setup)
No database configuration needed:
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"
```
Or run the pre-built standalone executable JAR:
```powershell
java -jar target/taskflow-backend-1.0.0.jar --spring.profiles.active=h2
```

#### Option B: Run with MySQL
1. Make sure MySQL server is running (e.g. `MySQL80` service on port 3306).
2. Configure credentials in `taskflow-backend/src/main/resources/application.properties` or set environment variables:
   ```powershell
   $env:DB_URL="jdbc:mysql://localhost:3306/taskflow_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="your_mysql_password"
   mvn spring-boot:run
   ```

Backend runs on **`http://localhost:5000`** with live endpoints:
- Root status: `GET http://localhost:5000/`
- Health check: `GET http://localhost:5000/api/health`
- H2 Web Console (when active): `http://localhost:5000/h2-console`

---

### 3. Running the React Frontend

In a separate terminal, navigate to `taskflow-pro`:
```powershell
cd taskflow-pro
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser to view the application.

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth` or root aliases)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/register` or `/api/auth/register` | Register new user | `{ "fullName", "email", "password" }` |
| `POST` | `/login` or `/api/auth/login` | Authenticate user & get token | `{ "email", "password" }` |

### 📋 Task Management (`/api/tasks`)

| Method | Endpoint | Description | Query / Request Body |
|--------|----------|-------------|----------------------|
| `GET` | `/api/tasks` | Get all tasks | `?userId=&status=` (optional filters) |
| `POST` | `/api/tasks` | Create new task | `{ "title", "description", "status", "priority", "dueDate", "userId" }` |
| `GET` | `/api/tasks/{id}` | Get task by ID | None |
| `PUT` | `/api/tasks/{id}` | Update task | Task details body |
| `PATCH` | `/api/tasks/{id}/status` | Update task status | `{ "status": "TODO" / "IN_PROGRESS" / "COMPLETED" }` |
| `DELETE` | `/api/tasks/{id}` | Delete task | None |
| `GET` | `/api/tasks/stats` | Get KPI metrics | `?userId=` (optional) |

---

## 📂 Directory Layout

```
fullstack/
├── taskflow-backend/              # Java Spring Boot 3 Backend
│   ├── pom.xml                   # Maven dependencies and build configuration
│   ├── src/main/java/com/taskflow/
│   │   ├── TaskflowApplication.java  # Main Application Entry Point
│   │   ├── config/              # CORS and Security Configurations
│   │   ├── controller/          # HomeController, AuthController, TaskController
│   │   ├── dto/                 # Request & Response DTOs
│   │   ├── exception/           # Global Exception Handling & Custom Exceptions
│   │   ├── model/               # User, Task, TaskStatus, TaskPriority JPA Entities
│   │   ├── repository/          # UserRepository, TaskRepository (Spring Data JPA)
│   │   └── service/             # AuthService, TaskService
│   └── src/main/resources/
│       ├── application.properties         # MySQL default config
│       ├── application-h2.properties      # In-Memory H2 zero-setup profile
│       └── application-postgres.properties# PostgreSQL profile
│
├── taskflow-pro/                  # Modern React 19 Frontend
│   ├── src/
│   │   ├── components/Navbar.jsx # Navigation header with user profile & logout
│   │   ├── pages/Login.jsx       # Login page integrated with Spring Boot
│   │   ├── pages/Register.jsx    # Registration page integrated with Spring Boot
│   │   ├── pages/Dashboard.jsx   # Full TaskFlow Dashboard (CRUD, Stats, Filtering)
│   │   ├── services/api.js       # Axios client connecting to Spring Boot (port 5000)
│   │   └── styles/               # Polished CSS styles
│   └── package.json
│
└── legacy-node-backend/           # Safe backup of previous Node.js Express files
```
