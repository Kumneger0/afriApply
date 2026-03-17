import { eq } from "drizzle-orm";
import type { UserProfile } from "../ai/aiHelper";
import { db } from "../db";
import { scrapingState, users } from "../db/schema";

export const getUserProfile = async () => {
  const user = await db.select().from(users).limit(1).get();
  if (!user) {
    throw new Error(
      "No user profile found. Please set up your profile first at /setup",
    );
  }

  const userProfile = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, user.id),
    with: {
      skills: true,
      experiences: true,
      educations: true,
      languages: true,
      achievements: true,
      projects: true,
      jobFilterPreferences: true,
    },
  });

  if (!userProfile) {
    throw new Error("Failed to load user profile");
  }

  const profileData: UserProfile = {
    personalInfo: {
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone ?? undefined,
      location: userProfile.location ?? undefined,
      telegramUsername: userProfile.telegramUsername ?? undefined,
    },
    professionalSummary: userProfile.professionalSummary || "",
    skills: userProfile.skills.map((s) => s.name),
    experience: userProfile.experiences.map((e) => ({
      position: e.position,
      company: e.company,
      duration: e.duration,
      description: e.description,
    })),
    education: userProfile.educations[0]
      ? {
          degree: userProfile.educations[0].degree,
          institution: userProfile.educations[0].institution,
          year: userProfile.educations[0].year,
        }
      : {
          degree: "",
          institution: "",
          year: new Date().getFullYear(),
        },
    languages: userProfile.languages.map((l) => `${l.name} (${l.proficiency})`),
    achievements: userProfile.achievements.map((a) => a.description),
    projects: userProfile.projects.map((p) => ({
      name: p.name,
      description: p.description,
      link: p.link ?? undefined,
    })),
    jobFilterPreferences: userProfile.jobFilterPreferences
      ? {
          sector: userProfile.jobFilterPreferences.sector ?? undefined,
          jobTypes: (userProfile.jobFilterPreferences.jobTypes ?? []).flat(),
          jobSites: (userProfile.jobFilterPreferences.jobSites ?? []).flat(),
          experienceLevel:
            userProfile.jobFilterPreferences.experienceLevel ?? undefined,
          educationLevel:
            userProfile.jobFilterPreferences.educationLevel ?? undefined,
          genderPreference:
            userProfile.jobFilterPreferences.genderPreference ?? undefined,
        }
      : null,
  };
  return profileData;
};

export async function getScrappingState() {
  const user = await db.select().from(users).limit(1).get();
  return user
    ? await db
        .select()
        .from(scrapingState)
        .where(eq(scrapingState.userId, user.id))
        .limit(1)
        .get()
    : null;
}
