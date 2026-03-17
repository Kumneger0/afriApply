import { eq } from "drizzle-orm";
import { Hono } from "hono";
import type { z } from "zod";
import { db } from "../db";
import {
  achievements,
  educations,
  experiences,
  jobFilterPreferences,
  languages,
  projects,
  skills,
  users,
} from "../db/schema";
import { ProfileForm } from "./profile-form";
import {
  ProfileSetupFormSchema,
  type JobFilterPreferencesSchemaType,
  type UserSchemaType,
  type ExperienceType,
  type EducationType,
  type LanguageType,
  type ProjectType,
} from "./validation";

const app = new Hono();

type ProfileData = {
  skillsData: string[];
  experiencesData: ExperienceType[];
  educationsData: EducationType[];
  languagesData: LanguageType[];
  achievementsData: string[];
  projectsData: ProjectType[];
};



const fetchUserProfile = async (userId: number) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    with: {
      skills: true,
      experiences: true,
      educations: true,
      languages: true,
      achievements: true,
      projects: true,
      appliedJobs: true,
      jobFilterPreferences: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    skills: user.skills.map((s) => s.name),
    experiences: user.experiences.map((e) => ({ 
      position: e.position, 
      company: e.company, 
      duration: e.duration, 
      description: e.description 
    })),
    educations: user.educations.map((e) => ({ 
      degree: e.degree, 
      institution: e.institution, 
      year: e.year 
    })),
    languages: user.languages.map((l) => ({ 
      name: l.name, 
      proficiency: l.proficiency 
    })),
    achievements: user.achievements.map((a) => a.description),
    projects: user.projects.map((p) => ({ 
      name: p.name, 
      description: p.description, 
      link: p.link ?? undefined 
    })),
    appliedJobs: user.appliedJobs.map((j) => ({ 
      jobId: j.jobId, 
      description: j.description, 
      appliedAt: j.appliedAt 
    })),
    jobPreferences: user.jobFilterPreferences ? {
      sector: user.jobFilterPreferences.sector ?? undefined,
      jobTypes: (user.jobFilterPreferences.jobTypes ?? []).flat(),
      jobSites: (user.jobFilterPreferences.jobSites ?? []).flat(),
      experienceLevel: user.jobFilterPreferences.experienceLevel ?? undefined,
      educationLevel: user.jobFilterPreferences.educationLevel ?? undefined,
      genderPreference: user.jobFilterPreferences.genderPreference ?? undefined,
    } : undefined,
  };
};

app.get("/setup", async (c) => {
  const existingUser = await db.select().from(users).limit(1).get();

  if (!existingUser) {
    return c.html(<ProfileForm />);
  }

  const profile = await fetchUserProfile(existingUser.id);

  return c.html(
    <ProfileForm
      user={{
        fullName: existingUser.fullName,
        email: existingUser.email,
        phone: existingUser.phone ?? undefined,
        location: existingUser.location ?? undefined,
        telegramUsername: existingUser.telegramUsername ?? undefined,
      }}
      {...profile}
    />,
  );
});

const parseFormData = (
  body: Record<string, string | File | (string | File)[]>,
) => {
  const mapArrayFields = (prefix: string, fields: string[]) => {
    const firstField = body[`${prefix}_${fields[0]}[]`];
    const length = Array.isArray(firstField)
      ? firstField.length
      : firstField
        ? 1
        : 0;

    if (length === 0) return [];

    return Array.from({ length }, (_, i) => {
      const obj: Record<string, string> = {};
      fields.forEach((field) => {
        const value = body[`${prefix}_${field}[]`];
        obj[field] = Array.isArray(value)
          ? (value[i] as string) || ""
          : (value as string) || "";
      });
      return obj;
    });
  };

  const jobTypes = Array.isArray(body["jobTypes[]"]) ? body["jobTypes[]"] as string[] : body["jobTypes[]"] ? [body["jobTypes[]"] as string] : [];
  const jobSites = Array.isArray(body["jobSites[]"]) ? body["jobSites[]"] as string[] : body["jobSites[]"] ? [body["jobSites[]"] as string] : [];
  const skills = Array.isArray(body["skills[]"]) ? body["skills[]"] as string[] : body["skills[]"] ? [body["skills[]"] as string] : [];
  const achievements = Array.isArray(body["achievements[]"]) ? body["achievements[]"] as string[] : body["achievements[]"] ? [body["achievements[]"] as string] : [];

  return {
    fullName: body.fullName,
    email: body.email,
    phone: body.phone || undefined,
    location: body.location || undefined,
    telegramUsername: body.telegramUsername || undefined,
    professionalSummary: body.professionalSummary || undefined,
    sector: body.sector || undefined,
    jobTypes: jobTypes,
    jobSites: jobSites,
    experienceLevel: body.experienceLevel || undefined,
    educationLevel: body.educationLevel || undefined,
    genderPreference: body.genderPreference || undefined,
    skills: skills,
    experiences: mapArrayFields("experience", [
      "position",
      "company",
      "duration",
      "description",
    ]),
    educations: mapArrayFields("education", ["degree", "institution", "year"]),
    languages: mapArrayFields("language", ["name", "proficiency"]),
    achievements: achievements,
    projects: mapArrayFields("project", ["name", "description", "link"]),
  };
};

const formatValidationErrors = (error: z.ZodError) => {
  const errors: Record<string, string[]> = {};
  error.issues.forEach((err) => {
    const fieldName = typeof err.path[1] === "string" ? err.path[1] : "_global";
    errors[fieldName] = [...(errors[fieldName] || []), err.message];
  });
  return errors;
};

const saveProfileData = async (userId: number, data: ProfileData) => {
  const {
    skillsData,
    experiencesData,
    educationsData,
    languagesData,
    achievementsData,
    projectsData,
  } = data;

  await Promise.all([
    db.delete(skills).where(eq(skills.userId, userId)).run(),
    db.delete(experiences).where(eq(experiences.userId, userId)).run(),
    db.delete(educations).where(eq(educations.userId, userId)).run(),
    db.delete(languages).where(eq(languages.userId, userId)).run(),
    db.delete(achievements).where(eq(achievements.userId, userId)).run(),
    db.delete(projects).where(eq(projects.userId, userId)).run(),
  ]);

  const inserts = [];
  if (skillsData.length)
    inserts.push(
      db
        .insert(skills)
        .values(skillsData.map((name) => ({ userId, name })))
        .run(),
    );
  if (experiencesData.length)
    inserts.push(
      db
        .insert(experiences)
        .values(experiencesData.map((exp) => ({ userId, ...exp })))
        .run(),
    );
  if (educationsData.length)
    inserts.push(
      db
        .insert(educations)
        .values(educationsData.map((edu) => ({ userId, ...edu })))
        .run(),
    );
  if (languagesData.length)
    inserts.push(
      db
        .insert(languages)
        .values(languagesData.map((lang) => ({ userId, ...lang })))
        .run(),
    );
  if (achievementsData.length)
    inserts.push(
      db
        .insert(achievements)
        .values(
          achievementsData.map((desc) => ({
            userId,
            description: desc,
          })),
        )
        .run(),
    );
  if (projectsData.length)
    inserts.push(
      db
        .insert(projects)
        .values(projectsData.map((proj) => ({ userId, ...proj })))
        .run(),
    );

  await Promise.all(inserts);
};

const upsertJobPreferences = async (
  userId: number,
  prefs: JobFilterPreferencesSchemaType,
) => {
  const data = {
    sector: prefs.sector || null,
    jobTypes: (prefs.jobTypes?.length
      ? prefs.jobTypes
      : null) as (typeof jobFilterPreferences.$inferInsert)["jobTypes"],
    jobSites: (prefs.jobSites?.length
      ? prefs.jobSites
      : null) as (typeof jobFilterPreferences.$inferInsert)["jobSites"],
    experienceLevel: prefs.experienceLevel || null,
    educationLevel: prefs.educationLevel || null,
    genderPreference: prefs.genderPreference || null,
  };

  const existing = await db
    .select()
    .from(jobFilterPreferences)
    .where(eq(jobFilterPreferences.userId, userId))
    .limit(1)
    .get();

  if (existing) {
    await db
      .update(jobFilterPreferences)
      .set(data)
      .where(eq(jobFilterPreferences.userId, userId))
      .run();
  } else {
    await db
      .insert(jobFilterPreferences)
      .values({ userId, ...data })
      .run();
  }
};

app.post("/setup", async (c) => {
  const body = await c.req.parseBody();
  Bun.write('fuck.json', JSON.stringify(body))
  const rawData = parseFormData(body);

  const parsed = ProfileSetupFormSchema.safeParse({
    user: {
      fullName: rawData.fullName,
      email: rawData.email,
      phone: rawData.phone,
      location: rawData.location,
      telegramUsername: rawData.telegramUsername,
      professionalSummary: rawData.professionalSummary,
    },
    jobPreferences: {
      sector: rawData.sector,
      jobTypes: rawData.jobTypes,
      jobSites: rawData.jobSites,
      experienceLevel: rawData.experienceLevel,
      educationLevel: rawData.educationLevel,
      genderPreference: rawData.genderPreference,
    },
    skills: rawData.skills,
    experiences: rawData.experiences,
    educations: rawData.educations,
    languages: rawData.languages,
    achievements: rawData.achievements,
    projects: rawData.projects,
  });

  if (!parsed.success) {
    return c.html(
      <ProfileForm
        user={rawData as unknown as UserSchemaType}
        jobPreferences={rawData as unknown as JobFilterPreferencesSchemaType}
        errors={formatValidationErrors(parsed.error)}
      />,
    );
  }

  try {
    const existingUser = await db.select().from(users).limit(1).get();

    const userId = existingUser
      ? (await db
          .update(users)
          .set(parsed.data.user)
          .where(eq(users.id, existingUser.id))
          .run(),
        existingUser.id)
      : (
          await db
            .insert(users)
            .values(parsed.data.user)
            .returning({ id: users.id })
            .get()
        ).id;

    const profileData: ProfileData = {
      skillsData: parsed.data.skills,
      experiencesData: parsed.data.experiences,
      educationsData: parsed.data.educations,
      languagesData: parsed.data.languages,
      achievementsData: parsed.data.achievements,
      projectsData: parsed.data.projects,
    };


    console.log('Raw form data:', {
      jobTypes: body["jobTypes[]"],
      jobSites: body["jobSites[]"],
      sector: body.sector,
      experienceLevel: body.experienceLevel,
      educationLevel: body.educationLevel,
      genderPreference: body.genderPreference
    });

    console.log('Parsed job preferences:', {
      sector: rawData.sector,
      jobTypes: rawData.jobTypes,
      jobSites: rawData.jobSites,
      experienceLevel: rawData.experienceLevel,
      educationLevel: rawData.educationLevel,
      genderPreference: rawData.genderPreference,
    });

    await saveProfileData(userId, profileData);
    await upsertJobPreferences(userId, parsed.data.jobPreferences);

    const updatedUser = await db.select().from(users).where(eq(users.id, userId)).get();
    const profile = await fetchUserProfile(userId);

    return c.html(
      <ProfileForm
        user={updatedUser ? {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phone: updatedUser.phone ?? undefined,
          location: updatedUser.location ?? undefined,
          telegramUsername: updatedUser.telegramUsername ?? undefined,
        } : undefined}
        {...profile}
        errors={{ _global: ["Profile saved successfully!"] }}
      />,
    );
  } catch (error) {
    console.error("Database operation failed:", error);
    return c.html(
      <ProfileForm
        user={rawData as unknown as UserSchemaType}
        jobPreferences={rawData as unknown as JobFilterPreferencesSchemaType}
        errors={{
          _global: [
            "Failed to save profile. Please try again.",
            error instanceof Error ? error.message : "",
          ],
        }}
      />,
      500,
    );
  }
});

export default app;
