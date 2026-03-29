import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return false
  const user = await prisma.user.findUnique({ where: { id: parseInt(session.user.id) } })
  return user?.role === 'ADMIN'
}

// GET — liste tous les produits (admin)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } })
  return NextResponse.json(products)
}

// POST — ajouter un produit
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { name, description, price, image, category } = await req.json()

  if (!name || !description || !price || !image || !category) {
    return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, description, price: parseFloat(price), image, category: category as Category },
  })

  return NextResponse.json(product, { status: 201 })
}