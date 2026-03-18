import { eq } from "drizzle-orm";
import { db } from "./src/db/index.js";
import {
  achievements,
  educations,
  experiences,
  jobFilterPreferences,
  languages,
  projects,
  skills,
  users
} from "./src/db/schema.js";
import seedData from "./profile-data.json" assert { type: "json" };

/*
AVAILABLE OPTIONS FOR PROFILE DATA:

SECTOR OPTIONS:
- Agriculture, Architecture & Urban Planning, Beauty & Grooming, Brokerage & Case Closing
- Chemical & Biomedical Engineering, Construction & Civil Engineering, Creative Art & Design
- Customer Service & Care, Documentation & Writing, Event Management & Organization
- Food & Drink Preparation / Service, Healthcare, Hospitality & Tourism
- Human Resource & Talent Management, Information Technology, Installation & Maintenance
- Janitorial & Office Services, Labor & Masonry, Logistics & Supply Chain
- Mechanical & Electrical Engineering, Multimedia Content Production, Pharmaceutical
- Psychiatry, Psychology & Social Work, Sales & Promotion, Secretarial & Office Management
- Security & Safety, Retail & Office Support, Software Design & Development
- Transportation & Delivery, Veterinary, Woodwork & Carpentry
- Fashion / Clothing & Textile Design, Media & Entertainment
- Environmental, Mining & Energy Engineering, Law & Legal Advocacy, Marketing
- Journalism & Communication, Business Administration & Operations, Research Services
- Data Science & Analytics, Teaching & Education, Tutoring, Training & Mentorship
- Gardening & Landscaping, Horticulture, Livestock & Animal Husbandry
- Manufacturing & Production, Purchasing & Procurement, Translation & Transcription
- Accounting & Finance, Advisory & Consultancy, Aeronautics & Aerospace

JOB TYPES: Full-time, Part-time, Freelance, Contractual, Volunteer, Intern (Paid), Intern (Unpaid)
JOB SITES: On-site, Remote, Hybrid
EXPERIENCE LEVELS: Entry level, Junior, Intermediate, Senior, Expert
EDUCATION LEVELS: Tvet, Secondary School, Certificate, Diploma, Bachelors Degree, Phd, Masters Degree, Not Required
GENDER PREFERENCE: Male, Female, null (for no preference)
*/

async function clearDatabase() {
  console.log("Clearing existing data...");
  
  // Get all users
  const allUsers = await db.select().from(users).all();
  
  for (const user of allUsers) {
    // Delete related data (cascade should handle this, but being explicit)
    await db.delete(skills).where(eq(skills.userId, user.id)).run();
    await db.delete(experiences).where(eq(experiences.userId, user.id)).run();
    await db.delete(educations).where(eq(educations.userId, user.id)).run();
    await db.delete(languages).where(eq(languages.userId, user.id)).run();
    await db.delete(achievements).where(eq(achievements.userId, user.id)).run();
    await db.delete(projects).where(eq(projects.userId, user.id)).run();
    await db.delete(jobFilterPreferences).where(eq(jobFilterPreferences.userId, user.id)).run();
  }
  
  // Delete all users
  await db.delete(users).run();
  
  console.log("Database cleared!");
}

async function seedDatabase() {
  try {
    // Clear existing data
    await clearDatabase();

    console.log("Seeding database with profile data...");

    // Insert user
    const user = await db
      .insert(users)
      .values({
        fullName: seedData.personalInfo.fullName,
        email: seedData.personalInfo.email,
        phone: seedData.personalInfo.phone,
        location: seedData.personalInfo.location,
        telegramUsername: seedData.personalInfo.telegramUsername,
        professionalSummary: seedData.professionalSummary,
        portfolioLinks: seedData.personalInfo.portfolioLinks,
      })
      .returning({ id: users.id })
      .get();

    const userId = user.id;
    console.log(`Created user with ID: ${userId}`);

    // Insert skills
    if (seedData.skills.length > 0) {
      await db
        .insert(skills)
        .values(seedData.skills.map((skill) => ({ userId, name: skill })))
        .run();
      console.log(`Inserted ${seedData.skills.length} skills`);
    }

    // Insert experiences
    if (seedData.experience.length > 0) {
      await db
        .insert(experiences)
        .values(
          seedData.experience.map((exp) => ({
            userId,
            position: exp.position,
            company: exp.company,
            duration: exp.duration,
            description: exp.description,
          })),
        )
        .run();
      console.log(`Inserted ${seedData.experience.length} experiences`);
    }

    // Insert education (now supports multiple entries)
    if (seedData.education.length > 0) {
      await db
        .insert(educations)
        .values(
          seedData.education.map((edu) => ({
            userId,
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year,
          })),
        )
        .run();
      console.log(`Inserted ${seedData.education.length} education entries`);
    }

    // Insert languages (now with proper structure)
    if (seedData.languages.length > 0) {
      await db
        .insert(languages)
        .values(
          seedData.languages.map((lang) => ({
            userId,
            name: lang.name,
            proficiency: lang.proficiency,
          })),
        )
        .run();
      console.log(`Inserted ${seedData.languages.length} languages`);
    }

    // Insert achievements
    if (seedData.achievements.length > 0) {
      await db
        .insert(achievements)
        .values(
          seedData.achievements.map((achievement) => ({
            userId,
            description: achievement,
          })),
        )
        .run();
      console.log(`Inserted ${seedData.achievements.length} achievements`);
    }

    // Insert projects
    if (seedData.projects.length > 0) {
      await db
        .insert(projects)
        .values(
          seedData.projects.map((project) => ({
            userId,
            name: project.name,
            description: project.description,
            link: project.link,
          })),
        )
        .run();
      console.log(`Inserted ${seedData.projects.length} projects`);
    }

    // Insert job preferences
    if (seedData.jobPreferences) {
      await db
        .insert(jobFilterPreferences)
        .values({
          //@ts-expect-error Object literal may only specify known properties, and 'userId' does not exist
          //fuck you ts i literally defined the column and u kept saying doesn't exit 
          userId,
          sector: seedData.jobPreferences.sector,
          jobTypes: seedData.jobPreferences.jobTypes,
          jobSites: seedData.jobPreferences.jobSites,
          experienceLevel: seedData.jobPreferences.experienceLevel,
          educationLevel: seedData.jobPreferences.educationLevel,
          genderPreference: seedData.jobPreferences.genderPreference,
        })
        .run();
      console.log("Inserted job preferences");
    }

    console.log("\n✅ Database seeded successfully!");
    console.log(`User: ${seedData.personalInfo.fullName}`);
    console.log(`Email: ${seedData.personalInfo.email}`);
    console.log(`Sector: ${seedData.jobPreferences.sector}`);
    console.log(`Job Types: ${seedData.jobPreferences.jobTypes.join(", ")}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("\nSeeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
