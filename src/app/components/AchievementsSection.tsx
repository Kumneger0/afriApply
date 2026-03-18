import type { FC } from 'hono/jsx';

type AchievementsSectionProps = {
  achievements?: string[];
};

export const AchievementsSection: FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🏆</span>
          Achievements
        </h2>
        <p class="text-gray-300 mt-1">Awards, certifications, and notable accomplishments</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-4" id="achievements-container">
          {achievements && achievements.length > 0 ? (
            achievements.map(achievement => (
              <div class="achievement-entry">
                <textarea 
                  name="achievements[]" 
                  placeholder="Describe your achievement (e.g., AWS Certified Solutions Architect, Employee of the Year 2023)" 
                  rows={3}
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
                >
                  {achievement}
                </textarea>
              </div>
            ))
          ) : (
            <div class="achievement-entry">
              <textarea 
                name="achievements[]" 
                placeholder="Describe your achievement (e.g., AWS Certified Solutions Architect, Employee of the Year 2023)" 
                rows={3}
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addAchievement()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Achievement
        </button>
      </div>
    </div>
  );
};