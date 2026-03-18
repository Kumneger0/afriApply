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
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">
        Portfolio Links
      </summary>
      <div class="mt-4 space-y-3" id="portfolio-container">
        {portfolioLinks && portfolioLinks.length > 0 ? (
          portfolioLinks.map((link) => (
            <div class="portfolio-entry">
              <input
                type="url"
                name="portfolioLinks[]"
                value={link}
                placeholder="Portfolio/Website URL"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))
        ) : (
          <div class="portfolio-entry">
            <input
              type="url"
              name="portfolioLinks[]"
              placeholder="Portfolio/Website URL"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onclick="addPortfolioLink()"
        class="mt-3 text-blue-500 hover:text-blue-700 text-sm"
      >
        + Add Portfolio Link
      </button>
    </details>
  );
};
