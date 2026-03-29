import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  }

  const userId = parseInt(session.user.id)
  const { name, email, currentPassword, newPassword } = await req.json()

  // Vérifier que l'email n'est pas déjà pris par quelqu'un d'autre
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 })
    }
  }

  const updateData: { name?: string; email?: string; password?: string } = {}

  if (name) updateData.name = name
  if (email) updateData.email = email

  // Si l'utilisateur veut changer son mot de passe
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Mot de passe actuel requis' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
    }

    updateData.password = await bcrypt.hash(newPassword, 10)
  }

  await prisma.user.update({ where: { id: userId }, data: updateData })

  return NextResponse.json({ message: 'Profil mis à jour avec succès' })
}