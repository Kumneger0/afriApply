import { db } from "./src/db/index.js";
import {
  users,
  skills,
  experiences,
  educations,
  languages,
  achievements,
  projects,
} from "./src/db/schema.js";
import { eq } from "drizzle-orm";

const seedData = {
  personalInfo: {
    fullName: "Sarah Mekonnen",
    email: "sarah.mekonnen@gmail.com",
    phone: "+251-911-789456",
    location: "Addis Ababa, Ethiopia",
    portfolioLinks: [],
    telegramUsername: "@sarah_sales",
  },
  professionalSummary:
    "Results-driven sales professional with 6+ years of experience in B2B and B2C sales. Proven track record of exceeding sales targets by 25-40% consistently. Expert in relationship building, lead generation, and closing complex deals in technology and financial services sectors.",
  skills: [
    "B2B Sales",
    "Lead Generation",
    "Client Relationship Management",
    "Negotiation",
    "CRM Software (Salesforce, HubSpot)",
    "Sales Forecasting",
    "Market Analysis",
    "Presentation Skills",
    "Cold Calling",
    "Account Management",
  ],
  experience: [
    {
      position: "Senior Sales Executive",
      company: "TechSolutions Ethiopia",
      duration: "2022 - Present",
      description:
        "Manage enterprise accounts worth $2M+ annually. Consistently exceed quarterly targets by 35%. Built and maintained relationships with 50+ key clients across banking and telecom sectors.",
    },
    {
      position: "Sales Representative",
      company: "Digital Finance Corp",
      duration: "2020 - 2022",
      description:
        "Generated $1.5M in new business revenue. Developed sales strategies for fintech products, achieving 120% of annual quota. Trained 5 junior sales reps on best practices.",
    },
    {
      position: "Junior Sales Associate",
      company: "Ethiopian Business Solutions",
      duration: "2018 - 2020",
      description:
        "Prospected and qualified leads through cold calling and networking. Closed 85+ deals worth $800K total. Maintained 95% client retention rate.",
    },
  ],
  education: {
    degree: "Bachelor of Business Administration - Marketing",
    institution: "Addis Ababa University",
    year: 2018,
  },
  languages: [
    "English (Fluent)",
    "Amharic (Native)",
    "Tigrinya (Conversational)",
    "Arabic (Basic)",
  ],
  achievements: [
    "Top Sales Performer 2023 - exceeded target by 42%",
    "Salesforce Certified Sales Cloud Consultant",
    "President's Club Winner 2022 & 2023",
    "Generated highest quarterly revenue in company history ($650K Q3 2023)",
  ],
  projects: [
    {
      name: "Enterprise Client Acquisition Campaign",
      description:
        "Led strategic sales campaign targeting Fortune 500 companies in East Africa, resulting in 12 new enterprise clients. Secured $2.3M in new annual recurring revenue. Reduced sales cycle from 9 months to 6 months. Achieved 85% close rate on qualified leads.",
      link: "https://linkedin.com/in/sarah-mekonnen-sales",
    },
    {
      name: "Sales Process Optimization Initiative",
      description:
        "Redesigned sales funnel and implemented new CRM workflows, improving team efficiency and conversion rates. Increased team conversion rate by 28%. Reduced administrative time by 40%. Improved lead qualification accuracy by 35%.",
      link: "https://github.com/sarah-sales/crm-optimization",
    },
  ],
};

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

    // Insert education
    await db
      .insert(educations)
      .values({
        userId,
        degree: seedData.education.degree,
        institution: seedData.education.institution,
        year: seedData.education.year,
      })
      .run();
    console.log("Inserted education");

    // Insert languages
    if (seedData.languages.length > 0) {
      await db
        .insert(languages)
        .values(
          seedData.languages.map((lang) => {
            const match = lang.match(/^(.+?)\s*\((.+?)\)$/);
            return {
              userId,
              name: (match?.[1]?.trim() || lang),
              proficiency: (match?.[2]?.trim() || "Fluent"),
            };
          }),
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

    console.log("\n✅ Database seeded successfully!");
    console.log(`User: ${seedData.personalInfo.fullName}`);
    console.log(`Email: ${seedData.personalInfo.email}`);
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
