import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function generateOrderNumber(): string {
  const date = new Date()
  const datePart =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0')
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `YL-${datePart}-${randomPart}`
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  })

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 })
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  let orderNumber = generateOrderNumber()
  let exists = await prisma.order.findUnique({ where: { orderNumber } })
  while (exists) {
    orderNumber = generateOrderNumber()
    exists = await prisma.order.findUnique({ where: { orderNumber } })
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  })

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
