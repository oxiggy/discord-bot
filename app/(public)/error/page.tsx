'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center'>
      <h1 className='mb-4 text-6xl font-bold'>404</h1>
      <p className='mb-6 text-xl'>Oops! Sorry, something went wrong.</p>
      <Link href='/'>
        <Button variant='default'>Go Back</Button>
      </Link>
    </div>
  );
}
