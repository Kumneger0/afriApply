import type { FC } from 'hono/jsx';

type LanguagesSectionProps = {
  languages?: Array<{ name: string; proficiency: string }>;
};

export const LanguagesSection: FC<LanguagesSectionProps> = ({ languages }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Languages</summary>
      <div class="mt-4 space-y-3" id="languages-container">
        {languages && languages.length > 0 ? (
          languages.map(lang => (
            <div class="language-entry flex gap-2">
              <input 
                type="text" 
                name="language_name[]" 
                value={lang.name} 
                placeholder="Language"
                class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
              />
              <input 
                type="text" 
                name="language_proficiency[]" 
                value={lang.proficiency} 
                placeholder="Proficiency (e.g., Fluent)"
                class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
              />
            </div>
          ))
        ) : (
          <div class="language-entry flex gap-2">
            <input 
              type="text" 
              name="language_name[]" 
              placeholder="Language"
              class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
            />
            <input 
              type="text" 
              name="language_proficiency[]" 
              placeholder="Proficiency (e.g., Fluent)"
              class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addLanguage()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Language
      </button>
    </details>
  );
};