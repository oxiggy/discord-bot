import "dotenv/config";

const APP_ID = process.env.DISCORD_APP_ID;
const TOKEN  = process.env.DISCORD_BOT_TOKEN;

function fail(msg: string) {
  console.error(msg);
  process.exit(1);
}

if (!APP_ID) fail("Missing DISCORD_APP_ID (Application ID) in env");
if (!TOKEN)  fail("Missing DISCORD_BOT_TOKEN (Bot Token) in env");

const commands = [
  { name: "ping", description: "Replies with Pong!", type: 1 },
  { name: "help", description: "List available commands", type: 1 },
];

async function main() {
  const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${TOKEN}`,
    },
    body: JSON.stringify(commands),
  });

  const text = await res.text();
  if (!res.ok) {
    fail(`Failed to register GLOBAL commands: ${res.status} ${text}`);
  }
  console.log("Global commands registered:", text || "(ok)");
}

main().catch((e) => fail(String(e)));