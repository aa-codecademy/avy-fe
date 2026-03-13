# Avy Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended) OR any local server

### Installation
```bash
# 1. Clone the repository
git clone <repository-url>
cd avy-web

# 2. Navigate to the frontend directory
cd src/avy-fe

# 3. Open in browser
# Option A: Use Live Server in VS Code (right-click index.html > Open with Live Server)
# Option B: Open index.html directly in browser
```

**That's it! No build process, no npm install needed.**

---

## 🔑 Test Accounts

Login with these pre-configured users:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Student** | john.doe@example.com | password123 | Job browsing, applications, CV management |
| **Alumni** | jane.smith@example.com | password123 | Same as student |
| **Employer** | alice.johnson@techcorp.com | password123 | Post jobs, search candidates |
| **Admin** | admin@avy.com | password123 | User management, analytics |

---

## 🗺️ Feature Tour

### As a Student/Alumni (john.doe@example.com)
1. **Dashboard**: See personalized welcome and quick stats
2. **Job Board** (`/jobs`): Browse 6 mock jobs
   - Try filters: search, employment type, work mode, experience level
   - Try sorting: newest, highest salary
3. **Job Detail** (`/jobs/j1`): View full job details
   - Apply with cover letter and CV upload
4. **Companies** (`/companies`): Browse 4 companies
5. **Profile** (`/profile`): Manage your CV
   - Personal info, work experience, education, skills

### As an Employer (alice.johnson@techcorp.com)
1. **Dashboard**: See job posting stats
2. **Post Job** (`/employer/post-job`): Create new job posting
   - Fill in all required fields
   - Add required and nice-to-have skills
   - See subscription limit enforcement (TechCorp has 5 active jobs limit)
3. **Candidate Search** (`/employer/candidates`): Browse students/alumni
   - Filter by type, skills, visibility
   - View profiles, save candidates

### As an Admin (admin@avy.com)
1. **Dashboard**: Platform overview
2. **User Management** (`/admin/users`): See all 4 users
   - Filter by role
   - View/Edit/Delete actions
3. **Analytics** (`/admin/analytics`): See platform KPIs
   - Total users, jobs, applications, hired count
   - Top skills and companies
   - Monthly growth metrics

---

## 📁 Project Structure

```
src/avy-fe/
├── index.html                  # Entry point
├── assets/
│   ├── css/
│   │   └── style.css          # Custom styles
│   └── js/
│       ├── main.js            # App initialization
│       ├── router.js          # SPA routing
│       ├── models/
│       │   └── DataModels.js  # 10 data model classes
│       ├── services/
│       │   ├── authService.js     # Authentication
│       │   └── mockDataService.js # Mock API
│       └── controllers/
│           ├── landingController.js
│           ├── loginController.js
│           ├── dashboardController.js
│           ├── jobBoardController.js      # Bloom
│           ├── jobDetailController.js     # Bloom
│           ├── companiesController.js     # Bloom
│           ├── profileController.js       # Bloom
│           ├── postJobController.js       # Evergreen
│           ├── candidatesController.js    # Evergreen
│           ├── adminUsersController.js    # Meridian
│           ├── adminAnalyticsController.js # Meridian
│           └── notFoundController.js
```

---

## 🎯 Key Features to Try

### Bloom Module (Student/Alumni)
- ✅ Filter jobs by multiple criteria
- ✅ Apply to jobs with cover letter
- ✅ Search companies
- ✅ Update profile and CV

### Evergreen Module (Employer)
- ✅ Post new job with all details
- ✅ Search candidates by skills
- ✅ Subscription limit validation

### Meridian Module (Admin)
- ✅ Manage all users
- ✅ View platform analytics
- ✅ Role-based access control

---

## 🔧 Developer Tips

### Making Changes
1. **Edit Controllers**: Modify `assets/js/controllers/*.js` for page logic
2. **Add Routes**: Register new routes in `main.js` > `registerRoutes()`
3. **Update Models**: Add properties to classes in `DataModels.js`
4. **Add Mock Data**: Extend `mockDataService.js` with more data

### Debugging
```javascript
// Open browser console (F12)
// All services available globally:
console.log(window.authService.getCurrentUser());
console.log(await window.mockDataService.getAllJobs());
```

### Common Tasks

**Add a new page**:
1. Create `assets/js/controllers/myPageController.js`
2. Import in `main.js`: `import myPageController from './controllers/myPageController.js'`
3. Register route: `router.addRoute('/my-page', myPageController, true)`
4. Add link: `<a href="/my-page" data-link>My Page</a>`

**Add mock data**:
```javascript
// In mockDataService.js
generateMockJobs() {
  return [
    ...this.jobs,
    new Job({
      id: 'j7',
      title: 'New Position',
      // ... other fields
    })
  ];
}
```

**Protect a route by role**:
```javascript
// In main.js
router.addRoute('/my-page', myPageController, true, ['student', 'alumni']);
```

---

## 🐛 Troubleshooting

### Issue: Blank page or "Cannot find module" error
**Solution**: Make sure you're using a local server (Live Server), not opening `index.html` directly. ES6 modules require HTTP protocol.

### Issue: Login not working
**Solution**: Check browser console for errors. Make sure:
- Email and password match one of the test accounts
- localStorage is enabled in browser

### Issue: Page not loading after navigation
**Solution**: Check browser console. Likely causes:
- Typo in controller file name
- Controller not imported in `main.js`
- Route not registered

### Issue: Styles not applying
**Solution**: 
- Check internet connection (Tailwind CSS is loaded from CDN)
- Verify `style.css` is loaded in `index.html`
- Clear browser cache

---

## 📚 Documentation

- **Full Implementation**: `docs/Boilerplate_Implementation_Summary.md`
- **User Requirements**: `docs/Avy_UR.txt`
- **Architecture**: See "Architecture" section in Implementation Summary

---

## 🚦 What Works (Phase 1)

✅ **Fully Functional**:
- Login/Logout
- Job browsing with filters and search
- Job application submission
- Company directory
- CV/Profile management (UI)
- Job posting form
- Candidate search
- User management table
- Analytics dashboard
- Role-based access control

⚠️ **Mock/Placeholder**:
- File uploads (no actual file storage)
- Data persistence (resets on refresh)
- Email notifications
- Application status workflow
- Success stories carousel
- Events registration

---

## 🔮 Next Steps (Phase 2)

1. **Backend Development**:
   - Set up Node.js/Express API
   - Connect to PostgreSQL/MongoDB
   - Implement real authentication (JWT)

2. **Feature Enhancements**:
   - File upload functionality
   - Email notifications
   - Real-time updates
   - Payment integration
   - Advanced analytics with charts

3. **Testing**:
   - Unit tests (Jest)
   - E2E tests (Playwright)
   - Accessibility testing

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Inspect network requests, console logs, and localStorage
2. **Check Router Logs**: Navigate between pages and watch console for route matches
3. **Mock Data is Your Friend**: All data in `mockDataService.js` is easily editable
4. **Test All Roles**: Log in as different users to see different views
5. **Mobile Testing**: Use browser DevTools device emulation

---

## 🤝 Contributing

When adding new features:
1. Follow existing code patterns
2. Add JSDoc comments
3. Update this Quick Start Guide
4. Test with all 4 user roles
5. Ensure responsive design

---

## 📞 Support

For questions or issues:
1. Check browser console for errors
2. Review `Boilerplate_Implementation_Summary.md`
3. Verify test account credentials
4. Check that all files are in correct directory structure

---

## ✨ Enjoy Building!

The boilerplate is ready for you to extend and customize. All three modules (Bloom, Evergreen, Meridian) are implemented with real UI and mock data.

**Happy Coding! 🚀**
