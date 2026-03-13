# Software Requirements Specification — Avy

**Version:** 1.0 (approved)
**Prepared by:** Product and Project Academy, Avenga Academy
**Date:** 22.01.2026

---

## Table of Contents

1. [Introduction](#1-introduction)
  - 1.1 [Purpose](#11-purpose)
    - 1.2 [Document Conventions](#12-document-conventions)
    - 1.3 [Project Scope](#13-project-scope)
2. [Overall Description](#2-overall-description)
  - 2.1 [Product Perspective](#21-product-perspective)
    - 2.2 [Product Features](#22-product-features)
3. [Revision History](#revision-history)

---

## Revision History


| Name                        | Date       | Reason          | Version |
| --------------------------- | ---------- | --------------- | ------- |
| Product and Project Academy | 22.01.2026 | Initial version | 1.0     |


---

## 1. Introduction

### 1.1 Purpose

Avenga Academy will provide a new web platform to connect potential employees with relevant companies. The goal is to enrich the academy experience and strengthen Avenga’s competitive position. The site will be available exclusively to Alumni/Students and partner companies.

**Objectives:**

- Improve company image and differentiate from competitors
- Support a new academy experience that can increase partnerships
- Create a potential new revenue stream

### 1.2 Document Conventions

All data and visuals on the web page must follow the **Avenga brand book**.
*AP: Caci to provide the Avenga brand book.*

### 1.3 Project Scope

**In scope:**

- Design and development of a web-based platform
- User registration for students, alumni, and companies
- Job and internship posting functionality
- Company membership and payment system
- Candidate profiles with skills and certifications
- Analytics and reporting

**Out of scope:**

- General public job board
- Recruitment agency services
- Advanced AI matching (future phase)
- Mobile app

---

## 2. Overall Description

### 2.1 Product Perspective

New product (web page and platform) that extends the current academies and is communicated as part of the existing academy offer.

**Main components:**

- Landing page (by language)
- Domain and web hosting
- Form for user creation
- Form for user log in
- Authentication form
- Profile predefined form
- CV predefined form
- Announcement form
- Forgot password form
- Pop-up windows
- Notification option
- Building blocks for announcements
- Search bar and filters (by position, company, location, tenure, education, experience, rating, industry, engagement time [full/part/hybrid/project/remote/internship], expiry date)
- Homepage for logged-in individuals and companies
- List of companies
- FAQ

---

### 2.2 Product Features

#### Landing page

- **Headline:** Logo [Avy by Avenga Academy] and slogan [Knowledge that matters]
- **CTAs:** Separate call-to-action buttons for companies and individuals

**For individuals:**

- **CTA:** Sign up / Sign in & Forgot password
  - Clicking Sign in/up opens a pop-up: enter email; if user exists, show password field; if not, show Sign up button instead
  - Option for “Forgot password” below password field
  - “Show password” option on password input
- **Key benefits:** Direct connection with companies | Tailor-made job postings | Apply in 2 clicks
- **Social proof:** Testimonial or logos (if available)
- **FAQ:** Top 3 objections (in footer)

#### Login / Sign up page

**Left panel — Welcome:**

- “Welcome to Avy Academy”
- “Join a community of learners, builders, and employers shaping the future of work.”

**Login:** Email, Password, Forgot Password?, Login button

**Sign up:** Full Name, Email, Password, Role selector (Student | Alumni | Employer), Account button

#### Screen after login

- **Header:** Same as landing page; logo links to homepage
- **Menus (left to right):** Companies | News | My profile | Language
- **Search bar:** By keyword
- **Filters & Find your job:** Dropdowns — position, company, location, tenure, education, experience, rating, industry, engagement time [full/part/hybrid/project/remote/internship], expiry date, skill

**Job announcements (list):**

- Company logo | Job position | Location | Due date | full time / part time / internship | “New” sticker (lasts 3 days)

**Footer:** Contact | About us | Terms of use | Privacy policy | Social media links | Sister companies (Avenga Academy, Avenga open jobs)

---

#### Menus and navigation

**Top navigation (public):**

- **Home** — Mission, platform overview, latest highlights
- **Why Avy?** — Story, values, impact-driven programs
- **Community** — Student/alumni profiles, projects, collaborations
- **Hire Talent** — For employers: post jobs, browse candidates, connect with mentors
- **Opportunities** — Career days, internships, workshops, networking
- **Login / Sign up** — Role-specific dashboards
- **Success stories** — Alumni testimonials, employment stories

Navigation is **role-based**. After login, menu reflects role: student, alumni, employer, admin.

**Student / Alumni navigation:**


| Menu       | Content                              |
| ---------- | ------------------------------------ |
| Dashboard  | Overview, notifications, job matches |
| My Profile | CV, skills, portfolio, availability  |
| Companies  | Browse employers, follow companies   |
| Messages   | Chat with companies / academy        |
| Events     | Register for academy events          |
| Resources  | CV tips, interview prep, materials   |
| Settings   | Profile & privacy                    |


**Employer navigation:**


| Menu            | Content                            |
| --------------- | ---------------------------------- |
| Dashboard       | Applicants & posts overview        |
| Post a Job      | Create job/internship offer        |
| Candidates      | Search students & alumni by skills |
| Messages        | Contact candidates / academy       |
| Events          | Career events                      |
| Company Profile | Employer branding page             |
| Settings        | Account management                 |
| Resources       | CV tips, interview prep, materials |
| Career Hub      | Personalized job recommendations   |
| Mentorship      | Connect with alumni mentors        |


**Secondary navigation (e.g. inside Job board):**

- Filter by skill, company
- Internship / Full-time
- Saved jobs

**Top-right icons (always visible):**

- Notifications
- Messages
- Profile dropdown
- Language switch
- Help / Support

**Footer:** Privacy Policy | Terms | Contact | FAQ | Social media

**Sidebar — Employer role (vertical, dark, white icons + labels):**

- Dashboard — Overview, candidate matches, saved profiles
- My Jobs — Post jobs, manage listings
- Talent Search — Browse candidates, filter by skills
- Messages — Chat with candidates / academy
- Events — Register for academy events
- Resources — Hiring guides, interview tips, templates
- Settings — Company profile & preferences
- Analytics — Job post performance
- Shortlist — Save and compare candidates

**Sidebar — Admin role:**

- Dashboard — System overview, reports, analytics
- User Management — Students, alumni, employers
- Jobs Management — Approve posts, monitor listings
- Events Management — Create and oversee events
- Messages — Monitor communications
- Content — News, success stories, resources
- Resources — Upload and manage materials
- Reports — Employment statistics, engagement
- Settings — Platform configuration, privacy, permissions
- Audit Logs — System changes
- Role Management — Permissions
- Support Tickets — Academy-wide issues

**Universal top bar (all roles):**

- Activity feed — Real-time updates
- Bookmarks — Save jobs, candidates, events
- Integrations — LinkedIn, GitHub, external job boards (TBD)
- Feedback — Suggest improvements

---

#### CV form

**Path:** Profile → Biography (CV form)

- Page title: “CV form”; top-right: “Settings” (opens edit pop-up)

**Section 1:**

- Photo upload (optional)
- **Name and Surname** (required), bold
- Educational degree (required), smaller font
- Current work position (required)
- Phone number
- Email (required)
- Date of birth (required)
- Citizen (optional)
- LinkedIn profile link (optional)
- Portfolio link (optional)

**Section 2 — Add blocks:**

- - Add Work experience / volunteering (current experience shown to company)
- - Add Education (required)
- - Add Avenga Academy attendance (required)
- - Add Additional education / training
- - Add Key skills and knowledge (required)
- - Add Language knowledge (Level A1/A2, B1/B2, C1/C2)

**Privacy:**

- If profile is **private**, only fields marked  are visible to companies.
- Company can request full profile access; alumni approves.
- When applying to a job with a private profile, show pop-up: agree to show all fields to company or apply with CV document.

---

#### Job announcement (single job) page

- Top-left: “← Back” to search
- **Job title** (bold), left to right
- Job announcement date (below title)
- Job application due date (below announcement date)
- Top-right: Company logo
- “About the company” — Short description / location

**Content blocks:**

- About the job and required responsibilities (free text)
- Required qualifications (free text)
- Benefits (free text)
- **Easy apply** button — On success: email notification to company and alumni
- Upload CV / additional documents (optional)
- Contact form (responsible person, email, phone, company)
- Company location (address + Google Maps link)

**Company block (e.g. left):**

- Company name (click → company info)
- “All open jobs” button → list of this company’s open jobs

**Middle:**

- “How did you find the job?” — 5-point scale with emoji; store as KPI (Alumni only)

**Recommendations:**

- “Those jobs might interest you” — Suggested jobs from other companies (algorithm-based)

---

### 2.3 Company Profile (Avy Hiring Platform)

#### 2.3.1 MUST-HAVE

**1.1 Company identity**

- Company name, logo, industry/sector
- Location(s) (HQ + remote/hybrid)
- Short description (max character limit)
- Website link (clickable)

**1.2 Hiring contact & access**

- Primary hiring contact (name + role; can be hidden from candidates)
- Contact email (can be hidden)
- Roles: Admin (full access), Recruiter (jobs + candidates)

**1.3 Job posting**

- Create, edit, pause, close openings
- Job title; employment type (internship / junior / mid / senior / freelance)
- Location (onsite / remote / hybrid)
- Required skills (structured, selectable tags); optional nice-to-have skills
- Experience level, application deadline
- Salary range (optional but encouraged)

**1.4 Matching & shortlisting (company view)**

- Filter candidates (skills, availability, graduation year)
- Save / shortlist / reject candidates

**1.5 Candidate interaction**

- Send interview invitations (TBD)
- Internal notes on candidates
- Status: new / shortlisted / interviewed / hired

#### 2.3.2 SHOULD-HAVE

**2.1 Hiring analytics**

- Views per job, number of applications
- AI match vs actual hire comparison (TBD)

**2.2 Talent pipeline**

- View upcoming alumni cohorts
- Browse talent pool without posting a job

**2.3 Feedback loop**

- Feedback on hired candidates
- Rate skill relevance of academy programs
- Suggest missing skills
- Platform feedback

#### 2.3.3 NICE-TO-HAVE

**3.1 Talent engagement**

- Internship programs
- Company-hosted challenges / case studies
- Sponsored academy modules

**3.2 Commercial layer**

- Subscription plan management
- Invoices & billing
- Role posting limits
- 
- Premium visibility

**3.3 Matching (company view) — TBC**

- AI-ranked candidate list per job
- Match score (%) per candidate
- Match explanation (skills / experience / academy track)

---

### 2.4 Success Stories

- Carousel at the bottom of the page
- Each item: photo, name, employed @, academy, “Read more” button
- “Read more” → full alumni interview page

---

### 2.5 Admin Panel

*To be defined in cooperation with the development team.*

---

### 2.6 Monetization (company-based)

**Subscription model:**


| Plan     | Job postings | Visibility               | Other                  |
| -------- | ------------ | ------------------------ | ---------------------- |
| BASIC    | 5/month      | Limited, non-prioritized | —                      |
| ADVANCED | 30/3 months  | Improved [TBD]           | Non-prioritized        |
| PREMIUM  | 80/6 months  | High, prioritized        | Curated candidate list |


---

*Software Requirements Specification — Avy · Page 6*