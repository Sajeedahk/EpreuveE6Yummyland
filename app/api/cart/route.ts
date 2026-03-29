import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    })
  }

  return NextResponse.json(cart)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)
  const { productId, quantity } = await req.json()

  let cart = await prisma.cart.findUnique({ where: { userId } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } })
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  })

  if (existing) {
    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity: existing.quantity + (quantity || 1) },
    })
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: quantity || 1 },
    })
  }

  return NextResponse.json({ message: 'Produit ajouté au panier' })
}
