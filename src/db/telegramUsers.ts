import { db } from "./index";
import { users } from "./schema";
import { eq, isNotNull } from "drizzle-orm";

export async function updateTelegramChatId(chatId: string, verificationId: string): Promise<boolean> {
  try {
    const result = await db
      .update(users)
      .set({ telegramChatId: chatId })
      .where(eq(users.verificationId, verificationId))
      .run();
    
    return result.rowsAffected > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getTelegramChatIds(): Promise<string[]> {
  const usersWithChatIds = await db
    .select({
      telegramChatId: users.telegramChatId,
    })
    .from(users)
    .where(isNotNull(users.telegramChatId));

  return usersWithChatIds
    .map((user) => user.telegramChatId!)
    .filter((chatId) => Boolean(chatId));
}
