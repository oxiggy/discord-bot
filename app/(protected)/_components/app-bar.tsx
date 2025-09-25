import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import Link from 'next/link'

const dashboardList = [
	{
		title: 'Ключевые метрики',
		href: '/dashboard',
		description: 'Общие показатели по пользователям и активности.',
	},
	{
		title: 'Пользователи',
		href: '/users',
		description: 'Таблица юзеров с их ролями, балансом и остальными данными.',
	},
	{
		title: 'Логи и статистика',
		href: '/logs',
		description: 'История событий, аналитика активности и мониторинг.',
	},
]

const commandsList = [
	{
		title: 'Ивенты',
		href: '/commands/events',
		description: 'Команды для запуска викторин и игровых механик (кейсы, мини-игры).',
	},
	{
		title: 'Инвентарь и баланс',
		href: '/commands/inventory',
		description: 'Просмотр предметов, открытие кейсов, проверка и перевод баланса.',
	},
	{
		title: 'Помощь и справка',
		href: '/commands/helper',
		description: 'Команды для получения справки, информации о боте и обратной связи.',
	},
	{
		title: 'Админские команды',
		href: '/commands/admin',
		description: 'Настройка викторин, кейсов, предметов, прав доступа, логов и аналитики.',
	},
]

const casesList = [
	{
		title: 'Виды кейсов и содержимое',
		href: '/cases',
		description: 'Наполнение и вероятность выпадения предметов.',
	},
	{
		title: 'Настройка предметов',
		href: '/cases/items',
		description: 'Параметры предметов внутри кейсов: название, тип (роль, валюта, тд).',
	},
	{
		title: 'История открытий',
		href: '/cases/history',
		description: 'Записи о том, когда и какие кейсы были открыты пользователями.',
	},
]

const quizList = [
	{
		title: 'Викторина по Overwatch',
		href: '/quiz/overwatch',
		description: 'Управление вопросами, вероятностями и наградами за ответы.',
	},
	{
		title: 'Другой ивент',
		href: '/games/coming-soon',
		description: 'Плейсхолдер для возможной новой викторины или мини-игры.',
	},
]

const adminPanelList = [
	{
		title: 'Профиль администратора',
		href: '/profile',
		description: 'Данные и управление сессиями',
	},
	{
		title: 'API документация',
		href: '/documentation',
		description: 'Эндпоинты, схемы и примеры запросов.',
	},
	{
		title: 'Команда админов',
		href: '/team',
		description: 'Список админов и менеджеров, онлайн-статус и активные сессии.',
	},
]

export function AppBar() {
	return (
		<NavigationMenu viewport={false} className="p-2">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Дашбоард</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{dashboardList.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Команды</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{commandsList.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Ивенты</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{quizList.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Кейсы</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{casesList.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>Админ-панель</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{adminPanelList.map((item) => (
								<ListItem key={item.title} title={item.title} href={item.href}>
									{item.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	)
}
