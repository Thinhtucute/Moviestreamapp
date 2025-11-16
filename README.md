# MovieStreamApp

A full-featured movie streaming platform (no actual streaming for obvious copyright reasons).
Built with Spring Boot backend and React frontend.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure JWT-based user registration and login |
| 🎥 Streaming | High-quality video streaming with subtitle support |
| ⭐ Favorites | Save and manage favorite movies/series |
| 📜 Watch History | Track viewing progress and history |
| 🔍 Advanced Search | Filter by genre, year, rating, media type |
| 👥 User Profiles | Customizable user accounts with avatars |
| 💳 Subscriptions | Free and Premium tier support |
| 🎭 Actor & Director Info | Detailed cast and crew information |

---

## Architecture

### Tech Stack

**Backend:**
- Java 17 (JDK 23)
- Spring Boot 3.3.5
- Spring Security + JWT
- MySQL 8.0

**Frontend:**
- React 18.3.1
- Redux Toolkit (State Management)
- Axios (API Client)
- Material-UI Components
- SCSS Modules

**Database:**
- MySQL 8.0 (Hosted on Aiven)
- Relational schema with 20+ tables
- Indexes for optimized search performance

**Deployment:**
- Backend: Render.com (Docker containerized)
- Frontend: Vercel (Static site hosting)
- Database: Aiven MySQL
- Uptime Monitoring: Upstash (keeps backend awake)

### System Flow

```
User Browser (Vercel)
    ↓ HTTPS
Frontend React App
    ↓ REST API (JWT Auth)
Backend Spring Boot (Render)
    ↓ JDBC
MySQL Database (Aiven)
    ↓ Data Processing
```

---

## Quick Start

### Prerequisites

- **Java:** JDK 17+ (JDK 23 recommended)
- **Node.js:** 16+ and npm
- **MySQL:** 8.0+
- **IDE:** IntelliJ IDEA (recommended) or VS Code

**Clone the repository:**
   ```bash
   git clone https://github.com/Thinhtucute/Moviestreamapp.git
   ```

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```
   
2. **Set up MySQL database:**
   ```sql
   CREATE DATABASE MOVIE_STREAMING_APP;
   ```

3. **Import the database schema:**
   ```bash
   mysql -u root -p MOVIE_STREAMING_APP < ../Database/Database.sql
   ```

4. **Configure environment variables:**
   
   Create `.env` file in `Backend/` directory (see `.env.example` below)

5. **Run the application:**
   ```bash
   # Using Maven
   ./mvnw spring-boot:run
   
   # Or in IntelliJ IDEA
   # Right-click BackendApplication.java → Run
   ```

   Backend starts at: http://localhost:8080

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   
   Create `.env` file (see `.env.example` below)

4. **Start development server:**
   ```bash
   npm start
   ```

   Frontend starts at: http://localhost:3000

---

## Configuration

### Backend `.env.example`

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=MOVIE_STREAMING_APP
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SIGNER_KEY=jwt_secret_key
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=36000

# TMDB API (for movie metadata)
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Server Configuration
SERVER_PORT=8080
```

### Frontend `.env.example`

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080
```

---

## API Overview

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/introspect` - Validate token

### Media Content
- `GET /api/media/search` - Search movies/series (with filters)
- `GET /api/media/{id}` - Get media details
- `GET /api/media/{id}/episodes` - Get series episodes
- `GET /api/media/{id}/recommendations` - Get AI recommendations

### User Features
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/{mediaId}` - Add to favorites
- `DELETE /api/favorites/{mediaId}` - Remove from favorites
- `GET /api/history` - Get watch history
- `POST /api/history` - Record viewing progress

### Genres & Actors
- `GET /api/genres` - List all genres
- `GET /api/actors` - List actors with pagination
- `GET /api/actors/{id}` - Get actor details

---

## Database Schema

**Key Tables:**
- `Users` - User accounts and authentication
- `Media` - Movies and series metadata
- `Episodes` - TV show episodes
- `Genres`, `Actors`, `Directors` - Content metadata
- `Favorites`, `Watchhistory` - User interactions
- `Ratings` - User ratings and reviews
- `Roles`, `Permissions` - RBAC system

**Relationships:**
- Many-to-Many: Media ↔ Genres, Media ↔ Actors
- One-to-Many: Media → Episodes, Users → Favorites

---

## Production Links
**Live Demo:** 
- Frontend: https://moviestreamapp-fe.vercel.app
- Backend API: https://moviestreamapp-atax.onrender.com

---

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie metadata API
- [Spring Boot](https://spring.io/projects/spring-boot) framework
- [React](https://react.dev/) library
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting
- [Aiven](https://aiven.io/) for database hosting
