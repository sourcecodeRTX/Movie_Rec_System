# 🎬 MovieRec Platform - Full-Stack Movie Recommendation System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple.svg)](https://getbootstrap.com/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)

A modern, feature-rich movie recommendation platform built with **Spring Boot**, **MongoDB**, and **Vanilla JavaScript**. The system provides personalized movie recommendations based on user preferences, trending algorithms, and comprehensive analytics.

---

## 🌟 Key Features

### 🔐 **Secure Authentication System**
- User registration with BCrypt password hashing
- Secure login with password verification
- Session management with localStorage
- Spring Security integration
- **Admin PIN-based access control** for movie management (Base64 encoded)

### 🎥 **Movie Management**
- Complete CRUD operations for movies (Admin-only via PIN protection)
- Advanced search by title and genre
- Rich movie metadata (title, genre, year, description, poster)
- Responsive movie card grid with hover animations
- Dynamic admin panel toggle based on authentication status

### ⭐ **Review & Rating System**
- User-generated reviews with 1-5 star ratings
- Movie-specific review listings
- Real-time review updates

### 📋 **Personal Watchlist**
- Save favorite movies to watchlist
- Remove movies from watchlist
- User-specific watchlist management

### 🔥 **Intelligent Recommendation Engine**
- Genre-based personalized recommendations
- Collaborative filtering using user review history
- Trending movies algorithm combining rating + review count

### 📊 **Platform Analytics Dashboard**
- Total users, movies, and reviews count
- Most popular genre detection
- Real-time statistics visualization

### 📱 **Responsive UI Design**
- Mobile-first responsive layouts
- Sleek dark theme with rich aesthetics
- Interactive cards, micro-animations, and hover transitions
- Responsive movie card grid with optimized poster aspect ratios

---

## 🏗️ Architecture Overview

```
Movie Recommendation Platform
│
├── Frontend (Next.js + React + TypeScript + Tailwind CSS)
│   ├── Authentication Pages (Login/Register)
│   ├── Dashboard with Analytics & Movie Catalog
│   ├── Discovery & Search (Recommendations, Trending, Search bar)
│   ├── Movie Details & Reviews (Individual page + review submissions)
│   └── Personal Watchlist (Bookmarking and saving movies)
│
└── Backend (Spring Boot + MongoDB)
    ├── REST API Endpoints
    ├── Business Logic Layer
    ├── Data Access Layer (Repositories)
    └── Security Configuration
```

---

## � Admin Access Control

The platform includes a PIN-based admin authentication system:
- **Admin PIN**: 6-digit numeric code (encoded with Base64 for basic security)
- **Access Control**: Only authenticated admins can add/modify movies
- **Session-based**: Admin status stored in localStorage during session
- **Dynamic UI**: Admin button toggles to "Add Movie" after successful authentication

**Admin PIN**: `905@#@` (Base64: `OTA1Nj@#@`)

---

## �💻 Technology Stack

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **Spring Boot 3.2.3** | Core framework for REST API |
| **Spring Data MongoDB** | NoSQL database integration |
| **Spring Security** | Authentication & authorization |
| **BCrypt** | Password hashing |
| **Maven** | Dependency management |

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| **Next.js 16 (App Router)** | React meta-framework |
| **React 19** | Dynamic component-driven UI |
| **TypeScript** | Static type safety and developer productivity |
| **Tailwind CSS v4** | Modern, utility-first UI styling |
| **Fetch API** | HTTP requests to backend endpoints |

### **Database**
| Technology | Purpose |
|-----------|---------|
| **MongoDB** | NoSQL document database |
| **Collections** | users, movies, reviews, watchlist |

---

## 🔑 Core Implementation Highlights

### 1️⃣ **Intelligent Recommendation Algorithm**

The recommendation engine analyzes user behavior to suggest relevant movies:

```java
// RecommendationService.java - Genre-based Collaborative Filtering
public List<Movie> getRecommendations(String userId) {
    // Step 1: Get all reviews written by this user
    List<Review> userReviews = reviewRepository.findByUserId(userId);
    
    Set<String> favoriteGenres = new HashSet<>();
    List<String> reviewedMovieIds = new ArrayList<>();

    // Step 2: Extract genres from reviewed movies
    for (Review review : userReviews) {
        reviewedMovieIds.add(review.getMovieId());
        movieRepository.findById(review.getMovieId()).ifPresent(movie -> {
            favoriteGenres.add(movie.getGenre());
        });
    }

    List<Movie> recommendations = new ArrayList<>();

    // Step 3: Find movies in favorite genres
    for (String genre : favoriteGenres) {
        List<Movie> moviesInGenre = movieRepository.findByGenreIgnoreCase(genre);
        
        for (Movie movie : moviesInGenre) {
            // Step 4: Exclude already reviewed movies
            if (!reviewedMovieIds.contains(movie.getId()) && !recommendations.contains(movie)) {
                recommendations.add(movie);
            }
        }
    }

    return recommendations;
}
```

**Why it's impressive:**
- Learns user preferences from review history
- Prevents recommending already-seen content
- Scales efficiently with growing user base
- Genre-agnostic approach works across all movie types

---

### 2️⃣ **Trending Movies Algorithm**

Calculates trending movies using a weighted scoring system:

```java
// TrendingService.java - Weighted Trending Score
public static class TrendingStats {
    public double totalRating = 0;
    public int reviewCount = 0;

    public double getTrendingScore() {
        if (reviewCount == 0) return 0;
        double averageRating = totalRating / reviewCount;
        // Logic: Average Rating + Review Count gives higher weight to popular movies
        return averageRating + reviewCount; 
    }
}

public List<Movie> getTrendingMovies() {
    List<Review> allReviews = reviewRepository.findAll();
    Map<String, TrendingStats> statsMap = new HashMap<>();

    // Aggregate ratings per movie
    for (Review review : allReviews) {
        statsMap.putIfAbsent(review.getMovieId(), new TrendingStats());
        TrendingStats stats = statsMap.get(review.getMovieId());
        stats.totalRating += review.getRating();
        stats.reviewCount += 1;
    }

    // Sort by trending score (highest first)
    List<Map.Entry<String, TrendingStats>> sortedEntries = new ArrayList<>(statsMap.entrySet());
    sortedEntries.sort((a, b) -> 
        Double.compare(b.getValue().getTrendingScore(), a.getValue().getTrendingScore())
    );

    // Return top 10 trending movies
    return sortedEntries.stream()
        .limit(10)
        .map(entry -> movieRepository.findById(entry.getKey()))
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
}
```

**Why it's impressive:**
- Combines both quality (rating) and quantity (review count)
- Prevents low-rated movies with many reviews from dominating
- Automatically updates as new reviews come in
- Returns top 10 most relevant trending movies

---

### 3️⃣ **Secure Password Authentication**

Industry-standard BCrypt hashing for password security:

```java
// AuthService.java - Secure Password Handling
@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;  // BCrypt implementation

    public String registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Error: Email is already in use!";
        }
        // Hash password before storing - never store plain text!
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    public String loginUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Compare raw password with hashed password using BCrypt
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return "Login successful! Welcome " + user.getName();
            } else {
                return "Error: Invalid password!";
            }
        }
        return "Error: User not found!";
    }
}
```

**Why it's impressive:**
- BCrypt uses adaptive hashing (slows down brute-force attacks)
- Automatic salt generation for each password
- Industry-standard security practice
- One-way encryption (impossible to reverse)

---

### 4️⃣ **Spring Security Configuration**

Modern Spring Security setup with CORS and CSRF handling:

```java
// SecurityConfig.java - Secure API Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**", 
                    "/api/movies/**", 
                    "/api/reviews/**", 
                    "/api/watchlist/**", 
                    "/api/recommendations/**", 
                    "/api/trending/**", 
                    "/api/analytics/**"
                ).permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

**Why it's impressive:**
- Modern lambda-based Spring Security 6.x configuration
- Allows frontend-backend communication via CORS
- Fine-grained endpoint access control
- Easily extensible for JWT or OAuth2 integration

---

### 5️⃣ **Analytics Dashboard with Aggregation**

Real-time platform statistics calculation:

```java
// AnalyticsService.java - Multi-Source Data Aggregation
public DashboardStats getDashboardData() {
    DashboardStats stats = new DashboardStats();

    // 1. Simple counts from database
    stats.setTotalUsers(userRepository.count());
    stats.setTotalMovies(movieRepository.count());
    stats.setTotalReviews(reviewRepository.count());

    // 2. Calculate most popular genre using HashMap
    List<Movie> allMovies = movieRepository.findAll();
    Map<String, Integer> genreCount = new HashMap<>();
    String topGenre = "N/A";
    int maxCount = 0;

    for (Movie movie : allMovies) {
        String genre = movie.getGenre();
        if (genre != null && !genre.isEmpty()) {
            int count = genreCount.getOrDefault(genre, 0) + 1;
            genreCount.put(genre, count);
            
            if (count > maxCount) {
                maxCount = count;
                topGenre = genre;
            }
        }
    }
    stats.setTopGenre(topGenre);

    // 3. Get trending movies from TrendingService
    stats.setTrendingMovies(trendingService.getTrendingMovies());

    return stats;
}
```

**Why it's impressive:**
- Aggregates data from multiple services and repositories
- Efficient genre counting using HashMap
- Combines real-time statistics with trending algorithms
- Single API endpoint provides complete dashboard data

---

### 6️⃣ **Dynamic Frontend with React and TypeScript**

Modern Next.js server/client state management with proper error handling:

```typescript
// dashboard/page.tsx - React State Loading with Error Handling
async function fetchMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/movies`);
    if (response.ok) {
      const data = await response.json();
      setMovies(data);
    }
  } catch (error) {
    console.error("Error loading movies:", error);
  } finally {
    setLoadingMovies(false);
  }
}
```

**Why it's impressive:**
- Type-safe components and API payloads using TypeScript interfaces
- React hooks-based state lifecycle management (`useState`, `useEffect`)
- Seamless rendering with dynamic page updates and custom CSS transition layers

---

### 8️⃣ **Admin PIN Authentication System**

Secure role-based access control for movie management on the frontend:

```typescript
// components/Navbar.tsx - PIN-based Admin Authentication
const verifyPin = () => {
  const pin = prompt("Enter 6-digit Admin PIN:");
  if (pin) {
    try {
      if (btoa(pin) === "OTA1NjMz") {
        localStorage.setItem("isAdmin", "true");
        setIsAdmin(true);
        alert("Admin access granted!");
        window.dispatchEvent(new Event("storage"));
        router.refresh();
      } else {
        alert("Security Alert: Incorrect PIN!");
      }
    } catch (err) {
      console.error("Encoding error:", err);
    }
  }
};
```

**Why it's impressive:**
- Native browser dialog verification with Base64 encoding comparison
- Instant state changes triggered via standard local storage updates
- Dynamic client-side routing checks prevent unauthorized page entry (e.g. `/add-movie`)

---

### 7️⃣ **Custom Repository Query Methods**

Spring Data MongoDB custom queries for complex searches:

```java
// MovieRepository.java - Custom Query Methods
public interface MovieRepository extends MongoRepository<Movie, String> {
    // Case-insensitive partial title search
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    // Exact genre match (case-insensitive)
    List<Movie> findByGenreIgnoreCase(String genre);
}

// ReviewRepository.java
public interface ReviewRepository extends MongoRepository<Review, String> {
    // Find all reviews for a specific movie
    List<Review> findByMovieId(String movieId);
    
    // Find all reviews written by a specific user (for recommendations)
    List<Review> findByUserId(String userId);
}
```

**Why it's impressive:**
- Spring Data generates queries automatically from method names
- No need to write MongoDB query syntax
- Type-safe and compile-time checked
- Optimized by Spring Data internally

---

## 📁 Project Structure

```
Movie Recommendation/
│
├── backend/
│   ├── src/main/java/com/movierec/
│   │   ├── config/
│   │   │   └── SecurityConfig.java          # Spring Security setup
│   │   ├── controller/
│   │   │   ├── AuthController.java          # Login/Register endpoints
│   │   │   ├── MovieController.java         # Movie CRUD + Search
│   │   │   ├── RecommendationController.java # Personalized recommendations
│   │   │   ├── ReviewController.java        # Review management
│   │   │   ├── WatchlistController.java     # Watchlist operations
│   │   │   ├── TrendingController.java      # Trending movies
│   │   │   └── AnalyticsController.java     # Dashboard statistics
│   │   ├── model/
│   │   │   ├── User.java                    # User entity
│   │   │   ├── Movie.java                   # Movie entity
│   │   │   ├── Review.java                  # Review entity
│   │   │   ├── Watchlist.java               # Watchlist entity
│   │   │   └── DashboardStats.java          # Analytics DTO
│   │   ├── repository/
│   │   │   ├── UserRepository.java          # User data access
│   │   │   ├── MovieRepository.java         # Movie data access
│   │   │   ├── ReviewRepository.java        # Review data access
│   │   │   └── WatchlistRepository.java     # Watchlist data access
│   │   ├── service/
│   │   │   ├── AuthService.java             # Authentication logic
│   │   │   ├── MovieService.java            # Movie business logic
│   │   │   ├── RecommendationService.java   # Recommendation algorithm
│   │   │   ├── ReviewService.java           # Review logic
│   │   │   ├── WatchlistService.java        # Watchlist logic
│   │   │   ├── TrendingService.java         # Trending algorithm
│   │   │   └── AnalyticsService.java        # Analytics aggregation
│   │   └── MovieRecApplication.java         # Main application
│   ├── src/main/resources/
│   │   └── application.properties           # MongoDB configuration
│   └── pom.xml                              # Maven dependencies
│
├── frontend/                                # Next.js Web App
│   ├── src/
│   │   ├── config.ts                        # Global API base URL configuration
│   │   ├── components/                      # Shared UI components (Navbar, MovieCard)
│   │   └── app/                             # Next.js App Router Pages
│   │       ├── page.tsx                     # Login Page (root)
│   │       ├── register/                    # User registration page
│   │       ├── dashboard/                   # Platform analytics & catalog page
│   │       ├── discover/                    # Search, trending & recommendations page
│   │       ├── watchlist/                   # Watchlist page
│   │       ├── add-movie/                   # Admin portal to add movies
│   │       └── movie/[id]/                  # Movie details & reviews page
│   ├── next.config.ts                       # Next.js configuration
│   ├── package.json                         # Build scripts & dependencies
│   └── tsconfig.json                        # TypeScript configuration
│
└── frontend-old/                            # Legacy Bootstrap HTML/CSS pages
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MongoDB 4.4+** (running locally on port 27017)
- Modern web browser (Chrome, Firefox, Edge)

### Installation Steps

#### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd "Movie Recommendation"
```

#### 2. **Start MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# Linux/Mac
mongod --dbpath /path/to/data/directory
```

#### 3. **Configure Database**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/movie_recommendation_db
server.port=8080
```

#### 4. **Build and Run Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` (or your configured port).

#### 5. **Launch Frontend**
Install frontend dependencies and start the Next.js development server:
```bash
cd frontend
pnpm install
pnpm run dev
```

Access the application locally at `http://localhost:3000`.

---

## 🚀 Vercel Deployment (Frontend)

To deploy the Next.js frontend to **Vercel**:

1. **Import the Repository**: Connect your GitHub repository to Vercel.
2. **Configure Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm run build` or `next build`
   - **Output Directory**: `.next`
3. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` under Environment Variables and set it to your deployed Spring Boot backend URL (e.g., `https://movie-rec-system-oanl.onrender.com`).
4. **Deploy**: Click **Deploy**. Vercel will build and serve your Next.js application automatically!

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/movies` | Get all movies |
| `POST` | `/api/movies` | Add new movie |
| `PUT` | `/api/movies/{id}` | Update movie |
| `DELETE` | `/api/movies/{id}` | Delete movie |
| `GET` | `/api/movies/search?title={title}` | Search by title |
| `GET` | `/api/movies/genre/{genre}` | Search by genre |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/reviews` | Add review |
| `GET` | `/api/reviews/movie/{movieId}` | Get movie reviews |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/watchlist` | Add to watchlist |
| `GET` | `/api/watchlist/user/{userId}` | Get user watchlist |
| `DELETE` | `/api/watchlist/user/{userId}/movie/{movieId}` | Remove from watchlist |

### Recommendations & Trending
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recommendations/user/{userId}` | Get personalized recommendations |
| `GET` | `/api/trending` | Get trending movies |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/dashboard` | Get platform statistics |

---

## 🎨 UI Features

### Responsive Design
- **Mobile-first approach** with Bootstrap grid system
- **Smooth animations** on hover and page load
- **Modern gradient navbar** with streaming platform aesthetic
- **Optimized movie posters** with 2:3 aspect ratio

### Custom Styling Highlights
```css
/* Smooth card hover animation */
.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2) !important;
}

/* Modern gradient navbar */
.navbar {
    background: linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%) !important;
}

/* Fade-in page load animation */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}
```

---

## 📊 Database Schema

### Collections

#### **users**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string (BCrypt hashed)"
}
```

#### **movies**
```json
{
  "_id": "ObjectId",
  "title": "string",
  "genre": "string",
  "year": "number",
  "description": "string",
  "posterUrl": "string"
}
```

#### **reviews**
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "movieId": "string",
  "rating": "number (1-5)",
  "reviewText": "string"
}
```

#### **watchlist**
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "movieId": "string"
}
```

---

## 🔒 Security Features

- ✅ BCrypt password hashing (10 rounds)
- ✅ CORS configuration for frontend-backend communication
- ✅ Spring Security integration
- ✅ Input validation on both frontend and backend
- ✅ Session management with localStorage
- ✅ Protected routes with authentication checks
- ✅ **Admin PIN-based access control** (Base64 encoded)
- ✅ Role-based UI rendering (admin vs regular user)

---

## 🌈 Future Enhancements

- [ ] JWT-based authentication for enhanced security
- [ ] OAuth2 social login (Google, Facebook)
- [ ] Advanced recommendation algorithms (content-based filtering, matrix factorization)
- [ ] Movie ratings with aggregated scores
- [ ] User profiles with avatars and bio
- [ ] Backend admin authentication API (replace client-side PIN)
- [ ] Integration with TMDB API for real movie data
- [ ] Real-time notifications for new releases using WebSockets
- [ ] Movie trailers and embedded video player
- [ ] Social features (follow users, share recommendations)
- [ ] Multi-factor authentication (MFA) for admin accounts
- [ ] Rate limiting and DDoS protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Built with ❤️ using Spring Boot, MongoDB, and modern web technologies.

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact via email
- Check the documentation

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- MongoDB for the flexible database
- Bootstrap team for the responsive UI components
- All contributors and testers

---

**⭐ If you find this project helpful, please give it a star!**
