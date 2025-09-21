import { InteractionResponseType, MessageFlags, ApplicationCommandOptionType } from 'discord-api-types/v10'
import type { APIApplicationCommandInteraction, APIChatInputApplicationCommandInteraction } from 'discord-api-types/v10'
import { formatElonName } from '@/lib/utils/formatElonName'

export function handleElonifyCommand(
  initialJson: APIApplicationCommandInteraction,
) {
  // приведение типа
  const json = initialJson as APIChatInputApplicationCommandInteraction;

  // опция text (type=3)
  const opt = json.data.options?.[0];
  const value = opt?.type === ApplicationCommandOptionType.String ? opt.value : undefined;

  if (!value) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: "Введите текст для элонефикации.",
        flags: MessageFlags.Ephemeral,
      },
    };
  }

  const result = formatElonName(value)

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: result,
    },
  };
}