'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border-2 border-pink-100">
        <h1 className="text-3xl font-bold text-pink-500 text-center mb-2">Connexion </h1>
        <p className="text-pink-300 text-center mb-6 text-sm">Bon retour sur YummyLand !</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
              placeholder="ton@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-pink-300 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-pink-500 font-medium hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
