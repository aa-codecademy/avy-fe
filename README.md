# Avy Frontend

Avy by Avenga Academy - A web platform connecting students, alumni, and companies.

## 🚀 Tech Stack

- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Custom SPA Router** - Client-side routing
- **Tailwind CSS (CDN)** - Utility-first styling
- **Font Awesome 6** - Icons
- **Modern ES Modules** - Clean module system

## 📋 Prerequisites

- Modern web browser with ES6+ support (Chrome, Firefox, Safari, Edge)
- Local web server for development (e.g., Live Server, Python HTTP server, or any static file server)
- **VS Code users:** Accept the recommended extensions (Prettier, ESLint) when prompted so format-on-save and linting work out of the box.

## 🛠️ Installation

**Phase 1: Frontend Only (No Build Required!)**

This is a pure vanilla JavaScript application that runs directly in the browser. No npm install, no build step, no dependencies!

1. Clone the repository (or if you're using the submodule, it's already cloned)
2. Start a local web server:
  **Option 1: VS Code Live Server Extension**
  - Install the "Live Server" extension in VS Code
  - Right-click on `index.html` and select "Open with Live Server"
    **Option 2: Python HTTP Server**
    **Option 3: Node.js http-server (if you have Node.js)**
3. Open your browser and navigate to `http://localhost:8000` (or the port your server uses)

## 🏃 Running the Application

Simply open `index.html` through any web server. The application will:

- Load Tailwind CSS from CDN
- Load Font Awesome from CDN
- Initialize the custom router
- Start on the landing page

**No build process required!**

## 📁 Project Structure

```
avy-fe/
├── index.html              # Main HTML entry point
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles (animations, utilities)
│   ├── js/
│   │   ├── main.js         # Application entry point & route registration
│   │   ├── router.js       # Custom SPA router with dynamic routes
│   │   ├── models/         # Data model classes
│   │   │   └── DataModels.js   # User, Job, Company, Application, etc.
│   │   ├── services/       # Business logic & data layer
│   │   │   ├── authService.js      # Authentication service
│   │   │   └── mockDataService.js  # Phase 1 mock data (570+ lines)
│   │   └── controllers/    # Page controllers (12+ files)
│   │       ├── landingController.js
│   │       ├── loginController.js
│   │       ├── dashboardController.js
│   │       ├── jobBoardController.js      # Bloom module
│   │       ├── jobDetailController.js     # Bloom module
│   │       ├── companiesController.js     # Bloom module
│   │       ├── profileController.js       # Bloom module
│   │       ├── postJobController.js       # Evergreen module
│   │       ├── candidatesController.js    # Evergreen module
│   │       ├── adminUsersController.js    # Meridian module
│   │       ├── adminAnalyticsController.js # Meridian module
│   │       └── notFoundController.js
│   └── img/                # Images and assets (placeholder)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎨 Architecture

### Custom SPA Router

- Hash-less routing using History API
- Route protection with authentication checks
- Role-based access control
- Automatic link interception for SPA navigation

### Authentication System

- JWT token storage in localStorage
- Phase 1: Mock authentication (email pattern determines role)
- Phase 2: Real backend API integration
- Automatic role detection and redirection

### Component-Based Architecture (React-like)

- **Controllers as Components**: Each page is a JavaScript function that renders HTML
- **Template Literals for Views**: HTML embedded in JavaScript using template strings
- **No Separate Templates**: No .html files for individual pages (all dynamic)
- **Data-Driven Rendering**: Content generated from JavaScript data/API responses
- **Benefits**: Type-safe variables, easy props passing, scales to real frameworks

### Module Pattern

- ES6 modules for clean code organization
- Service layer for business logic (authService, mockDataService)
- Controller layer for page rendering (one controller per page)
- Models for data structures (User, Job, Company, etc.)
- Clear separation of concerns

## 🎨 Key Features

### Three Platform Modules

**🌱 Bloom (Student & Alumni)**

- Profile management with CV builder
- Job board with advanced filters
- Direct applications to companies
- Dashboard with job matches
- Application tracking

**🏢 Evergreen (Company)**

- Company profile management
- Job posting capabilities
- Candidate search and filtering
- Application management
- Subscription plans (Basic, Advanced, Premium)

**⚙️ Meridian (Admin)**

- User management
- Job moderation
- Platform analytics
- System configuration

## 🔐 Authentication (Phase 1 - Demo Mode)

The app uses mock JWT-based authentication with the following user roles:

- **Student** - `student@avy.com` (or any email with "student")
- **Alumni** - `alumni@avy.com` (or any email with "alumni")
- **Employer** - `company@avy.com` or `employer@avy.com`
- **Admin** - `admin@avy.com` (or any email with "admin")

**Phase 1:** Any password works. Role is determined by email pattern.
**Phase 2:** Real authentication with backend validation.

**Phase 1:** Any password works. Role is determined by email pattern.
**Phase 2:** Real authentication with backend validation.

## 🌐 API Integration

**Phase 1 (Current):** Frontend operates independently with mock data.

**Phase 2 (Coming Soon):** Backend integration with Node.js or .NET APIs.

The mock data service can be easily replaced with real API calls in Phase 2!

## 🎯 Development Phases

### Phase 1: Frontend Only ✅ Current

- ✅ Complete UI/UX with vanilla JavaScript
- ✅ Mock authentication system
- ✅ All pages and navigation (12+ controllers)
- ✅ Role-based routing (student, alumni, employer, admin)
- ✅ Responsive design with Tailwind CSS
- ✅ Comprehensive data models (10+ classes)
- ✅ Mock data service (6 jobs, 4 users, 4 companies)
- ✅ Job Board with filters, Job Detail with application form
- ✅ Profile/CV management, Company directory
- ✅ Employer pages (Post Job, Candidate Search)
- ✅ Admin pages (User Management, Analytics)

### Phase 2: Backend Integration (Future)

- 🔄 Connect to Node.js or .NET backend
- 🔄 Replace mock data service with real API calls
- 🔄 Database persistence (PostgreSQL/MongoDB)
- 🔄 File uploads (CV, photos, company logos)
- 🔄 Email notifications (SendGrid/Mailgun)
- 🔄 Real-time updates (WebSockets)
- 🔄 Advanced analytics with charts (Chart.js)
- 🔄 Payment processing for subscriptions (Stripe)

## 💡 Quick Start Guide

1. **Clone or pull the repository**
2. **Start a local web server** (see Installation section)
3. **Open in browser** at `http://localhost:8000` (or your server's port)
4. **Try demo login:**
  - Email: `student@avy.com` (or `admin@avy.com`, `company@avy.com`)
    - Password: Any password (Phase 1 demo mode)
5. **Explore the dashboard** based on your role!

## 🎓 Learning Resources

This project demonstrates:

- Modern vanilla JavaScript (ES6+)
- ES Modules and imports
- SPA routing without frameworks
- State management with localStorage
- JWT token handling
- Responsive design with Tailwind
- Clean code architecture
- MVC-like patterns in vanilla JS

## 🔧 Customization

### Adding New Pages

1. Create controller in `assets/js/controllers/`:

```javascript
export default async function myPageController() {
    const app = document.getElementById('app');
    app.innerHTML = `<div>My Page Content</div>`;
}
```

1. Register route in `assets/js/main.js`:

```javascript
import myPageController from './controllers/myPageController.js';
router.addRoute('/my-page', myPageController, true); // true = requires auth
```

### Adding New Services

Create a service file in `assets/js/services/`:

```javascript
import apiService from './apiService.js';

class MyService {
    async getData() {
        return await apiService.get('/my-endpoint');
    }
}

export default new MyService();
```

## 📝 Code Style

- Use ES6+ features (arrow functions, destructuring, template literals)
- Follow modular architecture (controllers, services, views)
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic
- Prefer `const` over `let`, avoid `var`

**Tooling:** The repo uses EditorConfig (indent, line endings), Prettier (formatting), and ESLint (basic lint). With the recommended VS Code extensions, saving a file will auto-format and apply safe fixes. Keep the project clean by committing only formatted, lint-clean code.

## 🐛 Troubleshooting

**Issue:** Page shows blank or modules don't load
**Solution:** Make sure you're using a web server (http://), not opening file:// directly

**Issue:** Router not working
**Solution:** Ensure all links use `data-link` attribute or navigate via `window.router.navigate()`

**Issue:** CORS errors in Phase 2
**Solution:** Configure backend CORS to allow your frontend origin

## 📄 License

Copyright © 2026 Avenga Academy

---

**Knowledge that matters** 🎓
Avy - Connecting Students with Opportunities
Phase 1: Frontend Only | Phase 2: Full Stack Integration

## 📚 Additional Documentation

- **[Boilerplate Implementation Summary](./docs/Boilerplate_Implementation_Summary.md)** - Complete technical details and architecture
- **[Quick Start Guide](./docs/Quick_Start_Guide.md)** - Getting started in 5 minutes with test accounts
- **[User Requirements](./docs/Avy_UR.md)** - Full platform specifications

### Branching & Git

- **[Branching strategy - The story](./docs/Branching%20strategy%20-%20The%20story.md)** - Why we branch and how we work
- **[Branching strategy - Resolving conflicts](./docs/Branching%20strategy%20-%20Resolving%20conflicts.md)** - How to resolve merge conflicts
- **[Branching strategy - Using Github Desktop](./docs/Branching%20strategy%20-%20Using%20Github%20Desktop.md)** - Using GitHub Desktop for branching

