'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type OrderItem = {
  id: number
  quantity: number
  price: number
  product: {
    name: string
    image: string
    category: string
  }
}

type Order = {
  id: number
  orderNumber: string
  total: number
  status: 'EN_ATTENTE' | 'EN_COURS' | 'LIVREE'
  createdAt: string
  items: OrderItem[]
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-600' },
  EN_COURS:   { label: 'En cours',   color: 'bg-blue-100 text-blue-600' },
  LIVREE:     { label: 'Livrée',     color: 'bg-green-100 text-green-600' },
}

const EMOJI: Record<string, string> = {
  PELUCHE: '',
  PORTE_CLEF: '🔑',
  SAC_A_DOS: '🎒',
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const successOrder = searchParams.get('success')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [openOrder, setOpenOrder] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false) })
  }, [session])

  if (loading) return <div className="text-center text-pink-300 py-20 text-xl">Chargement... </div>

  return (
     <div className="max-w-3xl mx-auto px-4 py-10">
  <h1 className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-8">
    Mes commandes
    <img
      src="/icons/commande.png"
      className="w-20 h-20 object-contain"
    />
  </h1>

      {successOrder && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl"><img
      src="/icons/right.png"
      alt="Boutique"
      className="w-20 h-25 object-contain"
    /></span>
          <div>
            <p className="font-bold text-green-700">Commande passée avec succès !</p>
            <p className="text-green-600 text-sm">
              Numéro de commande : <span className="font-mono font-bold">{successOrder}</span>
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-pink-100">
          <div className="text-6xl mb-4">
            <img
      src="/icons/vide.png"
      className="w-64 h-35 object-contain ml-auto mr-auto"
    />
          </div>
          <p className="text-pink-300 text-lg mb-4">Aucune commande pour le moment !</p>
          <Link
            href="/shop"
            className="bg-pink-400 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-500 transition"
          >
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = openOrder === order.id
            const s = STATUS_LABEL[order.status]
            const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric',
            })

            return (
              <div key={order.id} className="bg-white rounded-2xl border-2 border-pink-100 overflow-hidden">
                <button
                  onClick={() => setOpenOrder(isOpen ? null : order.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-pink-50 transition text-left"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-gray-700 text-sm">{order.orderNumber}</p>
                      <p className="text-pink-300 text-xs">{date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-pink-500">{order.total.toFixed(2)} €</span>
                    <span className="text-pink-300 text-lg">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t-2 border-pink-50 divide-y divide-pink-50">
                    {order.items.map((item) => (
                      <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement
                              t.style.display = 'none'
                              t.parentElement!.innerHTML = `<span class="text-xl">${EMOJI[item.product.category] || '🎀'}</span>`
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-700 text-sm truncate">{item.product.name}</p>
                          <p className="text-pink-300 text-xs">Qté : {item.quantity}</p>
                        </div>
                        <p className="text-gray-600 font-semibold text-sm">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    ))}
                    <div className="px-4 py-3 flex justify-between items-center bg-pink-50">
                      <span className="text-gray-500 text-sm">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} articles
                      </span>
                      <span className="font-bold text-pink-500">Total : {order.total.toFixed(2)} €</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
