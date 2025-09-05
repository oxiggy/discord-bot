import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function PageWrapper({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn('py-8 px-4', className)}>
      {children}
    </div>
  );
}