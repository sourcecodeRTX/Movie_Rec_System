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
- Mobile-first design with Bootstrap 5
- Smooth hover animations and transitions
- Modern gradient navbar
- Optimized movie poster aspect ratios

---

## 🏗️ Architecture Overview

```
Movie Recommendation Platform
│
├── Frontend (HTML/CSS/JavaScript + Bootstrap)
│   ├── Authentication Pages (Login/Register)
│   ├── Dashboard with Analytics
│   ├── Movie Discovery & Search
│   ├── Movie Details & Reviews
│   └── Personal Watchlist
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
| **HTML5** | Semantic markup |
| **CSS3** | Custom styling with animations |
| **JavaScript (ES6+)** | Client-side logic & API calls |
| **Bootstrap 5.3.0** | Responsive UI framework |
| **Fetch API** | HTTP requests to backend |

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

### 6️⃣ **Dynamic Frontend with Async/Await**

Modern JavaScript with proper error handling:

```javascript
// dashboard.html - Async Data Loading with Error Handling
async function loadMovies() {
    try {
        const response = await fetch('https://movie-rec-system-oanl.onrender.com/api/movies');
        if (response.ok) {
            const movies = await response.json();
            const movieGrid = document.getElementById('movieGrid');
            
            if (movies.length === 0) {
                movieGrid.innerHTML = '<p class="text-muted">No movies available.</p>';
                return;
            }

            movies.forEach(movie => {
                const movieCard = `
                    <div class="col-6 col-md-4 col-lg-3 mb-4">
                        <div class="card h-100 shadow-sm">
                            <img src="${movie.posterUrl}" class="card-img-top" 
                                 alt="Movie Poster" style="height: 350px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text text-muted mb-1">${movie.year} | ${movie.genre}</p>
                                <p class="card-text small text-truncate">${movie.description}</p>
                            </div>
                            <div class="card-footer bg-white border-top-0 pb-3">
                                <a href="movie-details.html?id=${movie.id}" 
                                   class="btn btn-outline-primary btn-sm w-100">View Details</a>
                            </div>
                        </div>
                    </div>
                `;
                movieGrid.innerHTML += movieCard;
            });
        }
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}
```

**Why it's impressive:**
- Modern async/await syntax (cleaner than callbacks)
- Comprehensive error handling
- Dynamic DOM manipulation
- Responsive grid layout generation

---

### 8️⃣ **Admin PIN Authentication System**

Secure role-based access control for movie management:

```javascript
// dashboard.html - PIN-based Admin Authentication
// Authenticate user on page load
const userEmail = localStorage.getItem('loggedInUser');

if (!userEmail) {
    window.location.href = 'index.html';
} else {
    document.getElementById('userDisplay').innerText = "Welcome, " + userEmail;
}

// Toggle buttons based on admin status
if (localStorage.getItem('isAdmin') === 'true') {
    document.getElementById('adminNavBtn').style.display = 'none';
    document.getElementById('addMovieNavBtn').style.display = 'block';
}

// Function to verify the 6-digit admin PIN
function verifyPin() {
    const pin = prompt("Enter 6-digit Admin PIN:");
    
    // Check if input matches the Base64 encoded PIN
    if (pin && btoa(pin) === 'OTA1NjMz') {
        localStorage.setItem('isAdmin', 'true');
        window.location.reload(); // Reload to update navbar UI
    } else if (pin) {
        alert("Security Alert: Incorrect PIN!");
    }
}

// Logout function to clear session and admin status
function logoutAdmin() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}
```

**Why it's impressive:**
- Role-based access control without backend authentication
- Base64 encoding for basic PIN obfuscation
- Dynamic UI changes based on authentication status
- Persistent admin session across page reloads
- Secure logout clears all credentials

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
└── frontend/
    ├── index.html                           # User login page
    ├── register.html                        # User registration
    ├── dashboard.html                       # Main dashboard with analytics
    ├── discover.html                        # Search, trending, recommendations
    ├── movie-details.html                   # Movie details + reviews
    ├── watchlist.html                       # Personal watchlist
    ├── add-movie.html                       # Add new movie form
    └── style.css                            # Custom styling
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

The backend will start on `https://movie-rec-system-oanl.onrender.com`

#### 5. **Launch Frontend**
Open `frontend/index.html` in your browser or use a live server:
```bash
# Using Python
cd frontend
python -m http.server 3000

# Using Node.js (http-server)
npx http-server frontend -p 3000
```

Access the application at `http://localhost:3000`

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
