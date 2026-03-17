import type { FC } from 'hono/jsx';

type ExperienceSectionProps = {
  experiences?: Array<{ position: string; company: string; duration: string; description: string }>;
};

export const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Experience</summary>
      <div class="mt-4 space-y-4" id="experience-container">
        {experiences && experiences.length > 0 ? (
          experiences.map(exp => (
            <div class="experience-entry border-b pb-4">
              <input 
                type="text" 
                name="experience_position[]" 
                value={exp.position} 
                placeholder="Position"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <input 
                type="text" 
                name="experience_company[]" 
                value={exp.company} 
                placeholder="Company"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <input 
                type="text" 
                name="experience_duration[]" 
                value={exp.duration} 
                placeholder="Duration (e.g., 2022 - Present)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <textarea 
                name="experience_description[]" 
                placeholder="Description" 
                rows={3}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                {exp.description}
              </textarea>
            </div>
          ))
        ) : (
          <div class="experience-entry border-b pb-4">
            <input 
              type="text" 
              name="experience_position[]" 
              placeholder="Position"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <input 
              type="text" 
              name="experience_company[]" 
              placeholder="Company"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <input 
              type="text" 
              name="experience_duration[]" 
              placeholder="Duration (e.g., 2022 - Present)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <textarea 
              name="experience_description[]" 
              placeholder="Description" 
              rows={3}
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addExperience()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Experience
      </button>
    </details>
  );
};