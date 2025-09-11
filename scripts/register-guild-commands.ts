import "dotenv/config";
import { GUILD_COMMANDS } from '@/lib/discord/commands'
import { config } from '@/lib/config'

const DISCORD_API = config.discord.api;
const APP_ID = config.discord.appId;
const TOKEN  = config.discord.botToken;
const GUILD_ID = config.discord.guildId;

const commands = GUILD_COMMANDS;

async function main() {
  const url = `${DISCORD_API}/applications/${APP_ID}/guilds/${GUILD_ID}/commands`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bot ${TOKEN}` },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    console.error("Failed:", res.status, await res.text());
    process.exit(1);
  }
  console.log(`Guild commands registered for ${GUILD_ID}!`);
}
main().catch(e => (console.error(e), process.exit(1)));