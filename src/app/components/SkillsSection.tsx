import type { FC } from 'hono/jsx';

type SkillsSectionProps = {
  skills?: string[];
};

export const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Skills</summary>
      <div class="mt-4 space-y-3" id="skills-container">
        {skills && skills.length > 0 ? (
          skills.map(skill => (
            <div class="skill-entry flex gap-2">
              <input 
                type="text" 
                name="skills[]" 
                value={skill} 
                placeholder="Skill name"
                class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              />
            </div>
          ))
        ) : (
          <div class="skill-entry flex gap-2">
            <input 
              type="text" 
              name="skills[]" 
              placeholder="Skill name"
              class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addSkill()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Skill
      </button>
    </details>
  );
};