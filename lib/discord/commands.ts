export enum CommandName {
  Help = "help",
  Roles = "roles",
  Member = "member",
}

export const COMMANDS = [
  { name: CommandName.Help, description: "Список доступных команд", type: 1 },
  { name: CommandName.Roles, description: "Выбрать роли по интересам", type: 1 },
  {
    name: CommandName.Member,
    description: "Показывает ник и роли участника",
    type: 1,
    options: [
      {
        name: "user",
        description: "Кого показать (по умолчанию — вы)",
        type: 6,
        required: false,
      },
    ],
  },
]

export const GUILD_COMMANDS = [
]