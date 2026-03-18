import type { FC } from 'hono/jsx';

type EducationSectionProps = {
  educations?: Array<{ degree: string; institution: string; year: number }>;
};

export const EducationSection: FC<EducationSectionProps> = ({ educations }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🎓</span>
          Education
        </h2>
        <p class="text-indigo-200 mt-1">Your academic background</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-6" id="education-container">
          {educations && educations.length > 0 ? (
            educations.map(edu => (
              <div class="education-entry bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    name="education_degree[]" 
                    value={edu.degree} 
                    placeholder="Degree (e.g., Bachelor of Science)"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                  <input 
                    type="text" 
                    name="education_institution[]" 
                    value={edu.institution} 
                    placeholder="Institution Name"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                </div>
                <input 
                  type="number" 
                  name="education_year[]" 
                  value={edu.year} 
                  placeholder="Graduation Year (e.g., 2020)"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
            ))
          ) : (
            <div class="education-entry bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  name="education_degree[]" 
                  placeholder="Degree (e.g., Bachelor of Science)"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  name="education_institution[]" 
                  placeholder="Institution Name"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
              <input 
                type="number" 
                name="education_year[]" 
                placeholder="Graduation Year (e.g., 2020)"
                class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-white placeholder-gray-400" 
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addEducation()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-300 bg-indigo-900/30 border border-indigo-500/50 rounded-lg hover:bg-indigo-900/50 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Education
        </button>
      </div>
    </div>
  );
};