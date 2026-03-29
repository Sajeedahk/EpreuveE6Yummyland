import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false
  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) } })
  return user?.role === 'ADMIN'
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: { select: { id: true, total: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}