import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";
import type { APIApplicationCommandInteraction, APIGuildMember, APIUser } from "discord-api-types/v10";
import { config } from '@/lib/config'

const DISCORD_API = config.discord.api;

/** Обработчик slash-команды /member */
export async function handleMemberCommand(
  json: APIApplicationCommandInteraction,
  botToken: string
) {
  // команда доступна только в гильдии
  const guildId = (json as any).guild_id as string | undefined;
  if (!guildId) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Эта команда доступна только на сервере (в ЛС ролей нет).",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  // 1) целевой пользователь: опция user (type=6) или вызывающий
  const optionUserId: string | undefined =
    (json.data as any)?.options?.[0]?.type === 6
      ? (json.data as any).options[0].value
      : undefined;

  // resolved может уже содержать member выбранного user
  const resolvedMember: APIGuildMember | undefined = optionUserId
    ? (json.data as any)?.resolved?.members?.[optionUserId]
    : (json as any).member;

  const resolvedUser: APIUser | undefined = optionUserId
    ? (json.data as any)?.resolved?.users?.[optionUserId]
    : (json as any).member?.user;

  const targetUserId: string | undefined = optionUserId ?? (json as any).member?.user?.id;

  // 2) если resolved нет (редко), добираем ч/з REST
  let nickname: string | null = (resolvedMember as any)?.nick ?? null;
  let roleIds: string[] =
    ((resolvedMember as any)?.roles ?? (json as any).member?.roles ?? []) as string[];

  if ((!nickname || roleIds.length === 0) && targetUserId) {
    // GET /guilds/{guild.id}/members/{user.id}
    const mres = await fetch(`${DISCORD_API}/guilds/${guildId}/members/${targetUserId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: "no-store",
    });
    if (mres.ok) {
      const m = await mres.json();
      nickname = nickname ?? (m.nick ?? null);
      roleIds = roleIds.length ? roleIds : (m.roles ?? []);
    }
  }

  // 3) список ролей гильдии -> имена (исключая @everyone == guildId)
  let roleNames: string[] = [];
  try {
    const rres = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${botToken}` },
      cache: "no-store",
    });
    if (rres.ok) {
      const allRoles: Array<{ id: string; name: string }> = await rres.json();
      const set = new Set(roleIds);
      roleNames = allRoles
        .filter((r) => set.has(r.id) && r.id !== guildId)
        .map((r) => r.name)
        .sort((a, b) => a.localeCompare(b));
    }
  } catch {}

  const display =
    nickname ??
    (resolvedMember as any)?.nick ??
    (resolvedUser as any)?.global_name ??
    (resolvedUser as any)?.username ??
    "(без ника)";

  const mention = targetUserId ? `<@${targetUserId}>` : "неизвестно";
  const rolesText = roleNames.length ? roleNames.map((n) => `\`${n}\``).join(", ") : "_нет ролей_";

  const content = [
    `**Участник:** ${mention}`,
    `**Ник на сервере:** ${display}`,
    `**Роли:** ${rolesText}`,
  ].join("\n");

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content },
  };
}
