export enum CommandName {
	Help = 'help',
	Word = 'word',
	Roles = 'roles',
	Member = 'member',
	Elonify = 'elonify',

}

export const COMMANDS = [
	{ name: CommandName.Help, description: 'Список доступных команд', type: 1 },
	{ name: CommandName.Word, description: 'Собрать слово из букв', type: 1 },
	{ name: CommandName.Roles, description: 'Выбрать роли по интересам', type: 1 },
	{
		name: CommandName.Member,
		description: 'Показывает ник и роли участника',
		type: 1,
		options: [
			{
				name: 'user',
				description: 'Кого показать (по умолчанию — вы)',
				type: 6,
				required: false,
			},
		],
	},
	{
		name: CommandName.Elonify,
		description: 'Преобразует текст в стиль Илона Маска',
		type: 1,
		options: [
			{
				name: 'text',
				description: 'Текст для преобразования',
				type: 3,
				required: true,
			},
		],
	},
]

export const GUILD_COMMANDS = []
