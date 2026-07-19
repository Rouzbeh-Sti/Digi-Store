# 🌐 DigiStore: Enterprise Digital Marketplace Platform

A comprehensive, scalable, and highly secure digital marketplace engineered to facilitate the seamless transaction of digital assets, including software licenses, electronic books, and online video courses. Designed with a robust, modular backend architecture, DigiStore disrupts traditional e-commerce paradigms by natively supporting both **Single-Purchase** models and recurring revenue streams via global subscription tiers (dubbed "DigiCourse").

---

## 🎓 Academic Context & Project Administration
* **Course:** Software Engineering (Undergraduate)
* **Semester:** Spring 1405
* **Institution:** Shahid Beheshti University (SBU), Faculty of Computer Engineering
* **Course Instructor:** Dr. Samadi
* **Engineering Team (Authors):** 
  * Rouzbeh Soltani (402243072)
  * Erfan Panjeh Shahi (402243046)
  * Mahan Baneshi (402243042)
  * Seyed Mohammad Mehdi Mirmotahari (402243106)
* **SRS Release Date:** 15 Ordibehesht 1405

---

## 🏗️ System Architecture & Engineering Principles

This project strictly adheres to modern software engineering practices, moving beyond simple CRUD operations to implement a resilient, enterprise-grade architecture suitable for academic defense and real-world scalability.

### 1. Architectural Pattern & C4 Modeling
The system utilizes a modular Monolithic architecture, heavily inspired by the **Model-View-Controller (MVC)** design pattern, separating core business logic from API routing mechanisms. The entire system architecture has been thoroughly documented using the **C4 Model** framework to provide a clear technical blueprint.
* **Level 1 (System Context):** Illustrates the macro-level interaction between Buyers, Sellers, Admins, and external systems (Payment Gateways, File Storage).
* **Level 2 (Container):** Details the technological separation between the React/Vite Frontend, Node.js/Express Backend API, and the PostgreSQL Database.
* **Level 3 (Component):** Maps the internal routing protocols, middleware authentication gateways (JWT/RBAC), and specific controller logic mapped to Prisma ORM instances.

> <img width="1942" height="963" alt="Level3-Backend" src="https://github.com/user-attachments/assets/da3a2979-5428-420f-9694-93b7f25978fa" />

> <img width="1669" height="603" alt="Level2" src="https://github.com/user-attachments/assets/086e55f9-f879-460a-bc9f-cebfe2d49ec3" />


### 2. Database Design & Transactional Integrity (ACID)
The relational database is highly normalized to prevent data anomalies and redundancy. We implemented **Atomic Transactions** via Prisma ORM (using `prisma.$transaction`) specifically for the checkout and subscription claiming pipelines. 
* **Concurrency & Safety:** This guarantees full ACID (Atomicity, Consistency, Isolation, Durability) properties. It ensures that a user is never financially charged without a corresponding cryptographic license being generated synchronously, completely eliminating edge-case failures during partial system crashes.
* **Entity Relations:** Strict foreign-key constraints bind `Users` to `Orders`, `OrderItems` to `Products` and `Subscriptions`, enforcing unique `License` generation per purchased item.

> <img width="1331" height="930" alt="Level3-Database" src="https://github.com/user-attachments/assets/a8c3cad6-a565-4069-9aa1-c627a5f429f7" />


### 3. Security & Role-Based Access Control (RBAC)
Security protocols are implemented meticulously at both the network routing and data-access layers.
* **Stateless Authentication:** Utilizing JWT (JSON Web Tokens) to manage user sessions securely without server-side memory overhead.
* **Cryptographic Hashing:** All user passwords are salted and hashed using `Bcrypt` before database insertion.
* **Strict RBAC:** Middleware (`authMiddleware.js`) explicitly isolates REST endpoints based on user roles (`BUYER`, `SELLER`, `ADMIN`), categorically preventing horizontal and vertical privilege escalation.
* **Live Constraint Checking:** Database-level ban checks instantly neutralize compromised or restricted accounts on every protected API call, overriding valid JWTs if an account is suspended.

---

## 🎯 Phase 3 Deliverables & Strict SRS Alignment

This iteration fulfills and exceeds the Phase 3 requirements dictated by the Software Engineering curriculum.

1. **SRS Traceability:** Development aligns perfectly with the core functional requirements defined in the SRS version 1.0.0.
2. **C4 Model Refinement:** Architecture documents reflect the finalized database schema, seller components, and routing structures.
3. **Comprehensive Unit Testing:** Isolated test suites cover the core backend API modules using Jest and Supertest, drastically exceeding the 3-API minimum academic requirement.
4. **Complete Dockerization:** The entire application stack (Frontend, Backend, Database) is containerized and orchestratable via a unified `docker-compose.yml` configuration file.
5. **Continuous Integration (CI):** A GitHub Actions pipeline automatically triggers automated tests on pull requests to the `main` branch, strictly preventing code merges if logical flaws exist.
6. **Responsive UI/UX:** The React frontend adapts seamlessly to mobile, tablet, and high-resolution desktop environments utilizing Tailwind CSS utility classes.

<img width="950" height="463" alt="image" src="https://github.com/user-attachments/assets/6ad63130-460a-468c-a0f3-4816478fe977" />

<img width="380" height="706" alt="image" src="https://github.com/user-attachments/assets/309a5bac-e9a5-4a94-a751-da0d005e739b" />


---

## 🚀 DevOps, CI/CD, and Docker Infrastructure

### Containerization Strategy
The application utilizes Docker to guarantee environment consistency across development, testing, and production workflows, eliminating "it works on my machine" issues.
* **Database Service:** `postgres:15-alpine` is utilized with persistent volume mounts (`postgres_data`) to ensure complete data retention across container lifecycles.
* **Multi-Container Orchestration:** `docker-compose.yml` links the Node.js backend, Vite/React frontend, and PostgreSQL database seamlessly through internal Docker networks.
* **Automated Migrations:** The backend container is configured with a strict health-check dependency; it automatically waits for the database to become fully operational before executing `npx prisma migrate deploy`, ensuring zero-downtime deployments and crash prevention.

<img width="1815" height="1146" alt="image" src="https://github.com/user-attachments/assets/1ea044ca-03d5-44b6-bd26-712a71d996b8" />


### Continuous Integration Pipeline (GitHub Actions)
We implemented an automated CI pipeline located at `.github/workflows/ci.yml`. 
* **Trigger Conditions:** Every `push` or `pull_request` to the `main` branch triggers an isolated `ubuntu-latest` runner.
* **Execution:** It provisions Node.js environment `22.x`, installs backend dependencies securely, and executes the full Jest/Supertest suite with mocked environmental variables. 
* **Merge Protection:** Branch protection rules require a green CI build (100% test pass rate) before code can be merged into production.

<img width="720" height="377" alt="image" src="https://github.com/user-attachments/assets/1f73f8bc-1c62-4518-98e9-0d7d64b94d29" />

---

## 🧪 Automated Testing Implementation

To ensure system reliability and satisfy Phase 3 integration requirements, we developed extensive automated unit and integration tests using **Jest** and **Supertest**. 
The test suites completely mock the Prisma database client (`jest.mock('@prisma/client')`) to execute rapidly without side effects or actual database mutations. Coverage includes:

1. **Authentication (`auth.test.js`):** Verifies user registration constraints, JWT issuance, and login ban-checks.
2. **Order Processing (`order.test.js`):** Validates empty cart handling, payload structuring, and the complex `$transaction` logic for checkout operations.
3. **Product Management (`product.test.js`):** Ensures public catalog retrieval and restricts product creation strictly to `SELLER` roles.
4. **Seller Analytics (`seller.test.js`):** Confirms that sellers can only mutate their own products and verifies statistical data compilation.
5. **Subscription Logic (`subscription.test.js`):** Validates the public retrieval of active plans and authorized status checking.
6. **Buyer Operations (`buyer.test.js`):** Tests dashboard access and explicitly verifies the `accessDigiCourseProduct` logic, ensuring non-subscribed users receive `403 Forbidden` errors.
7. **Admin Privileges (`admin.test.js`):** Confirms that standard user roles are aggressively blocked from accessing critical verification endpoints.

<img width="1003" height="587" alt="image" src="https://github.com/user-attachments/assets/25a83738-2fe0-4422-8397-1ff57dcc1b2b" />

---

## ⚙️ Quick Start & Deployment Guide

### Prerequisites
* [Docker Desktop](https://www.docker.com/) (or Docker Engine + Docker Compose)
* Git Version Control

### Deployment Execution
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rouzbeh-Sti/Digi-Store
   cd Digi-Store

2. **Deploy the entire stack in detached mode:**
This single command pulls necessary base images, builds the frontend/backend Dockerfiles, applies database schemas, and spins up the isolated environment.
  ```bash
  docker-compose up --build -d
  
  ```


3. **Inject Realistic Mock Data (Database Seeding):**
To fully evaluate the UI and system analytics, populate the database with realistic mock data (including 30+ users, 50+ diverse products, realistic reviews, and 120+ simulated transaction records).
  ```bash
  docker exec -it digistore-backend npx prisma db seed
  
  ```



### Application Access Points

* **Client Frontend (React):** `http://localhost:5173`

* **Backend API Gateway:** `http://localhost:5000`


### System Test Accounts (Password for all: `12345678`)

* **Admin Dashboard:** `admin@digistore.ir`
* **Seller Dashboard:** `erfan@digistore.ir` or `edit@digistore.ir`
* **Buyer Profile:** `student1@sbu.ac.ir`

---

## 📑 Functional Requirements Traceability Matrix (SRS Mapping)

The following table proves direct architectural compliance with the Software Requirements Specification (SRS) defined for this project.

| Req ID | SRS Functional Requirement | Backend Implementation Controller | Automated Test Suite Coverage |
|--------|----------------------------|----------------------------------|------------------------------|
| **REQ-01** | User Registration & Role Assignment | `authController.js` (registerUser) | `auth.test.js` |
| **REQ-02** | Secure Authentication & Login | `authController.js` (loginUser) | `auth.test.js` |
| **REQ-03** | Seller Product Creation & Upload | `sellerController.js` (createProduct) | `seller.test.js` & `product.test.js` |
| **REQ-04** | Buyer Product Catalog & Search | `productController.js` (getAllPublicProducts) | `product.test.js` |
| **REQ-05** | Single Purchase Cart Checkout | `orderController.js` (checkoutCart) | `order.test.js` |
| **REQ-06** | License Generation on Payment | `orderController.js` (verifyPayment) | `order.test.js` |
| **REQ-07** | Global Subscription Management | `subscriptionController.js` | `subscription.test.js` |
| **REQ-08** | Subscription Content Claiming | `orderController.js` (claimWithSubscription) | `buyer.test.js` |
| **REQ-09** | Admin Monitoring & Enforcement | `adminController.js` (getAllUsers, toggleUserBan) | `admin.test.js` |
| **REQ-10** | Seller Financial Analytics | `sellerController.js` (getSellerAnalytics) | `seller.test.js` |
