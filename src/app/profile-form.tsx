import type { FC } from "hono/jsx";
import type { fetchUserProfile } from ".";
import { AchievementsSection } from "./components/AchievementsSection";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { FormScripts } from "./components/FormScripts";
import { JobPreferencesSection } from "./components/JobPreferencesSection";
import { LanguagesSection } from "./components/LanguagesSection";
import { PersonalInfoSection } from "./components/PersonalInfoSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";
import { Layout } from "./layout";

type ProfileFormProps = {
  data?: NonNullable<Awaited<ReturnType<typeof fetchUserProfile>>>;
  errors?: Record<string, string[]>;
};

export const ProfileForm: FC<ProfileFormProps> = (props) => {
  return (
    <Layout title="AfriApply Profile Setup">
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div class="container mx-auto px-4 py-8">
          {/* Header */}
          <div class="text-center mb-12">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Welcome to AfriApply
            </h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">
              Set up your professional profile to start receiving personalized job matches and automated applications
            </p>
            {props.data?.verificationId && (
              <div class="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl max-w-md mx-auto backdrop-blur-sm">
                <p class="text-sm text-emerald-300 font-medium mb-3">
                  📱 Your Telegram Verification ID:
                </p>
                <code class="text-xl font-mono bg-emerald-950/50 px-4 py-2 rounded-lg text-emerald-200 border border-emerald-500/30">
                  {props.data.verificationId}
                </code>
                <p class="text-xs text-emerald-400 mt-3">
                  Use this ID with your Telegram bot: /verify {props.data.verificationId}
                </p>
              </div>
            )}
          </div>

          <form method="post" action="/setup" class="max-w-4xl mx-auto">
            <div class="space-y-8">
              <PersonalInfoSection user={props.data} errors={props.errors} />
              <PortfolioSection portfolioLinks={props.data?.portfolioLinks} />
              <SkillsSection skills={props.data?.skills} />
              <ExperienceSection experiences={props.data?.experiences} />
              <EducationSection educations={props.data?.educations} />
              <LanguagesSection languages={props.data?.languages} />
              <AchievementsSection achievements={props.data?.achievements} />
              <ProjectsSection projects={props.data?.projects} />
              <JobPreferencesSection
                jobPreferences={props.data?.jobPreferences}
                errors={props.errors}
              />

              {/* Submit Button */}
              <div class="flex justify-center pt-8">
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
                >
                  Save Profile & Start Job Search
                </button>
              </div>

              {/* Global Errors */}
              {props.errors?._global && (
                <div class="max-w-2xl mx-auto">
                  {props.errors._global.map((err) => (
                    <div class="bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl text-center backdrop-blur-sm">
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <FormScripts />
    </Layout>
  );
};
