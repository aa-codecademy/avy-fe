# Student Directory — Admin Feature

## Overview

The Student Directory gives super admins a searchable, filterable view of all registered students on the platform. It lives under the **Meridian** (admin) module and is accessible only to users with the `admin` role.

**Route:** `/admin/students`  
**Nav link:** Students (graduation cap icon) in the admin header

---

## Files

| File | Purpose |
|---|---|
| `assets/js/controllers/meridian/adminStudentsController.js` | Page controller — renders the directory and wires up all interactions |
| `assets/js/services/mockDataService.js` | Provides `getStudentsWithProfiles()` — joins student users with their CV profiles |
| `assets/js/views/appHeader.js` | Admin nav — includes the Students link |
| `assets/js/main.js` | Route registration (`/admin/students`) |

---

## Features

### Search
- Live search with a 250 ms debounce (no button press needed)
- Matches against: **name**, **email**, **skills**, **academy track**, **education degree**

### Filters
| Filter | Options |
|---|---|
| Academy Track | All / Frontend Development / Backend Development / QA Engineering / Data Analytics / UX/UI Design |
| Profile Visibility | All / Public / Private |
| Sort By | Name A–Z / Newest First / Oldest First |

All filters combine — e.g. "Backend track + Public profiles, sorted by newest".  
The **Clear Filters** button resets everything at once.

### Student Cards
Each card shows:
- Avatar, full name, email
- Academy track badge (color-coded per track)
- Profile visibility badge (Public / Private)
- Education degree and field of study
- Top 5 skill chips ("+N more" if there are additional skills)
- Join date

### Empty State
When no students match the active filters, a friendly empty state is shown with a prompt to adjust or clear filters.

---

## Data Layer

`getStudentsWithProfiles()` in `MockDataService` joins two data sources at call time:

```
users (role === 'student')  +  cvProfiles (matched by userId)
        ↓
enriched student object:
  - all User fields
  - skills            ← from CVProfile
  - academyTrack      ← from CVProfile.academyAttendance[0].track
  - academyStatus     ← from CVProfile.academyAttendance[0].status
  - educationLabel    ← from CVProfile.education[0] (degree + field)
```

In Phase 2, replace `getStudentsWithProfiles()` with a single API call to `GET /api/admin/students?include=profile` and the controller requires no other changes.

---

## Phase 1 Mock Students

Six students are seeded in `mockDataService.js` to make the directory functional during development:

| Name | Track | Visibility |
|---|---|---|
| John Doe | Frontend Development | Public |
| Emily Davis | Backend Development | Public |
| James Carter | QA Engineering | Public |
| Sophia Miller | Frontend Development | Private |
| Ryan Brooks | Data Analytics | Public |
| Olivia Chen | UX/UI Design | Public |

---

## How to Access

1. Open the app in a browser (via Live Server or any static file server)
2. Log in with `admin@avy.com` (any password)
3. Click **Students** in the top navigation, or navigate to `/admin/students`

---

## Phase 2 Migration Notes

- Replace `mockDataService.getStudentsWithProfiles()` with `apiService.get('/admin/students?include=profile')`
- Add server-side pagination — update the results count label to reflect `page X of Y`
- The track filter options are currently derived from actual data; in Phase 2 fetch them from `GET /api/academy/tracks`
- "View Profile" action on each card can link to `/admin/students/:id` once a student detail page exists
