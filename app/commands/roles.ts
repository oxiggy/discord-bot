import { InteractionResponseType, MessageFlags, ComponentType, ButtonStyle } from 'discord-api-types/v10'
import type { APIInteraction, APIMessageComponentInteraction } from "discord-api-types/v10";
import { config } from '@/lib/config'

const DISCORD_API = config.discord.api;

const ROLE_IDS = {
  // --- GAME ---
  overwatch: process.env.ROLE_OVERWATCH_ID ?? "",
  minecraft: process.env.ROLE_MINECRAFT_ID ?? "",
  repo: process.env.ROLE_REPO_ID ?? "",
  // --- ACTIVITY ---
  movies: process.env.ROLE_MOVIES_ID ?? "",
  // --- DEV ---
  dev: process.env.ROLE_DEV_ID ?? "",
  java: process.env.ROLE_JAVA_ID ?? "",
  c: process.env.ROLE_C_ID ?? "",
  csharp: process.env.ROLE_CSHARP_ID ?? "",
  cpp: process.env.ROLE_CPP_ID ?? "",
  javascript: process.env.ROLE_JAVASCRIPT_ID ?? "",
  python: process.env.ROLE_PYTHON_ID ?? "",
  php: process.env.ROLE_PHP_ID ?? "",
  lolcode: process.env.ROLE_LOLCODE_ID ?? "",
} as const;

/** Кнопки для сообщения выбора ролей */
export const buildRoleButtons = () => ([
  {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Overwatch",
        custom_id: "role:overwatch",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Minecraft",
        custom_id: "role:minecraft",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Repo",
        custom_id: "role:repo",
      },
    ],
  },
  // --- Activity ---
  {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Movies",
        custom_id: "role:movies",
      },
    ],
  },
  // --- Dev 1 ---
  {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Dev",
        custom_id: "role:dev",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Java",
        custom_id: "role:java",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "C",
        custom_id: "role:c",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "C#",
        custom_id: "role:csharp",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "C++",
        custom_id: "role:cpp",
      },
    ],
  },
  // --- Dev 2 ---
  {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "JavaScript",
        custom_id: "role:javascript",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "Python",
        custom_id: "role:python",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "PHP",
        custom_id: "role:php",
      },
      {
        type: ComponentType.Button,
        style: ButtonStyle.Secondary,
        label: "LOLCode",
        custom_id: "role:lolcode",
      },
    ],
  },
] as const);

/** Обработчик slash-команды /roles */
export function handleRolesCommand(json: APIInteraction) {
  const guildId: string | undefined = json.guild_id;
  if (!guildId) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Эта команда доступна только на сервере.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Выбери роль по интересам — её могут упоминать при соответствующей активности. Повторное нажатие снимет роль.",
      flags: MessageFlags.Ephemeral,
      components: buildRoleButtons(),
    },
  };
}

/** Узнаём, что клик по нашей кнопке роли */
export const isRoleButton = (customId: string | undefined): boolean =>
  typeof customId === "string" && customId.startsWith("role:");

/** Тумблер роли по клику на кнопку */
export async function handleRoleButton(json: APIMessageComponentInteraction, botToken: string) {
  const customId: string = json.data?.custom_id ?? "";
  const kind = customId.split(":")[1] as keyof typeof ROLE_IDS | undefined;
  const roleId = kind ? ROLE_IDS[kind] : undefined;

  const guildId: string | undefined = json.guild_id;
  const userId: string | undefined = json.member?.user?.id;

  if (!guildId || !userId) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Действие доступно только на сервере.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  if (!roleId || roleId.includes("_ROLE_ID")) {
    return {
      type: InteractionResponseType.UpdateMessage,
      data: {
        content: "ID роли не настроен. Сообщи админу.",
        components: json.message?.components ?? [],
      },
    };
  }

  const currentRoles: string[] = (json.member?.roles ?? []) as string[];
  const hasRole = currentRoles.includes(roleId);

  const url = `${DISCORD_API}/guilds/${guildId}/members/${userId}/roles/${roleId}`;
  const method = hasRole ? "DELETE" : "PUT";

  let ok = false;
  try {
    const r = await fetch(url, {
      method,
      headers: { Authorization: `Bot ${botToken}` },
    });
    ok = r.ok;
  } catch {
    ok = false;
  }

  const statusText = ok
    ? hasRole
      ? `Снята роль \`${kind}\`.`
      : `Выдана роль \`${kind}\`.`
    : "Не удалось изменить роль. Проверьте права бота и иерархию ролей.";

  return {
    type: InteractionResponseType.UpdateMessage,
    data: {
      content: statusText,
      components: json.message?.components ?? [],
    },
  };
}
