import { InteractionResponseType } from "discord-api-types/v10";

export function handleHelpCommand() {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: [
        "**Доступные команды:**",
        "• `/help` — показывает это сообщение.",
        "• `/roles` — выдаёт/снимает роли через кнопки.",
        "• `/member` — информация об участнике.",
      ].join("\n"),
    },
  };
}