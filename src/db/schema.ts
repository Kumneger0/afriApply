import { sql, relations } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  location: text('location'),
  telegramUsername: text('telegram_username'),
  telegramChatId: text('telegram_chat_id').unique(),
  professionalSummary: text('professional_summary'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  position: text('position').notNull(),
  company: text('company').notNull(),
  duration: text('duration').notNull(), // e.g., "2022 - Present"
  description: text('description').notNull(),
});

export const educations = sqliteTable('educations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  degree: text('degree').notNull(),
  institution: text('institution').notNull(),
  year: integer('year').notNull(), // e.g., 2018
});

export const languages = sqliteTable('languages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  proficiency: text('proficiency').notNull(), 
});

export const achievements = sqliteTable('achievements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  link: text('link'), 
});

export const JobTypeEnum = ['Full-time', 'Part-time', 'Freelance', 'Contractual', 'Volunteer', 'Intern (Paid)', 'Intern (Unpaid)'] as const;
export const JobSiteEnum = ['On-site', 'Remote', 'Hybrid'] as const;
export const ExperienceLevelEnum = ['Entry level', 'Junior', 'Intermediate', 'Senior', 'Expert'] as const;
export const EducationLevelEnum = ['Tvet', 'Secondary School', 'Certificate', 'Diploma', 'Bachelors Degree', 'Phd', 'Masters Degree', 'Not Required'] as const;
export const GenderPreferenceEnum = ['Male', 'Female'] as const;
export const SectorEnum = [
  'Agriculture',
  'Architecture & Urban Planning',
  'Beauty & Grooming',
  'Brokerage & Case Closing',
  'Chemical & Biomedical Engineering',
  'Construction & Civil Engineering',
  'Creative Art & Design',
  'Customer Service & Care',
  'Documentation & Writing',
  'Event Management & Organization',
  'Food & Drink Preparation / Service',
  'Healthcare',
  'Hospitality & Tourism',
  'Human Resource & Talent Management',
  'Information Technology',
  'Installation & Maintenance',
  'Janitorial & Office Services',
  'Labor & Masonry',
  'Logistics & Supply Chain',
  'Mechanical & Electrical Engineering',
  'Multimedia Content Production',
  'Pharmaceutical',
  'Psychiatry, Psychology & Social Work',
  'Sales & Promotion',
  'Secretarial & Office Management',
  'Security & Safety',
  'Retail & Office Support',
  'Software Design & Development',
  'Transportation & Delivery',
  'Veterinary',
  'Woodwork & Carpentry',
  'Fashion / Clothing & Textile Design',
  'Media & Entertainment',
  'Environmental, Mining & Energy Engineering',
  'Law & Legal Advocacy',
  'Marketing',
  'Journalism & Communication',
  'Business Administration & Operations',
  'Research Services',
  'Data Science & Analytics',
  'Teaching & Education',
  'Tutoring, Training & Mentorship',
  'Gardening & Landscaping',
  'Horticulture',
  'Livestock & Animal Husbandry',
  'Manufacturing & Production',
  'Purchasing & Procurement',
  'Translation & Transcription',
  'Accounting & Finance',
  'Advisory & Consultancy',
  'Aeronautics & Aerospace'
] as const;

export const jobFilterPreferences = sqliteTable('job_filter_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  sector: text('sector', { enum: SectorEnum }),
  jobTypes: text('job_types', { mode: 'json' }).$type<typeof JobTypeEnum[]>().default([]), // Allow multiple selections, stored as JSON array
  jobSites: text('job_sites', { mode: 'json' }).$type<typeof JobSiteEnum[]>().default([]), // Allow multiple selections
  experienceLevel: text('experience_level', { enum: ExperienceLevelEnum }), 
  educationLevel: text('education_level', { enum: EducationLevelEnum }), 
  genderPreference: text('gender_preference', { enum: GenderPreferenceEnum }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const appliedJobs = sqliteTable('applied_jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jobId: text('job_id').notNull(), // Job ID from Afriwork
  description: text('description').notNull(),
  title: text('title').notNull(),
  appliedAt: text('applied_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const scrapingState = sqliteTable('scraping_state', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  latestJobId: text('latest_job_id').notNull(), // Latest scraped job ID from Afriwork
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  skills: many(skills),
  experiences: many(experiences),
  educations: many(educations),
  languages: many(languages),
  achievements: many(achievements),
  projects: many(projects),
  jobFilterPreferences: one(jobFilterPreferences),
  appliedJobs: many(appliedJobs),
  scrapingState: one(scrapingState),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, {
    fields: [experiences.userId],
    references: [users.id],
  }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id],
  }),
}));

export const languagesRelations = relations(languages, ({ one }) => ({
  user: one(users, {
    fields: [languages.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const jobFilterPreferencesRelations = relations(jobFilterPreferences, ({ one }) => ({
  user: one(users, {
    fields: [jobFilterPreferences.userId],
    references: [users.id],
  }),
}));

export const appliedJobsRelations = relations(appliedJobs, ({ one }) => ({
  user: one(users, {
    fields: [appliedJobs.userId],
    references: [users.id],
  }),
}));

export const scrapingStateRelations = relations(scrapingState, ({ one }) => ({
  user: one(users, {
    fields: [scrapingState.userId],
    references: [users.id],
  }),
}));

