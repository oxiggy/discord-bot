import { InteractionResponseType, MessageFlags } from "discord-api-types/v10";

export const ephemeral = (content: string) => ({
  type: InteractionResponseType.ChannelMessageWithSource,
  data: { content, flags: MessageFlags.Ephemeral },
});

export const visible = (content: string) => ({
  type: InteractionResponseType.ChannelMessageWithSource,
  data: { content },
});

export const notFoundReply = () => visible("Команда не найдена.");
export const unknownActionReply = () => ephemeral("Неизвестное действие.");