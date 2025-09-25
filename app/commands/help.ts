import { InteractionResponseType } from 'discord-api-types/v10'
import { COMMANDS, GUILD_COMMANDS } from '@/lib/discord/commands'

type Command = { name: string; description: string }

const toLine = (c: Command) => `\`/${c.name}\` — ${c.description}`

export function handleHelpCommand() {
	const mainLines = (COMMANDS as readonly Command[]).map(toLine)

	const lines: string[] = ['**Доступные команды:**', ...mainLines]

	if (GUILD_COMMANDS.length) {
		const guildLines = (GUILD_COMMANDS as readonly Command[]).map(toLine)
		lines.push('', '**В разработке:**', ...guildLines)
	}

	return {
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			content: lines.join('\n'),
		},
	}
}
