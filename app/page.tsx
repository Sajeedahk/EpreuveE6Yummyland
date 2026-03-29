import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-pink-500 mb-4">
          <img
      src="/icons/titre.png"
      alt="Boutique"
      className="w-47 h-49 object-contain"
    />
        </h1>
        
        <p className="text-pink-400 text-xl mb-8">
          Votre boutique Jellycat en ligne
        </p>
    
        <Link
          href="/shop"
          className="bg-pink-400 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-500 transition shadow-md"
        >
          Découvrir la boutique
        </Link>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <Link href="/shop?category=PELUCHE" className="group">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition border-2 border-pink-100 hover:border-pink-300 h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img src="/icons/iconspeluche.png" alt="Peluche" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-pink-500 mb-2">Peluches Jellycat</h2>
            <p className="text-pink-300 text-sm">Lapins, ours, animaux... ultra doux !</p>
          </div>
        </Link>

        <Link href="/shop?category=PORTE_CLEF" className="group">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition border-2 border-pink-100 hover:border-pink-300 h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img src="/icons/iconspc.png" alt="Porte-clés" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-pink-500 mb-2">Porte-clés Jellycat</h2>
            <p className="text-pink-300 text-sm">Petits compagnons pour vos clés</p>
          </div>
        </Link>

        <Link href="/shop?category=SAC_A_DOS" className="group">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition border-2 border-pink-100 hover:border-pink-300 h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <img src="/icons/iconssac.png" alt="Sac à dos" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-pink-500 mb-2">Sacs à dos Jellycat</h2>
            <p className="text-pink-300 text-sm">Des sacs trop craquants pour sortir</p>
          </div>
        </Link>
      </div>
    </div>
  )
}