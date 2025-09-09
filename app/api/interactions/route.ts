import { NextResponse } from "next/server";
import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY!;
    const signature = req.headers.get("x-signature-ed25519");
    const timestamp = req.headers.get("x-signature-timestamp");
    if (!PUBLIC_KEY || !signature || !timestamp) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // Сырое тело до верификации
    const body = await req.text();

    // Проверка подписи
    const isValid = await verifyKey(body, signature, timestamp, PUBLIC_KEY);
    if (!isValid) {
      return new NextResponse("invalid request signature", { status: 401 });
    }

    const json = JSON.parse(body);

    // Валидация URL в Dev Portal
    if (json.type === InteractionType.PING) {
      return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    // Slash-команды
    if (json.type === InteractionType.APPLICATION_COMMAND) {
      const name = json.data?.name;

      if (name === "ping") {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: "Pong! 🏓" },
        });
      }

      if (name === "help") {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: [
              "**Доступные команды:**",
              "• `/ping` — отвечает `Pong!`.",
              "• `/help` — показывает это сообщение.",
            ].join("\n"),
          },
        });
      }

      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "Команда не найдена." },
      });
    }

    return new NextResponse("Unhandled interaction type", { status: 400 });
  } catch (e: any) {
    const msg = e?.stack || e?.message || String(e);
    return NextResponse.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `DEV error:\n${msg}`, flags: 64 },
    });
  }
}