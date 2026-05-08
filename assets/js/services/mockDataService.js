/**
 * Mock Data Service
 * Provides hardcoded data for Phase 1 development
 * Will be replaced with real API calls in Phase 2
 */

import {
    User, CVProfile, WorkExperience, Education, AcademyAttendance, Language,
    Job, Company, Application, SuccessStory, Event, Analytics
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
                profileStatus: 'pending'
            }),
            new User({
                id: '2',
                email: 'jane.smith@example.com',
                name: 'Jane Smith',
                role: 'alumni',
                avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=764ba2&color=fff',
                phone: '+389 70 234 567',
                educationDegree: 'Master in Software Engineering',
                currentPosition: 'Senior Full Stack Developer'
            }),
            new User({
                id: '3',
                email: 'alice.johnson@techcorp.com',
                name: 'Alice Johnson',
                role: 'employer',
                companyId: 'c1', // TechCorp
                avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=48bb78&color=fff',
                currentPosition: 'Senior Recruiter at TechCorp'
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
                createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
                profileStatus: 'approved',
                profileStatusUpdatedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
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
                createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
                profileStatus: 'approved',
                profileStatusUpdatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
                accountStatus: 'suspended',
                accountStatusNote: 'Reported for sharing confidential employer contacts outside the platform. Under review.',
                accountStatusUpdatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
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
                createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                profileStatus: 'rejected',
                profileStatusNote: 'LinkedIn and portfolio links appear broken or missing. Please resubmit with verified contact details.',
                profileStatusUpdatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                accountStatus: 'deactivated',
                accountStatusNote: 'Repeated violations of platform terms of service after prior suspension.',
                accountStatusUpdatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
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
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                profileStatus: 'pending'
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
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                profileStatus: 'pending'
            })
        ];
    }
    
    async getAllUsers() {
        await this.simulateDelay();
        return this.users;
    }
    
    async getUserById(id) {
        await this.simulateDelay();
        return this.users.find(u => u.id === id);
    }
    
    async getUsersByRole(role) {
        await this.simulateDelay();
        return this.users.filter(u => u.role === role);
    }

    async updateStudentProfile(userId, profileData) {
        await this.simulateDelay();
        const user = this.users.find(u => u.id === userId);
        if (user) {
            Object.assign(user, profileData, { updatedAt: new Date().toISOString() });
            return user;
        }
        return null;
    }

    async updateProfileStatus(userId, status, note = '') {
        await this.simulateDelay();
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.profileStatus = status;
            user.profileStatusNote = note;
            user.profileStatusUpdatedAt = new Date().toISOString();
            user.updatedAt = new Date().toISOString();
            return user;
        }
        return null;
    }

    async updateAccountStatus(userId, status, note = '') {
        await this.simulateDelay();
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.accountStatus = status;
            user.accountStatusNote = note;
            user.accountStatusUpdatedAt = status === 'active' ? '' : new Date().toISOString();
            user.updatedAt = new Date().toISOString();
            return user;
        }
        return null;
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

    async getStudentsForExport() {
        await this.simulateDelay();
        return this.users
            .filter(u => u.role === 'student')
            .map(student => {
                const cv         = this.cvProfiles.find(c => c.userId === student.id) || new CVProfile({ userId: student.id });
                const attendance = cv.academyAttendance[0];
                const education  = cv.education[0];
                return {
                    name:                student.name,
                    email:               student.email,
                    phone:               student.phone              || '',
                    dateOfBirth:         student.dateOfBirth        || '',
                    citizenship:         student.citizenship        || '',
                    accountStatus:       student.accountStatus      || 'active',
                    profileStatus:       student.profileStatus      || 'pending',
                    profileVisibility:   student.profileVisibility  || 'private',
                    currentPosition:     student.currentPosition    || '',
                    linkedIn:            student.linkedIn           || '',
                    portfolio:           student.portfolio          || '',
                    createdAt:           student.createdAt          || '',
                    academyName:         attendance?.academyName    || '',
                    academyTrack:        attendance?.track          || '',
                    academyStartDate:    attendance?.startDate      || '',
                    academyEndDate:      attendance?.endDate        || '',
                    academyStatus:       attendance?.status         || '',
                    educationDegree:     education
                        ? `${education.degree} in ${education.fieldOfStudy}`
                        : (student.educationDegree || ''),
                    educationInstitution: education?.institution    || '',
                    educationGrade:       education?.grade          || '',
                    skills:              (cv.skills    || []).join(', '),
                    languages:           (cv.languages || []).map(l => `${l.language} (${l.level})`).join(', '),
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
                description: 'Leading software development company specializing in enterprise solutions.',
                website: 'https://techcorp.example.com',
                locations: ['Skopje', 'Belgrade', 'Remote'],
                size: '201-500',
                contactEmail: 'hr@techcorp.example.com',
                contactPerson: 'Alice Johnson',
                subscriptionPlan: 'premium',
                jobPostingLimit: 80,
                jobPostingsUsed: 12
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
                jobPostingsUsed: 8
            }),
            new Company({
                id: 'c3',
                name: 'DataWorks Analytics',
                logo: 'https://ui-avatars.com/api/?name=DataWorks&background=48bb78&color=fff&size=128',
                industry: 'Data Analytics',
                description: 'Data analytics company helping businesses make data-driven decisions.',
                website: 'https://dataworks.example.com',
                locations: ['Remote'],
                size: '11-50',
                subscriptionPlan: 'basic',
                jobPostingLimit: 5,
                jobPostingsUsed: 3
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
                jobPostingsUsed: 15
            })
        ];
    }
    
    async getAllCompanies() {
        await this.simulateDelay();
        return this.companies;
    }
    
    async getCompanyById(id) {
        await this.simulateDelay();
        return this.companies.find(c => c.id === id);
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
                responsibilities: 'Develop responsive web applications using modern frameworks, collaborate with designers and backend developers, write clean and maintainable code.',
                qualifications: 'Proficiency in HTML, CSS, JavaScript, React or Vue.js, experience with responsive design.',
                benefits: 'Competitive salary, health insurance, remote work options, professional development budget.',
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
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new Job({
                id: 'j2',
                companyId: 'c2',
                title: 'Backend Developer',
                description: 'Join our fintech team as a Backend Developer.',
                responsibilities: 'Design and implement RESTful APIs, work with databases, ensure application security and performance.',
                qualifications: 'Strong knowledge of Node.js or .NET, database experience (PostgreSQL/MySQL), API design.',
                benefits: 'Great team culture, flexible hours, learning opportunities, modern tech stack.',
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
                applications: 12
            }),
            new Job({
                id: 'j3',
                companyId: 'c3',
                title: 'Data Analyst Intern',
                description: 'Internship opportunity for aspiring data analysts.',
                responsibilities: 'Analyze datasets, create visualizations, assist in reporting, learn data analytics tools.',
                qualifications: 'Basic knowledge of SQL, Excel, interest in data analysis, willingness to learn.',
                benefits: 'Mentorship program, hands-on experience, possibility of full-time employment.',
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
                applications: 25
            }),
            new Job({
                id: 'j4',
                companyId: 'c4',
                title: 'DevOps Engineer',
                description: 'Looking for a DevOps Engineer to manage our cloud infrastructure.',
                responsibilities: 'Manage AWS/Azure infrastructure, implement CI/CD pipelines, monitor system performance, ensure security.',
                qualifications: 'Experience with cloud platforms (AWS/Azure), Docker, Kubernetes, CI/CD tools.',
                benefits: 'Top-tier salary, certifications paid, remote work, cutting-edge technology.',
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
                isPriority: true
            }),
            new Job({
                id: 'j5',
                companyId: 'c1',
                title: 'Full Stack Developer',
                description: 'Full Stack Developer needed for our enterprise projects.',
                responsibilities: 'Develop both frontend and backend features, work on full project lifecycle, mentor junior developers.',
                qualifications: 'Proficiency in React and Node.js, database knowledge, API design experience.',
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
                applications: 10
            }),
            new Job({
                id: 'j6',
                companyId: 'c2',
                title: 'QA Engineer',
                description: 'Quality Assurance Engineer for fintech applications.',
                responsibilities: 'Create test plans, perform manual and automated testing, report bugs, ensure quality standards.',
                qualifications: 'Experience with testing methodologies, automation tools (Selenium/Cypress), attention to detail.',
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
                applications: 7
            })
        ];
    }
    
    async getAllJobs(filters = {}) {
        await this.simulateDelay();
        let jobs = [...this.jobs];
        
        // Apply filters
        if (filters.status) {
            jobs = jobs.filter(j => j.status === filters.status);
        }
        if (filters.companyId) {
            jobs = jobs.filter(j => j.companyId === filters.companyId);
        }
        if (filters.employmentType) {
            jobs = jobs.filter(j => j.employmentType === filters.employmentType);
        }
        if (filters.workMode) {
            jobs = jobs.filter(j => j.workMode === filters.workMode);
        }
        if (filters.experienceLevel) {
            jobs = jobs.filter(j => j.experienceLevel === filters.experienceLevel);
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
                need.some((skill) =>
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
        return this.jobs.find(j => j.id === id);
    }
    
    async createJob(jobData) {
        await this.simulateDelay();
        const newJob = new Job({
            ...jobData,
            id: 'j' + (this.jobs.length + 1)
        });
        this.jobs.push(newJob);
        return newJob;
    }
    
    async updateJob(id, jobData) {
        await this.simulateDelay();
        const index = this.jobs.findIndex(j => j.id === id);
        if (index !== -1) {
            this.jobs[index] = new Job({ ...this.jobs[index], ...jobData, updatedAt: new Date().toISOString() });
            return this.jobs[index];
        }
        return null;
    }
    
    async deleteJob(id) {
        await this.simulateDelay();
        const index = this.jobs.findIndex(j => j.id === id);
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
                appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new Application({
                id: 'a2',
                jobId: 'j2',
                userId: '2',
                status: 'interview',
                coverLetter: 'With my experience in backend development...',
                appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            }),
            new Application({
                id: 'a3',
                jobId: 'j3',
                userId: '1',
                status: 'pending',
                coverLetter: 'Excited about the internship opportunity...',
                appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            })
        ];
    }
    
    async getApplications(filters = {}) {
        await this.simulateDelay();
        let apps = [...this.applications];
        
        if (filters.userId) {
            apps = apps.filter(a => a.userId === filters.userId);
        }
        if (filters.jobId) {
            apps = apps.filter(a => a.jobId === filters.jobId);
        }
        if (filters.status) {
            apps = apps.filter(a => a.status === filters.status);
        }
        
        return apps;
    }
    
    async createApplication(appData) {
        await this.simulateDelay();
        const newApp = new Application({
            ...appData,
            id: 'a' + (this.applications.length + 1)
        });
        this.applications.push(newApp);
        return newApp;
    }
    
    async updateApplicationStatus(id, status, notes = '') {
        await this.simulateDelay();
        const index = this.applications.findIndex(a => a.id === id);
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
                        description: 'Building responsive web applications with React and Tailwind CSS.'
                    })
                ],
                education: [
                    new Education({
                        id: 'ed1',
                        institution: 'University of Skopje',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Computer Science',
                        startDate: '2020-09-01',
                        endDate: '2024-06-30',
                        grade: '9.5/10'
                    })
                ],
                academyAttendance: [
                    new AcademyAttendance({
                        id: 'aa1',
                        academyName: 'Avenga Academy',
                        track: 'Frontend Development',
                        startDate: '2024-02-01',
                        endDate: '2024-05-31',
                        status: 'completed'
                    })
                ],
                skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'REST APIs'],
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
        return this.cvProfiles.find(cv => cv.userId === userId) || new CVProfile({ userId });
    }
    
    async bulkImportStudents(rows) {
        await this.simulateDelay(600);
        const results = { created: [], failed: [] };

        for (const row of rows) {
            const duplicate = this.users.find(u => u.email.toLowerCase() === row.email.toLowerCase());
            if (duplicate) {
                results.failed.push({ row, reason: `Email already registered: ${row.email}` });
                continue;
            }

            const ids = this.users.map(u => parseInt(u.id)).filter(n => !isNaN(n));
            const nextId = String(Math.max(0, ...ids) + 1 + results.created.length);

            const newUser = new User({
                id: nextId,
                email: row.email,
                name: row.name,
                role: 'student',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=667eea&color=fff`,
                phone: row.phone || '',
                dateOfBirth: row.dateofbirth || '',
                citizenship: row.citizenship || '',
                educationDegree: row.educationdegree || '',
                profileStatus: 'pending',
                accountStatus: 'active',
            });

            this.users.push(newUser);

            const academyAttendance = row.academytrack
                ? [new AcademyAttendance({
                    id: 'aa_import_' + nextId,
                    academyName: row.academyname || 'Avenga Academy',
                    track: row.academytrack,
                    startDate: row.academystartdate || '',
                    endDate: row.academyenddate || '',
                    status: 'active'
                })]
                : [];

            this.cvProfiles.push(new CVProfile({
                userId: nextId,
                academyAttendance,
                skills: [],
                languages: []
            }));

            results.created.push(newUser);
        }

        return results;
    }

    async assignStudentProgramme(userId, programmeData) {
        await this.simulateDelay();
        const attendance = new AcademyAttendance({
            id: programmeData.id,
            academyName: programmeData.academyName,
            track: programmeData.track,
            startDate: programmeData.startDate,
            endDate: programmeData.endDate,
            status: programmeData.status,
        });
        const index = this.cvProfiles.findIndex(cv => cv.userId === userId);
        if (index !== -1) {
            const existing = [...this.cvProfiles[index].academyAttendance];
            if (existing.length > 0) {
                existing[0] = attendance;
            } else {
                existing.unshift(attendance);
            }
            this.cvProfiles[index] = new CVProfile({
                ...this.cvProfiles[index],
                academyAttendance: existing,
                updatedAt: new Date().toISOString(),
            });
            return this.cvProfiles[index];
        }
        const newCV = new CVProfile({ userId, academyAttendance: [attendance] });
        this.cvProfiles.push(newCV);
        return newCV;
    }

    async updateCVProfile(userId, cvData) {
        await this.simulateDelay();
        const index = this.cvProfiles.findIndex(cv => cv.userId === userId);
        if (index !== -1) {
            this.cvProfiles[index] = new CVProfile({ ...this.cvProfiles[index], ...cvData, updatedAt: new Date().toISOString() });
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
                userPhoto: 'https://ui-avatars.com/api/?name=Jane+Smith&background=764ba2&color=fff',
                company: 'TechCorp Solutions',
                position: 'Senior Full Stack Developer',
                academy: 'Avenga Academy - Full Stack Track',
                excerpt: 'From academy student to senior developer in just 2 years...',
                fullStory: 'My journey started at Avenga Academy where I learned modern web development. After graduating, I joined TechCorp as a junior developer and quickly advanced through the ranks...',
                publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            })
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
                registeredCount: 45
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
                registeredCount: 32
            })
        ];
    }
    
    async getEvents() {
        await this.simulateDelay();
        return this.events;
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
                { skill: 'SQL', count: 120 }
            ],
            topCompanies: [
                { company: 'TechCorp Solutions', jobCount: 28 },
                { company: 'InnoSoft', jobCount: 22 },
                { company: 'CloudTech Systems', jobCount: 19 }
            ],
            monthlyGrowth: { users: 12, jobs: 8, applications: 45 }
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
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export default new MockDataService();
