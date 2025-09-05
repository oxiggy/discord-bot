import { Button } from '@/components/ui/button'
import PageWrapper from '@/components/ui/page-wrapper'
import { DoorOpenIcon } from 'lucide-react'

export default function Page() {
  return (
    <PageWrapper className='p-10'>
      <Button className='gap-8 text-violet-400' variant='outline'>
        <span>Выйти</span>
        <DoorOpenIcon />
      </Button>
    </PageWrapper>
  );
}
