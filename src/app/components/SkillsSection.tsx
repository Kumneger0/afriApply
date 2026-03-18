import type { FC } from 'hono/jsx';

type SkillsSectionProps = {
  skills?: string[];
};

export const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-orange-900/50 to-amber-900/50 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🛠️</span>
          Skills
        </h2>
        <p class="text-orange-200 mt-1">List your technical and professional skills</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-4" id="skills-container">
          {skills && skills.length > 0 ? (
            skills.map(skill => (
              <div class="skill-entry">
                <input 
                  type="text" 
                  name="skills[]" 
                  value={skill} 
                  placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
            ))
          ) : (
            <div class="skill-entry">
              <input 
                type="text" 
                name="skills[]" 
                placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-white placeholder-gray-400" 
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addSkill()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-orange-300 bg-orange-900/30 border border-orange-500/50 rounded-lg hover:bg-orange-900/50 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Skill
        </button>
      </div>
    </div>
  );
};