import { eq } from "drizzle-orm";
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

  return userProfile;
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
