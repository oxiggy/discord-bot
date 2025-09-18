'use client'

import { Button } from '@/components/ui/button'
import { DoorOpenIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error);
    } else {
      router.push('/');
    }
  }

  return (
    <Button className='gap-8 text-violet-400' variant='outline' onClick={handleLogout}>
      <span>Выйти</span>
      <DoorOpenIcon />
    </Button>
  );
}
