/**
 * Admin Analytics Controller
 * Platform analytics dashboard for administrators
 */
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
                </div>
            </div>
        </div>
    `;
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => authService.logout());
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
                    <i class="fas fa-filter-circle-dollar text-purple-600 mr-2"></i>
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
