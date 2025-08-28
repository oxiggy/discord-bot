import { VenetianMaskIcon } from 'lucide-react'
import { AppBarLink } from './app-bar-link'

export function AppBar() {
  return (
    <nav className="w-full h-16 bg-app-bar text-app-bar-foreground flex gap-2 items-center px-4">
      <AppBarLink href="/dashboard">Дашбоард</AppBarLink>
      <AppBarLink href="/commands">Команды</AppBarLink>
      <AppBarLink href="/quiz">Викторина</AppBarLink>
      <AppBarLink href="/cases">Кейсы</AppBarLink>
      <AppBarLink href="/logs">Логи</AppBarLink>
      <div className='grow'></div>
      <AppBarLink href="/profile"><VenetianMaskIcon /></AppBarLink>
    </nav>
  )
}