import type { FC } from 'hono/jsx';

type EducationSectionProps = {
  educations?: Array<{ degree: string; institution: string; year: number }>;
};

export const EducationSection: FC<EducationSectionProps> = ({ educations }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Education</summary>
      <div class="mt-4 space-y-4" id="education-container">
        {educations && educations.length > 0 ? (
          educations.map(edu => (
            <div class="education-entry border-b pb-4">
              <input 
                type="text" 
                name="education_degree[]" 
                value={edu.degree} 
                placeholder="Degree"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <input 
                type="text" 
                name="education_institution[]" 
                value={edu.institution} 
                placeholder="Institution"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <input 
                type="number" 
                name="education_year[]" 
                value={edu.year} 
                placeholder="Year (e.g., 2018)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
              />
            </div>
          ))
        ) : (
          <div class="education-entry border-b pb-4">
            <input 
              type="text" 
              name="education_degree[]" 
              placeholder="Degree"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <input 
              type="text" 
              name="education_institution[]" 
              placeholder="Institution"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <input 
              type="number" 
              name="education_year[]" 
              placeholder="Year (e.g., 2018)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addEducation()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Education
      </button>
    </details>
  );
};