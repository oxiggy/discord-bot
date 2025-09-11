import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";
import type { APIInteraction } from "discord-api-types/v10";

export async function verifyDiscordRequest(req: Request, publicKey: string): Promise<
  | { ok: true; body: string; json: APIInteraction }
  | { ok: false; error: NextResponse }
> {
  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  if (!publicKey || !signature || !timestamp) {
    return { ok: false, error: new NextResponse("Bad request", { status: 400 }) };
  }

  // Сырое тело до верификации
  const body = await req.text();

  // Проверка подписи
  const isValid = await verifyKey(body, signature, timestamp, publicKey);
  if (!isValid) {
    return { ok: false, error: new NextResponse("invalid request signature", { status: 401 }) };
  }

  return { ok: true, body, json: JSON.parse(body) as APIInteraction };
}
