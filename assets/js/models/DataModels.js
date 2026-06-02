/**
 * Data Models
 * JavaScript classes representing data contracts for the Avy platform
 */

/**
 * User Model
 */
export class User {
    constructor(data = {}) {
        this.id = data.id || '';
        this.email = data.email || '';
        this.name = data.name || '';
        this.role = data.role || 'student'; // student, alumni, employer, admin
        this.adminRoleId = data.adminRoleId || '';
        this.status = data.status || 'active'; // active, invited, deactivated
        this.companyId = data.companyId || ''; // For employer role
        this.avatar = data.avatar || '';
        this.phone = data.phone || '';
        this.dateOfBirth = data.dateOfBirth || '';
        this.citizenship = data.citizenship || '';
        this.linkedIn = data.linkedIn || '';
        this.portfolio = data.portfolio || '';
        this.educationDegree = data.educationDegree || '';
        this.currentPosition = data.currentPosition || '';
        this.profileVisibility = data.profileVisibility || 'public'; // public, private
        this.profileStatus = data.profileStatus || 'pending'; // pending, approved, rejected
        this.profileStatusNote = data.profileStatusNote || '';
        this.profileStatusUpdatedAt = data.profileStatusUpdatedAt || '';
        this.accountStatus = data.accountStatus || 'active'; // active, suspended, deactivated
        this.accountStatusNote = data.accountStatusNote || '';
        this.accountStatusUpdatedAt = data.accountStatusUpdatedAt || '';
        this.lastLoginAt = data.lastLoginAt || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
}

/**
 * CV/Profile Model
 */
export class CVProfile {
    constructor(data = {}) {
        this.userId = data.userId || '';
        this.workExperience = data.workExperience || []; // Array of WorkExperience
        this.education = data.education || []; // Array of Education
        this.academyAttendance = data.academyAttendance || []; // Array of AcademyAttendance
        this.additionalTraining = data.additionalTraining || [];
        this.skills = data.skills || []; // Array of strings
        this.languages = data.languages || []; // Array of Language
        // Job recommendation preferences
        this.workModePreference = data.workModePreference || 'hybrid'; // onsite, remote, hybrid
        this.locationPreference = data.locationPreference || ''; // Preferred work location
        this.salaryExpectation = data.salaryExpectation || { min: 0, max: 0, currency: 'EUR' }; // Expected salary range
        this.yearsOfExperience = data.yearsOfExperience || 0; // Calculated total years of experience
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
}

/**
 * Work Experience Model
 */
export class WorkExperience {
    constructor(data = {}) {
        this.id = data.id || '';
        this.company = data.company || '';
        this.position = data.position || '';
        this.startDate = data.startDate || '';
        this.endDate = data.endDate || ''; // Empty for current position
        this.description = data.description || '';
        this.isVolunteering = data.isVolunteering || false;
    }
}

/**
 * Education Model
 */
export class Education {
    constructor(data = {}) {
        this.id = data.id || '';
        this.institution = data.institution || '';
        this.degree = data.degree || '';
        this.fieldOfStudy = data.fieldOfStudy || '';
        this.startDate = data.startDate || '';
        this.endDate = data.endDate || '';
        this.grade = data.grade || '';
    }
}

/**
 * Academy Attendance Model
 */
export class AcademyAttendance {
    constructor(data = {}) {
        this.id = data.id || '';
        this.academyName = data.academyName || '';
        this.track = data.track || ''; // Frontend, Backend, QA, etc.
        this.startDate = data.startDate || '';
        this.endDate = data.endDate || '';
        this.status = data.status || 'completed'; // active, completed
    }
}

/**
 * Language Model
 */
export class Language {
    constructor(data = {}) {
        this.language = data.language || '';
        this.level = data.level || 'A1'; // A1, A2, B1, B2, C1, C2
    }
}

/**
 * Profile Access Log Model
 * Represents a single employer access event for a student's profile.
 * type: view | export | request | grant | deny | revoke
 * grant / deny / revoke are admin actions — employerId and ipAddress will be empty.
 */
export class ProfileAccessLog {
    constructor(data = {}) {
        this.id           = data.id           || '';
        this.studentId    = data.studentId    || '';
        this.employerId   = data.employerId   || '';
        this.employerName = data.employerName || '';
        this.companyId    = data.companyId    || '';
        this.companyName  = data.companyName  || '';
        this.type         = data.type         || 'view';
        this.details      = data.details      || '';
        this.ipAddress    = data.ipAddress    || '';
        this.timestamp    = data.timestamp    || new Date().toISOString();
    }
}

/**
 * Job Model
 */
export class Job {
    constructor(data = {}) {
        this.id = data.id || '';
        this.companyId = data.companyId || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.responsibilities = data.responsibilities || '';
        this.qualifications = data.qualifications || '';
        this.benefits = data.benefits || '';
        this.employmentType = data.employmentType || 'full-time'; // full-time, part-time, contract, internship, freelance
        this.applicationMode = data.applicationMode || 'easy_apply'; // easy_apply, cv_required
        this.location = data.location || '';
        this.workMode = data.workMode || 'onsite'; // onsite, remote, hybrid
        this.experienceLevel = data.experienceLevel || 'junior'; // intern, junior, mid, senior
        this.requiredSkills = data.requiredSkills || []; // Array of strings
        this.niceToHaveSkills = data.niceToHaveSkills || [];
        this.salaryRange = data.salaryRange || { min: 0, max: 0, currency: 'EUR' };
        this.applicationDeadline = data.applicationDeadline || '';
        this.status = data.status || 'active'; // active, paused, closed
        this.views = data.views || 0;
        this.applications = data.applications || 0;
        this.isPriority = data.isPriority || false; // Premium feature
        // Recommendation algorithm analytics
        this.recommendationViews = data.recommendationViews || 0; // Views from recommendations
        this.recommendationClicks = data.recommendationClicks || 0; // Clicks from recommendations
        this.recommendationApplications = data.recommendationApplications || 0; // Applications from recommendations
        this.averageMatchScore = data.averageMatchScore || 0; // Average match score for this job
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
}

/**
 * Company Model
 */
export class Company {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.logo = data.logo || '';
        this.industry = data.industry || '';
        this.description = data.description || '';
        this.website = data.website || '';
        this.locations = data.locations || []; // Array of strings
        this.size = data.size || ''; // 1-10, 11-50, 51-200, 201-500, 501+
        this.contactEmail = data.contactEmail || '';
        this.contactPerson = data.contactPerson || '';
        this.subscriptionPlan = data.subscriptionPlan || 'basic'; // basic, advanced, premium
        this.jobPostingLimit = data.jobPostingLimit || 5;
        this.jobPostingsUsed = data.jobPostingsUsed || 0;
        this.applicationResponseRate = data.applicationResponseRate || 0;
        this.averageTimeToUpdateStatus = data.averageTimeToUpdateStatus || 0;
        this.profileAccessRequests = data.profileAccessRequests || 0;
        this.lastActivityDate = data.lastActivityDate || new Date().toISOString();
        this.subscriptionExpiry = data.subscriptionExpiry || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
}

/**
 * Application Model
 */
export class Application {
    constructor(data = {}) {
        this.id = data.id || '';
        this.jobId = data.jobId || '';
        this.userId = data.userId || '';
        this.status = data.status || 'pending'; // pending, under_review, interview, rejected, hired
        this.coverLetter = data.coverLetter || '';
        this.cvDocument = data.cvDocument || ''; // URL to uploaded CV
        this.additionalDocuments = data.additionalDocuments || []; // Array of URLs
        this.notes = data.notes || ''; // Internal company notes
        this.appliedAt = data.appliedAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        this.statusUpdateHistory = data.statusUpdateHistory || [
            {
                status: this.status,
                updatedAt: this.updatedAt,
            },
        ];
    }
}

/**
 * Success Story Model
 */
export class SuccessStory {
    constructor(data = {}) {
        this.id = data.id || '';
        this.userId = data.userId || '';
        this.userName = data.userName || '';
        this.userPhoto = data.userPhoto || '';
        this.company = data.company || '';
        this.position = data.position || '';
        this.academy = data.academy || '';
        this.excerpt = data.excerpt || '';
        this.fullStory = data.fullStory || '';
        this.publishedAt = data.publishedAt || new Date().toISOString();
    }
}

/**
 * Event Model
 */
export class Event {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.type = data.type || 'career-day'; // career-day, workshop, networking, internship
        this.date = data.date || '';
        this.time = data.time || '';
        this.location = data.location || '';
        this.isOnline = data.isOnline || false;
        this.maxParticipants = data.maxParticipants || 0;
        this.registeredCount = data.registeredCount || 0;
        this.actualAttendance = data.actualAttendance || 0;
        this.byProgramme = data.byProgramme || [];
        this.registeredUsers = data.registeredUsers || [];
        this.organizerId = data.organizerId || '';
        this.status = data.status || 'upcoming'; // upcoming, ongoing, completed, cancelled
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}
/**
 * Event Notification Model
 */
export class EventNotification {
    constructor(data = {}) {
        this.id = data.id || '';
        this.eventId = data.eventId || '';
        this.message = data.message || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

/**
 * Resource Model
 */
export class Resource {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.type = data.type || 'article'; // cv-guide, interview-prep, protfolio-template
        this.contentBody = data.contentBody || '';
        this.externalUrl = data.externalUrl || '';
        this.isGlobal = data.isGlobal || true;
        this.programs = data.programs || [];
        this.status = data.status || 'active'; // archived
        this.viewCount = data.viewCount || Math.floor(Math.random() * 90) + 10;
        this.organizerId = data.organizerId || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

/**
 * Message Model
 */
export class Message {
    constructor(data = {}) {
        this.id = data.id || '';
        this.threadId = data.threadId || ''; // Groups messages into a conversation
        this.fromUserId = data.fromUserId || '';
        this.toUserId = data.toUserId || '';
        this.companyId = data.companyId || ''; // Optional: company context for the thread
        this.jobId = data.jobId || ''; // Optional: job context for the thread
        this.subject = data.subject || '';
        this.body = data.body || '';
        this.read = data.read || false;
        this.sentAt = data.sentAt || new Date().toISOString();
    }
}

/**
 * Notification Model
 */
export class Notification {
    constructor(data = {}) {
        this.id = data.id || '';
        this.userId = data.userId || ''; // Recipient
        this.type = data.type || 'info'; // application_status, interview_invitation, message_received, application_submitted, password_changed, registration_success, event_reminder, system_alert, info
        this.title = data.title || '';
        this.message = data.message || '';
        this.link = data.link || ''; // Optional in-app link to navigate to
        this.read = data.read || false;
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

/**
 * Analytics Model
 */
export class Analytics {
    constructor(data = {}) {
        this.totalUsers = data.totalUsers || 0;
        this.totalStudents = data.totalStudents || 0;
        this.totalAlumni = data.totalAlumni || 0;
        this.totalCompanies = data.totalCompanies || 0;
        this.totalJobs = data.totalJobs || 0;
        this.activeJobs = data.activeJobs || 0;
        this.totalApplications = data.totalApplications || 0;
        this.hiredCount = data.hiredCount || 0;
        this.averageMatchScore = data.averageMatchScore || 0;
        this.topSkills = data.topSkills || []; // Array of {skill, count}
        this.topCompanies = data.topCompanies || []; // Array of {company, jobCount}
        this.monthlyGrowth = data.monthlyGrowth || { users: 0, jobs: 0, applications: 0 };
    }
}
