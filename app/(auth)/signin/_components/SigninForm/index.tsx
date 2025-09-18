'use client'

import { useActionState, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { SigninActionState, signinAction } from '@/app/(auth)/signin/_actions/signin'

export const SigninForm = () => {
  const [state, action, pending] = useActionState<SigninActionState, FormData>(signinAction, {})
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <form
      className="grid gap-y-8 px-8 py-4"
      action={action}
    >
      {state.error && !pending && (
        <div className="text-destructive">{state.error}</div>
      )}
      <input type="hidden" name="origin" value={origin} />

      <div className="">
        <Button type="submit" disabled={pending}>Sign in with Discord</Button>
      </div>
    </form>
  );
}