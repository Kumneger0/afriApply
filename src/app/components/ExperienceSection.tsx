import type { FC } from 'hono/jsx';

type ExperienceSectionProps = {
  experiences?: Array<{ position: string; company: string; duration: string; description: string }>;
};

export const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">💼</span>
          Work Experience
        </h2>
        <p class="text-blue-200 mt-1">Your professional work history</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-6" id="experience-container">
          {experiences && experiences.length > 0 ? (
            experiences.map(exp => (
              <div class="experience-entry bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    name="experience_position[]" 
                    value={exp.position} 
                    placeholder="Job Title"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                  <input 
                    type="text" 
                    name="experience_company[]" 
                    value={exp.company} 
                    placeholder="Company Name"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                </div>
                <div class="mb-4">
                  <input 
                    type="text" 
                    name="experience_duration[]" 
                    value={exp.duration} 
                    placeholder="Duration (e.g., Jan 2022 - Present)"
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                </div>
                <textarea 
                  name="experience_description[]" 
                  placeholder="Describe your key responsibilities and achievements..." 
                  rows={3}
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
                >
                  {exp.description}
                </textarea>
              </div>
            ))
          ) : (
            <div class="experience-entry bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  name="experience_position[]" 
                  placeholder="Job Title"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  name="experience_company[]" 
                  placeholder="Company Name"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
              <div class="mb-4">
                <input 
                  type="text" 
                  name="experience_duration[]" 
                  placeholder="Duration (e.g., Jan 2022 - Present)"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
              <textarea 
                name="experience_description[]" 
                placeholder="Describe your key responsibilities and achievements..." 
                rows={3}
                class="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addExperience()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 border border-blue-500/50 rounded-lg hover:bg-blue-900/50 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Experience
        </button>
      </div>
    </div>
  );
};