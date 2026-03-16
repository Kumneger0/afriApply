import { html } from 'hono/html';
import {
  EducationLevelEnum,
  ExperienceLevelEnum,
  GenderPreferenceEnum,
  JobSiteEnum,
  JobTypeEnum,
  SectorEnum
} from '../db/schema';
import { Layout } from './layout';
import { type JobFilterPreferencesSchemaType, type UserSchemaType } from './validation';

type ProfileFormProps = {
  user?: UserSchemaType;
  jobPreferences?: JobFilterPreferencesSchemaType;
  skills?: string[];
  experiences?: Array<{ position: string; company: string; duration: string; description: string }>;
  educations?: Array<{ degree: string; institution: string; year: number }>;
  languages?: Array<{ name: string; proficiency: string }>;
  achievements?: string[];
  projects?: Array<{ name: string; description: string; link?: string }>;
  errors?: Record<string, string[]>;
};

export const ProfileForm = (props: ProfileFormProps) => Layout({
  title: "AfriApply Profile Setup",
  children: html`
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Set Up Your AfriApply Profile</h1>

    <form method="POST" action="/setup" class="space-y-6">
      <div class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
        <div class="mb-4">
          <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input type="text" id="fullName" name="fullName" value="${props.user?.fullName || ''}" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          ${props.errors?.fullName && props.errors.fullName.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" name="email" value="${props.user?.email || ''}" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          ${props.errors?.email && props.errors.email.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input type="text" id="phone" name="phone" value="${props.user?.phone || ''}"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          ${props.errors?.phone && props.errors.phone.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
        <div class="mb-4">
          <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <input type="text" id="location" name="location" value="${props.user?.location || ''}"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          ${props.errors?.location && props.errors.location.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
        <div class="mb-4">
          <label for="telegramUsername" class="block text-gray-700 text-sm font-bold mb-2">Telegram Username</label>
          <input type="text" id="telegramUsername" name="telegramUsername" value="${props.user?.telegramUsername || ''}"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          ${props.errors?.telegramUsername && props.errors.telegramUsername.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
        <div class="mb-4">
          <label for="professionalSummary" class="block text-gray-700 text-sm font-bold mb-2">Professional Summary</label>
          <textarea id="professionalSummary" name="professionalSummary" rows="4" placeholder="Brief summary of your professional background and career goals"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">${props.user?.professionalSummary || ''}</textarea>
          ${props.errors?.professionalSummary && props.errors.professionalSummary.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
      </div>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Skills</summary>
        <div class="mt-4 space-y-3" id="skills-container">
          ${props.skills && props.skills.length > 0 ? props.skills.map(skill => html`
            <div class="skill-entry flex gap-2">
              <input type="text" name="skills[]" value="${skill}" placeholder="Skill name"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          `) : html`
            <div class="skill-entry flex gap-2">
              <input type="text" name="skills[]" placeholder="Skill name"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          `}
        </div>
        <button type="button" onclick="addSkill()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Skill</button>
      </details>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Experience</summary>
        <div class="mt-4 space-y-4" id="experience-container">
          ${props.experiences && props.experiences.length > 0 ? props.experiences.map(exp => html`
            <div class="experience-entry border-b pb-4">
              <input type="text" name="experience_position[]" value="${exp.position}" placeholder="Position"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="experience_company[]" value="${exp.company}" placeholder="Company"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="experience_duration[]" value="${exp.duration}" placeholder="Duration (e.g., 2022 - Present)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <textarea name="experience_description[]" placeholder="Description" rows="3"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">${exp.description}</textarea>
            </div>
          `) : html`
            <div class="experience-entry border-b pb-4">
              <input type="text" name="experience_position[]" placeholder="Position"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="experience_company[]" placeholder="Company"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="experience_duration[]" placeholder="Duration (e.g., 2022 - Present)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <textarea name="experience_description[]" placeholder="Description" rows="3"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>
            </div>
          `}
        </div>
        <button type="button" onclick="addExperience()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Experience</button>
      </details>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Education</summary>
        <div class="mt-4 space-y-4" id="education-container">
          ${props.educations && props.educations.length > 0 ? props.educations.map(edu => html`
            <div class="education-entry border-b pb-4">
              <input type="text" name="education_degree[]" value="${edu.degree}" placeholder="Degree"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="education_institution[]" value="${edu.institution}" placeholder="Institution"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="number" name="education_year[]" value="${edu.year}" placeholder="Year (e.g., 2018)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `) : html`
            <div class="education-entry border-b pb-4">
              <input type="text" name="education_degree[]" placeholder="Degree"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="text" name="education_institution[]" placeholder="Institution"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <input type="number" name="education_year[]" placeholder="Year (e.g., 2018)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `}
        </div>
        <button type="button" onclick="addEducation()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Education</button>
      </details>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Languages</summary>
        <div class="mt-4 space-y-3" id="languages-container">
          ${props.languages && props.languages.length > 0 ? props.languages.map(lang => html`
            <div class="language-entry flex gap-2">
              <input type="text" name="language_name[]" value="${lang.name}" placeholder="Language"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              <input type="text" name="language_proficiency[]" value="${lang.proficiency}" placeholder="Proficiency (e.g., Fluent)"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `) : html`
            <div class="language-entry flex gap-2">
              <input type="text" name="language_name[]" placeholder="Language"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
              <input type="text" name="language_proficiency[]" placeholder="Proficiency (e.g., Fluent)"
                     class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `}
        </div>
        <button type="button" onclick="addLanguage()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Language</button>
      </details>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Achievements</summary>
        <div class="mt-4 space-y-3" id="achievements-container">
          ${props.achievements && props.achievements.length > 0 ? props.achievements.map(achievement => html`
            <div class="achievement-entry">
              <textarea name="achievements[]" placeholder="Achievement description" rows="2"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">${achievement}</textarea>
            </div>
          `) : html`
            <div class="achievement-entry">
              <textarea name="achievements[]" placeholder="Achievement description" rows="2"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>
            </div>
          `}
        </div>
        <button type="button" onclick="addAchievement()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Achievement</button>
      </details>

      <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
        <summary class="text-xl font-semibold cursor-pointer text-gray-700">Projects</summary>
        <div class="mt-4 space-y-4" id="projects-container">
          ${props.projects && props.projects.length > 0 ? props.projects.map(project => html`
            <div class="project-entry border-b pb-4">
              <input type="text" name="project_name[]" value="${project.name}" placeholder="Project name"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <textarea name="project_description[]" placeholder="Project description" rows="3"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline">${project.description}</textarea>
              <input type="url" name="project_link[]" value="${project.link || ''}" placeholder="Project link (optional)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `) : html`
            <div class="project-entry border-b pb-4">
              <input type="text" name="project_name[]" placeholder="Project name"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" />
              <textarea name="project_description[]" placeholder="Project description" rows="3"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"></textarea>
              <input type="url" name="project_link[]" placeholder="Project link (optional)"
                     class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />
            </div>
          `}
        </div>
        <button type="button" onclick="addProject()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">+ Add Project</button>
      </details>

      <div class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Job Search Preferences</h2>
        <div class="mb-4">
          <label for="sector" class="block text-gray-700 text-sm font-bold mb-2">Sector</label>
          <select id="sector" name="sector" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select a sector</option>
            ${SectorEnum.map(sector => html`<option value="${sector}" ${props.jobPreferences?.sector === sector ? 'selected' : ''}>${sector}</option>`).join('')}
          </select>
          ${props.errors?.sector && props.errors.sector.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Job Types</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${JobTypeEnum.map(type => html`
              <label class="inline-flex items-center text-gray-700">
                <input type="checkbox" name="jobTypes" value="${type}"
                       ${props.jobPreferences?.jobTypes?.includes(type) ? 'checked' : ''}
                       class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                <span class="ml-2">${type}</span>
              </label>
            `)}
          </div>
          ${props.errors?.jobTypes && props.errors.jobTypes.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Job Sites</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            ${JobSiteEnum.map(site => html`
              <label class="inline-flex items-center text-gray-700">
                <input type="checkbox" name="jobSites" value="${site}"
                       ${props.jobPreferences?.jobSites?.includes(site) ? 'checked' : ''}
                       class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                <span class="ml-2">${site}</span>
              </label>
            `)}
          </div>
          ${props.errors?.jobSites && props.errors.jobSites.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>

        <div class="mb-4">
          <label for="experienceLevel" class="block text-gray-700 text-sm font-bold mb-2">Experience Level</label>
          <select id="experienceLevel" name="experienceLevel"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select an experience level</option>
            ${ExperienceLevelEnum.map(level => html`
              <option value="${level}" ${props.jobPreferences?.experienceLevel === level ? 'selected' : ''}>
                ${level}
              </option>
            `)}
          </select>
          ${props.errors?.experienceLevel && props.errors.experienceLevel.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>

        <div class="mb-4">
          <label for="educationLevel" class="block text-gray-700 text-sm font-bold mb-2">Education Level</label>
          <select id="educationLevel" name="educationLevel"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select an education level</option>
            ${EducationLevelEnum.map(level => html`
              <option value="${level}" ${props.jobPreferences?.educationLevel === level ? 'selected' : ''}>
                ${level}
              </option>
            `)}
          </select>
          ${props.errors?.educationLevel && props.errors.educationLevel.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>

        <div class="mb-4">
          <label for="genderPreference" class="block text-gray-700 text-sm font-bold mb-2">Gender Preference</label>
          <select id="genderPreference" name="genderPreference"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select gender preference</option>
            ${GenderPreferenceEnum.map(gender => html`
              <option value="${gender}" ${props.jobPreferences?.genderPreference === gender ? 'selected' : ''}>
                ${gender}
              </option>
            `)}
          </select>
          ${props.errors?.genderPreference && props.errors.genderPreference.map(err => html`<p class="text-red-500 text-xs italic mt-1">${err}</p>`)}
        </div>
      </div>

      <button type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save Profile and Preferences
      </button>
      ${props.errors?._global && props.errors._global.map(err => html`<p class="text-red-500 text-xs italic mt-1 text-center">${err}</p>`)}
    </form>

    <script>
      function addSkill() {
        const container = document.getElementById('skills-container');
        const entry = document.createElement('div');
        entry.className = 'skill-entry flex gap-2';
        entry.innerHTML = '<input type="text" name="skills[]" placeholder="Skill name" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />';
        container.appendChild(entry);
      }

      function addExperience() {
        const container = document.getElementById('experience-container');
        const entry = document.createElement('div');
        entry.className = 'experience-entry border-b pb-4';
        entry.innerHTML = '<input type="text" name="experience_position[]" placeholder="Position" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="experience_company[]" placeholder="Company" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="experience_duration[]" placeholder="Duration (e.g., 2022 - Present)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><textarea name="experience_description[]" placeholder="Description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>';
        container.appendChild(entry);
      }

      function addEducation() {
        const container = document.getElementById('education-container');
        const entry = document.createElement('div');
        entry.className = 'education-entry border-b pb-4';
        entry.innerHTML = '<input type="text" name="education_degree[]" placeholder="Degree" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="education_institution[]" placeholder="Institution" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="number" name="education_year[]" placeholder="Year (e.g., 2018)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
        container.appendChild(entry);
      }

      function addLanguage() {
        const container = document.getElementById('languages-container');
        const entry = document.createElement('div');
        entry.className = 'language-entry flex gap-2';
        entry.innerHTML = '<input type="text" name="language_name[]" placeholder="Language" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" /><input type="text" name="language_proficiency[]" placeholder="Proficiency (e.g., Fluent)" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
        container.appendChild(entry);
      }

      function addAchievement() {
        const container = document.getElementById('achievements-container');
        const entry = document.createElement('div');
        entry.className = 'achievement-entry';
        entry.innerHTML = '<textarea name="achievements[]" placeholder="Achievement description" rows="2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>';
        container.appendChild(entry);
      }

      function addProject() {
        const container = document.getElementById('projects-container');
        const entry = document.createElement('div');
        entry.className = 'project-entry border-b pb-4';
        entry.innerHTML = '<input type="text" name="project_name[]" placeholder="Project name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><textarea name="project_description[]" placeholder="Project description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"></textarea><input type="url" name="project_link[]" placeholder="Project link (optional)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
        container.appendChild(entry);
      }
    </script>
  `
});
