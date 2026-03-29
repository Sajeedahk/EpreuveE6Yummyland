import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    // Peluches
    { name: 'Bashful Bunny Rose', description: 'Le célèbre lapin doux Jellycat en rose pastel', price: 34.99, image: '/images/bunny.jpg', category: Category.PELUCHE },
    { name: 'Amuseable Avocado', description: 'Un avocat trop mignon en peluche ultra douce', price: 29.99, image: '/images/avocado.jpg', category: Category.PELUCHE },
    { name: 'Smudge Rabbit', description: 'Lapin Jellycat avec les oreilles tombantes', price: 39.99, image: '/images/smudge.jpg', category: Category.PELUCHE },
    { name: 'Blossom Bunny', description: 'Lapin fleuri aux couleurs pastel', price: 44.99, image: '/images/blossom.jpg', category: Category.PELUCHE },

    // Porte-clés
    { name: 'Porte-clé Lapin', description: 'Mini lapin Jellycat pour vos clés', price: 12.99, image: '/images/keyring-bunny.jpg', category: Category.PORTE_CLEF },
    { name: 'Porte-clé Fraise', description: 'Petite fraise Jellycat adorable', price: 11.99, image: '/images/keyring-strawberry.jpg', category: Category.PORTE_CLEF },
    { name: 'Porte-clé Ours', description: 'Mini ourson Jellycat pour accessoriser', price: 12.99, image: '/images/keyring-bear.jpg', category: Category.PORTE_CLEF },

    // Sacs à dos
    { name: 'Sac Lapin Pastel', description: 'Sac à dos en forme de lapin Jellycat', price: 59.99, image: '/images/bag-bunny.jpg', category: Category.SAC_A_DOS },
    { name: 'Sac Ours Doux', description: 'Sac à dos ours Jellycat pour enfants', price: 54.99, image: '/images/bag-bear.jpg', category: Category.SAC_A_DOS },
    { name: 'Sac Licorne', description: 'Sac à dos licorne Jellycat rose et doré', price: 64.99, image: '/images/bag-unicorn.jpg', category: Category.SAC_A_DOS },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Seed terminé ! 10 produits créés.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
