import { Bot, webhookCallback } from "grammy";
import { getTelegramChatIds, updateTelegramChatId } from "../db/telegramUsers";

const bot = new Bot(process.env.BOT_TOKEN as string);


bot.command("start", async (ctx) => {
  const chatId = ctx.chat.id;
  if(await updateTelegramChatId(chatId.toString())){
    await ctx.reply("🎉 Welcome to AfriApply! You're all set to receive job notifications and updates directly here.");
  } else {
    await ctx.reply("👋 Welcome to AfriApply! To receive personalized job notifications, please make sure you've set up your profile first in the application, then try this command again.");
  }
});

export const handleWebhook = webhookCallback(bot, "hono");

export async function setWebhook(webhookUrl?: string) {
  if (!process.env.BOT_TOKEN) {
    console.error("BOT_TOKEN is not set. Please set it in your .env file.");
    return false;
  }

  const url = webhookUrl || `${process.env.WEBHOOK_URL}/webhook/telegram`;
  
  try {
    await bot.api.setWebhook(url);
    console.log(`Webhook set to: ${url}`);
    return true;
  } catch (error) {
    console.error("Failed to set webhook:", error);
    return false;
  }
}

if(process.env.WEBHOOK_URL){
  console.log('setting up webhook endpoint')
  setWebhook().catch(console.error);
}

export async function sendNotification(message: string) {
  const chatIds = await getTelegramChatIds();
  for (const chatId of chatIds) {
    try {
      await bot.api.sendMessage(chatId, message);
      console.log(`Notification sent to chat ID: ${chatId}`);
    } catch (error) {
      console.error(`Failed to send notification to chat ID ${chatId}:`, error);
    }
  }
}

export { bot };