'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

const CATEGORIES = [
  { key: '', label: 'Tous', icon: '/icons/capybara.png' },
  { key: 'PELUCHE', label: 'Peluches', icon: '/icons/iconspeluche.png' },
  { key: 'PORTE_CLEF', label: 'Porte-clés', icon: '/icons/iconspc.png' },
  { key: 'SAC_A_DOS', label: 'Sacs à dos', icon: '/icons/iconssac.png' },
]

const FALLBACK_ICON: Record<string, string> = {
  PELUCHE: '/icons/iconspeluche.png',
  PORTE_CLEF: '/icons/iconspc.png',
  SAC_A_DOS: '/icons/iconssac.png',
}

export default function ShopPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)

  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    const url = category ? `/api/products?category=${category}` : '/api/products'
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false) })
  }, [category])

  const setCategory = (cat: string) => {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    router.push('/shop' + (cat ? `?${params.toString()}` : ''))
  }

  const addToCart = async (productId: number) => {
    if (!session) { router.push('/login'); return }
    setAdding(productId)
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
    setAdding(null)
    setSuccess(productId)
    setTimeout(() => setSuccess(null), 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
  <h1 className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-8">
    Notre boutique
    <img
      src="/icons/boutique.png"
      alt="Boutique"
      className="w-20 h-20 object-contain"
    />
  </h1>


      {/* Category filter */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-5 py-2 rounded-full font-medium transition text-sm border-2 flex items-center gap-2 ${
              category === cat.key
                ? 'bg-pink-400 text-white border-pink-400'
                : 'bg-white text-pink-400 border-pink-200 hover:border-pink-400'
            }`}
          >
            {cat.icon
              ? <img src={cat.icon} alt={cat.label} className="w-5 h-5 object-contain" />
              : <span><img src="/icons/capybara.png"className="w-full h-full object-contain" /></span>
            }
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-pink-300 py-20 text-xl">Chargement... </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border-2 border-pink-100 hover:border-pink-200 hover:shadow-md transition overflow-hidden"
            >
              <div className="bg-white h-48 flex items-center justify-center p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    const fallback = FALLBACK_ICON[product.category] || ''
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = fallback
                      ? `<img src="${fallback}" class="w-20 h-20 object-contain" />`
                      : `<div class="text-5xl"></div>`
                  }}
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-pink-300 font-medium uppercase tracking-wide">
                  {product.category === 'PELUCHE' ? 'Peluche' : product.category === 'PORTE_CLEF' ? 'Porte-clé' : 'Sac à dos'}
                </span>
                <h3 className="font-bold text-gray-700 mt-1 mb-1">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-500 font-bold text-lg">{product.price.toFixed(2)} €</span>
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={adding === product.id}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      success === product.id
                        ? 'bg-green-400 text-white'
                        : 'bg-pink-400 text-white hover:bg-pink-500'
                    } disabled:opacity-50`}
                  >
                    {success === product.id ? '✓ Ajouté !' : adding === product.id ? '...' : '+ Panier'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}