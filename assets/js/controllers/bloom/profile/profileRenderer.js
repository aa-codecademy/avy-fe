import {
    formatDate,
    escapeHtml,
    monthNames,
    getYearOptions,
    getMonthOptions,
    renderDateRangeSelectors,
    renderSingleDateSelectors,
} from './profileHelpers.js';

export function renderWorkExperienceList(workExp, t) {
    if (!workExp || workExp.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptyWorkExperience') : 'No work experience added yet. Click "Add Work Experience" to get started.'}</p>`;
    }
    return workExp
        .map(
            (exp) => `
        <div class="mb-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow" data-id="${exp.id}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${escapeHtml(exp.position)}</h3>
                    <p class="text-gray-600 font-medium">${escapeHtml(exp.company)}</p>
                    <p class="text-sm text-gray-500">${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</p>
                    ${exp.endDate === 'Present' ? '<span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Current</span>' : ''}
                    ${exp.description ? `<p class="text-gray-700 mt-2 text-sm">${escapeHtml(exp.description)}</p>` : ''}
                    ${exp.isVolunteering ? '<span class="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Volunteering</span>' : ''}
                </div>
                <div class="flex gap-2">
                    <button class="edit-work-exp text-blue-600 hover:text-blue-800 transition-colors" data-id="${exp.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-work-exp text-red-600 hover:text-red-800 transition-colors" data-id="${exp.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

export function renderEducationList(education, t) {
    if (!education || education.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptyEducation') : 'No education added yet. Click "Add Education" to get started.'}</p>`;
    }
    return education
        .map(
            (edu) => `
        <div class="mb-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow" data-id="${edu.id}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${escapeHtml(edu.degree)} in ${escapeHtml(edu.fieldOfStudy)}</h3>
                    <p class="text-gray-600">${escapeHtml(edu.institution)}</p>
                    <p class="text-sm text-gray-500">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                    ${edu.endDate === 'Present' ? '<span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Current</span>' : ''}
                    ${edu.grade ? `<p class="text-sm text-gray-600 mt-1">Grade: ${escapeHtml(edu.grade)}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    <button class="edit-education text-blue-600 hover:text-blue-800 transition-colors" data-id="${edu.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-education text-red-600 hover:text-red-800 transition-colors" data-id="${edu.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

export function renderAcademyList(academies, t) {
    if (!academies || academies.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptyAcademy') : 'No academy attendance added yet. Click "Add Academy Program" to get started.'}</p>`;
    }
    return academies
        .map(
            (academy) => `
        <div class="mb-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow" data-id="${academy.id}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${escapeHtml(academy.academyName)}</h3>
                    <p class="text-gray-600">Track: ${escapeHtml(academy.track)}</p>
                    <p class="text-sm text-gray-500">${formatDate(academy.startDate)} - ${formatDate(academy.endDate)}</p>
                    ${academy.endDate === 'Present' ? '<span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Current</span>' : ''}
                </div>
                <div class="flex gap-2">
                    <button class="edit-academy text-blue-600 hover:text-blue-800 transition-colors" data-id="${academy.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-academy text-red-600 hover:text-red-800 transition-colors" data-id="${academy.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

export function renderAdditionalEducationList(additionalEdu, t) {
    if (!additionalEdu || additionalEdu.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptyAdditionalEducation') : 'No additional education or training added yet. Click "Add Training" to get started.'}</p>`;
    }
    return additionalEdu
        .map(
            (edu) => `
        <div class="mb-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow" data-id="${edu.id}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${escapeHtml(edu.courseName)}</h3>
                    ${edu.institution ? `<p class="text-gray-600">${escapeHtml(edu.institution)}</p>` : ''}
                    <p class="text-sm text-gray-500">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                    ${edu.endDate === 'Present' ? '<span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Current</span>' : ''}
                    ${edu.description ? `<p class="text-gray-700 mt-2 text-sm">${escapeHtml(edu.description)}</p>` : ''}
                    ${edu.certificateUrl ? `<p class="text-sm text-blue-600 mt-1"> <a href="${edu.certificateUrl}" target="_blank" class="hover:underline">View Certificate</a></p>` : ''}
                </div>
                <div class="flex gap-2">
                    <button class="edit-additional-edu text-blue-600 hover:text-blue-800 transition-colors" data-id="${edu.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-additional-edu text-red-600 hover:text-red-800 transition-colors" data-id="${edu.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

export function renderSkillsList(skills, t) {
    if (!skills || skills.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptySkills') : 'No skills added yet. Click "Add Skill" to get started.'}</p>`;
    }
    return skills
        .map(
            (skill, index) => `
        <div class="mb-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200 hover:shadow-sm transition-shadow" data-index="${index}">
            <div><span class="font-semibold text-gray-800 text-base">${escapeHtml(skill)}</span></div>
            <div class="flex gap-2">
                <button class="edit-skill text-blue-600 hover:text-blue-800 transition-colors" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-skill text-red-600 hover:text-red-800 transition-colors" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
        )
        .join('');
}

export function renderLanguagesList(languages, t) {
    if (!languages || languages.length === 0) {
        return `<p class="text-gray-500 text-center py-4">${t ? t('profile.emptyLanguages') : 'No languages added yet. Click "Add Language" to get started.'}</p>`;
    }
    return languages
        .map(
            (lang, index) => `
        <div class="mb-3 p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200 hover:shadow-sm transition-shadow" data-index="${index}">
            <div class="flex items-center gap-3">
                <span class="font-semibold text-gray-800 text-base">${escapeHtml(lang.language)}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">${escapeHtml(lang.level)}</span>
            </div>
            <div class="flex gap-2">
                <button class="edit-language text-blue-600 hover:text-blue-800 transition-colors" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-language text-red-600 hover:text-red-800 transition-colors" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
        )
        .join('');
}
