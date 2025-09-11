import "dotenv/config";
import { COMMANDS } from '@/lib/discord/commands'
import { config } from '@/lib/config'

const DISCORD_API = config.discord.api;
const APP_ID = config.discord.appId;
const TOKEN  = config.discord.botToken;

const commands = COMMANDS;

async function main() {
  const url = `${DISCORD_API}/applications/${APP_ID}/commands`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bot ${TOKEN}` },
    body: JSON.stringify(commands),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Failed to register GLOBAL commands: ${res.status} ${text}`);
    process.exit(1);
  }
  console.log("Global commands registered:", text || "(ok)");
}

main().catch(e => (console.error(e), process.exit(1)));