# 🎬 MovieTown App

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Fullstack-pink?style=for-the-badge)

**MovieTown** is a high-end cinema ticket booking platform featuring a dark, futuristic aesthetic. Built with a modern full-stack architecture, it provides a seamless experience for moviegoers and a robust management suite for administrators.


## ✨ Key Features

### 👤 For Users
- **Interactive Booking:** A specialized Grid UI for real-time seat selection in various cinema halls.
- **Dynamic Content:** Browse upcoming screenings, movie details, and genres.
- **Personal Profile:** Manage account details and view a complete history of personal reservations.
- **Secure Authentication:** Robust login and registration system powered by **JWT (JSON Web Tokens)**.

### 🛡️ For Administrators
- **Screening Management:** Full CRUD operations for managing the cinema's schedule with animated confirmation modals.
- **User Administration:** Manage the workforce, change user roles (User/Admin), and edit personnel records.
- **Concurrency Control:** Implementation of **Optimistic Concurrency** using PostgreSQL's `xmin` to prevent data conflicts between multiple admins.



## 🛠️ Technical Stack

### **Frontend**
- **React 18** with **TypeScript** for type-safe development.
- **Tailwind CSS** for the futuristic utility-first styling.
- **Framer Motion** for smooth, high-performance animations and modals.
- **Lucide React** for consistent, modern iconography.
- **React Router Dom** for lightning-fast SPA navigation.

### **Backend**
- **.NET 9 (ASP.NET Core API)** – High-performance backend services.
- **Entity Framework Core** – ORM for efficient database communication.
- **PostgreSQL** – Reliable, production-ready relational database.
- **BCrypt.Net** – Industrial-strength password hashing.
- **Docker** – Containerization for consistent deployment environments.




## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **.NET 9 SDK**
- **Docker & Docker Compose** (optional, for local database)

### Environment Setup 🔑

1. **Root Directory (`/.env`):**
Used by Docker Compose to set up infrastructure.
- `DB_PASSWORD`: Password for the PostgreSQL container.
- `JWT_SECRET`: Secret key for token generation (min. 32 chars).

2. **Frontend Directory (`/frontend/.env`):**
Used by React to connect to the API.
- `REACT_APP_API_URL`: URL of your running backend (e.g., `http://localhost:5000` for local dev or your Render URL).

### Installation & Local Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/annawierzbik/MovieTownApp.git](https://github.com/annawierzbik/MovieTownApp.git)
   cd MovieTownApp
   
2. **Run Application (Docker):**
   ```bash
     docker-compose up -d

3. **Access Application at:**
- Frontend: http://localhost
- Backend: http://localhost/api

  
## 🌐 Deployment
The application is fully deployed and can be accessed via the following link:

Live Frontend: https://movie-town-frontend.onrender.com

## 📝 Author
Anna Wierzbik Developed as a final project for the "Narzędzia Typu RAD" course.
