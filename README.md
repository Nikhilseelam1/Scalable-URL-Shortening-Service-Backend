# ⚡ Scalable URL Shortening Service

> A production-grade, high-performance URL shortening backend engineered for low-latency redirects, async analytics processing, and scalable read-heavy workloads.

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-F05032?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

---

# 📌 Overview

This project is a scalable backend-focused URL shortening platform designed to efficiently handle read-heavy redirect traffic using Redis caching, asynchronous analytics processing, JWT authentication, and layered backend architecture.

Unlike basic CRUD applications, this system incorporates production-oriented backend engineering concepts such as:

* Redis lookaside caching
* Async worker queues using BullMQ
* JWT refresh token rotation
* HTTP-only secure cookies
* Redis-backed rate limiting
* Layered architecture (Controller-Service-Repository)
* Read-heavy optimization
* Queue-based analytics processing
* URL expiration handling

---

# 🏛️ Architecture Overview

```text
Client Request
      │
      ▼
Express API Server
      │
 ┌────┴───────────────┐
 │                    │
 ▼                    ▼
Redis Cache       MongoDB Atlas
(Cache Hit)       (Persistence Layer)
 │                    │
 ▼                    ▼
302 Redirect      Populate Cache
      │
      ▼
BullMQ Queue
      │
      ▼
Analytics Worker
      │
      ▼
Analytics Collection
```

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas

## Caching

* Redis (Upstash)

## Queue System

* BullMQ

## Authentication

* JWT Access Tokens
* Refresh Token Rotation
* HTTP-only Cookies

## Deployment

* Render

## Containerization

* Docker
* Docker Compose

---

# ✨ Features

* 🔗 URL shortening
* 🏷️ Custom aliases
* ⚡ Redis-based redirect caching
* 📊 Click analytics tracking
* 🔄 Async analytics workers
* 🔐 JWT authentication
* 🍪 Refresh token rotation
* 🚦 Redis rate limiting
* ⏰ URL expiration support
* 🧱 Layered backend architecture
* 🐳 Docker support

---

# 🧠 System Design Concepts

## 1. Redis Lookaside Cache

The redirect pipeline follows a cache-first strategy.

```text
Request
   │
   ▼
Redis Lookup
   │
 ┌─┴──────────┐
 │            │
Hit          Miss
 │            │
 ▼            ▼
Redirect   MongoDB Query
                │
                ▼
          Populate Cache
                │
                ▼
             Redirect
```

### Why Redis?

* Reduces MongoDB load
* Improves redirect latency
* Optimizes read-heavy workloads
* Handles viral traffic efficiently

---

## 2. BullMQ Async Analytics Pipeline

Analytics processing is decoupled from the redirect hot-path.

```text
Redirect Request
      │
      ▼
Immediate 302 Redirect
      │
      ▼
Enqueue Analytics Job
      │
      ▼
BullMQ Worker
      │
      ▼
MongoDB Analytics Storage
```

### Benefits

* Non-blocking redirects
* Lower latency
* Improved scalability
* Worker horizontal scaling

---

## 3. Authentication Architecture

```text
Login
  │
  ▼
Access Token + Refresh Token
  │
  ├── Access Token → Client Memory
  └── Refresh Token → HTTP-only Cookie
```

### Security Features

* JWT refresh token rotation
* HTTP-only secure cookies
* Cross-origin cookie handling
* Reduced XSS exposure
* Stateless authentication

---

# 🚦 Rate Limiting

Redis-backed rate limiting protects the system from:

* brute-force attacks
* scraping
* redirect abuse
* spam requests

Implemented using a sliding window approach.

---

# 🔀 Request Flow

## URL Shortening Flow

```text
POST /api/urls/shorten
      │
      ▼
JWT Auth Middleware
      │
      ▼
Validation Layer
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
MongoDB Storage
      │
      ▼
Cache Warmup
      │
      ▼
Response
```

---

## Redirect Flow

```text
GET /:shortCode
      │
      ▼
Rate Limiter
      │
      ▼
Redis Lookup
      │
 ┌────┴─────┐
 │          │
Hit        Miss
 │          │
 ▼          ▼
302      MongoDB Query
             │
             ▼
       Populate Cache
             │
             ▼
       Queue Analytics
             │
             ▼
         302 Redirect
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register user        |
| POST   | `/api/auth/login`    | Login user           |
| POST   | `/api/auth/refresh`  | Refresh access token |
| POST   | `/api/auth/logout`   | Logout user          |

---

## URL Management

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/urls/shorten`    | Create short URL |
| GET    | `/api/urls/my-urls`    | Get user URLs    |
| DELETE | `/api/urls/:shortCode` | Delete URL       |

---

## Redirect

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| GET    | `/:shortCode` | Public redirect |

---

# 📁 Folder Structure

```text
src/
├── config/
├── models/
├── repositories/
├── services/
├── controllers/
├── routes/
├── middlewares/
├── cache/
├── rateLimiter/
├── queues/
├── workers/
├── validators/
├── utils/
├── logging/
```

---

# ⚙️ Local Development Setup

## Clone Repository

```bash
git clone https://github.com/Nikhilseelam1/Scalable-URL-Shortening-Service-Backend.git
cd Scalable-URL-Shortening-Service-Backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

```bash
cp .env.example .env
```

---

## Start Development Server

```bash
npm run dev
```

---

## Start Worker Process

```bash
npm run dev:worker
```

---

# 🔧 Environment Variables

```env
PORT=5000

MONGO_URI=your_mongodb_uri

REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret

BASE_URL=http://localhost:5000

CLIENT_ORIGIN=http://localhost:5173
```

---

# 🐳 Docker Setup

## Start Containers

```bash
docker-compose up --build
```

---

# 🚀 Deployment

## Backend Deployment

* Render

## Frontend Deployment

* Vercel

## Database

* MongoDB Atlas

## Redis

* Upstash Redis

---

# 📈 Scalability & Performance Optimizations

| Optimization         | Benefit             |
| -------------------- | ------------------- |
| Redis Cache          | Reduced DB hits     |
| BullMQ Workers       | Async analytics     |
| JWT Auth             | Stateless scaling   |
| Rate Limiting        | Abuse prevention    |
| Layered Architecture | Maintainability     |
| Worker Separation    | Independent scaling |

---

# 🔒 Security Features

* JWT refresh token rotation
* HTTP-only secure cookies
* Redis rate limiting
* Request validation
* Helmet.js security headers
* CORS protection
* Password hashing using bcrypt

---

# 🔭 Future Improvements

* QR code generation
* Real-time analytics dashboard
* Geo-based analytics
* CDN integration
* Distributed Redis cluster
* Click heatmaps
* OpenTelemetry tracing

---

# 📸 Screenshots

> Add dashboard and architecture screenshots here.

---

# 👨‍💻 Author

## Nikhil Seelam

* GitHub: https://github.com/Nikhilseelam1

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Final Notes

This project demonstrates production-oriented backend engineering concepts including:

* scalable API architecture
* caching strategies
* async processing
* distributed systems concepts
* authentication flows
* worker-based architectures
* read-heavy optimization

Designed with a strong focus on backend scalability, maintainability, and system design principles.
