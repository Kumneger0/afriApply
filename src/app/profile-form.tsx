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
      <h1 class="text-2xl font-bold mb-4 text-gray-800">
        Set Up Your AfriApply Profile
      </h1>

      <form method="post" action="/setup" class="space-y-6">
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

        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Profile and Preferences
        </button>
        {props.errors?._global &&
          props.errors._global.map((err) => (
            <p class="text-red-500 text-xs italic mt-1 text-center">{err}</p>
          ))}
      </form>

      <FormScripts />
    </Layout>
  );
};
