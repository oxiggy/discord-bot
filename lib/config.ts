import { z } from 'zod'

const envSchema = z.object({
	DISCORD_APP_ID: z.string().min(1),
	DISCORD_BOT_TOKEN: z.string().min(1),
	DISCORD_PUBLIC_KEY: z.string().min(1),
	DISCORD_GUILD_ID: z.string().min(1),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
	console.error('❌ Invalid environment variables', env.error.format())
	throw new Error('Invalid environment variables.')
}

export const config = {
	discord: {
		api: 'https://discord.com/api/v10',
		appId: env.data.DISCORD_APP_ID,
		botToken: env.data.DISCORD_BOT_TOKEN,
		publicKey: env.data.DISCORD_PUBLIC_KEY,
		guildId: env.data.DISCORD_GUILD_ID,
	},
}
