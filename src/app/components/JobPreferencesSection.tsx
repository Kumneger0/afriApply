import type { FC } from 'hono/jsx';
import {
  EducationLevelEnum,
  ExperienceLevelEnum,
  GenderPreferenceEnum,
  JobSiteEnum,
  JobTypeEnum,
  SectorEnum
} from '../../db/schema';
import type { JobFilterPreferencesSchemaType } from '../validation';

type JobPreferencesSectionProps = {
  jobPreferences?: JobFilterPreferencesSchemaType;
  errors?: Record<string, string[]>;
};

export const JobPreferencesSection: FC<JobPreferencesSectionProps> = ({ jobPreferences, errors }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-slate-600/20 to-gray-600/20 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🎯</span>
          Job Search Preferences
        </h2>
        <p class="text-gray-300 mt-1">Configure your job search filters and preferences</p>
      </div>
      
      <div class="p-8 space-y-6">
        <div>
          <label for="sector" class="block text-sm font-semibold text-gray-300 mb-2">
            Preferred Sector
          </label>
          <select 
            id="sector" 
            name="sector" 
            class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-white"
          >
            <option value="">Select a sector</option>
            {SectorEnum.map(sector => (
              <option value={sector} selected={jobPreferences?.sector === sector}>
                {sector}
              </option>
            ))}
          </select>
          {errors?.sector && errors.sector.map(err => (
            <p class="text-red-400 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>{err}
            </p>
          ))}
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Job Types
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {JobTypeEnum.map(type => (
              <label class="flex items-center p-3 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/30 cursor-pointer transition-colors duration-200">
                <input 
                  type="checkbox" 
                  name="jobTypes[]" 
                  value={type}
                  checked={jobPreferences?.jobTypes?.includes(type)}
                  class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" 
                />
                <span class="ml-3 text-gray-300 text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors?.jobTypes && errors.jobTypes.map(err => (
            <p class="text-red-400 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>{err}
            </p>
          ))}
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-300 mb-3">
            Work Location
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            {JobSiteEnum.map(site => (
              <label class="flex items-center p-3 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/30 cursor-pointer transition-colors duration-200">
                <input 
                  type="checkbox" 
                  name="jobSites[]" 
                  value={site}
                  checked={jobPreferences?.jobSites?.includes(site)}
                  class="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" 
                />
                <span class="ml-3 text-gray-300 text-sm">{site}</span>
              </label>
            ))}
          </div>
          {errors?.jobSites && errors.jobSites.map(err => (
            <p class="text-red-400 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>{err}
            </p>
          ))}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="experienceLevel" class="block text-sm font-semibold text-gray-300 mb-2">
              Experience Level
            </label>
            <select 
              id="experienceLevel" 
              name="experienceLevel"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-white"
            >
              <option value="">Select experience level</option>
              {ExperienceLevelEnum.map(level => (
                <option value={level} selected={jobPreferences?.experienceLevel === level}>
                  {level}
                </option>
              ))}
            </select>
            {errors?.experienceLevel && errors.experienceLevel.map(err => (
              <p class="text-red-400 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠️</span>{err}
              </p>
            ))}
          </div>

          <div>
            <label for="educationLevel" class="block text-sm font-semibold text-gray-300 mb-2">
              Education Level
            </label>
            <select 
              id="educationLevel" 
              name="educationLevel"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-white"
            >
              <option value="">Select education level</option>
              {EducationLevelEnum.map(level => (
                <option value={level} selected={jobPreferences?.educationLevel === level}>
                  {level}
                </option>
              ))}
            </select>
            {errors?.educationLevel && errors.educationLevel.map(err => (
              <p class="text-red-400 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠️</span>{err}
              </p>
            ))}
          </div>
        </div>

        <div>
          <label for="genderPreference" class="block text-sm font-semibold text-gray-300 mb-2">
            Gender Preference (if specified by employer)
          </label>
          <select 
            id="genderPreference" 
            name="genderPreference"
            class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 text-white"
          >
            <option value="">No preference</option>
            {GenderPreferenceEnum.map(gender => (
              <option value={gender} selected={jobPreferences?.genderPreference === gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors?.genderPreference && errors.genderPreference.map(err => (
            <p class="text-red-400 text-sm mt-1 flex items-center">
              <span class="mr-1">⚠️</span>{err}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};