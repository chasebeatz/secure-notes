'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateInput(email: string, password: string) {
  if (!validEmail.test(email) || password.length < 8) {
    return false
  }

  return true
}

export async function logIn(prevState: { message: string }, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!validateInput(email, password)) {
    return { message: 'Please enter a valid email and a password of at least 8 characters.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { message: 'Wrong email or password.' }
  }

  redirect('/')
}

export async function signUp(prevState: { message: string }, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!validateInput(email, password)) {
    return { message: 'Please enter a valid email and a password of at least 8 characters.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { message: error.message || 'Could not create account.' }
  }

  if (!data.session) {
    return { message: 'Check your email for a confirmation link. Confirm your email, then return here to log in.' }
  }

  redirect('/')
}

export async function authenticate(prevState: { message: string }, formData: FormData) {
  return formData.get('intent') === 'signup'
    ? signUp(prevState, formData)
    : logIn(prevState, formData)
}
