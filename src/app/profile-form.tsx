import type { FC } from 'hono/jsx';
import { Layout } from './layout';
import { type JobFilterPreferencesSchemaType, type UserSchemaType } from './validation';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { PortfolioSection } from './components/PortfolioSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { LanguagesSection } from './components/LanguagesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { JobPreferencesSection } from './components/JobPreferencesSection';
import { FormScripts } from './components/FormScripts';

type ProfileFormProps = {
  user?: UserSchemaType;
  jobPreferences?: JobFilterPreferencesSchemaType;
  skills?: string[];
  experiences?: Array<{ position: string; company: string; duration: string; description: string }>;
  educations?: Array<{ degree: string; institution: string; year: number }>;
  languages?: Array<{ name: string; proficiency: string }>;
  achievements?: string[];
  projects?: Array<{ name: string; description: string; link?: string }>;
  portfolioLinks?: string[];
  errors?: Record<string, string[]>;
};

export const ProfileForm: FC<ProfileFormProps> = (props) => {
  return (
    <Layout title="AfriApply Profile Setup">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">Set Up Your AfriApply Profile</h1>

      <form method="post" action="/setup" class="space-y-6">
        <PersonalInfoSection user={props.user} errors={props.errors} />
        <PortfolioSection portfolioLinks={props.portfolioLinks} />
        <SkillsSection skills={props.skills} />
        <ExperienceSection experiences={props.experiences} />
        <EducationSection educations={props.educations} />
        <LanguagesSection languages={props.languages} />
        <AchievementsSection achievements={props.achievements} />
        <ProjectsSection projects={props.projects} />
        <JobPreferencesSection jobPreferences={props.jobPreferences} errors={props.errors} />

        <button 
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Profile and Preferences
        </button>
        {props.errors?._global && props.errors._global.map(err => (
          <p class="text-red-500 text-xs italic mt-1 text-center">{err}</p>
        ))}
      </form>

      <FormScripts />
    </Layout>
  );
};