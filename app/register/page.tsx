'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordRules = [
    { label: '12 caractères minimum', test: (p: string) => p.length >= 12 },
    { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Une minuscule', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Un caractère spécial (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(fr|com|net|org|eu|io|be|ch|ca|info|biz)$/
  const isEmailValid = email.length === 0 || emailRegex.test(email)
  const isPasswordValid = passwordRules.every((r) => r.test(password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!emailRegex.test(email)) {
      setError('Email invalide. Format attendu : utilisateur@exemple.fr')
      return
    }

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères requis')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Une erreur est survenue')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border-2 border-pink-100">
        <h1 className="text-3xl font-bold text-pink-500 text-center mb-2">Inscription </h1>
        <p className="text-pink-300 text-center mb-6 text-sm">Rejoins la famille YummyLand !</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Prénom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
              placeholder="Ton prénom"
              required
            />
          </div>
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-2.5 focus:outline-none text-gray-700 transition ${
                email.length > 0 && !isEmailValid
                  ? 'border-red-300 focus:border-red-400'
                  : email.length > 0 && isEmailValid
                  ? 'border-green-300 focus:border-green-400'
                  : 'border-pink-200 focus:border-pink-400'
              }`}
              placeholder="utilisateur@exemple.fr"
              required
            />
            {email.length > 0 && !isEmailValid && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                 Format invalide - ex : utilisateur@exemple.fr 
              </p>
            )}
            {email.length > 0 && isEmailValid && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                 Email valide
              </p>
            )}
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
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className={`text-xs flex items-center gap-1.5 ${rule.test(password) ? 'text-green-500' : 'text-pink-300'}`}>
                    <span>{rule.test(password) ? '✓' : '○'}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isPasswordValid || !isEmailValid || email.length === 0}
            className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-pink-300 text-sm mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-pink-500 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}