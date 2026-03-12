import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? ''

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Password reset flow: keep the session and redirect to reset-password
            if (next === '/reset-password') {
                throw redirect(303, '/reset-password')
            }

            // Email verification flow: Go straight to the dashboard!
            throw redirect(303, '/dashboard')
        }
    }

    // return the user to an error page with instructions
    throw redirect(303, '/login?error=auth_callback_failed')
}
