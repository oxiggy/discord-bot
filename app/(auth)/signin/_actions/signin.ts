'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SigninActionState = {
	error?: string
}

export async function signinAction(_state: SigninActionState, formData: FormData) {
	const supabase = await createClient()
	const origin = formData.get('origin')

	if (!origin || typeof origin !== 'string') {
		throw new Error('Origin is required')
	}

	const redirectTo = `${origin}/signin/callback`

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: { redirectTo },
	})

	if (!error) {
		return redirect(data.url)
	}

	return {
		error: error.message,
	}
}
