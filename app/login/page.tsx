'use client'

import { useActionState } from 'react'

import { authenticate } from './actions'

const initialState = { message: '' }

export default function LoginPage() {
  const [state, action, isPending] = useActionState(authenticate, initialState)
  const message = state.message

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">Secure Notes</h1>

        <form className="space-y-4" action={action}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              name="intent"
              value="login"
              disabled={isPending}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </button>

            <button
              type="submit"
              name="intent"
              value="signup"
              disabled={isPending}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>

        {message ? (
          <p aria-live="polite" className="mt-4 text-sm text-red-600">
            {message}
          </p>
        ) : null}
      </div>
    </main>
  )
}
