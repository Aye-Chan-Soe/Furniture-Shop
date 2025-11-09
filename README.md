# 🛋️ Furniture E-Commerce Shop with PERN Stack

A full-stack e-commerce platform built with **PostgreSQL, Express.js, React, and Node.js (PERN)**, featuring type safety with **TypeScript**, modern styling via **Tailwind CSS and shadCN UI**, and robust database management using **Prisma** and **Docker** for consistent environments.
---

## ✨ Features

* **Modern Frontend:** Built with **React** and **TypeScript** for type safety and scalability.
* **Intuitive UI:** Styled using **shadCN UI** components and utility-first **Tailwind CSS**.
* **Robust Backend:** Fast, unopinionated **REST API** layer powered by **Node.js** and **Express.js**.
* **Type-Safe ORM:** Efficient database interaction managed by **Prisma**.
* **Secure Authentication:** Implemented with **JWT (JSON Web Tokens)**.
* **Session/Cache Management:** Uses **Redis** for efficient caching and session handling.
* **Containerized Development:** Consistent, isolated environments using **Docker** and **Docker Compose**.

---

## 🛠️ Tech Stack

This project leverages a modern, scalable full-stack toolkit.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** | Core library for building the user interface. |
| **Language** | **TypeScript** | Adds static type checking for enhanced code quality. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **UI Library** | **shadCN UI** | Accessible, pre-built components for a polished look. |
| **Backend** | **Node.js & Express.js** | The runtime and framework for the RESTful API. |
| **Database** | **PostgreSQL** | Primary relational data store. |
| **ORM** | **Prisma** | Type-safe database access and schema management. |
| **Cache/Session** | **Redis** | Used for caching data and managing short-lived sessions. |
| **Environment**| **Docker & Docker Compose**| Containerization for consistent setup across environments. |

---

## ⚙️ Installation & Setup (Using Docker)

The easiest way to get this project running is by using Docker Compose, which handles the Node.js and PostgreSQL services automatically.

### Prerequisites

Ensure you have the following installed on your machine:

* **Git**
* **Docker** and **Docker Compose**

### 1. Clone the Repository

```bash
git clone https://github.com/Aye-Chan-Soe/Furniture-Shop
```
### 2. Configure Environment Variables
* Create a file named .env in the root directory. This file is critical for connecting services and should never be committed to Git.


# Example .env content:
# Database connection for Docker container
```bash
DATABASE_URL="postgresql://user:password@db:5432/db_name"
```

# Backend server configuration
```bash
PORT=8080
JWT_SECRET="your_secure_secret_key"
```

3. Build and Run Containers
Use Docker Compose to build your application image and start both the Node.js API and the PostgreSQL database.

```bash
docker-compose up --build -d
```
The -d runs the containers in detached mode (in the background).

4. Setup Database Schema (Prisma)
Once the containers are running, you need to apply the Prisma schema and generate the client inside the container.

# Execute Prisma commands inside the running Node.js container (replace 'app' with your service name if different)
```bash
docker exec [your-project-folder]_app_1 npx prisma migrate dev --name init
```

# If you have seed data:
```bash
docker exec [your-project-folder]_app_1 npx prisma db seed
```

▶️ How to Use
Accessing Services 
| Service | Address | Notes |
| :--- | :--- | :--- |
| **Backend API** | "http://localhost:[Your Port, e.g., 8080]" |  |Access the API endpoints (e.g., /api/users).
| **Frontend App** |  "http://localhost:[Frontend Port, e.g., 3000]" |  Access the application in your browser. |

Common Development commands
If you need to run Node.js commands directly (e.g., to generate Prisma client locally or run scripts):

# To install a new package
```bash
docker exec -it [container_name] npm install [package-name]
```

# To stop all running containers
```bash
docker-compose down
```

🤝 Contribution
1.Fork the repository.

2.Create your feature branch (git checkout -b feature/AmazingFeature).

3.Commit your changes (git commit -m 'feat: Add some AmazingFeature').

4.Push to the branch (git push origin feature/AmazingFeature).

5.Open a Pull Request.

