# 🌐 DigiStore: Enterprise Digital Marketplace & Subscription Platform

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Modular_Monolith_%7C_C4_Model-6320EE?style=for-the-badge&logo=diagramsdotnet&logoColor=white" alt="Architecture" />
  <img src="https://img.shields.io/badge/Backend-Node.js_%7C_Express_%7C_Prisma_ORM-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind_CSS-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="Frontend" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL_15_(ACID)-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/DevOps-Docker_Compose_%7C_GitHub_Actions_CI-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="DevOps" />
</p>

<p align="center">
  <b>A production-ready, scalable, and highly secure multi-vendor digital asset marketplace engineered for instant license delivery, recurring course subscriptions ("DigiCourse"), and resilient transactional integrity.</b>
</p>

---

## 🎓 Academic Context & Project Administration

<div align="center">

| Attribute | Specification |
| :--- | :--- |
| **Course** | Software Engineering (Undergraduate) |
| **Semester** | Spring 1405 |
| **Institution** | Shahid Beheshti University (SBU), Faculty of Computer Engineering |
| **Course Instructor** | Dr. Samadi |
| **SRS Release Date** | 15 Ordibehesht 1405 |

### 👥 Engineering Team
* **Rouzbeh Soltani** (`402243072`)
* **Erfan Panjeh Shahi** (`402243046`)
* **Mahan Baneshi** (`402243042`)
* **Seyed Mohammad Mehdi Mirmotahari** (`402243106`)

</div>

---

## 💻 Tech Stack

<div align="center">

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend Web** | `React 18`, `Vite 6`, `Tailwind CSS`, `Lucide Icons`, `Context API` |
| **Backend REST API** | `Node.js (v22.x)`, `Express.js`, `Prisma ORM (v5+)` |
| **Database Engine** | `PostgreSQL 15 (Alpine)`, `ACID Atomic Transactions` |
| **Security & Auth** | `JSON Web Tokens (JWT)`, `Bcrypt Password Hashing`, `Role-Based Access Control (RBAC)` |
| **Payment Gateway** | `ZarinPal Sandbox API v4 (REST Callback & Verification)` |
| **DevOps & CI/CD** | `Docker`, `Docker Compose`, `GitHub Actions (Ubuntu-latest Runner)` |
| **Testing Suite** | `Jest`, `Supertest`, `Prisma Client Mocking` |
| **UI Prototyping** | `Figma Make / shadcn/ui Design System` |

</div>

---

## 🏗️ System Architecture & C4 Modeling

This project strictly adheres to enterprise-grade software engineering principles, implementing a modular Monolithic architecture structured around the **Model-View-Controller (MVC)** design pattern. The full architecture is formally documented via the **C4 Model** specification.

### C4 Level 2: Container Diagram
Details the technological boundaries between the client React/Vite layer, Express.js REST API gateway, and the PostgreSQL persistence layer.

<p align="center">
  <img src="https://github.com/user-attachments/assets/086e55f9-f879-460a-bc9f-cebfe2d49ec3" width="850px" alt="C4 Level 2 Container Diagram" />
</p>

### C4 Level 3: Component Diagram (Backend API)
Maps internal routing pipelines, JWT/RBAC middleware interception gateways, and Prisma ORM data mapper instances.

<p align="center">
  <img src="https://github.com/user-attachments/assets/da3a2979-5428-420f-9694-93b7f25978fa" width="850px" alt="C4 Level 3 Component Diagram" />
</p>

### C4 Level 3: Database Domain Model
Illustrates entity relationships, foreign key constraints, and relational indexes across Users, Orders, Subscriptions, Licenses, and Reviews.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a8c3cad6-a565-4069-9aa1-c627a5f429f7" width="750px" alt="C4 Level 3 Database Domain Model" />
</p>

---

## 🛡️ Security & Transactional Integrity

### 1. Database Design & ACID Atomic Transactions
* **Atomic Pipelines:** High-risk checkout and subscription claiming operations are wrapped in `prisma.$transaction`.
* **Concurrency Protection:** Guarantees full **ACID (Atomicity, Consistency, Isolation, Durability)** compliance. Prevents financial capture without synchronous cryptographic license generation.
* **Strict Relational Normalization:** Foreign key bindings enforce unique license creation per purchase order item.

### 2. Multi-Tier Security & Strict RBAC
* **Stateless Token Authentication:** Dual-layered JWT authentication headers without server-side memory state overhead.
* **Cryptographic Hashing:** Salted `Bcrypt` hashing (10 rounds) applied before writing user passwords to disk.
* **Granular Role Isolation:** Middleware (`authMiddleware.js`) intercepts endpoints and enforces strict role separation (`BUYER`, `SELLER`, `ADMIN`), categorically preventing privilege escalation.
* **Real-time Ban Validation:** Database-level constraint lookups immediately neutralize suspended accounts on every protected API transaction.

---

## 📱 Responsive UI/UX & User Journeys

The interface adapts responsively across mobile, tablet, and desktop viewports using utility-first Tailwind CSS classes and custom RTL typography.

<div align="center">

| 🖥️ Marketplace Catalog (Desktop View) | 📱 Mobile Drawer & Storefront (Mobile View) |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/6ad63130-460a-468c-a0f3-4816478fe977" width="550px" alt="Desktop Marketplace" /> | <img src="https://github.com/user-attachments/assets/309a5bac-e9a5-4a94-a751-da0d005e739b" width="230px" alt="Mobile View" /> |

</div>

---

## 🚀 DevOps, CI/CD, and Docker Infrastructure

### Containerization Strategy
* **Persistent Database Tier:** `postgres:15-alpine` container with named volume mounts (`postgres_data`) for full data persistence.
* **Dependency Health Checks:** Backend container delays start until PostgreSQL is verified healthy, automatically triggering `npx prisma migrate deploy`.
* **Multi-Container Orchestration:** Single-command bootstrap of Frontend, API, and DB networks via `docker-compose.yml`.

<p align="center">
  <img src="https://github.com/user-attachments/assets/1ea044ca-03d5-44b6-bd26-712a71d996b8" width="800px" alt="Docker Setup" />
</p>

### Continuous Integration Pipeline (GitHub Actions)
Configured via `.github/workflows/ci.yml`:
* Runs on isolated `ubuntu-latest` environments upon `push` and `pull_request` targeting `main`/`master`.
* Provisions Node.js `22.x`, securely caches NPM dependencies, and executes test suites.
* Enforces strict merge protection rules (100% green test pass requirement).

<p align="center">
  <img src="https://github.com/user-attachments/assets/1f73f8bc-1c62-4518-98e9-0d7d64b94d29" width="600px" alt="CI Pipeline Result" />
</p>

---

## 🧪 Automated Testing Implementation

Comprehensive unit and integration test coverage using **Jest** and **Supertest** with mocked database clients (`jest.mock('@prisma/client')`):

<p align="center">
  <img src="https://github.com/user-attachments/assets/25a83738-2fe0-4422-8397-1ff57dcc1b2b" width="650px" alt="Test Suites Results" />
</p>

1. **Authentication (`auth.test.js`):** Tests user registration, duplicate emails, password encryption, JWT issuance, and banned account rejection.
2. **Order Processing (`order.test.js`):** Validates empty cart handling, payload parsing, and transaction logic during checkout.
3. **Product Management (`product.test.js`):** Confirms public catalog reads and restricts asset creation strictly to `SELLER` tokens.
4. **Seller Analytics (`seller.test.js`):** Asserts seller resource ownership checks and verifies financial metrics compilation.
5. **Subscription Logic (`subscription.test.js`):** Asserts active plan querying and authorized membership status validation.
6. **Buyer Operations (`buyer.test.js`):** Validates digital library access and tests `accessDigiCourseProduct` (enforcing `403 Forbidden` on non-subscribed buyers).
7. **Admin Operations (`admin.test.js`):** Validates administrative enforcement and product verification state transitions.

---

## ⚙️ Quick Start & Deployment Guide

### Prerequisites
* [Docker Desktop](https://www.docker.com/) (or Docker Engine + Docker Compose)
* Git Version Control

### 1. Clone Repository
```bash
git clone https://github.com/Rouzbeh-Sti/Digi-Store.git
cd Digi-Store
```

### 2. Launch Container Stack
Spins up PostgreSQL, compiles the Express API, serves the React client, and executes Prisma migrations:
```bash
docker-compose up --build -d
```

### 3. Seed Mock Database Records
Populates the database with 30+ users, 50+ diverse digital products, realistic reviews, and 120+ simulated transactions:
```bash
docker exec -it digistore-backend npx prisma db seed
```

### 4. Service Endpoints
* **Client Frontend (React):** `http://localhost:5173`
* **Backend REST API:** `http://localhost:5000`

### 🔑 Test Accounts (`Password: 12345678`)
* **Admin Dashboard:** `admin@digistore.ir`
* **Seller Dashboard:** `erfan@digistore.ir` or `edit@digistore.ir`
* **Buyer Account:** `student1@sbu.ac.ir`

---

## 📑 Functional Requirements Traceability Matrix (SRS Mapping)

| Req ID | SRS Functional Requirement | Backend Implementation Controller | Automated Test Suite Coverage |
| :---: | :--- | :--- | :--- |
| **REQ-01** | User Registration & Role Assignment | `authController.js` (`registerUser`) | `auth.test.js` |
| **REQ-02** | Secure Authentication & Login | `authController.js` (`loginUser`) | `auth.test.js` |
| **REQ-03** | Seller Product Creation & Upload | `sellerController.js` (`createProduct`) | `seller.test.js` & `product.test.js` |
| **REQ-04** | Buyer Product Catalog & Search | `productController.js` (`getAllPublicProducts`) | `product.test.js` |
| **REQ-05** | Single Purchase Cart Checkout | `orderController.js` (`checkoutCart`) | `order.test.js` |
| **REQ-06** | License Generation on Payment | `orderController.js` (`verifyPayment`) | `order.test.js` |
| **REQ-07** | Global Subscription Management | `subscriptionController.js` | `subscription.test.js` |
| **REQ-08** | Subscription Content Claiming | `orderController.js` (`claimWithSubscription`) | `buyer.test.js` |
| **REQ-09** | Admin Monitoring & Enforcement | `adminController.js` (`getAllUsers`, `toggleUserBan`) | `admin.test.js` |
| **REQ-10** | Seller Financial Analytics | `sellerController.js` (`getSellerAnalytics`) | `seller.test.js` |

---

## 👤 Project Maintainers

Developed by the **SBU Computer Engineering Software Team**:
* **Rouzbeh Soltani**
* **Erfan Panjeh Shahi**
* **Mahan Baneshi**
* **Seyed Mohammad Mehdi Mirmotahari**

---
<p align="center">
  <i>Developed as part of the Software Engineering Course (Spring 1405) at Shahid Beheshti University (SBU).</i>
</p>
