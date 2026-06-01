# Student Directory — Admin Feature

## Overview

The Student Directory gives super admins a searchable, filterable view of all registered students on the platform. It lives under the **Meridian** (admin) module and is accessible only to users with the `admin` role.

**Routes:**
- `/admin/students` — directory listing
- `/admin/students/:id` — full student profile

**Nav link:** Students (graduation cap icon) in the admin header

---

## Files

| File | Purpose |
|---|---|
| `assets/js/controllers/meridian/adminStudentsController.js` | Directory controller — renders the listing and wires up search, filters, and card navigation |
| `assets/js/controllers/meridian/adminStudentDetailController.js` | Profile controller — renders the full student record at `/admin/students/:id` |
| `assets/js/services/mockDataService.js` | `getStudentsWithProfiles()` (directory) and `getUserById()` + `getCVProfile()` (detail) |
| `assets/js/views/appHeader.js` | Admin nav — includes the Students link |
| `assets/js/main.js` | Route registration for both `/admin/students` and `/admin/students/:id` |

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
- "View Profile →" affordance — clicking anywhere on the card navigates to the full profile

### Empty State
When no students match the active filters, a friendly empty state is shown with a prompt to adjust or clear filters.

---

## Student Profile View

Accessed by clicking any student card. The URL is `/admin/students/:id`. If the ID does not belong to a student, the router redirects to `/404`.

### Layout

Two-column grid (sidebar + main content):

**Left column**
| Card | Content |
|---|---|
| Profile hero | Avatar, name, email, current position, track badge, visibility badge, join date |
| Profile completeness | Percentage bar (green ≥ 80%, yellow ≥ 50%, red < 50%) with a list of missing fields |
| Contact & Personal | Phone, date of birth + age, citizenship, LinkedIn, portfolio |

**Right column**
| Card | Content |
|---|---|
| Academy Attendance | Academy name, track badge, active/completed status, date range — supports multiple entries |
| Education | Institution, degree + field of study, date range, grade |
| Work Experience | Position, company, date range, description — supports multiple entries |
| Skills | All skill chips with total count |
| Languages | Language name + CEFR level badge (A = gray, B = blue, C = green) |

### Profile Completeness

Computed from 11 checkpoints at render time — no separate API call:

| Checkpoint | Source |
|---|---|
| Phone number | `user.phone` |
| Date of birth | `user.dateOfBirth` |
| Citizenship | `user.citizenship` |
| LinkedIn profile | `user.linkedIn` |
| Portfolio link | `user.portfolio` |
| Current position | `user.currentPosition` |
| Work experience | `cvProfile.workExperience.length > 0` |
| Education | `cvProfile.education.length > 0` |
| Skills | `cvProfile.skills.length > 0` |
| Languages | `cvProfile.languages.length > 0` |
| Academy attendance | `cvProfile.academyAttendance.length > 0` |

### Data Fetching

```
getUserById(id)      →  base user record (name, email, contact fields, …)
getCVProfile(id)     →  full CV (work experience, education, skills, languages, academy)
```

Both calls run in parallel via `Promise.all`. The controller guards against non-student IDs (e.g. an admin or employer ID typed manually into the URL).

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

**Directory**
- Replace `mockDataService.getStudentsWithProfiles()` with `apiService.get('/admin/students?include=profile')`
- Add server-side pagination — update the results count label to reflect `page X of Y`
- Derive track filter options from `GET /api/academy/tracks` instead of the in-memory data

**Profile view**
- Replace the two parallel mock calls with `apiService.get('/admin/students/:id')` returning the full record in one response
- Profile completeness logic lives entirely in the controller and requires no backend changes
