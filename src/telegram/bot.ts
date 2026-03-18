import { Bot, webhookCallback } from "grammy";
import { getTelegramChatIds, updateTelegramChatId } from "../db/telegramUsers";

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "👋 Welcome to AfriApply!\n\n" +
    "To receive personalized job notifications:\n" +
    "1. Set up your profile at your AfriApply dashboard\n" +
    "2. Find your Verification ID on the setup page\n" +
    "3. Send: /verify YOUR_VERIFICATION_ID\n\n" +
    "🔒 This ensures only you receive your job notifications."
  );
});

bot.command("verify", async (ctx) => {
  const verificationId = ctx.match?.toString().trim();
  
  if (!verificationId) {
    await ctx.reply(
      "❌ Please provide your Verification ID.\n" +
      "Usage: /verify YOUR_VERIFICATION_ID\n\n" +
      "Find your Verification ID on your AfriApply setup page."
    );
    return;
  }
  
  const chatId = ctx.chat.id;
  const success = await updateTelegramChatId(chatId.toString(), verificationId);
  
  if (success) {
    await ctx.reply(
      "Verification successful!\n\n" +
      "You're now connected to receive job notifications.\n" +
      "You'll get updates about new job matches and applications here."
    );
  } else {
    await ctx.reply(
      "❌ Verification ID not found or already connected to another chat.\n\n" +
      "Please check your Verification ID or contact support if the issue persists."
    );
  }
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    "AfriApply Bot Commands:\n\n" +
    "/start - Welcome message\n" +
    "/verify VERIFICATION_ID - Connect your account for notifications\n" +
    "/help - Show this help message\n\n" +
    "Need help? Find your Verification ID on your AfriApply setup page."
  );
});

export const handleWebhook = webhookCallback(bot, "hono");

export async function setWebhook(webhookUrl?: string) {
  if (!process.env.BOT_TOKEN) {
    console.error("BOT_TOKEN is not set. Please set it in your .env file.");
    return false;
  }

  const url = webhookUrl || `${process.env.BASE_URL}/webhook/telegram`;
  
  try {
    await bot.api.setWebhook(url);
    console.log(`Webhook set to: ${url}`);
    return true;
  } catch (error) {
    console.error("Failed to set webhook:", error);
    return false;
  }
}

if(process.env.BASE_URL){
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