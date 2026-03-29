import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Category } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') as Category | null

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { id: 'asc' },
  })

  return NextResponse.json(products)
}
