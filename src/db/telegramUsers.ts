import { db } from "./index";
import { users } from "./schema";
import { eq, isNotNull } from "drizzle-orm";

export async function updateTelegramChatId(chatId: string): Promise<void> {
  try {
    await db.update(users).set({ telegramChatId: chatId });
  } catch (err) {
    console.error(err);
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
