import { NextResponse } from 'next/server'
import { InteractionType, InteractionResponseType, MessageFlags } from 'discord-api-types/v10'
// main
import { CommandName } from '@/lib/discord/commands'
import { config } from '@/lib/config'
import { verifyDiscordRequest } from '@/lib/discord/verify'
import { notFoundReply, unknownActionReply } from '@/lib/discord/reply'
// commands
import { handleRoleButton, handleRolesCommand, isRoleButton } from '@/app/commands/roles'
import { handleHelpCommand } from '@/app/commands/help'
import { handleMemberCommand } from '@/app/commands/member'
import { handleElonifyCommand } from '@/app/commands/elonify'
import { handleWordButton, handleWordCommand, handleWordModalSubmit, isWordButton, isWordModalSubmit } from '@/app/commands/word'

export const runtime = 'edge'

export async function POST(req: Request) {
	const BOT_TOKEN = config.discord.botToken
	const PUBLIC_KEY = config.discord.publicKey

	try {
		const verified = await verifyDiscordRequest(req, PUBLIC_KEY)
		if (!verified.ok) return verified.error

		const { json } = verified

		switch (json.type) {
			/* Валидация URL в Dev Portal */
			case InteractionType.Ping: {
				return NextResponse.json({ type: InteractionResponseType.Pong })
			}

			/**
			 * Slash-команды
			 */
			case InteractionType.ApplicationCommand: {
				const name = json.data?.name as CommandName | undefined

				if (name === CommandName.Help) {
					return NextResponse.json(handleHelpCommand())
				}

				if (name === CommandName.Word) {
					const response = await handleWordCommand()
					return NextResponse.json(response)
				}

				if (name === CommandName.Elonify) {
					return NextResponse.json(handleElonifyCommand(json))
				}

				if (name === CommandName.Roles) {
					return NextResponse.json(handleRolesCommand(json))
				}

				if (name === CommandName.Member) {
					const response = await handleMemberCommand(json, BOT_TOKEN)
					return NextResponse.json(response)
				}

				return NextResponse.json(notFoundReply)
			}

			/**
			 * Взаимодействие с сообщениями (кнопки, селекты и пр.)
			 */
			case InteractionType.MessageComponent: {
				const customId: string | undefined = json.data?.custom_id

				if (isWordButton(customId)) {
					return NextResponse.json(handleWordButton(customId!))
				}

				if (isRoleButton(customId)) {
					const response = await handleRoleButton(json, BOT_TOKEN)
					return NextResponse.json(response)
				}

				return NextResponse.json(unknownActionReply)
			}

			/**
			 * Модальные окна (отправка форм)
			 */
			case InteractionType.ModalSubmit: {
				if (isWordModalSubmit(json)) {
					const response = await handleWordModalSubmit(json)
					return NextResponse.json(response)
				}

				return NextResponse.json(unknownActionReply)
			}

			default: {
				return new NextResponse('Unhandled interaction type', { status: 400 })
			}
		}
	} catch (_e: unknown) {
		return NextResponse.json({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: { content: `Ошибка... или это просто мини-саботаж 🤖`, flags: MessageFlags.Ephemeral },
		})
	}
}

export async function GET() {
	return NextResponse.json({ ok: true })
}
