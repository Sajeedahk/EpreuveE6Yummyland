'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loadingInfo, setLoadingInfo] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [successInfo, setSuccessInfo] = useState('')
  const [errorInfo, setErrorInfo] = useState('')
  const [successPassword, setSuccessPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  // Regex email
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(fr|com|net|org|eu|io|be|ch|ca|info|biz)$/
  const isEmailValid = email.length === 0 || emailRegex.test(email)

  // Règles mot de passe
  const passwordRules = [
    { label: '12 caractères minimum', test: (p: string) => p.length >= 12 },
    { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Une minuscule', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Un caractère spécial (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]
  const isNewPasswordValid = newPassword.length === 0 || passwordRules.every((r) => r.test(newPassword))
  const isConfirmValid = confirmPassword.length === 0 || newPassword === confirmPassword

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || '')
        setEmail(data.email || '')
      })
  }, [session])

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorInfo('')
    setSuccessInfo('')

    if (!emailRegex.test(email)) {
      setErrorInfo('Format email invalide — ex : utilisateur@exemple.fr')
      return
    }

    setLoadingInfo(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    const data = await res.json()
    setLoadingInfo(false)

    if (!res.ok) {
      setErrorInfo(data.error || 'Une erreur est survenue')
    } else {
      setSuccessInfo('Informations mises à jour !')
      await update({ name, email })
      setTimeout(() => setSuccessInfo(''), 3000)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorPassword('')
    setSuccessPassword('')

    if (!passwordRules.every((r) => r.test(newPassword))) {
      setErrorPassword('Le nouveau mot de passe ne respecte pas les critères')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorPassword('Les mots de passe ne correspondent pas')
      return
    }

    setLoadingPassword(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    setLoadingPassword(false)

    if (!res.ok) {
      setErrorPassword(data.error || 'Une erreur est survenue')
    } else {
      setSuccessPassword('Mot de passe modifié ! Reconnexion...')
      setTimeout(() => signOut({ callbackUrl: '/login' }), 2000)
    }
  }

  if (status === 'loading') return <div className="text-center text-pink-300 py-20 text-xl">Chargement... </div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
  <h1 className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-8">
    Mon profil
    <img
      src="/icons/profil.png"
      className="w-15 h-12 object-contain"
    />
  </h1>


      {/* Infos personnelles */}
      <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
        <h2 className="text-lg font-bold text-pink-400 mb-5">Informations personnelles</h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          
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
              <p className="text-red-400 text-xs mt-1">✗ Format invalide — ex : utilisateur@exemple.fr</p>
            )}
            {email.length > 0 && isEmailValid && (
              <p className="text-green-500 text-xs mt-1">✓ Email valide</p>
            )}
          </div>

          {errorInfo && <p className="text-red-400 text-sm text-center">{errorInfo}</p>}
          {successInfo && <p className="text-green-500 text-sm text-center">✓ {successInfo}</p>}

          <button
            type="submit"
            disabled={loadingInfo || !isEmailValid || email.length === 0}
            className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loadingInfo ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>

      {/* Changement de mot de passe */}
      <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
        <h2 className="text-lg font-bold text-pink-400 mb-5">Changer le mot de passe</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-2.5 focus:outline-none text-gray-700 transition ${
                newPassword.length > 0 && !isNewPasswordValid
                  ? 'border-red-300 focus:border-red-400'
                  : newPassword.length > 0 && isNewPasswordValid
                  ? 'border-green-300 focus:border-green-400'
                  : 'border-pink-200 focus:border-pink-400'
              }`}
              placeholder="••••••••"
              required
            />
            {newPassword.length > 0 && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className={`text-xs flex items-center gap-1.5 ${rule.test(newPassword) ? 'text-green-500' : 'text-pink-300'}`}>
                    <span>{rule.test(newPassword) ? '✓' : '○'}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-pink-500 font-medium mb-1 text-sm">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-2.5 focus:outline-none text-gray-700 transition ${
                confirmPassword.length > 0 && !isConfirmValid
                  ? 'border-red-300 focus:border-red-400'
                  : confirmPassword.length > 0 && isConfirmValid
                  ? 'border-green-300 focus:border-green-400'
                  : 'border-pink-200 focus:border-pink-400'
              }`}
              placeholder="••••••••"
              required
            />
            {confirmPassword.length > 0 && !isConfirmValid && (
              <p className="text-red-400 text-xs mt-1">✗ Les mots de passe ne correspondent pas</p>
            )}
            {confirmPassword.length > 0 && isConfirmValid && (
              <p className="text-green-500 text-xs mt-1">✓ Les mots de passe correspondent</p>
            )}
          </div>

          {errorPassword && <p className="text-red-400 text-sm text-center">{errorPassword}</p>}
          {successPassword && <p className="text-green-500 text-sm text-center">✓ {successPassword}</p>}

          <button
            type="submit"
            disabled={loadingPassword || !isNewPasswordValid || !isConfirmValid || newPassword.length === 0}
            className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loadingPassword ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}