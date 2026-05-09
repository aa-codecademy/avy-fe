/**
 * Mock Data Service
 * Provides hardcoded data for Phase 1 development
 * Will be replaced with real API calls in Phase 2
 */

import {
    AcademyAttendance,
    Analytics,
    Application,
    Company,
    CVProfile,
    Education,
    Event,
    Job,
    Language,
    Message,
    Notification,
    SuccessStory,
    User,
    WorkExperience,
} from '../models/DataModels.js';

class MockDataService {
    constructor() {
        this.initializeMockData();
    }

    /**
     * Initialize all mock data
     */
    initializeMockData() {
        this.users = this.generateMockUsers();
        this.companies = this.generateMockCompanies();
        this.jobs = this.generateMockJobs();
        this.applications = this.generateMockApplications();
        this.cvProfiles = this.generateMockCVProfiles();
        this.successStories = this.generateMockSuccessStories();
        this.events = this.generateMockEvents();
        this.messages = this.generateMockMessages();
        this.notifications = this.generateMockNotifications();
        this.analytics = this.generateMockAnalytics();
        this.permissionCatalog = this.generatePermissionCatalog();
        this.adminRoles = this.generateAdminRoles();
        this.notificationTemplates = this.generateNotificationTemplates();
        this.emailTemplates = this.generateEmailTemplates();
        this.platformSettings = this.generatePlatformSettings();
        this.auditLog = this.generateAuditLog();
        this.complianceExports = [];
    }

    /**
     * USERS
     */
    generateMockUsers() {
        return [
            new User({
                id: '1',
                email: 'john.doe@example.com',
                name: 'John Doe',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff',
                phone: '+389 70 123 456',
                dateOfBirth: '2000-05-15',
                citizenship: 'Macedonia',
                linkedIn: 'https://linkedin.com/in/johndoe',
                portfolio: 'https://johndoe.dev',
                educationDegree: 'Bachelor in Computer Science',
                currentPosition: 'Frontend Developer Intern',
            }),
            new User({
                id: '2',
                email: 'jane.smith@example.com',
                name: 'Jane Smith',
                role: 'alumni',
                avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=764ba2&color=fff',
                phone: '+389 70 234 567',
                educationDegree: 'Master in Software Engineering',
                currentPosition: 'Senior Full Stack Developer',
            }),
            new User({
                id: '3',
                email: 'alice.johnson@techcorp.com',
                name: 'Alice Johnson',
                role: 'employer',
                companyId: 'c1', // TechCorp
                avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=48bb78&color=fff',
                currentPosition: 'Senior Recruiter at TechCorp',
            }),
            new User({
                id: '4',
                email: 'admin@avy.com',
                name: 'Admin User',
                role: 'admin',
                adminRoleId: 'super_admin',
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ed8936&color=fff',
                currentPosition: 'Super Admin',
                lastLoginAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            }),
            new User({
                id: '5',
                email: 'maria.ops@avy.com',
                name: 'Maria Petrova',
                role: 'admin',
                adminRoleId: 'operations_admin',
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=Maria+Petrova&background=0257b4&color=fff',
                currentPosition: 'Operations Admin',
                lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            }),
            new User({
                id: '6',
                email: 'david.compliance@avy.com',
                name: 'David Nikolov',
                role: 'admin',
                adminRoleId: 'compliance_admin',
                status: 'invited',
                avatar: 'https://ui-avatars.com/api/?name=David+Nikolov&background=1f2937&color=fff',
                currentPosition: 'Compliance Admin',
            }),
        ];
    }

    async getAllUsers() {
        await this.simulateDelay();
        return this.users;
    }

    async getUserById(id) {
        await this.simulateDelay();
        return this.users.find((u) => u.id === id);
    }

    async getUsersByRole(role) {
        await this.simulateDelay();
        return this.users.filter((u) => u.role === role);
    }

    async getAdminAccounts() {
        await this.simulateDelay();
        return this.users
            .filter((user) => user.role === 'admin')
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    async createAdminAccount(adminData) {
        await this.simulateDelay();
        const timestamp = new Date().toISOString();
        const newAdmin = new User({
            id: this.generateId('admin'),
            email: adminData.email,
            name: adminData.name,
            role: 'admin',
            adminRoleId: adminData.adminRoleId || 'operations_admin',
            status: adminData.status || 'invited',
            phone: adminData.phone || '',
            currentPosition: adminData.currentPosition || 'Platform Administrator',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(adminData.name)}&background=ed8936&color=fff`,
            createdAt: timestamp,
            updatedAt: timestamp,
        });

        this.users.push(newAdmin);
        this.analytics.totalUsers += 1;
        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action: 'Created admin account',
            area: 'Access',
            targetName: newAdmin.name,
            severity: 'info',
            summary: `${newAdmin.email} invited as ${newAdmin.adminRoleId}`,
        });

        return newAdmin;
    }

    async updateAdminAccount(id, updates) {
        await this.simulateDelay();
        const admin = this.users.find((user) => user.id === id && user.role === 'admin');
        if (!admin) {
            return null;
        }

        const previousStatus = admin.status;
        Object.assign(admin, updates, { updatedAt: new Date().toISOString() });

        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action:
                previousStatus !== admin.status ? 'Updated admin status' : 'Updated admin account',
            area: 'Access',
            targetName: admin.name,
            severity: admin.status === 'deactivated' ? 'warning' : 'info',
            summary: `Role: ${admin.adminRoleId} | Status: ${admin.status}`,
        });

        return admin;
    }

    async deactivateAdminAccount(id) {
        await this.simulateDelay();
        return this.updateAdminAccount(id, { status: 'deactivated', lastLoginAt: '' });
    }

    async reactivateAdminAccount(id) {
        await this.simulateDelay();
        return this.updateAdminAccount(id, { status: 'active' });
    }

    /**
     * COMPANIES
     */
    generateMockCompanies() {
        return [
            new Company({
                id: 'c1',
                name: 'TechCorp Solutions',
                logo: 'https://ui-avatars.com/api/?name=TechCorp&background=667eea&color=fff&size=128',
                industry: 'Software Development',
                description:
                    'Leading software development company specializing in enterprise solutions.',
                website: 'https://techcorp.example.com',
                locations: ['Skopje', 'Belgrade', 'Remote'],
                size: '201-500',
                contactEmail: 'hr@techcorp.example.com',
                contactPerson: 'Alice Johnson',
                subscriptionPlan: 'premium',
                jobPostingLimit: 80,
                jobPostingsUsed: 12,
            }),
            new Company({
                id: 'c2',
                name: 'InnoSoft',
                logo: 'https://ui-avatars.com/api/?name=InnoSoft&background=764ba2&color=fff&size=128',
                industry: 'Fintech',
                description: 'Innovative fintech startup building the future of payments.',
                website: 'https://innosoft.example.com',
                locations: ['Skopje', 'Hybrid'],
                size: '51-200',
                subscriptionPlan: 'advanced',
                jobPostingLimit: 30,
                jobPostingsUsed: 8,
            }),
            new Company({
                id: 'c3',
                name: 'DataWorks Analytics',
                logo: 'https://ui-avatars.com/api/?name=DataWorks&background=48bb78&color=fff&size=128',
                industry: 'Data Analytics',
                description:
                    'Data analytics company helping businesses make data-driven decisions.',
                website: 'https://dataworks.example.com',
                locations: ['Remote'],
                size: '11-50',
                subscriptionPlan: 'basic',
                jobPostingLimit: 5,
                jobPostingsUsed: 3,
            }),
            new Company({
                id: 'c4',
                name: 'CloudTech Systems',
                logo: 'https://ui-avatars.com/api/?name=CloudTech&background=4299e1&color=fff&size=128',
                industry: 'Cloud Computing',
                description: 'Cloud infrastructure and DevOps solutions provider.',
                website: 'https://cloudtech.example.com',
                locations: ['Skopje', 'Remote'],
                size: '101-200',
                subscriptionPlan: 'advanced',
                jobPostingLimit: 30,
                jobPostingsUsed: 15,
            }),
        ];
    }

    async getAllCompanies() {
        await this.simulateDelay();
        return this.companies;
    }

    async getCompanyById(id) {
        await this.simulateDelay();
        return this.companies.find((c) => c.id === id);
    }

    /**
     * JOBS
     */
    generateMockJobs() {
        const now = new Date();
        const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        return [
            new Job({
                id: 'j1',
                companyId: 'c1',
                title: 'Frontend Developer',
                description: 'We are looking for a talented Frontend Developer to join our team.',
                responsibilities:
                    'Develop responsive web applications using modern frameworks, collaborate with designers and backend developers, write clean and maintainable code.',
                qualifications:
                    'Proficiency in HTML, CSS, JavaScript, React or Vue.js, experience with responsive design.',
                benefits:
                    'Competitive salary, health insurance, remote work options, professional development budget.',
                employmentType: 'full-time',
                location: 'Skopje',
                workMode: 'hybrid',
                experienceLevel: 'junior',
                requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
                niceToHaveSkills: ['TypeScript', 'Tailwind CSS', 'Git'],
                salaryRange: { min: 800, max: 1200, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 142,
                applications: 8,
                isPriority: true,
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Job({
                id: 'j2',
                companyId: 'c2',
                title: 'Backend Developer',
                description: 'Join our fintech team as a Backend Developer.',
                responsibilities:
                    'Design and implement RESTful APIs, work with databases, ensure application security and performance.',
                qualifications:
                    'Strong knowledge of Node.js or .NET, database experience (PostgreSQL/MySQL), API design.',
                benefits:
                    'Great team culture, flexible hours, learning opportunities, modern tech stack.',
                employmentType: 'full-time',
                location: 'Skopje',
                workMode: 'hybrid',
                experienceLevel: 'mid',
                requiredSkills: ['Node.js', 'PostgreSQL', 'REST API', 'Git'],
                niceToHaveSkills: ['Docker', 'AWS', 'Microservices'],
                salaryRange: { min: 1200, max: 1800, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 98,
                applications: 12,
            }),
            new Job({
                id: 'j3',
                companyId: 'c3',
                title: 'Data Analyst Intern',
                description: 'Internship opportunity for aspiring data analysts.',
                responsibilities:
                    'Analyze datasets, create visualizations, assist in reporting, learn data analytics tools.',
                qualifications:
                    'Basic knowledge of SQL, Excel, interest in data analysis, willingness to learn.',
                benefits:
                    'Mentorship program, hands-on experience, possibility of full-time employment.',
                employmentType: 'internship',
                location: 'Remote',
                workMode: 'remote',
                experienceLevel: 'intern',
                requiredSkills: ['SQL', 'Excel', 'Data Analysis'],
                niceToHaveSkills: ['Python', 'Power BI', 'Statistics'],
                salaryRange: { min: 300, max: 500, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 215,
                applications: 25,
            }),
            new Job({
                id: 'j4',
                companyId: 'c4',
                title: 'DevOps Engineer',
                description: 'Looking for a DevOps Engineer to manage our cloud infrastructure.',
                responsibilities:
                    'Manage AWS/Azure infrastructure, implement CI/CD pipelines, monitor system performance, ensure security.',
                qualifications:
                    'Experience with cloud platforms (AWS/Azure), Docker, Kubernetes, CI/CD tools.',
                benefits:
                    'Top-tier salary, certifications paid, remote work, cutting-edge technology.',
                employmentType: 'full-time',
                location: 'Remote',
                workMode: 'remote',
                experienceLevel: 'senior',
                requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                niceToHaveSkills: ['Terraform', 'Ansible', 'Python'],
                salaryRange: { min: 2000, max: 3000, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 178,
                applications: 15,
                isPriority: true,
            }),
            new Job({
                id: 'j5',
                companyId: 'c1',
                title: 'Full Stack Developer',
                description: 'Full Stack Developer needed for our enterprise projects.',
                responsibilities:
                    'Develop both frontend and backend features, work on full project lifecycle, mentor junior developers.',
                qualifications:
                    'Proficiency in React and Node.js, database knowledge, API design experience.',
                benefits: 'Competitive salary, project bonuses, career growth, modern office.',
                employmentType: 'full-time',
                location: 'Skopje',
                workMode: 'onsite',
                experienceLevel: 'mid',
                requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST API'],
                niceToHaveSkills: ['GraphQL', 'TypeScript', 'Docker'],
                salaryRange: { min: 1400, max: 2000, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 95,
                applications: 10,
            }),
            new Job({
                id: 'j6',
                companyId: 'c2',
                title: 'QA Engineer',
                description: 'Quality Assurance Engineer for fintech applications.',
                responsibilities:
                    'Create test plans, perform manual and automated testing, report bugs, ensure quality standards.',
                qualifications:
                    'Experience with testing methodologies, automation tools (Selenium/Cypress), attention to detail.',
                benefits: 'Flexible schedule, remote-first culture, training budget.',
                employmentType: 'freelance',
                location: 'Skopje',
                workMode: 'remote',
                experienceLevel: 'junior',
                requiredSkills: ['Manual Testing', 'Test Cases', 'Bug Tracking'],
                niceToHaveSkills: ['Selenium', 'Cypress', 'API Testing'],
                salaryRange: { min: 900, max: 1300, currency: 'EUR' },
                applicationDeadline: futureDate.toISOString(),
                status: 'active',
                views: 67,
                applications: 7,
            }),
        ];
    }

    async getAllJobs(filters = {}) {
        await this.simulateDelay();
        let jobs = [...this.jobs];

        // Apply filters
        if (filters.status) {
            jobs = jobs.filter((j) => j.status === filters.status);
        }
        if (filters.companyId) {
            jobs = jobs.filter((j) => j.companyId === filters.companyId);
        }
        if (filters.employmentType) {
            jobs = jobs.filter((j) => j.employmentType === filters.employmentType);
        }
        if (filters.workMode) {
            jobs = jobs.filter((j) => j.workMode === filters.workMode);
        }
        if (filters.experienceLevel) {
            jobs = jobs.filter((j) => j.experienceLevel === filters.experienceLevel);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase().trim();
            jobs = jobs.filter((j) => {
                const company = this.companies.find((c) => c.id === j.companyId);
                const companyName = (company?.name || '').toLowerCase();
                const industry = (company?.industry || '').toLowerCase();
                const skillMatch = [...j.requiredSkills, ...j.niceToHaveSkills].some((s) =>
                    s.toLowerCase().includes(search)
                );
                return (
                    j.title.toLowerCase().includes(search) ||
                    j.description.toLowerCase().includes(search) ||
                    (j.location && j.location.toLowerCase().includes(search)) ||
                    companyName.includes(search) ||
                    industry.includes(search) ||
                    skillMatch
                );
            });
        }
        if (filters.industry) {
            jobs = jobs.filter((j) => {
                const company = this.companies.find((c) => c.id === j.companyId);
                return company?.industry === filters.industry;
            });
        }
        if (filters.skills && filters.skills.length > 0) {
            const need = filters.skills.map((s) => s.toLowerCase().trim()).filter(Boolean);
            jobs = jobs.filter((j) =>
                need.some(
                    (skill) =>
                        j.requiredSkills.some(
                            (rs) =>
                                rs.toLowerCase() === skill ||
                                rs.toLowerCase().includes(skill) ||
                                skill.includes(rs.toLowerCase())
                        ) ||
                        j.niceToHaveSkills.some(
                            (ns) =>
                                ns.toLowerCase() === skill ||
                                ns.toLowerCase().includes(skill) ||
                                skill.includes(ns.toLowerCase())
                        )
                )
            );
        }

        return jobs;
    }

    async getJobById(id) {
        await this.simulateDelay();
        return this.jobs.find((j) => j.id === id);
    }

    async createJob(jobData) {
        await this.simulateDelay();
        const newJob = new Job({
            ...jobData,
            id: 'j' + (this.jobs.length + 1),
        });
        this.jobs.push(newJob);
        return newJob;
    }

    async updateJob(id, jobData) {
        await this.simulateDelay();
        const index = this.jobs.findIndex((j) => j.id === id);
        if (index !== -1) {
            this.jobs[index] = new Job({
                ...this.jobs[index],
                ...jobData,
                updatedAt: new Date().toISOString(),
            });
            return this.jobs[index];
        }
        return null;
    }

    async deleteJob(id) {
        await this.simulateDelay();
        const index = this.jobs.findIndex((j) => j.id === id);
        if (index !== -1) {
            this.jobs.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * APPLICATIONS
     */
    generateMockApplications() {
        return [
            new Application({
                id: 'a1',
                jobId: 'j1',
                userId: '1',
                status: 'under_review',
                coverLetter: 'I am very interested in this position...',
                appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Application({
                id: 'a2',
                jobId: 'j2',
                userId: '2',
                status: 'interview',
                coverLetter: 'With my experience in backend development...',
                appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Application({
                id: 'a3',
                jobId: 'j3',
                userId: '1',
                status: 'pending',
                coverLetter: 'Excited about the internship opportunity...',
                appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        ];
    }

    async getApplications(filters = {}) {
        await this.simulateDelay();
        let apps = [...this.applications];

        if (filters.userId) {
            apps = apps.filter((a) => a.userId === filters.userId);
        }
        if (filters.jobId) {
            apps = apps.filter((a) => a.jobId === filters.jobId);
        }
        if (filters.status) {
            apps = apps.filter((a) => a.status === filters.status);
        }

        return apps;
    }

    async createApplication(appData) {
        await this.simulateDelay();
        const newApp = new Application({
            ...appData,
            id: 'a' + (this.applications.length + 1),
        });
        this.applications.push(newApp);
        return newApp;
    }

    async updateApplicationStatus(id, status, notes = '') {
        await this.simulateDelay();
        const index = this.applications.findIndex((a) => a.id === id);
        if (index !== -1) {
            this.applications[index].status = status;
            if (notes) this.applications[index].notes = notes;
            this.applications[index].updatedAt = new Date().toISOString();
            return this.applications[index];
        }
        return null;
    }

    async getApplicationById(id) {
        await this.simulateDelay();
        return this.applications.find((a) => a.id === id);
    }

    async withdrawApplication(id) {
        await this.simulateDelay();
        const index = this.applications.findIndex((a) => a.id === id);
        if (index !== -1) {
            this.applications[index].status = 'withdrawn';
            this.applications[index].updatedAt = new Date().toISOString();
            return this.applications[index];
        }
        return null;
    }

    async getApplicationsByJobId(jobId) {
        await this.simulateDelay();
        const apps = this.applications.filter((a) => a.jobId === jobId);
        // Join applicant user info for the employer applicants view
        return apps.map((a) => ({
            ...a,
            applicant: this.users.find((u) => u.id === a.userId) || null,
        }));
    }

    /**
     * CV PROFILES
     */
    generateMockCVProfiles() {
        return [
            new CVProfile({
                userId: '1',
                workExperience: [
                    new WorkExperience({
                        id: 'we1',
                        company: 'StartupXYZ',
                        position: 'Frontend Developer Intern',
                        startDate: '2024-06-01',
                        endDate: '',
                        description:
                            'Building responsive web applications with React and Tailwind CSS.',
                    }),
                ],
                education: [
                    new Education({
                        id: 'ed1',
                        institution: 'University of Skopje',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Computer Science',
                        startDate: '2020-09-01',
                        endDate: '2024-06-30',
                        grade: '9.5/10',
                    }),
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa1',
                        academyName: 'Avenga Academy',
                        track: 'Frontend Development',
                        startDate: '2024-02-01',
                        endDate: '2024-05-31',
                        status: 'completed',
                    }),
                ],
                skills: [
                    'JavaScript',
                    'React',
                    'HTML5',
                    'CSS3',
                    'Tailwind CSS',
                    'Git',
                    'REST APIs',
                ],
                languages: [
                    new Language({ language: 'English', level: 'C1' }),
                    new Language({ language: 'Macedonian', level: 'C2' }),
                ],
            }),
        ];
    }

    async getCVProfile(userId) {
        await this.simulateDelay();
        return this.cvProfiles.find((cv) => cv.userId === userId) || new CVProfile({ userId });
    }

    async updateCVProfile(userId, cvData) {
        await this.simulateDelay();
        const index = this.cvProfiles.findIndex((cv) => cv.userId === userId);
        if (index !== -1) {
            this.cvProfiles[index] = new CVProfile({
                ...this.cvProfiles[index],
                ...cvData,
                updatedAt: new Date().toISOString(),
            });
            return this.cvProfiles[index];
        } else {
            const newCV = new CVProfile({ userId, ...cvData });
            this.cvProfiles.push(newCV);
            return newCV;
        }
    }

    /**
     * SUCCESS STORIES
     */
    generateMockSuccessStories() {
        return [
            new SuccessStory({
                id: 'ss1',
                userId: '2',
                userName: 'Jane Smith',
                userPhoto:
                    'https://ui-avatars.com/api/?name=Jane+Smith&background=764ba2&color=fff',
                company: 'TechCorp Solutions',
                position: 'Senior Full Stack Developer',
                academy: 'Avenga Academy - Full Stack Track',
                excerpt: 'From academy student to senior developer in just 2 years...',
                fullStory:
                    'My journey started at Avenga Academy where I learned modern web development. After graduating, I joined TechCorp as a junior developer and quickly advanced through the ranks...',
                publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        ];
    }

    async getSuccessStories() {
        await this.simulateDelay();
        return this.successStories;
    }

    /**
     * EVENTS
     */
    generateMockEvents() {
        const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

        return [
            new Event({
                id: 'e1',
                title: 'Career Day 2026',
                description: 'Meet top employers and explore career opportunities.',
                type: 'career-day',
                date: futureDate.toISOString().split('T')[0],
                time: '10:00',
                location: 'Avenga Academy - Skopje',
                isOnline: false,
                maxParticipants: 100,
                registeredCount: 45,
            }),
            new Event({
                id: 'e2',
                title: 'Web Development Workshop',
                description: 'Hands-on workshop on modern web development practices.',
                type: 'workshop',
                date: futureDate.toISOString().split('T')[0],
                time: '14:00',
                location: 'Online',
                isOnline: true,
                maxParticipants: 50,
                registeredCount: 32,
            }),
        ];
    }

    async getEvents() {
        await this.simulateDelay();
        return this.events;
    }

    async getEventById(id) {
        await this.simulateDelay();
        return this.events.find((e) => e.id === id);
    }

    async createEvent(eventData) {
        await this.simulateDelay();
        const newEvent = new Event({
            ...eventData,
            id: 'e' + (this.events.length + 1),
        });
        this.events.push(newEvent);
        return newEvent;
    }

    async updateEvent(id, eventData) {
        await this.simulateDelay();
        const index = this.events.findIndex((e) => e.id === id);
        if (index !== -1) {
            this.events[index] = new Event({ ...this.events[index], ...eventData });
            return this.events[index];
        }
        return null;
    }

    async deleteEvent(id) {
        await this.simulateDelay();
        const index = this.events.findIndex((e) => e.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
            return true;
        }
        return false;
    }

    async registerForEvent(eventId, userId) {
        await this.simulateDelay();
        const event = this.events.find((e) => e.id === eventId);
        if (!event) return null;
        if (event.maxParticipants && event.registeredCount >= event.maxParticipants) {
            return { success: false, reason: 'event_full', event };
        }
        event.registeredCount = (event.registeredCount || 0) + 1;
        return { success: true, event, userId };
    }

    /**
     * MESSAGES
     */
    generateMockMessages() {
        const now = Date.now();
        return [
            new Message({
                id: 'm1',
                threadId: 't1',
                fromUserId: '1',
                toUserId: '3',
                companyId: 'c1',
                jobId: 'j1',
                subject: 'Question about Frontend Developer role',
                body: 'Hi, I would like to know more about the tech stack used at TechCorp.',
                read: true,
                sentAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Message({
                id: 'm2',
                threadId: 't1',
                fromUserId: '3',
                toUserId: '1',
                companyId: 'c1',
                jobId: 'j1',
                subject: 'Re: Question about Frontend Developer role',
                body: 'Hi John, thanks for reaching out! We use React, TypeScript, and Tailwind CSS.',
                read: false,
                sentAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Message({
                id: 'm3',
                threadId: 't2',
                fromUserId: '3',
                toUserId: '2',
                companyId: 'c1',
                subject: 'Interview invitation',
                body: 'Hi Jane, we would like to invite you to an interview for the Senior position.',
                read: false,
                sentAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        ];
    }

    async getMessages(filters = {}) {
        await this.simulateDelay();
        let msgs = [...this.messages];
        if (filters.userId) {
            msgs = msgs.filter(
                (m) => m.fromUserId === filters.userId || m.toUserId === filters.userId
            );
        }
        if (filters.threadId) {
            msgs = msgs.filter((m) => m.threadId === filters.threadId);
        }
        if (filters.companyId) {
            msgs = msgs.filter((m) => m.companyId === filters.companyId);
        }
        return msgs.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    }

    async getMessageThreads(userId) {
        await this.simulateDelay();
        const userMsgs = this.messages.filter(
            (m) => m.fromUserId === userId || m.toUserId === userId
        );
        const threadMap = new Map();
        userMsgs.forEach((m) => {
            const existing = threadMap.get(m.threadId);
            if (!existing || new Date(m.sentAt) > new Date(existing.sentAt)) {
                threadMap.set(m.threadId, m);
            }
        });
        return Array.from(threadMap.values())
            .map((lastMsg) => ({
                threadId: lastMsg.threadId,
                companyId: lastMsg.companyId,
                jobId: lastMsg.jobId,
                lastMessage: lastMsg,
                unreadCount: userMsgs.filter(
                    (m) => m.threadId === lastMsg.threadId && m.toUserId === userId && !m.read
                ).length,
            }))
            .sort((a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt));
    }

    async sendMessage(messageData) {
        await this.simulateDelay();
        const newMessage = new Message({
            ...messageData,
            id: 'm' + (this.messages.length + 1),
            threadId: messageData.threadId || 't' + (this.messages.length + 1),
        });
        this.messages.push(newMessage);
        return newMessage;
    }

    async markMessageAsRead(id) {
        await this.simulateDelay();
        const msg = this.messages.find((m) => m.id === id);
        if (msg) {
            msg.read = true;
            return msg;
        }
        return null;
    }

    /**
     * NOTIFICATIONS
     */
    generateMockNotifications() {
        const now = Date.now();
        return [
            new Notification({
                id: 'n1',
                userId: '1',
                type: 'application_status',
                title: 'Application status updated',
                message: 'Your application for Frontend Developer at TechCorp is now Under Review.',
                link: '/applications',
                read: false,
                createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            }),
            new Notification({
                id: 'n2',
                userId: '1',
                type: 'message_received',
                title: 'New message',
                message: 'You have a new message from TechCorp Solutions.',
                link: '/messages',
                read: false,
                createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
            }),
            new Notification({
                id: 'n3',
                userId: '1',
                type: 'event_reminder',
                title: 'Career Day 2026 is coming up',
                message: "Don't forget to attend Career Day 2026 next week.",
                link: '/events',
                read: true,
                createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Notification({
                id: 'n4',
                userId: '1',
                type: 'application_submitted',
                title: 'Application submitted',
                message: 'Your application for Data Analyst Intern was successfully submitted.',
                link: '/applications',
                read: true,
                createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Notification({
                id: 'n5',
                userId: '3',
                type: 'system_alert',
                title: 'New applicant for Frontend Developer',
                message: 'John Doe has applied to your Frontend Developer posting.',
                link: '/employer/jobs',
                read: false,
                createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
            }),
        ];
    }

    async getNotifications(userId, options = {}) {
        await this.simulateDelay();
        let list = this.notifications.filter((n) => n.userId === userId);
        if (options.unreadOnly) {
            list = list.filter((n) => !n.read);
        }
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async getUnreadCount(userId) {
        await this.simulateDelay();
        return this.notifications.filter((n) => n.userId === userId && !n.read).length;
    }

    async createNotification(data) {
        await this.simulateDelay();
        const newNotification = new Notification({
            ...data,
            id: 'n' + (this.notifications.length + 1),
        });
        this.notifications.push(newNotification);
        return newNotification;
    }

    async markNotificationAsRead(id) {
        await this.simulateDelay();
        const n = this.notifications.find((n) => n.id === id);
        if (n) {
            n.read = true;
            return n;
        }
        return null;
    }

    async markAllAsRead(userId) {
        await this.simulateDelay();
        this.notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
        return true;
    }

    /**
     * ANALYTICS
     */
    generateMockAnalytics() {
        return new Analytics({
            totalUsers: 487,
            totalStudents: 245,
            totalAlumni: 150,
            totalCompanies: 92,
            totalJobs: 234,
            activeJobs: 156,
            totalApplications: 1247,
            hiredCount: 89,
            averageMatchScore: 78.5,
            topSkills: [
                { skill: 'JavaScript', count: 180 },
                { skill: 'React', count: 145 },
                { skill: 'Node.js', count: 98 },
                { skill: 'Python', count: 87 },
                { skill: 'SQL', count: 120 },
            ],
            topCompanies: [
                { company: 'TechCorp Solutions', jobCount: 28 },
                { company: 'InnoSoft', jobCount: 22 },
                { company: 'CloudTech Systems', jobCount: 19 },
            ],
            monthlyGrowth: { users: 12, jobs: 8, applications: 45 },
        });
    }

    async getAnalytics() {
        await this.simulateDelay();
        return this.analytics;
    }

    /**
     * PLATFORM SETTINGS & PERMISSIONS
     */
    generatePermissionCatalog() {
        return [
            { id: 'admins.manage', label: 'Manage admin accounts', group: 'Access' },
            { id: 'roles.configure', label: 'Configure roles and permissions', group: 'Access' },
            { id: 'users.view', label: 'View platform users', group: 'Users' },
            { id: 'jobs.review', label: 'Review jobs and employers', group: 'Content' },
            { id: 'events.manage', label: 'Manage events and resources', group: 'Content' },
            {
                id: 'templates.notifications',
                label: 'Edit in-app notification templates',
                group: 'Templates',
            },
            { id: 'templates.email', label: 'Edit email templates', group: 'Templates' },
            { id: 'privacy.configure', label: 'Configure privacy settings', group: 'Compliance' },
            {
                id: 'localisation.configure',
                label: 'Manage localisation settings',
                group: 'Compliance',
            },
            { id: 'audit.view', label: 'View platform audit log', group: 'Compliance' },
            { id: 'exports.generate', label: 'Generate compliance exports', group: 'Compliance' },
        ];
    }

    generateAdminRoles() {
        return [
            {
                id: 'super_admin',
                name: 'Super Admin',
                description: 'Full platform access including permissions and compliance actions.',
                permissions: this.permissionCatalog.map((permission) => permission.id),
            },
            {
                id: 'operations_admin',
                name: 'Operations Admin',
                description: 'Runs day-to-day admin workflows across users, jobs, and events.',
                permissions: [
                    'admins.manage',
                    'users.view',
                    'jobs.review',
                    'events.manage',
                    'templates.notifications',
                    'audit.view',
                ],
            },
            {
                id: 'compliance_admin',
                name: 'Compliance Admin',
                description: 'Owns audit visibility, privacy defaults, and export tooling.',
                permissions: [
                    'users.view',
                    'privacy.configure',
                    'localisation.configure',
                    'audit.view',
                    'exports.generate',
                    'templates.email',
                ],
            },
            {
                id: 'communications_admin',
                name: 'Communications Admin',
                description: 'Maintains system copy and outbound messaging templates.',
                permissions: ['events.manage', 'templates.notifications', 'templates.email'],
            },
        ];
    }

    async getPermissionCatalog() {
        await this.simulateDelay();
        return this.permissionCatalog;
    }

    async getAdminRoles() {
        await this.simulateDelay();
        return this.adminRoles.map((role) => ({
            ...role,
            memberCount: this.users.filter(
                (user) =>
                    user.role === 'admin' &&
                    user.adminRoleId === role.id &&
                    user.status !== 'deactivated'
            ).length,
        }));
    }

    async updateAdminRolePermissions(roleId, permissions) {
        await this.simulateDelay();
        const role = this.adminRoles.find((item) => item.id === roleId);
        if (!role) {
            return null;
        }

        role.permissions = [...permissions];
        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action: 'Updated role permissions',
            area: 'Access',
            targetName: role.name,
            severity: 'warning',
            summary: `${permissions.length} permissions assigned`,
        });

        return role;
    }

    generateNotificationTemplates() {
        return [
            {
                id: 'notif-profile-approved',
                key: 'profile_approved',
                name: 'Profile approved',
                audience: 'Students',
                trigger: 'Student profile approved by admin',
                title: 'Your profile is live',
                body: 'Your Avy profile has been approved and is now visible to employers on the platform.',
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Maria Petrova',
            },
            {
                id: 'notif-interview-invite',
                key: 'interview_invitation',
                name: 'Interview invitation',
                audience: 'Students',
                trigger: 'Employer moves candidate to interview stage',
                title: 'You have a new interview invite',
                body: 'A company invited you to interview. Open your applications to confirm the details.',
                updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Admin User',
            },
            {
                id: 'notif-event-reminder',
                key: 'event_reminder',
                name: 'Event reminder',
                audience: 'Students',
                trigger: '24 hours before an event starts',
                title: 'Your event starts tomorrow',
                body: 'Reminder: you are registered for an upcoming event. Check the event page for time and location.',
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Maria Petrova',
            },
        ];
    }

    generateEmailTemplates() {
        return [
            {
                id: 'email-welcome',
                key: 'welcome_email',
                name: 'Welcome email',
                audience: 'All new accounts',
                subject: 'Welcome to Avy by Avenga Academy',
                previewText:
                    'Start exploring jobs, events, and resources tailored to your journey.',
                body: 'Hi {{firstName}},\n\nWelcome to Avy. Your account is ready and you can now explore the platform.\n\nBest,\nThe Avy team',
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Admin User',
            },
            {
                id: 'email-approval',
                key: 'approval_notification',
                name: 'Approval notification',
                audience: 'Students and employers',
                subject: 'Your Avy account has been approved',
                previewText: 'Your account is now active and ready to use.',
                body: 'Hi {{firstName}},\n\nGood news. Your account has been approved and you can now access the Avy platform.\n\nBest,\nThe Avy team',
                updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Maria Petrova',
            },
            {
                id: 'email-event-confirmation',
                key: 'event_confirmation',
                name: 'Event confirmation',
                audience: 'Event registrants',
                subject: 'You are registered for {{eventName}}',
                previewText: 'Keep this email for your event details and reminders.',
                body: 'Hi {{firstName}},\n\nYou are confirmed for {{eventName}} on {{eventDate}}. We will send a reminder before it starts.\n\nBest,\nThe Avy team',
                updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                updatedBy: 'Admin User',
            },
        ];
    }

    async getNotificationTemplates() {
        await this.simulateDelay();
        return this.notificationTemplates;
    }

    async updateNotificationTemplate(id, updates) {
        await this.simulateDelay();
        const template = this.notificationTemplates.find((item) => item.id === id);
        if (!template) {
            return null;
        }

        Object.assign(template, updates, {
            updatedAt: new Date().toISOString(),
            updatedBy: 'Admin User',
        });
        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action: 'Updated in-app template',
            area: 'Templates',
            targetName: template.name,
            severity: 'info',
            summary: template.trigger,
        });
        return template;
    }

    async getEmailTemplates() {
        await this.simulateDelay();
        return this.emailTemplates;
    }

    async updateEmailTemplate(id, updates) {
        await this.simulateDelay();
        const template = this.emailTemplates.find((item) => item.id === id);
        if (!template) {
            return null;
        }

        Object.assign(template, updates, {
            updatedAt: new Date().toISOString(),
            updatedBy: 'Admin User',
        });
        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action: 'Updated email template',
            area: 'Templates',
            targetName: template.name,
            severity: 'info',
            summary: template.subject,
        });
        return template;
    }

    generatePlatformSettings() {
        return {
            privacy: {
                defaultProfileVisibility: 'private',
                employerAccessRequestExpiryDays: 7,
                consentLogRetentionDays: 365,
                dsarResponseWindowDays: 30,
            },
            localisation: {
                defaultLanguage: 'en',
                supportedLanguages: [
                    { code: 'en', name: 'English', enabled: true },
                    { code: 'mk', name: 'Macedonian', enabled: true },
                    { code: 'sq', name: 'Albanian', enabled: false },
                    { code: 'de', name: 'German', enabled: false },
                ],
                timezone: 'Europe/Skopje',
                dateFormat: 'DD/MM/YYYY',
            },
        };
    }

    async getPlatformSettings() {
        await this.simulateDelay();
        return this.platformSettings;
    }

    async updatePlatformSettings(updates) {
        await this.simulateDelay();
        this.platformSettings = {
            ...this.platformSettings,
            privacy: {
                ...this.platformSettings.privacy,
                ...(updates.privacy || {}),
            },
            localisation: {
                ...this.platformSettings.localisation,
                ...(updates.localisation || {}),
                supportedLanguages:
                    updates.localisation?.supportedLanguages ||
                    this.platformSettings.localisation.supportedLanguages,
            },
        };

        this.createAuditEntry({
            actorName: 'Admin User',
            actorRole: 'admin',
            action: 'Updated platform settings',
            area: 'Compliance',
            targetName: 'Platform settings',
            severity: 'warning',
            summary: 'Privacy and localisation preferences updated',
        });

        return this.platformSettings;
    }

    generateAuditLog() {
        const now = Date.now();
        return [
            {
                id: 'audit-1',
                timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
                actorName: 'Admin User',
                actorRole: 'admin',
                action: 'Approved employer account',
                area: 'Access',
                targetName: 'TechCorp Solutions',
                severity: 'info',
                summary: 'Employer application approved and access granted',
            },
            {
                id: 'audit-2',
                timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
                actorName: 'John Doe',
                actorRole: 'student',
                action: 'Updated profile visibility',
                area: 'Privacy',
                targetName: 'Student profile',
                severity: 'warning',
                summary: 'Visibility changed from public to private',
            },
            {
                id: 'audit-3',
                timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
                actorName: 'Alice Johnson',
                actorRole: 'employer',
                action: 'Requested private profile access',
                area: 'Compliance',
                targetName: 'John Doe',
                severity: 'warning',
                summary: 'Employer requested access to a private student profile',
            },
            {
                id: 'audit-4',
                timestamp: new Date(now - 28 * 60 * 60 * 1000).toISOString(),
                actorName: 'Maria Petrova',
                actorRole: 'admin',
                action: 'Updated notification template',
                area: 'Templates',
                targetName: 'Interview invitation',
                severity: 'info',
                summary: 'Adjusted copy to match new brand voice',
            },
        ];
    }

    createAuditEntry(entry) {
        const record = {
            id: this.generateId('audit'),
            timestamp: new Date().toISOString(),
            ...entry,
        };
        this.auditLog.unshift(record);
        return record;
    }

    async getAuditLog(filters = {}) {
        await this.simulateDelay();
        const query = (filters.query || '').trim().toLowerCase();
        return this.auditLog.filter((entry) => {
            const matchesQuery =
                !query ||
                [entry.actorName, entry.action, entry.targetName, entry.summary]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(query));
            const matchesActorRole = !filters.actorRole || entry.actorRole === filters.actorRole;
            const matchesArea = !filters.area || entry.area === filters.area;
            const matchesSeverity = !filters.severity || entry.severity === filters.severity;

            return matchesQuery && matchesActorRole && matchesArea && matchesSeverity;
        });
    }

    async getComplianceExports() {
        await this.simulateDelay();
        return this.complianceExports;
    }

    async generateComplianceExport(request) {
        await this.simulateDelay();
        const domains = request.domains?.length
            ? request.domains
            : ['account', 'activity', 'communications'];
        const payload =
            request.accountType === 'employer'
                ? this.buildEmployerExportPayload(request.accountId, domains)
                : this.buildStudentExportPayload(request.accountId, domains);

        if (!payload) {
            throw new Error('Unable to generate export for the selected account.');
        }

        const content =
            request.format === 'csv'
                ? this.buildComplianceExportCsv(payload)
                : JSON.stringify(payload, null, 2);
        const exportRecord = {
            id: this.generateId('export'),
            accountType: request.accountType,
            accountId: request.accountId,
            requestedAt: new Date().toISOString(),
            requestedBy: request.requestedBy || 'Admin User',
            fileName: `avy-${request.accountType}-${request.accountId}.${request.format === 'csv' ? 'csv' : 'json'}`,
            format: request.format === 'csv' ? 'csv' : 'json',
            domains,
            sizeLabel: `${Math.max(1, Math.ceil(content.length / 1024))} KB`,
        };

        this.complianceExports.unshift(exportRecord);
        this.createAuditEntry({
            actorName: exportRecord.requestedBy,
            actorRole: 'admin',
            action: 'Generated compliance export',
            area: 'Compliance',
            targetName: payload.account.name,
            severity: 'warning',
            summary: `${exportRecord.format.toUpperCase()} export with ${domains.join(', ')}`,
        });

        return {
            ...exportRecord,
            content,
            mimeType:
                exportRecord.format === 'csv'
                    ? 'text/csv;charset=utf-8'
                    : 'application/json;charset=utf-8',
        };
    }

    buildStudentExportPayload(accountId, domains) {
        const account = this.users.find(
            (user) => user.id === accountId && (user.role === 'student' || user.role === 'alumni')
        );
        if (!account) {
            return null;
        }

        const payload = {
            account,
            generatedAt: new Date().toISOString(),
            domains,
        };

        if (domains.includes('account')) {
            payload.profile =
                this.cvProfiles.find((profile) => profile.userId === accountId) || null;
        }
        if (domains.includes('activity')) {
            payload.applications = this.applications.filter(
                (application) => application.userId === accountId
            );
            payload.auditTrail = this.auditLog.filter(
                (entry) => entry.actorName === account.name || entry.targetName === account.name
            );
        }
        if (domains.includes('communications')) {
            payload.notifications = this.notifications.filter(
                (notification) => notification.userId === accountId
            );
            payload.messages = this.messages.filter(
                (message) => message.fromUserId === accountId || message.toUserId === accountId
            );
        }

        return payload;
    }

    buildEmployerExportPayload(accountId, domains) {
        const account = this.users.find(
            (user) => user.id === accountId && user.role === 'employer'
        );
        if (!account) {
            return null;
        }

        const company = this.companies.find((item) => item.id === account.companyId) || null;
        const companyJobs = this.jobs.filter((job) => job.companyId === account.companyId);
        const jobIds = new Set(companyJobs.map((job) => job.id));

        const payload = {
            account,
            company,
            generatedAt: new Date().toISOString(),
            domains,
        };

        if (domains.includes('account')) {
            payload.jobs = companyJobs;
        }
        if (domains.includes('activity')) {
            payload.applications = this.applications.filter((application) =>
                jobIds.has(application.jobId)
            );
            payload.auditTrail = this.auditLog.filter(
                (entry) => entry.actorName === account.name || entry.targetName === company?.name
            );
        }
        if (domains.includes('communications')) {
            payload.notifications = this.notifications.filter(
                (notification) => notification.userId === accountId
            );
            payload.messages = this.messages.filter(
                (message) =>
                    message.fromUserId === accountId ||
                    message.toUserId === accountId ||
                    message.companyId === account.companyId
            );
        }

        return payload;
    }

    buildComplianceExportCsv(payload) {
        const rows = [['Section', 'Record ID', 'Summary', 'Data']];
        for (const [section, value] of Object.entries(payload)) {
            if (section === 'generatedAt' || section === 'domains') {
                continue;
            }

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    rows.push([section, '', 'No records', '']);
                    continue;
                }

                value.forEach((item) => {
                    rows.push([
                        section,
                        item.id || '',
                        item.name || item.title || item.subject || item.action || 'Record',
                        JSON.stringify(item),
                    ]);
                });
                continue;
            }

            rows.push([
                section,
                value?.id || '',
                value?.name || value?.title || 'Record',
                JSON.stringify(value),
            ]);
        }

        return rows
            .map((row) =>
                row.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(',')
            )
            .join('\n');
    }

    /**
     * UTILITY
     */
    generateId(prefix) {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    simulateDelay(ms = 300) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export default new MockDataService();
