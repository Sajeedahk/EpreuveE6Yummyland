'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type CartItem = {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image: string
    category: string
  }
}

type Cart = {
  id: number
  items: CartItem[]
}

const FALLBACK_ICON: Record<string, string> = {
  PELUCHE: '/icons/iconspeluche.png',
  PORTE_CLEF: '/icons/iconspc.png',
  SAC_A_DOS: '/icons/iconssac.png',
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)

  const placeOrder = async () => {
    setOrdering(true)
    const res = await fetch('/api/orders', { method: 'POST' })
    const data = await res.json()
    setOrdering(false)
    if (res.ok) {
      router.push(`/orders?success=${data.orderNumber}`)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const fetchCart = async () => {
    const res = await fetch('/api/cart')
    const data = await res.json()
    setCart(data)
    setLoading(false)
  }

  useEffect(() => {
    if (session) fetchCart()
  }, [session])

  const updateQuantity = async (itemId: number, quantity: number) => {
    await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    fetchCart()
  }

  const removeItem = async (itemId: number) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
    fetchCart()
  }

  const total = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0

  if (loading) return <div className="text-center text-pink-300 py-20 text-xl">Chargement... </div>

  return (
      <div className="max-w-3xl mx-auto px-4 py-10">
  <h1 className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-8">
    Mon panier
    <img
      src="/icons/panier.png"
      className="w-20 h-20 object-contain"
    />
  </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-pink-100">
          <div className="text-6xl mb-4">
            <img
      src="/icons/vide.png"
      className="w-64 h-35 object-contain ml-auto mr-auto"
    />
          </div>
          <p className="text-pink-300 text-lg mb-4">Ton panier est vide !</p>
          <Link
            href="/shop"
            className="bg-pink-400 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-500 transition"
          >
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border-2 border-pink-100 p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-white border border-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<span class="text-2xl">${FALLBACK_ICON[item.product.category] || '🎀'}</span>`
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-700 truncate">{item.product.name}</h3>
                  <p className="text-pink-400 font-semibold">{item.product.price.toFixed(2)} €</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border-2 border-pink-200 text-pink-400 hover:bg-pink-50 font-bold transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border-2 border-pink-200 text-pink-400 hover:bg-pink-50 font-bold transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="w-20 text-right font-bold text-gray-700">
                  {(item.product.price * item.quantity).toFixed(2)} €
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-pink-200 hover:text-red-400 transition text-xl ml-1"
                  title="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border-2 border-pink-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">
                Total ({cart.items.reduce((s, i) => s + i.quantity, 0)} articles)
              </span>
              <span className="text-2xl font-bold text-pink-500">{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={ordering}
              className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
            >
              {ordering ? 'Traitement...' : 'Passer la commande '}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
