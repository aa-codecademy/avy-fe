export function generateDemoApplications(allJobs, companies, user) {
    if (!allJobs?.length || !companies?.length) {
        return [];
    }

    const timestamp = Date.now();

    const safeGetJob = (index, fallbackId) => {
        return (
            allJobs[index] || {
                id: fallbackId,
                title: 'Unknown Position',
                companyId: 'unknown',
                location: 'Not specified',
                employmentType: 'full-time',
            }
        );
    };

    const safeGetCompany = (companyId, fallbackName, fallbackEmail) => {
        const company = companies.find((c) => c.id === companyId);
        return {
            name: company?.name || fallbackName,
            email: company?.contactEmail || fallbackEmail,
        };
    };

    const job1 = safeGetJob(4, 'j5');
    const company1 = safeGetCompany(job1.companyId, 'TechCorp', 'hr@techcorp.com');

    const job2 = safeGetJob(1, 'j2');
    const company2 = safeGetCompany(job2.companyId, 'InnoSoft', 'hr@innosoft.com');

    const job3 = safeGetJob(2, 'j3');
    const company3 = safeGetCompany(job3.companyId, 'DataWorks', 'hr@dataworks.com');

    const job4 = safeGetJob(3, 'j4');
    const company4 = safeGetCompany(job4.companyId, 'CloudTech', 'hr@cloudtech.com');

    const job5 = safeGetJob(0, 'j1');
    const company5 = safeGetCompany(job5.companyId, 'TechCorp', 'hr@techcorp.com');

    return [
        {
            id: `demo_pending_1`,
            jobId: job1.id,
            userId: user.id,
            status: 'pending',
            jobTitle: job1.title,
            companyId: job1.companyId,
            companyName: company1.name,
            companyEmail: company1.email,
            location: job1.location,
            employmentType: job1.employmentType,
            appliedDate: new Date(timestamp - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'applications.applicationSubmitted',
            updatedAt: new Date(timestamp - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: `demo_interview_1`,
            jobId: job2.id,
            userId: user.id,
            status: 'interview',
            jobTitle: job2.title,
            companyId: job2.companyId,
            companyName: company2.name,
            companyEmail: company2.email,
            location: job2.location,
            employmentType: job2.employmentType,
            appliedDate: new Date(timestamp - 12 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'applications.technicalInterview',
            updatedAt: new Date(timestamp - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: `demo_accepted_1`,
            jobId: job3.id,
            userId: user.id,
            status: 'accepted',
            jobTitle: job3.title,
            companyId: job3.companyId,
            companyName: company3.name,
            companyEmail: company3.email,
            location: job3.location,
            employmentType: job3.employmentType,
            appliedDate: new Date(timestamp - 30 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'OFFER ACCEPTED! Start date: June 1st, 2026',
            updatedAt: new Date(timestamp - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: `demo_rejected_1`,
            jobId: job4.id,
            userId: user.id,
            status: 'rejected',
            jobTitle: job4.title,
            companyId: job4.companyId,
            companyName: company4.name,
            companyEmail: company4.email,
            location: job4.location,
            employmentType: job4.employmentType,
            appliedDate: new Date(timestamp - 20 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'applications.positionFilled',
            updatedAt: new Date(timestamp - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: `demo_declined_1`,
            jobId: job5.id,
            userId: user.id,
            status: 'declined',
            jobTitle: job5.title,
            companyId: job5.companyId,
            companyName: company5.name,
            companyEmail: company5.email,
            location: job5.location,
            employmentType: job5.employmentType,
            appliedDate: new Date(timestamp - 14 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'applications.applicationCancelled',
            updatedAt: new Date(timestamp - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
}
