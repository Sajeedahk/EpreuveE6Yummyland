import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'YummyLand',
  description: 'La boutique Jellycat rose et douce',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
