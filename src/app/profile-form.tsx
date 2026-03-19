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
            {props.data?.telegramChatId && (
              <div class="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl max-w-lg mx-auto backdrop-blur-sm text-center">
                <div class="flex justify-center mb-3">
                  <div class="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <span class="text-2xl">✅</span>
                  </div>
                </div>
                <p class="text-lg text-emerald-300 font-semibold mb-2">
                  Telegram Connected!
                </p>
                <p class="text-sm text-emerald-100/80 mb-5">
                  Your account is successfully linked. You will receive a notification here whenever AfriApply finishes sending a job application for you.
                </p>
                
                <div class="border-t border-emerald-500/20 pt-4 mt-2 text-left">
                  <p class="text-xs text-emerald-400 mb-2 font-medium">Not receiving notifications?</p>
                  <p class="text-xs text-emerald-200/70 mb-3">
                    If you cleared your chat or stopped the bot, you may need to reconnect.
                  </p>
                  
                  {/* Hidden verification section that can be toggled via simple JS */}
                  <button 
                    type="button" 
                    onclick="document.getElementById('reconnect-section').classList.toggle('hidden')"
                    class="text-xs text-emerald-300 underline hover:text-emerald-200 transition-colors"
                  >
                    Click here to reconnect
                  </button>
                  
                  <div id="reconnect-section" class="hidden mt-4 pt-4 border-t border-emerald-500/20">
                    {/* Verification ID with Copy */}
                    <div class="flex items-center justify-center gap-2 mb-4">
                      <code
                        id="verification-id-reconnect"
                        class="text-lg font-mono bg-emerald-950/50 px-4 py-2 rounded-lg text-emerald-200 border border-emerald-500/30 select-all"
                      >
                        {props.data.verificationId || 'Generate ID first'}
                      </code>
                      <button
                        type="button"
                        id="copy-verification-id-btn-reconnect"
                        onclick={`navigator.clipboard.writeText('${props.data.verificationId}').then(function(){var b=document.getElementById('copy-verification-id-btn-reconnect');b.textContent='✓';b.classList.add('bg-emerald-600');setTimeout(function(){b.textContent='Copy';b.classList.remove('bg-emerald-600')},2000)})`}
                        class="px-3 py-2 text-xs font-medium bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 rounded-lg border border-emerald-500/30 transition-all duration-200 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                    
                    <div class="text-xs text-emerald-200/80 space-y-1.5 mb-3 bg-emerald-950/40 p-3 rounded-lg">
                      <p>1. Open the AfriApply bot</p>
                      <p>2. Send <code class="bg-emerald-900/50 px-1 rounded">/start</code></p>
                      <p>3. Send: <code class="bg-emerald-900/50 px-1 rounded select-all">/verify {props.data.verificationId}</code></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {props.data?.verificationId && !props.data?.telegramChatId && (
              <div class="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded-2xl max-w-lg mx-auto backdrop-blur-sm">
                <p class="text-sm text-emerald-300 font-semibold mb-4 uppercase tracking-wide">
                  📱 Telegram Verification
                </p>

                {/* Verification ID with Copy */}
                <div class="flex items-center justify-center gap-3 mb-5">
                  <code
                    id="verification-id"
                    class="text-xl font-mono bg-emerald-950/50 px-5 py-2.5 rounded-lg text-emerald-200 border border-emerald-500/30 select-all"
                  >
                    {props.data.verificationId}
                  </code>
                  <button
                    type="button"
                    id="copy-verification-id-btn"
                    onclick={`navigator.clipboard.writeText('${props.data.verificationId}').then(function(){var b=document.getElementById('copy-verification-id-btn');b.textContent='✓ Copied!';b.classList.add('bg-emerald-600');setTimeout(function(){b.textContent='Copy';b.classList.remove('bg-emerald-600')},2000)})`}
                    class="px-4 py-2.5 text-sm font-medium bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 rounded-lg border border-emerald-500/30 transition-all duration-200 cursor-pointer whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>

                {/* Step-by-step Instructions */}
                <div class="text-left space-y-2.5 mb-5 bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/20">
                  <p class="text-sm text-emerald-200 font-medium mb-3">How to verify your Telegram:</p>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold text-sm min-w-[20px]">1.</span>
                    <span class="text-sm text-gray-300">Open the AfriApply bot on Telegram</span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold text-sm min-w-[20px]">2.</span>
                    <span class="text-sm text-gray-300">
                      Send <code class="text-emerald-300 bg-emerald-900/50 px-1.5 py-0.5 rounded">/start</code> to begin
                    </span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-emerald-400 font-bold text-sm min-w-[20px]">3.</span>
                    <span class="text-sm text-gray-300">Send the following command to link your account:</span>
                  </div>
                </div>

                {/* Full Command with Copy */}
                <div class="flex items-center justify-center gap-3">
                  <code
                    id="verify-command"
                    class="text-sm font-mono bg-gray-900/80 px-4 py-2.5 rounded-lg text-emerald-300 border border-emerald-500/30 select-all"
                  >
                    /verify {props.data.verificationId}
                  </code>
                  <button
                    type="button"
                    id="copy-verify-cmd-btn"
                    onclick={`navigator.clipboard.writeText('/verify ${props.data.verificationId}').then(function(){var b=document.getElementById('copy-verify-cmd-btn');b.textContent='✓ Copied!';b.classList.add('bg-emerald-600');setTimeout(function(){b.textContent='Copy';b.classList.remove('bg-emerald-600')},2000)})`}
                    class="px-4 py-2.5 text-sm font-medium bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 rounded-lg border border-emerald-500/30 transition-all duration-200 cursor-pointer whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>

                <p class="text-xs text-emerald-500 mt-4 text-center">
                  Once verified, you'll be notified here whenever AfriApply finishes sending a job application.
                </p>
              </div>
            )}
            {props.data && !props.data.verificationId && (
              <div class="mt-8 p-6 bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-2xl max-w-lg mx-auto backdrop-blur-sm text-center">
                <p class="text-sm text-amber-300 font-semibold mb-3 uppercase tracking-wide">
                  📱 Telegram Verification
                </p>
                <p class="text-sm text-gray-300 mb-5">
                  Generate a verification ID to connect your Telegram account and get notified when AfriApply finishes sending a job application.
                </p>
                <form method="post" action="/setup/generate-verification">
                  <button
                    type="submit"
                    class="px-6 py-3 text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg border border-amber-500/30 transition-all duration-200 cursor-pointer"
                  >
                    🔑 Generate Verification ID
                  </button>
                </form>
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
