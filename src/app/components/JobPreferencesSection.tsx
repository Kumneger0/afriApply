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
    <div class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Job Search Preferences</h2>
      <div class="mb-4">
        <label for="sector" class="block text-gray-700 text-sm font-bold mb-2">Sector</label>
        <select 
          id="sector" 
          name="sector" 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select a sector</option>
          {SectorEnum.map(sector => (
            <option value={sector} selected={jobPreferences?.sector === sector}>
              {sector}
            </option>
          ))}
        </select>
        {errors?.sector && errors.sector.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Job Types</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {JobTypeEnum.map(type => (
            <label class="inline-flex items-center text-gray-700">
              <input 
                type="checkbox" 
                name="jobTypes[]" 
                value={type}
                checked={jobPreferences?.jobTypes?.includes(type)}
                class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span class="ml-2">{type}</span>
            </label>
          ))}
        </div>
        {errors?.jobTypes && errors.jobTypes.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Job Sites</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {JobSiteEnum.map(site => (
            <label class="inline-flex items-center text-gray-700">
              <input 
                type="checkbox" 
                name="jobSites[]" 
                value={site}
                checked={jobPreferences?.jobSites?.includes(site)}
                class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
              />
              <span class="ml-2">{site}</span>
            </label>
          ))}
        </div>
        {errors?.jobSites && errors.jobSites.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>

      <div class="mb-4">
        <label for="experienceLevel" class="block text-gray-700 text-sm font-bold mb-2">Experience Level</label>
        <select 
          id="experienceLevel" 
          name="experienceLevel"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select an experience level</option>
          {ExperienceLevelEnum.map(level => (
            <option value={level} selected={jobPreferences?.experienceLevel === level}>
              {level}
            </option>
          ))}
        </select>
        {errors?.experienceLevel && errors.experienceLevel.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>

      <div class="mb-4">
        <label for="educationLevel" class="block text-gray-700 text-sm font-bold mb-2">Education Level</label>
        <select 
          id="educationLevel" 
          name="educationLevel"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select an education level</option>
          {EducationLevelEnum.map(level => (
            <option value={level} selected={jobPreferences?.educationLevel === level}>
              {level}
            </option>
          ))}
        </select>
        {errors?.educationLevel && errors.educationLevel.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>

      <div class="mb-4">
        <label for="genderPreference" class="block text-gray-700 text-sm font-bold mb-2">Gender Preference</label>
        <select 
          id="genderPreference" 
          name="genderPreference"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select gender preference</option>
          {GenderPreferenceEnum.map(gender => (
            <option value={gender} selected={jobPreferences?.genderPreference === gender}>
              {gender}
            </option>
          ))}
        </select>
        {errors?.genderPreference && errors.genderPreference.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
    </div>
  );
};