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
    Analytics,
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
        this.analytics = this.generateMockAnalytics();
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
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ed8936&color=fff',
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
                id: 'e2',
                title: 'Web Development Workshop',
                description: 'Hands-on workshop on modern web development practices.',
                type: 'workshop',
                date: futureDate.toISOString().split('T')[0],
                time: '14:00',
                location: 'Online',
                isOnline: true,
                maxParticipants: 50,
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
                    new User({
                        id: 'u6',
                        name: 'Test User 6',
                        role: 'student',
                        email: 'testuser6@gmail.com',
                    }),
                ],
            }),
        ];
    }
    /**
     * Generates a unique ID using a prefix.
     * @param {string} prefix - The prefix 'e_' for events, 'r_' from resources
     * @returns {string} The generated unique ID
     */
    generateId(prefix) {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 4);
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
     * UTILITY
     */
    simulateDelay(ms = 300) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export default new MockDataService();
