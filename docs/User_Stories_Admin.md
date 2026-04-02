# Admin Panel — User Stories Backlog

_Source: User Stories Admin.pdf_

## Epic A1 — Dashboard & Overview

### A1-01 — Admin home dashboard

**As a** super admin I want to land on a dedicated admin dashboard immediately after logging in
**So that** I can see the state of the platform at a glance and act on the most urgent items

### A1-02 — Platform KPI metrics

**As a** super admin I want to see a row of key platform metrics at the top of my dashboard — total students, active job listings, pending approvals, and events this month
**So that** I can understand platform health without running a report

### A1-03 — Recent activity feed

**As a** super admin I want to see a chronological feed of recent platform activity — new student registrations, employer sign-ups, job postings, and event registrations
**So that** I am always aware of what is happening on the platform without checking each section individually

### A1-04 — Pending actions queue

**As a** super admin I want to see a consolidated list of items that require my action — profile approvals, employer verifications, and job post reviews
**So that** nothing falls through the cracks and I can process items efficiently from one place

### A1-05 — Quick navigation shortcuts

**As a** super admin I want quick-access shortcut tiles on the dashboard for the most common admin tasks — add student, add job, create event, add resource
**So that** I can jump to the most frequent workflows in one click

### A1-06 — Alerts and system notices

**As a** super admin I want to see system-level alerts on my dashboard — such as failed email sends, access request expirations, or unusual activity flags
**So that** I can address platform issues before they affect students or employers

## Epic A2 — Students & Profiles

### A2-01 — Student directory with search and filters

**As a** super admin I want a searchable, filterable directory of all registered students
**So that** I can find any student record quickly without scrolling through a full list

### A2-02 — View full student profile

**As a** super admin I want to open and view a student's full profile record from the directory
**So that** I can review their data, check completeness, and understand their platform activity

### A2-03 — Approve or reject a student profile submission

**As a** super admin I want to review and approve or reject student profile submissions that require admin sign-off
**So that** only verified, appropriate profiles are visible to employers

### A2-04 — Edit a student record

**As a** super admin I want to edit a student's profile record directly — including correcting fields, updating their programme assignment, or amending account details
**So that** I can resolve data issues without requiring the student to make the change themselves

### A2-05 — Suspend or deactivate a student account

**As a** super admin I want to suspend or permanently deactivate a student account
**So that** I can enforce platform policies and remove access when necessary

### A2-06 — Bulk import students via CSV

**As a** super admin I want to upload a CSV file to create multiple student accounts at once
**So that** I can onboard an entire cohort efficiently at the start of an academy programme

### A2-07 — Assign or change a student's academy programme

**As a** super admin I want to assign or change the academy programme associated with a student's account
**So that** their dashboard content, resource recommendations, and employer matching reflect the correct programme

### A2-08 — Export student data

**As a** super admin I want to export the student directory — in full or filtered — as a CSV or Excel file
**So that** I can use the data in external reporting, cohort analysis, or compliance documentation

### A2-09 — View profile privacy access log

**As a** super admin I want to view a log of all employer access requests and grants for a specific student's profile
**So that** I can support students with privacy queries and ensure access controls are functioning correctly

## Epic A3 — Jobs & Employers

### A3-01 — Employer directory with search and filters

**As a** super admin I want a searchable directory of all registered employer accounts
**So that** I can find, review, and manage any employer on the platform

### A3-02 — Approve or reject a new employer account

**As a** super admin I want to review and approve or reject employer account applications before they gain access to the platform
**So that** only legitimate, vetted companies can post jobs and access student profiles

### A3-03 — Manage all job listings

**As a** super admin I want to view and manage all job listings across all employers on the platform
**So that** I can ensure job content is appropriate, accurate, and up to date

### A3-04 — Approve or reject a job posting

**As a** super admin I want to approve or reject job postings submitted by employers before they go live on the platform
**So that** students only see quality, relevant, and appropriate job opportunities

### A3-05 — Feature a company on the student dashboard

**As a** super admin I want to mark a company as "featured" so it appears prominently in the student dashboard's companies section
**So that** I can promote partner employers and increase student engagement with key companies

### A3-06 — Suspend an employer account

**As a** super admin I want to suspend an employer account
**So that** I can enforce platform policies and immediately remove access when a company violates terms

### A3-07 — View application analytics per job listing

**As a** super admin I want to view application statistics for any job listing — total applicants, status breakdown, and Easy Apply vs full application split
**So that** I can monitor platform engagement and identify underperforming listings

### A3-08 — Review and manage employer profile access requests

**As a** super admin I want to view all outstanding and historical employer access requests for private student profiles across the platform
**So that** I can monitor compliance and intervene if access is being requested inappropriately

## Epic A4 — Events & Resources

### A4-01 — Create a new event

**As a** super admin I want to create a new event on the platform with all required details
**So that** students can discover and register for it from their dashboard

### A4-02 — Edit or cancel an existing event

**As a** super admin I want to edit the details of an upcoming event or cancel it entirely
**So that** I can keep event information accurate and manage changes in plans

### A4-03 — View event registrations

**As a** super admin I want to see a list of all students registered for a specific event
**So that** I can plan logistics, manage capacity, and track attendance

### A4-04 — Export event attendee list

**As a** super admin I want to export the registrations list for any event as a CSV or Excel file
**So that** I can use it for attendance tracking, reporting, or logistics planning

### A4-05 — Send a notification to event registrants

**As a** super admin I want to send a custom in-app and email notification to all students registered for a specific event
**So that** I can communicate reminders, last-minute changes, or post-event follow-ups

### A4-06 — Create a new resource

**As a** super admin I want to create a new career resource — such as a CV guide, interview prep article, or portfolio template — and publish it to the platform
**So that** students can access up-to-date support content from their dashboard

### A4-07 — Edit or archive a resource

**As a** super admin I want to edit an existing resource's content or details, or archive it when it is no longer relevant
**So that** the resource library stays accurate and up to date

### A4-08 — Assign a resource to a specific academy programme

**As a** super admin I want to assign a resource to one or more specific academy programmes, or make it available to all students
**So that** students see only content relevant to their training background

### A4-09 — View resource usage analytics

**As a** super admin I want to see engagement metrics for each resource — view count, unique student count, and programme breakdown
**So that** I can understand which resources are most useful and prioritise content improvements

## Epic A5 — Platform Settings & Permissions

### A5-01 — Manage admin accounts

**As a** super admin I want to create, edit, and deactivate other admin accounts
**So that** I can control who has administrative access to the platform

### A5-02 — Role and permission configuration

**As a** super admin I want to view and configure what actions each admin role is permitted to perform
**So that** I can maintain the principle of least privilege as the platform evolves and new roles are added

### A5-03 — Manage in-app notification templates

**As a** super admin I want to view and edit the templates used for system-generated in-app notifications — such as profile approved, interview invitation received, and event reminder
**So that** notification copy stays accurate, on-brand, and up to date

### A5-04 — Manage email templates

**As a** super admin I want to view and edit the templates used for system-generated emails — such as welcome emails, approval notifications, and event confirmations
**So that** all outbound emails from the platform are accurate and consistently branded

### A5-05 — Configure platform privacy policy settings

**As a** super admin I want to configure platform-level privacy settings — such as the default profile visibility for new students, employer access request expiry period, and consent log retention period
**So that** the platform operates in line with data protection requirements

### A5-06 — Configure platform language and localisation settings

**As a** super admin I want to manage which languages are available on the platform and set the default language for new accounts
**So that** the platform serves its intended user base across different language regions

### A5-07 — View the platform audit log

**As a** super admin I want to view a full, tamper-proof audit log of all significant actions taken on the platform — by admins, students, and employers
**So that** I can investigate issues, demonstrate compliance, and maintain platform integrity

### A5-08 — Data export and compliance tools

**As a** super admin I want to generate a full data export for any individual student or employer account on request
**So that** I can fulfil data subject access requests (DSARs) and comply with data protection regulations

## Epic A6 — Analytics & Reporting

### A6-01 — Platform overview analytics

**As a** super admin I want a dedicated analytics page showing platform-wide KPIs with trend data over time — including total students, active job listings, total applications, and events held
**So that** I can understand platform growth and health beyond the snapshot on my dashboard

### A6-02 — Student engagement metrics

**As a** super admin I want to view detailed student engagement analytics — including profile completion rates, average login frequency, and dashboard interaction patterns
**So that** I can identify disengaged cohorts and make informed decisions about outreach or platform improvements

### A6-03 — Job and application funnel analytics

**As a** super admin I want to see a conversion funnel showing how students move from viewing a job to saving it, applying, and reaching an outcome
**So that** I can identify where drop-off happens and work with employers to improve listing quality and student outcomes

### A6-04 — Employer performance metrics

**As a** super admin I want to view performance metrics per employer — including how many jobs they have posted, their application response rate, average time to update application statuses, and how many profile access requests they have made
**So that** I can identify unresponsive employers and take action to protect the student experience

### A6-05 — Event attendance analytics

**As a** super admin I want to view attendance analytics across all events — including registration counts, actual attendance rates, no-show rates, and a breakdown by student programme
**So that** I can evaluate event effectiveness and plan future events more accurately

### A6-06 — Recommendation algorithm performance

**As a** super admin I want to monitor the performance of the job recommendation algorithm — including click-through rate, apply rate, and match quality indicators
**So that** I can assess whether the algorithm is delivering relevant results and flag issues for the development team

### A6-07 — Custom report builder and scheduled exports

**As a** super admin I want to build custom reports by selecting metrics, filters, and dimensions from any data domain on the platform, and schedule them to be delivered automatically by email
**So that** I can produce tailored reports for stakeholders without needing developer support
