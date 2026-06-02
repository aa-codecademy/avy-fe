/**
 * Mock Data Service
 * Provides hardcoded data for Phase 1 development
 * Will be replaced with real API calls in Phase 2
 */

import {
    User,
    CVProfile,
    WorkExperience,
    Education,
    AcademyAttendance,
    Language,
    Job,
    Company,
    Application,
    SuccessStory,
    Event,
    Resource,
    Analytics,
    Message,
    Notification,
} from '../models/DataModels.js';

class MockDataService {
    constructor() {
        const stored = localStorage.getItem('mockData');

        if (stored) {
            const data = JSON.parse(stored);
            Object.assign(this, data);

            this.hydrateOptionalMockData();
        } else {
            this.initializeMockData();
            this.saveToStorage();
        }
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
        this.resourceObjects = this.generateMockResourceObjects();
        this.resources = this.generateMockResources();
        this.analytics = this.generateMockAnalytics();
        this.scheduledReports = this.generateMockScheduledReports();
        this.scheduledReportDeliveries = this.generateMockScheduledReportDeliveries();
    }

    /**
     * Save current mock data state to localStorage (for persistence across reloads)
     */
    saveToStorage() {
        this.hydrateOptionalMockData();

        localStorage.setItem(
            'mockData',
            JSON.stringify({
                users: this.users,
                companies: this.companies,
                jobs: this.jobs,
                applications: this.applications,
                cvProfiles: this.cvProfiles,
                successStories: this.successStories,
                events: this.events,
                resourceObjects: this.resourceObjects,
                resources: this.resources,
                messages: this.messages,
                notifications: this.notifications,
                analytics: this.analytics,
                scheduledReports: this.scheduledReports,
                scheduledReportDeliveries: this.scheduledReportDeliveries || [],
                pendingActions: this.pendingActions,
                alerts: this.alerts,
                permissionCatalog: this.permissionCatalog,
                adminRoles: this.adminRoles,
                notificationTemplates: this.notificationTemplates,
                emailTemplates: this.emailTemplates,
                platformSettings: this.platformSettings,
                auditLog: this.auditLog,
                complianceExports: this.complianceExports || [],
            })
        );
    }

    hydrateOptionalMockData() {
        this.pendingActions = this.generateMockPendingActions();
        this.alerts = this.generateMockAlerts();

        if (!this.messages) this.messages = this.generateMockMessages();
        if (!this.notifications) this.notifications = this.generateMockNotifications();
        if (!this.scheduledReports) this.scheduledReports = this.generateMockScheduledReports();
        if (!this.scheduledReportDeliveries)
            this.scheduledReportDeliveries = this.generateMockScheduledReportDeliveries();
        if (!this.resourceObjects) this.resourceObjects = this.generateMockResourceObjects();
        if (!this.permissionCatalog) this.permissionCatalog = this.generatePermissionCatalog();
        if (!this.adminRoles) this.adminRoles = this.generateAdminRoles();
        if (!this.notificationTemplates)
            this.notificationTemplates = this.generateNotificationTemplates();
        if (!this.emailTemplates) this.emailTemplates = this.generateEmailTemplates();
        if (!this.platformSettings) this.platformSettings = this.generatePlatformSettings();
        if (!this.auditLog) this.auditLog = this.generateAuditLog();
        if (!this.complianceExports) this.complianceExports = [];
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
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ed8936&color=fff'
            }),
            new User({
                id: '5',
                email: 'emily.davis@example.com',
                name: 'Emily Davis',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=38b2ac&color=fff',
                phone: '+389 70 345 678',
                dateOfBirth: '2001-03-22',
                citizenship: 'Macedonia',
                educationDegree: 'Bachelor in Computer Science',
                currentPosition: 'Backend Developer Intern',
                profileVisibility: 'public',
                createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new User({
                id: '6',
                email: 'james.carter@example.com',
                name: 'James Carter',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=James+Carter&background=d69e2e&color=fff',
                phone: '+389 70 456 789',
                dateOfBirth: '2000-11-08',
                citizenship: 'Macedonia',
                educationDegree: 'Bachelor in Software Engineering',
                currentPosition: 'QA Intern',
                profileVisibility: 'public',
                createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new User({
                id: '7',
                email: 'sophia.miller@example.com',
                name: 'Sophia Miller',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=Sophia+Miller&background=ed64a6&color=fff',
                phone: '+389 70 567 890',
                dateOfBirth: '1999-07-14',
                citizenship: 'Macedonia',
                educationDegree: 'Master in Human-Computer Interaction',
                currentPosition: 'Frontend Developer',
                profileVisibility: 'private',
                createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new User({
                id: '8',
                email: 'ryan.brooks@example.com',
                name: 'Ryan Brooks',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=Ryan+Brooks&background=e53e3e&color=fff',
                phone: '+389 70 678 901',
                dateOfBirth: '2000-01-30',
                citizenship: 'Macedonia',
                educationDegree: 'Bachelor in Mathematics',
                currentPosition: 'Data Analyst Intern',
                profileVisibility: 'public',
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new User({
                id: '9',
                email: 'olivia.chen@example.com',
                name: 'Olivia Chen',
                role: 'student',
                avatar: 'https://ui-avatars.com/api/?name=Olivia+Chen&background=6b46c1&color=fff',
                phone: '+389 70 789 012',
                dateOfBirth: '2001-09-05',
                citizenship: 'Macedonia',
                educationDegree: 'Bachelor in Graphic Design',
                currentPosition: 'UX Designer Intern',
                profileVisibility: 'public',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            })
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

    async getStudentsWithProfiles() {
        await this.simulateDelay();
        return this.users
            .filter(u => u.role === 'student')
            .map(student => {
                const cv = this.cvProfiles.find(c => c.userId === student.id) || new CVProfile({ userId: student.id });
                const attendance = cv.academyAttendance[0];
                const education = cv.education[0];
                return {
                    ...student,
                    skills: cv.skills,
                    academyTrack: attendance?.track || '',
                    academyStatus: attendance?.status || '',
                    educationLabel: education
                        ? `${education.degree} in ${education.fieldOfStudy}`
                        : student.educationDegree,
                };
            });
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
                applicationResponseRate: 92,
                averageTimeToUpdateStatus: 2.5,
                profileAccessRequests: 156,
                lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
                applicationResponseRate: 68,
                averageTimeToUpdateStatus: 8.3,
                profileAccessRequests: 89,
                lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
                applicationResponseRate: 45,
                averageTimeToUpdateStatus: 14.2,
                profileAccessRequests: 34,
                lastActivityDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
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
                applicationResponseRate: 88,
                averageTimeToUpdateStatus: 3.1,
                profileAccessRequests: 142,
                lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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

    async updateCompany(id, companyData) {
        await this.simulateDelay();

        const index = this.companies.findIndex((c) => c.id === id);

        if (index !== -1) {
            this.companies[index] = new Company({
                ...this.companies[index],
                ...companyData,
                updatedAt: new Date().toISOString(),
            });

            this.saveToStorage();

            return this.companies[index];
        }

        return null;
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
                // Recommendation algorithm analytics
                recommendationViews: 45,
                recommendationClicks: 12,
                recommendationApplications: 3,
                averageMatchScore: 85,
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
                // Recommendation algorithm analytics
                recommendationViews: 32,
                recommendationClicks: 8,
                recommendationApplications: 4,
                averageMatchScore: 78,
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
                // Recommendation algorithm analytics
                recommendationViews: 89,
                recommendationClicks: 18,
                recommendationApplications: 7,
                averageMatchScore: 92,
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
                // Recommendation algorithm analytics
                recommendationViews: 67,
                recommendationClicks: 14,
                recommendationApplications: 5,
                averageMatchScore: 76,
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
                // Recommendation algorithm analytics
                recommendationViews: 28,
                recommendationClicks: 6,
                recommendationApplications: 2,
                averageMatchScore: 82,
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
                // Recommendation algorithm analytics
                recommendationViews: 19,
                recommendationClicks: 4,
                recommendationApplications: 1,
                averageMatchScore: 71,
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
        const appliedDate1 = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        const appliedDate2 = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
        const appliedDate3 = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

        return [
            new Application({
                id: 'a1',
                jobId: 'j1',
                userId: '1',
                status: 'under_review',
                coverLetter: 'I am very interested in this position...',
                appliedAt: appliedDate1.toISOString(),
                updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                statusUpdateHistory: [
                    { status: 'pending', updatedAt: appliedDate1.toISOString() },
                    {
                        status: 'under_review',
                        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ],
            }),
            new Application({
                id: 'a2',
                jobId: 'j2',
                userId: '2',
                status: 'interview',
                coverLetter: 'With my experience in backend development...',
                appliedAt: appliedDate2.toISOString(),
                updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                statusUpdateHistory: [
                    { status: 'pending', updatedAt: appliedDate2.toISOString() },
                    {
                        status: 'under_review',
                        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'interview',
                        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ],
            }),
            new Application({
                id: 'a3',
                jobId: 'j3',
                userId: '1',
                status: 'pending',
                coverLetter: 'Excited about the internship opportunity...',
                appliedAt: appliedDate3.toISOString(),
                updatedAt: appliedDate3.toISOString(),
                statusUpdateHistory: [{ status: 'pending', updatedAt: appliedDate3.toISOString() }],
            }),
            new Application({
                id: 'a4',
                jobId: 'j1',
                userId: '2',
                status: 'rejected',
                coverLetter: 'I am excited to apply for this role...',
                appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                statusUpdateHistory: [
                    {
                        status: 'pending',
                        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'under_review',
                        updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'rejected',
                        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ],
            }),
            new Application({
                id: 'a5',
                jobId: 'j2',
                userId: '1',
                status: 'pending',
                coverLetter: 'Interested in joining your fintech team...',
                appliedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                statusUpdateHistory: [
                    {
                        status: 'pending',
                        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ],
            }),
            new Application({
                id: 'a6',
                jobId: 'j4',
                userId: '2',
                status: 'hired',
                coverLetter: 'DevOps engineer with cloud expertise...',
                appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                statusUpdateHistory: [
                    {
                        status: 'pending',
                        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'under_review',
                        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'interview',
                        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        status: 'hired',
                        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    },
                ],
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
                    new Language({ language: 'Macedonian', level: 'C2' })
                ]
            }),
            new CVProfile({
                userId: '5',
                workExperience: [
                    new WorkExperience({
                        id: 'we2',
                        company: 'DataSoft',
                        position: 'Backend Developer Intern',
                        startDate: '2024-09-01',
                        endDate: '',
                        description: 'Building RESTful APIs with Python and Django.'
                    })
                ],
                education: [
                    new Education({
                        id: 'ed2',
                        institution: 'Ss. Cyril and Methodius University',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Computer Science',
                        startDate: '2020-09-01',
                        endDate: '2024-06-30',
                        grade: '9.1/10'
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa2',
                        academyName: 'Avenga Academy',
                        track: 'Backend Development',
                        startDate: '2024-03-01',
                        endDate: '2024-06-30',
                        status: 'completed'
                    })
                ],
                skills: ['Python', 'Django', 'PostgreSQL', 'REST API', 'Git', 'Docker'],
                languages: [
                    new Language({ language: 'English', level: 'B2' }),
                    new Language({ language: 'Macedonian', level: 'C2' })
                ]
            }),
            new CVProfile({
                userId: '6',
                workExperience: [],
                education: [
                    new Education({
                        id: 'ed3',
                        institution: 'FINKI Skopje',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Software Engineering',
                        startDate: '2021-09-01',
                        endDate: '',
                        grade: ''
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa3',
                        academyName: 'Avenga Academy',
                        track: 'QA Engineering',
                        startDate: '2024-09-01',
                        endDate: '2024-12-31',
                        status: 'completed'
                    })
                ],
                skills: ['Selenium', 'Cypress', 'Manual Testing', 'JIRA', 'Postman', 'SQL'],
                languages: [
                    new Language({ language: 'English', level: 'C1' }),
                    new Language({ language: 'Macedonian', level: 'C2' })
                ]
            }),
            new CVProfile({
                userId: '7',
                workExperience: [
                    new WorkExperience({
                        id: 'we3',
                        company: 'PixelLab',
                        position: 'Frontend Developer',
                        startDate: '2023-10-01',
                        endDate: '',
                        description: 'Building UI components with Vue.js and TypeScript.'
                    })
                ],
                education: [
                    new Education({
                        id: 'ed4',
                        institution: 'University of Skopje',
                        degree: 'Master',
                        fieldOfStudy: 'Human-Computer Interaction',
                        startDate: '2022-09-01',
                        endDate: '2024-06-30',
                        grade: '9.8/10'
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa4',
                        academyName: 'Avenga Academy',
                        track: 'Frontend Development',
                        startDate: '2023-03-01',
                        endDate: '2023-06-30',
                        status: 'completed'
                    })
                ],
                skills: ['Vue.js', 'TypeScript', 'JavaScript', 'Figma', 'CSS3', 'UX Research'],
                languages: [
                    new Language({ language: 'English', level: 'C2' }),
                    new Language({ language: 'Macedonian', level: 'C2' }),
                    new Language({ language: 'French', level: 'B1' })
                ]
            }),
            new CVProfile({
                userId: '8',
                workExperience: [
                    new WorkExperience({
                        id: 'we4',
                        company: 'Analytics Co.',
                        position: 'Data Analyst Intern',
                        startDate: '2025-01-01',
                        endDate: '',
                        description: 'Analyzing datasets and building Power BI dashboards.'
                    })
                ],
                education: [
                    new Education({
                        id: 'ed5',
                        institution: 'Ss. Cyril and Methodius University',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Mathematics',
                        startDate: '2019-09-01',
                        endDate: '2023-06-30',
                        grade: '8.7/10'
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa5',
                        academyName: 'Avenga Academy',
                        track: 'Data Analytics',
                        startDate: '2024-09-01',
                        endDate: '2024-12-31',
                        status: 'completed'
                    })
                ],
                skills: ['Python', 'Pandas', 'SQL', 'Power BI', 'Excel', 'Statistics'],
                languages: [
                    new Language({ language: 'English', level: 'B2' }),
                    new Language({ language: 'Macedonian', level: 'C2' })
                ]
            }),
            new CVProfile({
                userId: '9',
                workExperience: [],
                education: [
                    new Education({
                        id: 'ed6',
                        institution: 'University of Arts Skopje',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Graphic Design',
                        startDate: '2021-09-01',
                        endDate: '',
                        grade: ''
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa6',
                        academyName: 'Avenga Academy',
                        track: 'UX/UI Design',
                        startDate: '2025-01-01',
                        endDate: '2025-04-30',
                        status: 'completed'
                    })
                ],
                skills: ['Figma', 'Adobe XD', 'Illustrator', 'User Research', 'Prototyping', 'CSS3'],
                languages: [
                    new Language({ language: 'English', level: 'C1' }),
                    new Language({ language: 'Macedonian', level: 'C2' })
                ]
            })
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
        const date1 = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        const date2 = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        const date3 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return [
            new Event({
                id: this.generateId('e_'),
                title: 'Career Day 2026',
                description: 'Meet top employers and explore career opportunities.',
                type: 'career-day',
                date: date1.toISOString().split('T')[0],
                time: '10:00',
                location: 'Avenga Academy - Skopje',
                isOnline: false,
                maxParticipants: 100,
                registeredCount: 45,
                actualAttendance: 38,
                byProgramme: [
                    { programme: 'Frontend Development', registered: 16, attended: 14, noShow: 2 },
                    { programme: 'Backend Development', registered: 11, attended: 9, noShow: 2 },
                    { programme: 'QA Engineering', registered: 9, attended: 8, noShow: 1 },
                    { programme: 'Data Analytics', registered: 9, attended: 7, noShow: 2 },
                ],
                maxRegistrations: 5,
                registeredUsers: [
                    new User({
                        id: 'u1',
                        name: 'Test User 1',
                        role: 'student',
                        email: 'testuser1@gmail.com',
                    }),
                    new User({
                        id: 'u2',
                        name: 'Test User 2',
                        role: 'alumni',
                        email: 'testuser2@gmail.com',
                    }),
                    new User({
                        id: 'u3',
                        name: 'Test User 3',
                        role: 'student',
                        email: 'testuser3@gmail.com',
                    }),
                ],
            }),
            new Event({
                id: this.generateId('e_'),
                title: 'Web Development Workshop',
                description: 'Hands-on workshop on modern web development practices.',
                type: 'workshop',
                date: date2.toISOString().split('T')[0],
                time: '14:00',
                location: 'Online',
                isOnline: true,
                maxParticipants: 50,
                registeredCount: 32,
                actualAttendance: 26,
                byProgramme: [
                    { programme: 'Frontend Development', registered: 12, attended: 10, noShow: 2 },
                    { programme: 'Backend Development', registered: 8, attended: 7, noShow: 1 },
                    { programme: 'QA Engineering', registered: 6, attended: 5, noShow: 1 },
                    { programme: 'Data Analytics', registered: 6, attended: 4, noShow: 2 },
                ],
                maxRegistrations: 5,
                registeredUsers: [
                    new User({
                        id: 'u4',
                        name: 'Test User 4',
                        role: 'alumni',
                        email: 'testuser4@gmail.com',
                    }),
                    new User({
                        id: 'u5',
                        name: 'Test User 5',
                        role: 'alumni',
                        email: 'testuser5@gmail.com',
                    }),
                ],
            }),
            new Event({
                id: this.generateId('e_'),
                title: 'Netwroking Day',
                description: 'Meet up with other students and establish networks.',
                type: 'networking',
                date: date3.toISOString().split('T')[0],
                time: '02:00',
                location: 'Avenga Academy - Skopje',
                isOnline: false,
                maxParticipants: 50,
                registeredCount: 32,
                actualAttendance: 26,
                byProgramme: [
                    { programme: 'Frontend Development', registered: 12, attended: 10, noShow: 2 },
                    { programme: 'Backend Development', registered: 8, attended: 7, noShow: 1 },
                    { programme: 'QA Engineering', registered: 6, attended: 5, noShow: 1 },
                    { programme: 'Data Analytics', registered: 6, attended: 4, noShow: 2 },
                ],
                maxRegistrations: 5,
                registeredUsers: [
                    new User({
                        id: 'u6',
                        name: 'Test User 6',
                        role: 'student',
                        email: 'testuser6@gmail.com',
                    }),
                    new User({
                        id: 'u7',
                        name: 'Test User 7',
                        role: 'alumni',
                        email: 'testuser7@gmail.com',
                    }),
                    new User({
                        id: 'u8',
                        name: 'Test User8',
                        role: 'student',
                        email: 'testuser8@gmail.com',
                    }),
                    new User({
                        id: 'u9',
                        name: 'Test User 9',
                        role: 'student',
                        email: 'testuser9@gmail.com',
                    }),
                ],
            }),
        ];
    }

    /**
     * RESOURCES
     */
    generateMockResourceObjects() {
        return [
            new Resource({
                id: this.generateId('r_'),
                title: 'How to Write a Winning CV',
                description:
                    'A comprehensive guide covering structure, tone, and the most common mistakes students make. Includes a downloadable template.',
                type: 'cv-guide',
                contentBody: 'Your CV is often the first impression you make on an employer...',
                externalUrl: 'https://www.themuse.com/advice/the-35-best-cv-tips-ever',
                isGlobal: true,
                programs: [],
                status: 'active',
                viewCount: 142,
                organizerId: 'admin_01',
                createdAt: new Date().toISOString(),
            }),
            new Resource({
                id: this.generateId('r_'),
                title: 'Acing Your First Interview',
                description:
                    'Tips and techniques from industry professionals on how to prepare, present yourself, and follow up after an interview.',
                type: 'interview-prep',
                contentBody: 'Preparation is the key to interview success...',
                externalUrl: '',
                isGlobal: true,
                programs: [],
                status: 'active',
                viewCount: 98,
                organizerId: 'admin_01',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Resource({
                id: this.generateId('r_'),
                title: 'Summer Internships 2026',
                description:
                    'A curated list of open internship positions across tech, finance, and media sectors available to students this summer.',
                type: 'article',
                contentBody:
                    'The following companies are currently accepting internship applications...',
                externalUrl: '',
                isGlobal: false,
                programs: ['software-engineering', 'data-science'],
                status: 'active',
                viewCount: 76,
                organizerId: 'admin_01',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            }),
            new Resource({
                id: this.generateId('r_'),
                title: 'Portfolio Template – Creative Track',
                description:
                    'A ready-to-use portfolio template designed for students in design and creative programs.',
                type: 'portfolio-template',
                contentBody: 'Download the template and follow the setup instructions...',
                externalUrl: 'https://www.figma.com',
                isGlobal: false,
                programs: ['graphic-design'],
                status: 'active',
                viewCount: 33,
                organizerId: 'admin_01',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            }),
        ];
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

    generateMockResources() {
        return [
            new Resource({
                id: 'r1',
                title: 'Build a Job-Ready CV',
                description:
                    'A practical checklist for structuring your CV for entry-level software roles.',
                type: 'cv-guide',
                contentBody:
                    'Start with a concise summary, highlight measurable project outcomes, and keep your technical stack specific. Tailor the top section for every application so employers can quickly match your profile to the role.',
                externalUrl: 'https://example.com/resources/job-ready-cv',
                isGlobal: true,
                programs: ['frontend', 'backend', 'qa'],
                status: 'active',
                viewCount: 184,
            }),
            new Resource({
                id: 'r2',
                title: 'Interview Preparation Workbook',
                description:
                    'Common technical and behavioural prompts with a framework for better answers.',
                type: 'interview-prep',
                contentBody:
                    'Prepare short stories that cover teamwork, debugging, ownership, and delivery under pressure. For technical interviews, practice explaining tradeoffs clearly instead of only focusing on the final answer.',
                isGlobal: true,
                programs: ['frontend', 'backend'],
                status: 'active',
                viewCount: 126,
            }),
            new Resource({
                id: 'r3',
                title: 'Portfolio Case Study Template',
                description:
                    'A reusable outline for turning academy and freelance work into stronger portfolio entries.',
                type: 'portfolio-template',
                contentBody:
                    'Document the problem, constraints, implementation choices, and measurable impact. Strong case studies explain why decisions were made, not just what was built.',
                externalUrl: 'https://example.com/resources/portfolio-template',
                isGlobal: false,
                programs: ['frontend'],
                status: 'archived',
                viewCount: 72,
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
            this.saveToStorage();
            return n;
        }
        return null;
    }

    async markAllAsRead(userId) {
        await this.simulateDelay();
        this.notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
        this.saveToStorage();
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
     * Scheduled Reports
     */
    generateMockScheduledReports() {
        return [
            {
                id: 'sr1',
                name: 'Weekly Platform Overview',
                description:
                    'Platform KPIs, job funnel, and recommendation performance delivered every Monday.',
                selectedMetrics: [
                    'platformOverview',
                    'jobApplicationFunnel',
                    'recommendationAnalytics',
                ],
                selectedFilters: ['last30Days'],
                selectedDimensions: ['jobs', 'students', 'recommendations'],
                recipients: ['admin@avy.com'],
                frequency: 'weekly',
                nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                lastRun: '',
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'sr2',
                name: 'Weekly Employers Overview',
                description: 'Company performance metrics and insights',
                selectedMetrics: ['Company Performance'],
                selectedFilters: ['last30Days'],
                selectedDimensions: ['jobs', 'students', 'recommendations'],
                recipients: ['admin@avy.com'],
                frequency: 'weekly',
                nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                lastRun: '',
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'sr3',
                name: 'Event Attendance',
                description: 'Showing me infor about event attandance',
                selectedMetrics: ['Event Attendance'],
                selectedFilters: ['last30Days'],
                selectedDimensions: ['jobs', 'students', 'recommendations'],
                recipients: ['admin@avy.com'],
                frequency: 'daily',
                nextRun: '',
                lastRun: '2026-05-01',
                active: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
    }

    /**
     * PENDING ACTIONS
     */
    generateMockPendingActions() {
        return [
            {
                id: 'pa1',
                type: 'profile_approval',
                description: 'Profile submission from Jane Smith requires review',
                targetName: 'Jane Smith',
                targetId: '2',
                priority: 'high',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                icon: 'fa-user-check',
            },
            {
                id: 'pa2',
                type: 'employer_verification',
                description: 'Company verification pending for TechCorp Solutions',
                targetName: 'TechCorp Solutions',
                targetId: 'c1',
                priority: 'high',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                icon: 'fa-building',
            },
            {
                id: 'pa3',
                type: 'job_review',
                description: 'Job posting "Senior Developer" at InnoSoft awaiting approval',
                targetName: 'Senior Developer',
                targetId: 'j2',
                priority: 'medium',
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                icon: 'fa-briefcase',
            },
            {
                id: 'pa4',
                type: 'profile_approval',
                description: 'Profile submission from John Doe requires review',
                targetName: 'John Doe',
                targetId: '1',
                priority: 'medium',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                icon: 'fa-user-check',
            },
        ];
    }

    generateMockScheduledReportDeliveries() {
        return [
            {
                reportId: 'sr1',
                name: 'Weekly Platform Overview',
                deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                recipients: ['admin@avy.com'],
                summary:
                    'Report Weekly Platform Overview delivered with 3 metric groups and 3 dimensions.',
            },
            {
                reportId: 'sr1',
                name: 'Weekly Platform Overview',
                deliveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
                recipients: ['admin@avy.com'],
                summary:
                    'Report Weekly Platform Overview delivered with 3 metric groups and 3 dimensions.',
            },
            {
                reportId: 'sr2',
                name: 'Weekly Employers Overview',
                deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                recipients: ['admin@avy.com'],
                summary:
                    'Report Weekly Employers Overview delivered with 1 metric groups and 3 dimensions.',
            },
            {
                reportId: 'sr2',
                name: 'Weekly Employers Overview',
                deliveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
                recipients: ['admin@avy.com'],
                summary:
                    'Report Weekly Employers Overview delivered with 1 metric groups and 3 dimensions.',
            },
            {
                reportId: 'sr3',
                name: 'Event Attendance',
                deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                recipients: ['admin@avy.com'],
                summary: 'Report Event Attendance delivered with 1 metric groups and 3 dimensions.',
            },
        ];
    }

    async getScheduledReports() {
        await this.simulateDelay();
        return this.scheduledReports || [];
    }

    async saveScheduledReport(report) {
        await this.simulateDelay();
        const index = (this.scheduledReports || []).findIndex((item) => item.id === report.id);
        if (index !== -1) {
            this.scheduledReports[index] = {
                ...this.scheduledReports[index],
                ...report,
                updatedAt: new Date().toISOString(),
            };
            this.saveToStorage();
            return this.scheduledReports[index];
        } else {
            const newReport = {
                ...report,
                id: report.id || `sr${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.scheduledReports = [...(this.scheduledReports || []), newReport];
            this.saveToStorage();
            return newReport;
        }
    }

    async deleteScheduledReport(reportId) {
        await this.simulateDelay();
        this.scheduledReports = (this.scheduledReports || []).filter(
            (report) => report.id !== reportId
        );
        this.saveToStorage();
        return true;
    }

    async runScheduledReport(report) {
        await this.simulateDelay();
        const payload = {
            reportId: report.id,
            name: report.name,
            deliveredAt: new Date().toISOString(),
            recipients: report.recipients,
            summary: `Report ${report.name} delivered with ${report.selectedMetrics.length} metric groups and ${report.selectedDimensions.length} dimensions.`,
        };
        if (!this.scheduledReportDeliveries) {
            this.scheduledReportDeliveries = [];
        }
        this.scheduledReportDeliveries.push(payload);
        const reportIndex = (this.scheduledReports || []).findIndex(
            (item) => item.id === report.id
        );
        if (reportIndex !== -1) {
            this.scheduledReports[reportIndex] = {
                ...this.scheduledReports[reportIndex],
                lastRun: payload.deliveredAt,
                nextRun: this.calculateNextRun(report.frequency),
                updatedAt: new Date().toISOString(),
            };
            this.saveToStorage();
        }
        return payload;
    }

    async getScheduledReportDeliveries() {
        await this.simulateDelay();
        return this.scheduledReportDeliveries || [];
    }

    calculateNextRun(frequency) {
        const now = new Date();
        switch (frequency) {
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            case 'monthly':
                return new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    now.getDate(),
                    now.getHours(),
                    now.getMinutes()
                ).toISOString();
            default:
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        }
    }

    async getPendingActions() {
        await this.simulateDelay();
        return this.pendingActions;
    }

    /**
     * ALERTS & NOTICES
     */
    generateMockAlerts() {
        return [
            {
                id: 'al1',
                type: 'error',
                title: 'Email Send Failed',
                message: '5 welcome emails failed to send to new registrations',
                severity: 'error',
                icon: 'fa-exclamation-circle',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
            {
                id: 'al2',
                type: 'warning',
                title: 'Access Request Expiration',
                message: '3 employer profile access requests expire in 2 days',
                severity: 'warning',
                icon: 'fa-clock',
                timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'al3',
                type: 'warning',
                title: 'Unusual Activity Detected',
                message: 'Multiple failed login attempts detected from IP 192.168.1.x',
                severity: 'warning',
                icon: 'fa-shield-alt',
                timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            },
            {
                id: 'al4',
                type: 'info',
                title: 'Database Backup Completed',
                message: 'Platform database backup completed successfully',
                severity: 'info',
                icon: 'fa-check-circle',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    async getAlerts() {
        await this.simulateDelay();
        return this.alerts;
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

    simulateDelay(ms = 0) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * JOB RECOMMENDATION ALGORITHM
     */

    //Calculate skill match score between student and job
    calculateSkillMatchScore(studentSkills, requiredSkills, niceToHaveSkills) {
        if (!studentSkills || studentSkills.length === 0) return 0;

        const studentSkillsLower = studentSkills.map((s) => s.toLowerCase().trim());
        const requiredLower = requiredSkills.map((s) => s.toLowerCase().trim());
        const niceToHaveLower = niceToHaveSkills.map((s) => s.toLowerCase().trim());

        // Calculate required skills match
        const requiredMatches = requiredLower.filter((reqSkill) =>
            studentSkillsLower.some(
                (studentSkill) => studentSkill.includes(reqSkill) || reqSkill.includes(studentSkill)
            )
        ).length;

        const requiredScore =
            requiredSkills.length > 0 ? (requiredMatches / requiredSkills.length) * 60 : 60;

        // Calculate nice-to-have skills match
        const niceMatches = niceToHaveLower.filter((niceSkill) =>
            studentSkillsLower.some(
                (studentSkill) =>
                    studentSkill.includes(niceSkill) || niceSkill.includes(studentSkill)
            )
        ).length;

        const niceScore =
            niceToHaveSkills.length > 0 ? (niceMatches / niceToHaveSkills.length) * 40 : 0;

        return Math.round(requiredScore + niceScore);
    }

    /**
     * Calculate work mode match score
     */
    calculateWorkModeMatchScore(studentWorkModePref, jobWorkMode) {
        if (!studentWorkModePref || !jobWorkMode) return 50;

        // Exact match
        if (studentWorkModePref === jobWorkMode) return 100;

        // Compatible matches
        const compatibilityMap = {
            hybrid: ['onsite', 'remote'],
            remote: ['hybrid'],
            onsite: ['hybrid'],
        };

        if (compatibilityMap[studentWorkModePref]?.includes(jobWorkMode)) return 75;

        return 25; // No match
    }

    /**
     * Calculate location match score
     */
    calculateLocationMatchScore(studentLocationPref, jobLocation) {
        if (!studentLocationPref || !jobLocation) return 50;

        // Remote jobs are flexible
        if (jobLocation.toLowerCase() === 'remote') return 100;

        // Student prefers remote work
        if (studentLocationPref.toLowerCase() === 'remote') return 75;

        // Location match
        if (studentLocationPref.toLowerCase() === jobLocation.toLowerCase()) return 100;

        return 25; // Different location
    }

    /**
     * Calculate experience match score
     */
    calculateExperienceMatchScore(studentYearsExp, jobExperienceLevel) {
        const experienceMap = {
            intern: { min: 0, max: 0.5, ideal: 0 },
            junior: { min: 0, max: 2, ideal: 1 },
            mid: { min: 1, max: 5, ideal: 3 },
            senior: { min: 3, max: 10, ideal: 5 },
        };

        const level = experienceMap[jobExperienceLevel];
        if (!level) return 50;

        const exp = studentYearsExp || 0;

        // Too little experience
        if (exp < level.min) return Math.max(10, (exp / level.min) * 50);

        // Ideal range
        if (exp >= level.min && exp <= level.max) {
            const distanceFromIdeal = Math.abs(exp - level.ideal);
            const maxDistance = level.ideal - level.min;
            return Math.round(100 - (distanceFromIdeal / maxDistance) * 30);
        }

        // Too much experience (still good, but diminishing returns)
        if (exp > level.max) {
            const overExperience = exp - level.max;
            return Math.max(70, 100 - overExperience * 5);
        }

        return 50;
    }

    /**
     * Calculate salary match score
     */
    calculateSalaryMatchScore(studentSalaryExp, jobSalaryRange) {
        if (!studentSalaryExp || !jobSalaryRange) return 50;

        const studentMin = studentSalaryExp.min || 0;
        const studentMax = studentSalaryExp.max || studentMin * 1.5;
        const jobMin = jobSalaryRange.min || 0;
        const jobMax = jobSalaryRange.max || jobMin * 1.5;

        // Student expectations overlap with job range
        const overlap = Math.max(0, Math.min(studentMax, jobMax) - Math.max(studentMin, jobMin));
        const studentRange = studentMax - studentMin;
        const jobRange = jobMax - jobMin;

        if (overlap === 0) return 10; // No overlap

        const overlapRatio = overlap / Math.max(studentRange, jobRange);
        return Math.round(overlapRatio * 100);
    }

    /**
     * Calculate overall match score for a job recommendation
     */
    calculateJobMatchScore(studentProfile, job) {
        const weights = {
            skills: 0.4,
            workMode: 0.15,
            location: 0.15,
            experience: 0.15,
            salary: 0.15,
        };

        const scores = {
            skills: this.calculateSkillMatchScore(
                studentProfile.skills,
                job.requiredSkills,
                job.niceToHaveSkills
            ),
            workMode: this.calculateWorkModeMatchScore(
                studentProfile.workModePreference,
                job.workMode
            ),
            location: this.calculateLocationMatchScore(
                studentProfile.locationPreference,
                job.location
            ),
            experience: this.calculateExperienceMatchScore(
                studentProfile.yearsOfExperience,
                job.experienceLevel
            ),
            salary: this.calculateSalaryMatchScore(
                studentProfile.salaryExpectation,
                job.salaryRange
            ),
        };

        const totalScore = Object.entries(weights).reduce((total, [key, weight]) => {
            return total + scores[key] * weight;
        }, 0);

        return {
            totalScore: Math.round(totalScore),
            breakdown: scores,
            weights: weights,
        };
    }

    /**
     * Get job recommendations for a student
     */
    async getJobRecommendations(userId, limit = 10) {
        await this.simulateDelay();

        const studentProfile = this.cvProfiles.find((cv) => cv.userId === userId);
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }

        // Get active jobs
        const activeJobs = this.jobs.filter((job) => job.status === 'active');

        // Calculate match scores for all jobs
        const recommendations = activeJobs.map((job) => {
            const matchResult = this.calculateJobMatchScore(studentProfile, job);
            return {
                job,
                matchScore: matchResult.totalScore,
                matchBreakdown: matchResult.breakdown,
            };
        });

        // Sort by match score (descending) and prioritize premium jobs
        recommendations.sort((a, b) => {
            // First by match score
            if (a.matchScore !== b.matchScore) {
                return b.matchScore - a.matchScore;
            }
            // Then by priority status
            if (a.job.isPriority !== b.job.isPriority) {
                return b.job.isPriority ? 1 : -1;
            }
            // Finally by creation date (newer first)
            return new Date(b.job.createdAt) - new Date(a.job.createdAt);
        });

        // Track recommendation view analytics
        recommendations.slice(0, limit).forEach((rec) => {
            this.trackRecommendationView(rec.job.id);
        });

        return recommendations.slice(0, limit);
    }

    /**
     * Track when a job is viewed through recommendations
     */
    async trackRecommendationView(jobId) {
        const jobIndex = this.jobs.findIndex((j) => j.id === jobId);
        if (jobIndex !== -1) {
            this.jobs[jobIndex].recommendationViews++;
            this.saveToStorage();
        }
    }

    /**
     * Track when a job is clicked through recommendations
     */
    async trackRecommendationClick(jobId) {
        const jobIndex = this.jobs.findIndex((j) => j.id === jobId);
        if (jobIndex !== -1) {
            this.jobs[jobIndex].recommendationClicks++;
            this.saveToStorage();
        }
    }

    /**
     * Track when an application comes from recommendations
     */
    async trackRecommendationApplication(jobId) {
        const jobIndex = this.jobs.findIndex((j) => j.id === jobId);
        if (jobIndex !== -1) {
            this.jobs[jobIndex].recommendationApplications++;
            this.saveToStorage();
        }
    }
}

// Export singleton instance
export default new MockDataService();
