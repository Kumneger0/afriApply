import type { FC } from 'hono/jsx';

type LanguagesSectionProps = {
  languages?: Array<{ name: string; proficiency: string }>;
};

export const LanguagesSection: FC<LanguagesSectionProps> = ({ languages }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🌍</span>
          Languages
        </h2>
        <p class="text-gray-300 mt-1">Languages you speak and your proficiency level</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-4" id="languages-container">
          {languages && languages.length > 0 ? (
            languages.map(lang => (
              <div class="language-entry grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="language_name[]" 
                  value={lang.name} 
                  placeholder="Language (e.g., English, Spanish)"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  name="language_proficiency[]" 
                  value={lang.proficiency} 
                  placeholder="Proficiency (e.g., Native, Fluent, Intermediate)"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
            ))
          ) : (
            <div class="language-entry grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="language_name[]" 
                placeholder="Language (e.g., English, Spanish)"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400" 
              />
              <input 
                type="text" 
                name="language_proficiency[]" 
                placeholder="Proficiency (e.g., Native, Fluent, Intermediate)"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400" 
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addLanguage()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Language
        </button>
      </div>
    </div>
  );
};