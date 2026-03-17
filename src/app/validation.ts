// src/app/validation.ts
import { z } from "zod";
import {
  EducationLevelEnum,
  ExperienceLevelEnum,
  GenderPreferenceEnum,
  JobSiteEnum,
  JobTypeEnum,
  SectorEnum,
} from "../db/schema";

const stringOrArray = z.union([z.string(), z.array(z.string())]).transform((val) => 
  Array.isArray(val) ? val : [val]
);

export const userSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  telegramUsername: z.string().optional().or(z.literal("")),
  professionalSummary: z.string().optional().or(z.literal("")),
});

export const jobFilterPreferencesSchema = z.object({
  sector: z.enum(SectorEnum).optional().or(z.literal("")),
  jobTypes: stringOrArray.pipe(z.array(z.enum(JobTypeEnum))).optional().default([]).nullable(),
  jobSites: stringOrArray.pipe(z.array(z.enum(JobSiteEnum))).optional().default([]).nullable(),
  experienceLevel: z.enum(ExperienceLevelEnum).optional().or(z.literal("")).nullable(),
  educationLevel: z.enum(EducationLevelEnum).optional().or(z.literal("")).nullable(),
  genderPreference: z.enum(GenderPreferenceEnum).optional().or(z.literal("")).nullable(),
});

const experienceSchema = z.object({
  position: z.string().min(1),
  company: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  year: z.coerce.number().int().positive(),
});

const languageSchema = z.object({
  name: z.string().min(1),
  proficiency: z.string().min(1),
});

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  link: z.string().optional().or(z.literal("")),
});

export const ProfileSetupFormSchema = z.object({
  user: userSchema,
  jobPreferences: jobFilterPreferencesSchema,
  skills: stringOrArray.optional().default([]).transform(arr => arr.filter(Boolean)),
  experiences: z.array(experienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  languages: z.array(languageSchema).optional().default([]),
  achievements: stringOrArray.optional().default([]).transform(arr => arr.filter(Boolean)),
  projects: z.array(projectSchema).optional().default([]),
});

export type JobFilterPreferencesSchemaType = z.infer<typeof jobFilterPreferencesSchema>;
export type UserSchemaType = z.infer<typeof userSchema>;
export type ExperienceType = z.infer<typeof experienceSchema>;
export type EducationType = z.infer<typeof educationSchema>;
export type LanguageType = z.infer<typeof languageSchema>;
export type ProjectType = z.infer<typeof projectSchema>;
