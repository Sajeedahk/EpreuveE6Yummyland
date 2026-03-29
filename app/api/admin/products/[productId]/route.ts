import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false
  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) } })
  return user?.role === 'ADMIN'
}

export async function DELETE(_: NextRequest, { params }: { params: { productId: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const productId = parseInt(params.productId)

  // Supprimer les relations avant le produit
  await prisma.cartItem.deleteMany({ where: { productId } })
  await prisma.product.delete({ where: { id: productId } })

  return NextResponse.json({ message: 'Produit supprimé' })
}