import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { quantity } = await req.json()
  const itemId = parseInt(params.itemId)

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: itemId } })
    return NextResponse.json({ message: 'Article supprimé' })
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const itemId = parseInt(params.itemId)
  await prisma.cartItem.delete({ where: { id: itemId } })

  return NextResponse.json({ message: 'Article supprimé du panier' })
}
