import type { FC } from 'hono/jsx';

type AchievementsSectionProps = {
  achievements?: string[];
};

export const AchievementsSection: FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Achievements</summary>
      <div class="mt-4 space-y-3" id="achievements-container">
        {achievements && achievements.length > 0 ? (
          achievements.map(achievement => (
            <div class="achievement-entry">
              <textarea 
                name="achievements[]" 
                placeholder="Achievement description" 
                rows={2}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              >
                {achievement}
              </textarea>
            </div>
          ))
        ) : (
          <div class="achievement-entry">
            <textarea 
              name="achievements[]" 
              placeholder="Achievement description" 
              rows={2}
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addAchievement()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Achievement
      </button>
    </details>
  );
};