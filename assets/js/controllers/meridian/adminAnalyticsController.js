/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators with Event Attendance Analytics
 */

//import Chart from 'chart.js/auto';
import authService from '../../services/authService.js';
import mockDataService from '../../services/mockDataService.js';
import { renderAppHeader } from '../../views/appHeader.js';

const platformOverviewTrends = [
    { month: 'Nov', totalStudents: 168, activeJobs: 98, totalApplications: 742, eventsHeld: 21 },
    { month: 'Dec', totalStudents: 181, activeJobs: 106, totalApplications: 816, eventsHeld: 24 },
    { month: 'Jan', totalStudents: 196, activeJobs: 119, totalApplications: 912, eventsHeld: 27 },
    { month: 'Feb', totalStudents: 211, activeJobs: 131, totalApplications: 1034, eventsHeld: 30 },
    { month: 'Mar', totalStudents: 227, activeJobs: 144, totalApplications: 1148, eventsHeld: 34 },
    { month: 'Apr', totalStudents: 245, activeJobs: 156, totalApplications: 1247, eventsHeld: 38 },
];

const studentEngagementMetrics = {
    profileCompletionRate: 76,
    averageLoginFrequency: 3.4,
    disengagedStudents: 45,
    dashboardInteractions: [
        { label: 'Job search', count: 1840, share: 34 },
        { label: 'Profile updates', count: 1218, share: 22 },
        { label: 'Applications', count: 1076, share: 20 },
        { label: 'Event views', count: 782, share: 14 },
        { label: 'Messages', count: 541, share: 10 },
    ],
    cohorts: [
        {
            name: 'Frontend Development',
            students: 84,
            profileCompletionRate: 82,
            averageLoginFrequency: 4.1,
            dashboardInteractions: 1720,
            disengagedStudents: 9,
            risk: 'Low',
        },
        {
            name: 'Backend Development',
            students: 68,
            profileCompletionRate: 74,
            averageLoginFrequency: 3.3,
            dashboardInteractions: 1264,
            disengagedStudents: 13,
            risk: 'Medium',
        },
        {
            name: 'QA Engineering',
            students: 51,
            profileCompletionRate: 67,
            averageLoginFrequency: 2.4,
            dashboardInteractions: 718,
            disengagedStudents: 17,
            risk: 'High',
        },
        {
            name: 'Data Analytics',
            students: 42,
            profileCompletionRate: 79,
            averageLoginFrequency: 3.8,
            dashboardInteractions: 936,
            disengagedStudents: 6,
            risk: 'Low',
        },
    ],
};

const jobApplicationFunnelMetrics = {
    stages: [
        { label: 'Job Views', count: 8420, conversionRate: 100 },
        { label: 'Saved Jobs', count: 2314, conversionRate: 27 },
        { label: 'Applications Started', count: 1568, conversionRate: 19 },
        { label: 'Applications Submitted', count: 1247, conversionRate: 15 },
        { label: 'Positive Outcomes', count: 214, conversionRate: 3 },
    ],
    listingInsights: [
        {
            listing: 'Frontend Developer Intern',
            employer: 'TechCorp Solutions',
            views: 1640,
            saves: 512,
            applications: 284,
            outcomes: 48,
            dropOffRisk: 'Low',
        },
        {
            listing: 'QA Automation Trainee',
            employer: 'CloudTech Systems',
            views: 1184,
            saves: 236,
            applications: 92,
            outcomes: 11,
            dropOffRisk: 'High',
        },
        {
            listing: 'Junior Backend Developer',
            employer: 'InnoSoft',
            views: 1398,
            saves: 388,
            applications: 211,
            outcomes: 37,
            dropOffRisk: 'Medium',
        },
        {
            listing: 'Data Analyst Internship',
            employer: 'DataWorks Analytics',
            views: 986,
            saves: 301,
            applications: 174,
            outcomes: 29,
            dropOffRisk: 'Low',
        },
    ],
};

export default async function adminAnalyticsController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        window.router.navigate('/dashboard');
        return;
    }

    const analytics = await mockDataService.getAnalytics();
    const events = mockDataService.generateMockEvents();
    const companies = mockDataService.generateMockCompanies();
    const jobs = mockDataService.generateMockJobs();
    const applications = mockDataService.generateMockApplications();
    const companyMetrics = getCompanyPerformanceMetrics(companies, jobs, applications);
    const unresponsiveEmployers = identifyUnresponsiveEmployers(companies, jobs, applications);

    app.innerHTML = `
        ${renderAppHeader(user, window.location.pathname)}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in">
                    <div class="mb-8">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">
                            <i class="fas fa-chart-line text-purple-600 mr-3"></i>
                            Platform Analytics
                        </h1>
                        <p class="text-gray-600">Platform growth, health, and student engagement metrics</p>
                    </div>

                    ${renderPlatformOverviewSection(analytics, platformOverviewTrends)}
                    ${renderStudentEngagementSection(studentEngagementMetrics)}
                    ${renderJobApplicationFunnelSection(jobApplicationFunnelMetrics)}
                    ${renderEventAttendanceAnalyticsSection(events)}
                    ${renderCompanyPerformanceSection(companyMetrics)}
                    ${renderUnresponsiveEmployersSection(unresponsiveEmployers)}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initializeEventCharts({
            events,
            registrationCounts: getRegistrationCounts(events),
            attendanceRates: getActualAttendanceRates(events),
            noShowRates: getNoShowRates(events),
            programmeBreakdown: getProgrammeBreakdown(events),
            effectiveness: evaluateEventEffectiveness(events),
        });
    }, 100);

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }
}

function renderPlatformOverviewSection(analytics, trends) {
    const latestEventsHeld = getLatestTrendValue(trends, 'eventsHeld');

    return `
        <section>
            <div class="grid md:grid-cols-4 gap-6 mb-8">
                ${renderPlatformKpiCard(
                    'Total Students',
                    analytics.totalStudents,
                    getTrendChange(trends, 'totalStudents'),
                    'fa-user-graduate',
                    'bg-gradient-to-br from-blue-500 to-blue-600',
                    'text-blue-100'
                )}
                ${renderPlatformKpiCard(
                    'Active Job Listings',
                    analytics.activeJobs,
                    getTrendChange(trends, 'activeJobs'),
                    'fa-briefcase',
                    'bg-gradient-to-br from-purple-500 to-purple-600',
                    'text-purple-100'
                )}
                ${renderPlatformKpiCard(
                    'Total Applications',
                    analytics.totalApplications,
                    getTrendChange(trends, 'totalApplications'),
                    'fa-file-alt',
                    'bg-gradient-to-br from-green-500 to-green-600',
                    'text-green-100'
                )}
                ${renderPlatformKpiCard(
                    'Events Held',
                    latestEventsHeld,
                    getTrendChange(trends, 'eventsHeld'),
                    'fa-calendar-check',
                    'bg-gradient-to-br from-orange-500 to-orange-600',
                    'text-orange-100'
                )}
            </div>

            <div class="card">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">
                            <i class="fas fa-chart-area text-purple-600 mr-2"></i>
                            Platform KPI Trends
                        </h2>
                        <p class="text-gray-600 text-sm mt-1">Monthly trend data for students, jobs, applications, and events held</p>
                    </div>
                    <p class="text-sm text-gray-500">${trends[0].month} - ${trends[trends.length - 1].month}</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th class="py-3 pr-4 font-semibold">Month</th>
                                <th class="py-3 px-4 font-semibold">Students</th>
                                <th class="py-3 px-4 font-semibold">Active Jobs</th>
                                <th class="py-3 px-4 font-semibold">Applications</th>
                                <th class="py-3 pl-4 font-semibold">Events Held</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${trends.map((trend) => renderPlatformTrendRow(trend)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `;
}

function renderPlatformKpiCard(title, value, change, icon, backgroundClass, labelClass) {
    return `
        <div class="card ${backgroundClass} text-white">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="${labelClass} mb-1">${title}</p>
                    <h3 class="text-4xl font-bold">${formatNumber(value)}</h3>
                    <p class="text-sm text-white/80 mt-3">
                        <i class="fas fa-arrow-trend-up mr-1"></i>
                        +${change}% over period
                    </p>
                </div>
                <i class="fas ${icon} text-3xl text-white/40"></i>
            </div>
        </div>
    `;
}

function renderPlatformTrendRow(trend) {
    return `
        <tr class="text-sm text-gray-700">
            <td class="py-4 pr-4 font-semibold text-gray-900">${trend.month}</td>
            <td class="py-4 px-4">${formatNumber(trend.totalStudents)}</td>
            <td class="py-4 px-4">${formatNumber(trend.activeJobs)}</td>
            <td class="py-4 px-4">${formatNumber(trend.totalApplications)}</td>
            <td class="py-4 pl-4">${formatNumber(trend.eventsHeld)}</td>
        </tr>
    `;
}

function renderStudentEngagementSection(metrics) {
    return `
        <section class="mt-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-user-check text-purple-600 mr-2"></i>
                    Student Engagement Metrics
                </h2>
                <p class="text-gray-600">Profile readiness, login frequency, and dashboard behavior by cohort</p>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-8">
                ${renderEngagementSummaryCard(
                    'Profile Completion',
                    `${metrics.profileCompletionRate}%`,
                    'students with completed profiles',
                    'fa-id-card',
                    'text-purple-600',
                    'text-purple-200'
                )}
                ${renderEngagementSummaryCard(
                    'Average Login Frequency',
                    `${metrics.averageLoginFrequency}x`,
                    'logins per student each week',
                    'fa-right-to-bracket',
                    'text-indigo-600',
                    'text-indigo-200'
                )}
                ${renderEngagementSummaryCard(
                    'Disengaged Students',
                    formatNumber(metrics.disengagedStudents),
                    'students flagged for outreach',
                    'fa-user-clock',
                    'text-yellow-600',
                    'text-yellow-200'
                )}
            </div>

            <div class="grid lg:grid-cols-5 gap-8">
                <div class="card lg:col-span-2">
                    <h3 class="text-xl font-bold text-gray-800 mb-5">
                        <i class="fas fa-chart-simple text-purple-600 mr-2"></i>
                        Dashboard Interaction Patterns
                    </h3>
                    <div class="space-y-4">
                        ${metrics.dashboardInteractions
                            .map((interaction) => renderInteractionPattern(interaction))
                            .join('')}
                    </div>
                </div>

                <div class="card lg:col-span-3 overflow-hidden">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
                        <h3 class="text-xl font-bold text-gray-800">
                            <i class="fas fa-layer-group text-purple-600 mr-2"></i>
                            Cohort Engagement
                        </h3>
                        <p class="text-sm text-gray-500">Use risk level to prioritize outreach</p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-left">
                            <thead>
                                <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                    <th class="py-3 pr-4 font-semibold">Cohort</th>
                                    <th class="py-3 px-4 font-semibold">Completion</th>
                                    <th class="py-3 px-4 font-semibold">Logins / Week</th>
                                    <th class="py-3 px-4 font-semibold">Interactions</th>
                                    <th class="py-3 px-4 font-semibold">Disengaged</th>
                                    <th class="py-3 pl-4 font-semibold">Risk</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${metrics.cohorts.map((cohort) => renderCohortRow(cohort)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderEngagementSummaryCard(title, value, description, icon, valueColor, iconColor) {
    return `
        <div class="card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-600 text-sm">${title}</p>
                    <p class="text-3xl font-bold ${valueColor}">${value}</p>
                    <p class="text-sm text-gray-500 mt-2">${description}</p>
                </div>
                <i class="fas ${icon} text-4xl ${iconColor}"></i>
            </div>
        </div>
    `;
}

function renderInteractionPattern(interaction) {
    return `
        <div>
            <div class="flex items-center justify-between gap-3 text-sm mb-2">
                <span class="font-semibold text-gray-700">${interaction.label}</span>
                <span class="text-gray-500">${formatNumber(interaction.count)} actions</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-purple-600 rounded-full" style="width:${interaction.share}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">${interaction.share}% of tracked dashboard interactions</p>
        </div>
    `;
}

function renderCohortRow(cohort) {
    return `
        <tr class="text-sm text-gray-700">
            <td class="py-4 pr-4">
                <p class="font-semibold text-gray-900">${cohort.name}</p>
                <p class="text-xs text-gray-500">${formatNumber(cohort.students)} students</p>
            </td>
            <td class="py-4 px-4">${cohort.profileCompletionRate}%</td>
            <td class="py-4 px-4">${cohort.averageLoginFrequency}x</td>
            <td class="py-4 px-4">${formatNumber(cohort.dashboardInteractions)}</td>
            <td class="py-4 px-4">${formatNumber(cohort.disengagedStudents)}</td>
            <td class="py-4 pl-4">${renderRiskBadge(cohort.risk)}</td>
        </tr>
    `;
}

function renderRiskBadge(risk) {
    const styles = {
        Low: 'bg-green-100 text-green-700',
        Medium: 'bg-yellow-100 text-yellow-700',
        High: 'bg-red-100 text-red-700',
    };

    return `
        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[risk] || styles.Medium}">
            ${risk}
        </span>
    `;
}

function renderJobApplicationFunnelSection(metrics) {
    const firstStageCount = metrics.stages[0].count;
    const finalStageCount = metrics.stages[metrics.stages.length - 1].count;
    const outcomeRate = Math.round((finalStageCount / firstStageCount) * 100);

    return `
        <section class="mt-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-filter text-purple-600 mr-2"></i>
                    Job and Application Funnel
                </h2>
                <p class="text-gray-600">Student movement from job views to saves, applications, and outcomes</p>
            </div>

            <div class="grid lg:grid-cols-5 gap-8 mb-8">
                <div class="card lg:col-span-3">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                        <h3 class="text-xl font-bold text-gray-800">
                            <i class="fas fa-chart-column text-purple-600 mr-2"></i>
                            Conversion Funnel
                        </h3>
                        <p class="text-sm text-gray-500">${outcomeRate}% of viewed jobs reached a positive outcome</p>
                    </div>
                    <div class="space-y-5">
                        ${metrics.stages.map((stage, index) => renderFunnelStage(stage, metrics.stages[index - 1])).join('')}
                    </div>
                </div>

                <div class="card lg:col-span-2">
                    <h3 class="text-xl font-bold text-gray-800 mb-5">
                        <i class="fas fa-triangle-exclamation text-yellow-600 mr-2"></i>
                        Largest Drop-Off Points
                    </h3>
                    <div class="space-y-4">
                        ${renderDropOffInsight(
                            'Views to saves',
                            getStageDropOff(metrics.stages[0], metrics.stages[1]),
                            'Students are viewing listings but not saving them for later.'
                        )}
                        ${renderDropOffInsight(
                            'Saves to started applications',
                            getStageDropOff(metrics.stages[1], metrics.stages[2]),
                            'Saved jobs are not always turning into application intent.'
                        )}
                        ${renderDropOffInsight(
                            'Submitted applications to outcomes',
                            getStageDropOff(metrics.stages[3], metrics.stages[4]),
                            'Employer review quality and feedback loops may need attention.'
                        )}
                    </div>
                </div>
            </div>

            <div class="card overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
                    <h3 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-briefcase text-purple-600 mr-2"></i>
                        Listing Funnel Performance
                    </h3>
                    <p class="text-sm text-gray-500">Use high drop-off listings for employer coaching</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th class="py-3 pr-4 font-semibold">Listing</th>
                                <th class="py-3 px-4 font-semibold">Views</th>
                                <th class="py-3 px-4 font-semibold">Saves</th>
                                <th class="py-3 px-4 font-semibold">Applications</th>
                                <th class="py-3 px-4 font-semibold">Outcomes</th>
                                <th class="py-3 pl-4 font-semibold">Drop-Off Risk</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${metrics.listingInsights.map((listing) => renderListingFunnelRow(listing)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `;
}

function renderFunnelStage(stage, previousStage) {
    const dropOff = previousStage ? getStageDropOff(previousStage, stage) : 0;

    return `
        <div>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                <div>
                    <p class="font-semibold text-gray-800">${stage.label}</p>
                    ${previousStage ? `<p class="text-xs text-red-600">${dropOff}% drop-off from previous step</p>` : '<p class="text-xs text-gray-500">Funnel starting point</p>'}
                </div>
                <div class="text-left md:text-right">
                    <p class="font-bold text-gray-900">${formatNumber(stage.count)}</p>
                    <p class="text-xs text-gray-500">${stage.conversionRate}% of total views</p>
                </div>
            </div>
            <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-purple-600 rounded-full" style="width:${stage.conversionRate}%"></div>
            </div>
        </div>
    `;
}

function renderDropOffInsight(title, percentage, description) {
    return `
        <div class="border border-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-between gap-3 mb-2">
                <p class="font-semibold text-gray-800">${title}</p>
                <span class="text-lg font-bold text-red-600">${percentage}%</span>
            </div>
            <p class="text-sm text-gray-600">${description}</p>
        </div>
    `;
}

function renderListingFunnelRow(listing) {
    return `
        <tr class="text-sm text-gray-700">
            <td class="py-4 pr-4">
                <p class="font-semibold text-gray-900">${listing.listing}</p>
                <p class="text-xs text-gray-500">${listing.employer}</p>
            </td>
            <td class="py-4 px-4">${formatNumber(listing.views)}</td>
            <td class="py-4 px-4">${formatNumber(listing.saves)}</td>
            <td class="py-4 px-4">${formatNumber(listing.applications)}</td>
            <td class="py-4 px-4">${formatNumber(listing.outcomes)}</td>
            <td class="py-4 pl-4">${renderRiskBadge(listing.dropOffRisk)}</td>
        </tr>
    `;
}

function getStageDropOff(previousStage, currentStage) {
    if (!previousStage?.count) return 0;
    return Math.round(((previousStage.count - currentStage.count) / previousStage.count) * 100);
}

function getLatestTrendValue(trends, key) {
    return trends[trends.length - 1][key] || 0;
}

function getTrendChange(trends, key) {
    if (trends.length < 2 || !trends[0][key]) return 0;

    const firstValue = trends[0][key];
    const latestValue = getLatestTrendValue(trends, key);

    return Math.round(((latestValue - firstValue) / firstValue) * 100);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value || 0);
}

/**EVENT ATTENDANCE ANALYTICS FUNCTIONS*/

// Function to get registration counts across all events
function getRegistrationCounts(events) {
    return events.reduce((total, event) => total + (event.registeredCount || 0), 0);
}

// Function to get actual attendance rates across all events
function getActualAttendanceRates(events) {
    const totalRegistered = events.reduce((sum, event) => sum + (event.registeredCount || 0), 0);
    const totalAttended = events.reduce((sum, event) => sum + (event.actualAttendance || 0), 0);
    const rate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;
    return { totalRegistered, totalAttended, rate };
}

// Function to get no-show rates across all events
function getNoShowRates(events) {
    const totalRegistered = events.reduce((sum, event) => sum + (event.registeredCount || 0), 0);
    const totalAttended = events.reduce((sum, event) => sum + (event.actualAttendance || 0), 0);
    const noShows = totalRegistered - totalAttended;
    const rate = totalRegistered > 0 ? Math.round((noShows / totalRegistered) * 100) : 0;
    return { totalRegistered, noShows, rate };
}

// Function to get breakdown by student programme across all events
function getProgrammeBreakdown(events) {
    const programmes = {};

    events.forEach((event) => {
        if (Array.isArray(event.byProgramme)) {
            event.byProgramme.forEach((prog) => {
                if (!programmes[prog.programme]) {
                    programmes[prog.programme] = {
                        registered: 0,
                        attended: 0,
                        noShow: 0,
                    };
                }
                programmes[prog.programme].registered += prog.registered || 0;
                programmes[prog.programme].attended += prog.attended || 0;
                programmes[prog.programme].noShow += prog.noShow || 0;
            });
        }
    });

    return Object.entries(programmes).map(([name, data]) => ({
        programme: name,
        ...data,
        attendanceRate:
            data.registered > 0 ? Math.round((data.attended / data.registered) * 100) : 0,
    }));
}

// Function to evaluate event effectiveness
function evaluateEventEffectiveness(events) {
    const effectiveness = events.map((event) => {
        const registered = event.registeredCount || 0;
        const attended = event.actualAttendance || 0;
        const rate = registered > 0 ? Math.round((attended / registered) * 100) : 0;
        let category = 'Low';
        if (rate >= 85) category = 'High';
        else if (rate >= 75) category = 'Medium';
        return { title: event.title, rate, category };
    });

    const highCount = effectiveness.filter((e) => e.category === 'High').length;
    const mediumCount = effectiveness.filter((e) => e.category === 'Medium').length;
    const lowCount = effectiveness.filter((e) => e.category === 'Low').length;

    return { effectiveness, highCount, mediumCount, lowCount };
}

// Function to render event attendance analytics section
function renderEventAttendanceAnalyticsSection(events) {
    const registrationCounts = getRegistrationCounts(events);
    const attendanceRates = getActualAttendanceRates(events);
    const noShowRates = getNoShowRates(events);
    const programmeBreakdown = getProgrammeBreakdown(events);
    const effectiveness = evaluateEventEffectiveness(events);

    const chartData = {
        events,
        registrationCounts,
        attendanceRates,
        noShowRates,
        programmeBreakdown,
        effectiveness,
    };

    return `
        <section class="mt-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-calendar-check text-purple-600 mr-2"></i>
                    Event Attendance Analytics
                </h2>
                <p class="text-gray-600">Comprehensive view of event attendance, no-show rates, and programme participation</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="card bg-blue-50 border-blue-200">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-blue-100 rounded-lg">
                            <i class="fas fa-user-check text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-blue-600 font-semibold">Total Registrations</p>
                            <p class="text-2xl font-bold text-blue-900">${formatNumber(registrationCounts)}</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-green-50 border-green-200">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-green-100 rounded-lg">
                            <i class="fas fa-users text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-green-600 font-semibold">Actual Attendees</p>
                            <p class="text-2xl font-bold text-green-900">${formatNumber(attendanceRates.totalAttended)}</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-purple-50 border-purple-200">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-purple-100 rounded-lg">
                            <i class="fas fa-chart-pie text-purple-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-purple-600 font-semibold">Attendance Rate</p>
                            <p class="text-2xl font-bold text-purple-900">${attendanceRates.rate}%</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-red-50 border-red-200">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-red-100 rounded-lg">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                        <div>
                            <p class="text-sm text-red-600 font-semibold">No-Show Rate</p>
                            <p class="text-2xl font-bold text-red-900">${noShowRates.rate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid lg:grid-cols-2 gap-8 mb-8">
                <!-- Attendance Rate Chart -->
                <div class="card">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar text-purple-600 mr-2"></i>
                        Event Attendance Rates
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="attendanceRateChart"></canvas>
                    </div>
                </div>

                <!-- Registration vs Attendance Chart -->
                <div class="card">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-chart-line text-purple-600 mr-2"></i>
                        Registration vs Attendance
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="registrationVsAttendanceChart"></canvas>
                    </div>
                </div>

                <!-- Programme Breakdown Chart -->
                <div class="card">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
                        Attendance by Programme
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="programmeBreakdownChart"></canvas>
                    </div>
                </div>

                <!-- No show rate -->

                <div class="card">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-user-clock text-red-600 mr-2"></i>
                        Event No-Show Rates
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="noShowChart"></canvas>
                    </div>
                </div>

            </div>

            <!-- Programme Breakdown Table -->
            <div class="card mb-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-layer-group text-purple-600 mr-2"></i>
                    Attendance Breakdown by Student Programme
                </h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th class="py-3 pr-4 font-semibold">Programme</th>
                                <th class="py-3 px-4 font-semibold">Registered</th>
                                <th class="py-3 px-4 font-semibold">Attended</th>
                                <th class="py-3 px-4 font-semibold">No-Shows</th>
                                <th class="py-3 pl-4 font-semibold">Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${programmeBreakdown
                                .map(
                                    (prog) => `
                                <tr class="text-sm text-gray-700">
                                    <td class="py-4 pr-4 font-semibold text-gray-900">${prog.programme}</td>
                                    <td class="py-4 px-4">${prog.registered}</td>
                                    <td class="py-4 px-4">${prog.attended}</td>
                                    <td class="py-4 px-4 text-red-600 font-semibold">${prog.noShow}</td>
                                    <td class="py-4 pl-4">
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold">${prog.attendanceRate}%</span>
                                            <div class="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-purple-600 rounded-full" style="width:${prog.attendanceRate}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `
                                )
                                .join('')}
                        </tbody>
                    </table>
                </div>
            </div>


            <!-- Event Effectiveness -->
            <div class="card bg-gray-50">
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-trophy text-purple-600 mr-2"></i>
                    Event Effectiveness Evaluation
                </h3>
                <div class="grid md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white rounded-lg p-4 border border-green-200">
                        <p class="text-sm font-semibold text-green-900 mb-2">High Effectiveness (85%+)</p>
                        <p class="text-3xl font-bold text-green-900">${effectiveness.highCount}</p>
                        <p class="text-xs text-gray-600 mt-2">Events with excellent attendance</p>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-yellow-200">
                        <p class="text-sm font-semibold text-yellow-900 mb-2">Medium Effectiveness (75-85%)</p>
                        <p class="text-3xl font-bold text-yellow-900">${effectiveness.mediumCount}</p>
                        <p class="text-xs text-gray-600 mt-2">Events with good attendance</p>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-red-200">
                        <p class="text-sm font-semibold text-red-900 mb-2">Low Effectiveness (<75%)</p>
                        <p class="text-3xl font-bold text-red-900">${effectiveness.lowCount}</p>
                        <p class="text-xs text-gray-600 mt-2">Events needing improvement</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg p-4">
                    <h4 class="font-semibold text-gray-800 mb-3">Individual Event Performance</h4>
                    <div class="space-y-2">
                        ${effectiveness.effectiveness
                            .map(
                                (event) => `
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm font-medium text-gray-700">${event.title}</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold ${event.category === 'High' ? 'text-green-600' : event.category === 'Medium' ? 'text-yellow-600' : 'text-red-600'}">${event.rate}%</span>
                                    <span class="px-2 py-1 text-xs rounded-full ${event.category === 'High' ? 'bg-green-100 text-green-700' : event.category === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">${event.category}</span>
                                </div>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Function to initialize charts using Chart.js
function initializeEventCharts(chartData) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    Chart.getChart('attendanceRateChart')?.destroy();
    Chart.getChart('registrationVsAttendanceChart')?.destroy();
    Chart.getChart('programmeBreakdownChart')?.destroy();
    Chart.getChart('effectivenessChart')?.destroy();
    Chart.getChart('noShowChart')?.destroy();

    const { events, programmeBreakdown, effectiveness } = chartData;

    // Attendance Rate Chart
    const ctx1 = document.getElementById('attendanceRateChart');
    if (ctx1) {
        const attendanceRates = getActualAttendanceRates(events);
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: events.map((e) => e.title.substring(0, 20)),
                datasets: [
                    {
                        label: 'Attendance Rate (%)',
                        data: events.map((e) => {
                            const reg = e.registeredCount || 0;
                            const att = Math.round(reg * 0.82);
                            return reg > 0 ? Math.round((att / reg) * 100) : 0;
                        }),
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } },
            },
        });
    }

    // No-Show Rate Chart
    const ctx5 = document.getElementById('noShowChart');
    if (ctx5) {
        new Chart(ctx5, {
            type: 'line',
            data: {
                labels: events.map((e) => e.title.substring(0, 20)),
                datasets: [
                    {
                        label: 'No-Show Rate (%)',
                        data: events.map((e) => {
                            const registered = e.registeredCount || 0;
                            const attended = e.actualAttendance || 0;
                            const noShow = Math.max(0, registered - attended);
                            return registered > 0 ? Math.round((noShow / registered) * 100) : 0;
                        }),
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    }

    // Registration vs Attendance Chart
    const ctx2 = document.getElementById('registrationVsAttendanceChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: events.map((e) => e.title.substring(0, 20)),
                datasets: [
                    {
                        label: 'Registered',
                        data: events.map((e) => e.registeredCount || 0),
                        borderColor: 'rgba(59, 130, 246, 1)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                    {
                        label: 'Attended',
                        data: events.map((e) => Math.round((e.registeredCount || 0) * 0.82)),
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
            },
        });
    }

    // Programme Breakdown Chart
    const ctx3 = document.getElementById('programmeBreakdownChart');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: programmeBreakdown.map((p) => p.programme),
                datasets: [
                    {
                        data: programmeBreakdown.map((p) => p.attended),
                        backgroundColor: [
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(249, 115, 22, 0.8)',
                        ],
                        borderColor: [
                            'rgba(139, 92, 246, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(249, 115, 22, 1)',
                        ],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
            },
        });
    }

    // Event Effectiveness Chart
    const ctx4 = document.getElementById('effectivenessChart');
    if (ctx4) {
        new Chart(ctx4, {
            type: 'doughnut',
            data: {
                labels: ['High (85%+)', 'Medium (75-85%)', 'Low (<75%)'],
                datasets: [
                    {
                        data: [
                            effectiveness.highCount,
                            effectiveness.mediumCount,
                            effectiveness.lowCount,
                        ],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(249, 115, 22, 1)',
                            'rgba(239, 68, 68, 1)',
                        ],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
            },
        });
    }
}

/*EMPLOYERS*/

// Employer performance dashboard sections
function renderCompanyPerformanceSection(companyMetrics) {
    const excellentCompanies = companyMetrics.filter((m) => m.healthStatus === 'excellent').length;
    const warningCompanies = companyMetrics.filter((m) => m.healthStatus === 'warning').length;
    const criticalCompanies = companyMetrics.filter((m) => m.healthStatus === 'critical').length;

    return `
        <section class="mt-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-building text-purple-600 mr-2"></i>
                    Employer Performance Metrics
                </h2>
                <p class="text-gray-600">Partner company performance metrics that impact student experience</p>
            </div>

            <div class="grid md:grid-cols-4 gap-6 mb-8">
                ${renderPerformanceSummaryCard('Excellent Performers', excellentCompanies, 'fa-star', 'bg-gradient-to-br from-green-500 to-green-600', 'Excellent response')}
                ${renderPerformanceSummaryCard('Needs Attention', warningCompanies, 'fa-exclamation-triangle', 'bg-gradient-to-br from-yellow-500 to-yellow-600', 'Monitor closely')}
                ${renderPerformanceSummaryCard('Critical Issues', criticalCompanies, 'fa-circle-xmark', 'bg-gradient-to-br from-red-500 to-red-600', 'Immediate action')}
                ${renderPerformanceSummaryCard('Companies Tracked', companyMetrics.length, 'fa-building', 'bg-gradient-to-br from-blue-500 to-blue-600', 'Total partner companies')}
            </div>

            <div class="card">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                        <i class="fas fa-table text-purple-600 mr-2"></i>
                        Company Performance Details
                    </h3>
                    <p class="text-gray-600 text-sm">Real-time metrics for all employers by company.</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left">
                        <thead>
                            <tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th class="py-3 pr-4 font-semibold">Company</th>
                                <th class="py-3 px-4 font-semibold">Plan</th>
                                <th class="py-3 px-4 font-semibold">Jobs Posted</th>
                                <th class="py-3 px-4 font-semibold">Response Rate</th>
                                <th class="py-3 px-4 font-semibold">Avg. Status Update</th>
                                <th class="py-3 px-4 font-semibold">Profile Access</th>
                                <th class="py-3 pl-4 font-semibold">Health</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${companyMetrics
                                .map((metric) => {
                                    const statusClasses =
                                        metric.healthStatus === 'excellent'
                                            ? 'bg-green-50 border-l-4 border-green-500'
                                            : metric.healthStatus === 'warning'
                                              ? 'bg-yellow-50 border-l-4 border-yellow-500'
                                              : 'bg-red-50 border-l-4 border-red-500';
                                    const responseClass =
                                        metric.applicationResponseRate >= 80
                                            ? 'text-green-600'
                                            : metric.applicationResponseRate >= 60
                                              ? 'text-yellow-600'
                                              : 'text-red-600';
                                    const updateClass =
                                        metric.averageTimeToUpdateStatus <= 5
                                            ? 'text-green-600'
                                            : metric.averageTimeToUpdateStatus <= 12
                                              ? 'text-yellow-600'
                                              : 'text-red-600';
                                    return `
                                <tr class="${statusClasses} hover:bg-opacity-80 transition-colors">
                                    <td class="py-4 pr-4 font-semibold text-gray-900">${metric.companyName}</td>
                                    <td class="py-4 px-4">
                                        <span class="px-3 py-1 text-xs rounded-full font-semibold ${metric.subscriptionPlan === 'premium' ? 'bg-purple-100 text-purple-800' : metric.subscriptionPlan === 'advanced' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                                            ${metric.subscriptionPlan}
                                        </span>
                                    </td>
                                    <td class="py-4 px-4 font-medium text-gray-700">${metric.jobsPosted}</td>
                                    <td class="py-4 px-4 font-semibold ${responseClass}">${metric.applicationResponseRate}%</td>
                                    <td class="py-4 px-4 font-semibold ${updateClass}">${metric.averageTimeToUpdateStatus}d</td>
                                    <td class="py-4 px-4 text-gray-700 font-medium">${metric.profileAccessRequests}</td>
                                    <td class="py-4 pl-4">
                                        <span class="px-3 py-1 text-xs rounded-full font-semibold ${metric.healthStatus === 'excellent' ? 'bg-green-100 text-green-800' : metric.healthStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                                            ${metric.healthStatus}
                                        </span>
                                    </td>
                                </tr>
                            `;
                                })
                                .join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `;
}

function renderPerformanceSummaryCard(title, value, icon, backgroundClass, subtitle) {
    return `
        <div class="card ${backgroundClass} text-white">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-white/80 mb-1">${title}</p>
                    <h3 class="text-4xl font-bold">${value}</h3>
                    <p class="text-sm mt-3 text-white/80">${subtitle}</p>
                </div>
                <i class="fas ${icon} text-3xl text-white/40"></i>
            </div>
        </div>
    `;
}

function renderUnresponsiveEmployersSection(unresponsiveEmployers) {
    if (unresponsiveEmployers.length === 0) {
        return `
            <section class="mt-8">
                <div class="card bg-green-50 border border-green-200">
                    <div class="flex items-center gap-4 p-6">
                        <div class="p-3 bg-green-100 rounded-lg">
                            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-green-900">All employers are responsive</h3>
                            <p class="text-green-700 mt-1">Student experience is protected; no unresponsive employers detected.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    const criticalCount = unresponsiveEmployers.filter(
        (item) => item.severity === 'critical'
    ).length;
    const warningCount = unresponsiveEmployers.filter((item) => item.severity === 'warning').length;
    return `
        <section class="mt-8">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                    Unresponsive Employers
                </h2>
                <p class="text-gray-600">Employers flagged for low response, slow updates, or inactivity.</p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <div class="card bg-red-50 border border-red-200 p-6">
                    <h3 class="text-lg font-bold text-red-800 mb-2">Critical</h3>
                    <p class="text-3xl font-bold text-red-900">${criticalCount}</p>
                    <p class="text-sm text-red-700 mt-1">Needs immediate follow-up.</p>
                </div>
                <div class="card bg-yellow-50 border border-yellow-200 p-6">
                    <h3 class="text-lg font-bold text-yellow-800 mb-2">Warning</h3>
                    <p class="text-3xl font-bold text-yellow-900">${warningCount}</p>
                    <p class="text-sm text-yellow-700 mt-1">Monitor these employers closely.</p>
                </div>
            </div>

            <div class="space-y-4">
                ${unresponsiveEmployers
                    .map((employer) => {
                        const isCritical = employer.severity === 'critical';
                        const badgeClass = isCritical
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800';
                        return `
                            <div class="card border ${isCritical ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'} p-6">
                                <div class="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h4 class="text-lg font-bold text-gray-900">${employer.companyName}</h4>
                                        <p class="text-sm text-gray-600">${employer.industry} • ${employer.subscriptionPlan} plan</p>
                                    </div>
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}">${employer.severity}</span>
                                </div>
                                <div class="grid lg:grid-cols-4 gap-3 text-sm text-gray-700">
                                    <div>
                                        <p class="font-semibold">Response Rate</p>
                                        <p>${employer.applicationResponseRate}%</p>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Avg. Update Time</p>
                                        <p>${employer.averageTimeToUpdateStatus} days</p>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Jobs Posted</p>
                                        <p>${employer.jobsPosted}</p>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Profile Access</p>
                                        <p>${employer.profileAccessRequests}</p>
                                    </div>
                                </div>
                                <div class="mt-4 text-sm text-gray-700">
                                    ${employer.flags.map((flag) => `<p class="mb-1">• ${flag}</p>`).join('')}
                                </div>
                            </div>
                        `;
                    })
                    .join('')}
            </div>
        </section>
    `;
}

function getJobsPostedByCompany(companyId, jobs) {
    return jobs.filter((job) => job.companyId === companyId && job.status === 'active').length;
}

function getApplicationResponseRate(companyId, jobs, applications) {
    const companyJobIds = jobs.filter((job) => job.companyId === companyId).map((job) => job.id);
    const companyApps = applications.filter((app) => companyJobIds.includes(app.jobId));
    if (!companyApps.length) return 0;
    const responded = companyApps.filter(
        (app) =>
            app.status !== 'pending' ||
            (app.statusUpdateHistory && app.statusUpdateHistory.length > 1)
    ).length;
    return Math.round((responded / companyApps.length) * 100);
}

function getAverageTimeToUpdateStatus(companyId, jobs, applications) {
    const companyJobIds = jobs.filter((job) => job.companyId === companyId).map((job) => job.id);
    const companyApps = applications.filter((app) => companyJobIds.includes(app.jobId));
    const updateIntervals = companyApps
        .filter((app) => app.statusUpdateHistory && app.statusUpdateHistory.length > 1)
        .map((app) => {
            const appliedAt = new Date(app.appliedAt).getTime();
            const firstUpdateAt = new Date(app.statusUpdateHistory[1].updatedAt).getTime();
            return (firstUpdateAt - appliedAt) / (1000 * 60 * 60 * 24);
        });
    if (!updateIntervals.length) return 0;
    return (
        Math.round(
            (updateIntervals.reduce((sum, days) => sum + days, 0) / updateIntervals.length) * 10
        ) / 10
    );
}

function getProfileAccessRequests(companyId, companies) {
    return companies.find((company) => company.id === companyId)?.profileAccessRequests || 0;
}

function getCompanyMetrics(companyId, company, jobs, applications) {
    const jobsPosted = getJobsPostedByCompany(companyId, jobs);
    const applicationResponseRate = getApplicationResponseRate(companyId, jobs, applications);
    const averageTimeToUpdateStatus = getAverageTimeToUpdateStatus(companyId, jobs, applications);
    const profileAccessRequests = getProfileAccessRequests(companyId, [company]);
    const totalApplications = applications.filter((app) =>
        jobs.some((j) => j.companyId === companyId && j.id === app.jobId)
    ).length;
    let healthStatus = 'excellent';
    if (applicationResponseRate < 50 || averageTimeToUpdateStatus > 15) {
        healthStatus = 'critical';
    } else if (applicationResponseRate < 70 || averageTimeToUpdateStatus > 10) {
        healthStatus = 'warning';
    }
    return {
        companyId,
        companyName: company.name,
        industry: company.industry,
        subscriptionPlan: company.subscriptionPlan,
        jobsPosted,
        totalApplications,
        applicationResponseRate,
        averageTimeToUpdateStatus,
        profileAccessRequests,
        lastActivityDate: company.lastActivityDate,
        healthStatus,
    };
}

function getCompanyPerformanceMetrics(companies, jobs, applications) {
    return companies.map((company) => getCompanyMetrics(company.id, company, jobs, applications));
}

function identifyUnresponsiveEmployers(companies, jobs, applications) {
    const metrics = getCompanyPerformanceMetrics(companies, jobs, applications);
    const inactivityThreshold = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    return metrics
        .map((metric) => {
            const lastActivity = new Date(metric.lastActivityDate);
            const flags = [];
            if (metric.applicationResponseRate < 60) {
                flags.push(`Low response rate: ${metric.applicationResponseRate}%`);
            }
            if (metric.averageTimeToUpdateStatus > 12) {
                flags.push(`Slow status updates: ${metric.averageTimeToUpdateStatus} days`);
            }
            if (lastActivity < inactivityThreshold) {
                const daysInactive = Math.floor(
                    (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
                );
                flags.push(`Inactive for ${daysInactive} days`);
            }
            return {
                ...metric,
                flags,
                severity:
                    metric.applicationResponseRate < 40 ||
                    metric.averageTimeToUpdateStatus > 20 ||
                    lastActivity < new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
                        ? 'critical'
                        : 'warning',
            };
        })
        .filter((item) => item.flags.length);
}
