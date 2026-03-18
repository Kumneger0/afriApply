import type { FC } from "hono/jsx";
import type { fetchUserProfile } from "..";

type PortfolioSectionProps = {
  portfolioLinks?: NonNullable<
    Awaited<ReturnType<typeof fetchUserProfile>>
  >["portfolioLinks"];
};

export const PortfolioSection: FC<PortfolioSectionProps> = ({
  portfolioLinks,
}) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🌐</span>
          Portfolio Links
        </h2>
        <p class="text-emerald-200 mt-1">Showcase your work and projects</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-4" id="portfolio-container">
          {portfolioLinks && portfolioLinks.length > 0 ? (
            portfolioLinks.map((link) => (
              <div class="portfolio-entry">
                <input
                  type="url"
                  name="portfolioLinks[]"
                  value={link}
                  placeholder="https://your-portfolio.com"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400"
                />
              </div>
            ))
          ) : (
            <div class="portfolio-entry">
              <input
                type="url"
                name="portfolioLinks[]"
                placeholder="https://your-portfolio.com"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onclick="addPortfolioLink()"
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-300 bg-emerald-900/30 border border-emerald-500/50 rounded-lg hover:bg-emerald-900/50 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Portfolio Link
        </button>
      </div>
    </div>
  );
};
