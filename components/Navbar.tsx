'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN'

  return (
    <nav className="bg-pink-400 shadow-md">
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <img src="/logo/logo2.png" alt="YummyLand" className="h-24 w-20 object-contain" />
        </Link>

        <div className="flex items-center gap-10">

          {/* Boutique */}
          <Link href="/shop" className="flex flex-col items-center gap-1 text-white hover:text-pink-100 transition">
            <img src="/icons/boutique.png" alt="Boutique" className="w-20 h-20 object-contain" />
            <span className="text-xs font-medium">Boutique</span>
          </Link>

          {session ? (
            <>
              {/* Panier */}
              <Link href="/cart" className="flex flex-col items-center gap-1 text-white hover:text-pink-100 transition">
                <img src="/icons/panier.png" alt="Panier" className="w-20 h-20 object-contain" />
                <span className="text-xs font-medium">Panier</span>
              </Link>

              {/* Commandes */}
              <Link href="/orders" className="flex flex-col items-center gap-1 text-white hover:text-pink-100 transition">
                <img src="/icons/commande.png" alt="Commandes" className="w-20 h-20 object-contain" />
                <span className="text-xs font-medium">Commandes</span>
              </Link>

              {/* Admin — visible uniquement si ADMIN */}
              {isAdmin && (
                <Link href="/admin" className="flex flex-col items-center gap-1 text-white hover:text-pink-100 transition">
                  <img src="/icons/admin.png" alt="Admin" className="w-20 h-20 object-contain" />
                  <span className="text-xs font-medium">Admin</span>
                </Link>
              )}


              {/* Bonjour + déconnexion */}
              <div className="flex flex-col items-center gap-1">
                <Link href="/profile">
                  <img src="/icons/hello.png" alt="Profil" className="w-15 h-14 object-contain" />
                </Link>
                <span className="text-pink-100 text-xs">{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-white text-pink-500 px-5 py-1 rounded-full text-xs font-medium hover:bg-pink-100 transition"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-white hover:text-pink-100 font-medium transition text-sm">
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-white text-pink-500 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-pink-100 transition"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}