'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

type User = {
  id: number
  name: string
  email: string
  createdAt: string
  orders: { id: number; total: number; status: string }[]
}

const CATEGORY_LABEL: Record<string, string> = {
  PELUCHE: 'Peluche',
  PORTE_CLEF: 'Porte-clé',
  SAC_A_DOS: 'Sac à dos',
}

const STATUS_COLOR: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-600',
  EN_COURS: 'bg-blue-100 text-blue-600',
  LIVREE: 'bg-green-100 text-green-600',
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tab, setTab] = useState<'products' | 'users'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  // Form state
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: 'PELUCHE' })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products')
    if (res.status === 403) { router.push('/'); return }
    const data = await res.json()
    setProducts(data)
  }

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    if (res.status === 403) { router.push('/'); return }
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    if (!session) return
    Promise.all([fetchProducts(), fetchUsers()]).finally(() => setLoading(false))
  }, [session])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    })
    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setFormError(data.error || 'Erreur lors de l\'ajout')
    } else {
      setFormSuccess('Produit ajouté avec succès !')
      setForm({ name: '', description: '', price: '', image: '', category: 'PELUCHE' })
      fetchProducts()
      setTimeout(() => setFormSuccess(''), 3000)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    setDeleting(productId)
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    setDeleting(null)
    fetchProducts()
  }

  if (loading) return <div className="text-center text-pink-300 py-20 text-xl">Chargement... </div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
  <h1 className="flex items-center gap-3 text-3xl font-bold text-pink-500 mb-8">
    Espace Admin
    <img
      src="/icons/admin.png"
      className="w-20 h-20 object-contain"
    />
  </h1>
      <p className="text-pink-400 text-sm mb-8">Bienvenue, {session?.user.name}</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setTab('products')}
          className={`px-6 py-2.5 rounded-full font-medium transition border-2 ${
            tab === 'products' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-pink-400 border-pink-200 hover:border-pink-400'
          }`}
        >
          Produits ({products.length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-6 py-2.5 rounded-full font-medium transition border-2 ${
            tab === 'users' ? 'bg-pink-400 text-white border-pink-400' : 'bg-white text-pink-400 border-pink-200 hover:border-pink-400'
          }`}
        >
          Clients ({users.length})
        </button>
      </div>

      {/* ===== PRODUITS ===== */}
      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Formulaire ajout */}
          <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
            <h2 className="text-lg font-bold text-pink-400 mb-5"> Ajouter un produit</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-pink-500 font-medium mb-1 text-sm">Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
                  placeholder="Ex: Bashful Bunny Rose"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-500 font-medium mb-1 text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700 resize-none"
                  placeholder="Description du produit"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pink-500 font-medium mb-1 text-sm">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
                    placeholder="29.99"
                    required
                  />
                </div>
                <div>
                  <label className="block text-pink-500 font-medium mb-1 text-sm">Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
                  >
                    <option value="PELUCHE">Peluche</option>
                    <option value="PORTE_CLEF">Porte-clé</option>
                    <option value="SAC_A_DOS">Sac à dos</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-pink-500 font-medium mb-1 text-sm">Chemin image</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full border-2 border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 text-gray-700"
                  placeholder="/images/mon-produit.jpg"
                  required
                />
                {form.image && (
                  <div className="mt-2 w-16 h-16 border border-pink-100 rounded-lg overflow-hidden bg-pink-50">
                    <img src={form.image} alt="preview" className="w-full h-full object-contain p-1" />
                  </div>
                )}
              </div>

              {formError && <p className="text-red-400 text-sm text-center">{formError}</p>}
              {formSuccess && <p className="text-green-500 text-sm text-center">✓ {formSuccess}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-pink-400 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition disabled:opacity-50"
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter le produit'}
              </button>
            </form>
          </div>

          {/* Liste produits */}
          <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
            <h2 className="text-lg font-bold text-pink-400 mb-5"> Liste des produits</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 border border-pink-100 rounded-xl p-3">
                  <div className="w-12 h-12 bg-pink-50 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-700 text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-pink-300">{CATEGORY_LABEL[product.category]}</span>
                      <span className="text-xs font-semibold text-pink-500">{product.price.toFixed(2)} €</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="text-pink-200 hover:text-red-400 transition text-xl flex-shrink-0 disabled:opacity-50"
                    title="Supprimer"
                  >
                    {deleting === product.id ? '...' : '×'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== CLIENTS ===== */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border-2 border-pink-100 p-6">
          <h2 className="text-lg font-bold text-pink-400 mb-5"> Liste des clients</h2>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-pink-300 text-center py-8">Aucun client pour le moment</p>
            ) : (
              users.map((user) => {
                const totalSpent = user.orders.reduce((s, o) => s + o.total, 0)
                return (
                  <div key={user.id} className="border-2 border-pink-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-700">{user.name}</p>
                        <p className="text-pink-300 text-sm">{user.email}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-pink-500 font-bold">{totalSpent.toFixed(2)} €</p>
                        <p className="text-gray-400 text-xs">{user.orders.length} commande{user.orders.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {user.orders.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {user.orders.map((order) => (
                          <span
                            key={order.id}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[order.status]}`}
                          >
                            {order.total.toFixed(2)} €
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}