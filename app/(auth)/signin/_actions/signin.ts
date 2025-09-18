'use server'
import {redirect} from "next/navigation";
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

async function getOrigin() {
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (host) return `${proto}://${host}`;
  return 'http://localhost:3000';
}

export type SigninActionState = {
  error?: string
}

export async function signinAction(state: SigninActionState, formData: FormData) {
  const supabase = await createClient()

  const redirectTo = new URL('/signin/callback', await getOrigin()).toString();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo },
  });

  if (!error) {
    return redirect(data.url);
  }

  return {
    error: error.message,
  }
}