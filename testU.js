const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

let passed = 0
let failed = 0

function ok(testName) {
  console.log(`  OK  ${testName}`)
  passed++
}

function ko(testName, err) {
  console.log(`  ECHEC  ${testName}`)
  if (err) console.log(`     -> ${err}`)
  failed++
}

//test connexion à la base de données

async function testConnexionBDD() {
  console.log('\nTest 1 : Connexion a la base de donnees')
  try {
    await prisma.$connect()
    ok('Connexion a MySQL reussie')
  } catch (e) {
    ko('Connexion a MySQL echouee', e)
  }
}

//Test récupération des produits

async function testGetProduits() {
  console.log('\nTest 2 : Recuperation des produits')
  try {
    const produits = await prisma.product.findMany()
    if (produits.length > 0) {
      ok('Produits trouves : ' + produits.length)
    } else {
      ko('Aucun produit en base (pense a lancer le seed)')
    }

    const premier = produits[0]
    if (premier && premier.name && premier.price && premier.category) {
      ok('Premier produit valide : "' + premier.name + '" — ' + premier.price + ' euros')
    } else {
      ko('Le premier produit a des champs manquants')
    }
  } catch (e) {
    ko('Erreur lors de la recuperation des produits', e)
  }
}



//lancement des tests

async function runTests() {
  console.log('=======================================')
  console.log('    YummyLand — Tests Unitaires')
  console.log('=======================================')

  await testConnexionBDD()
  await testGetProduits()

  console.log('\n=======================================')
  console.log('  Resultats : ' + passed + ' reussi(s) / ' + failed + ' echoue(s)')
  if (failed === 0) {
    console.log('  Tous les tests sont passes !')
  } else {
    console.log('  Certains tests ont echoue.')
  }
  console.log('=======================================\n')

  await prisma.$disconnect()
}

runTests()


//Pour lancer les tests dans le terminal cmd de vsc node testU.js
