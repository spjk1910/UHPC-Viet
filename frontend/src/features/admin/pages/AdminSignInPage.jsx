import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../config/appRoutes'
import { signInAdmin } from '../services/adminService'

function AdminSignInPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signInAdmin({ username, password })
      navigate(APP_ROUTES.adminDashboard, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link to="/" className="text-sm font-semibold text-brand-700">UHPC Viet</Link>
        <h1 className="mt-6 text-3xl font-bold text-dark">Admin sign in</h1>
        <p className="mt-2 text-sm text-concrete">Sign in to manage the product catalogue.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Username
            <input
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 font-normal outline-none focus:border-brand-600"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 font-normal outline-none focus:border-brand-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-concrete hover:text-dark focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {showPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A10.7 10.7 0 0112 5c5.5 0 9 7 9 7a14.8 14.8 0 01-3 3.8" />
                      <path d="M6.2 6.2C3.9 7.7 3 12 3 12s3.5 7 9 7a9.9 9.9 0 004.1-.9" />
                    </>
                  ) : (
                    <>
                      <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminSignInPage
