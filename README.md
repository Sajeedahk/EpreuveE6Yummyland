# 🌸 YummyLand — Boutique Jellycat

Site e-commerce rose et doux pour les produits Jellycat (peluches, porte-clés, sacs à dos).

---

## ⚙️ Stack technique

- **Next.js 14** (App Router)
- **NextAuth.js** (authentification JWT)
- **Prisma** (ORM)
- **MySQL** (base de données)
- **Tailwind CSS** (styles)
- **bcryptjs** (hashage des mots de passe)

---

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd yummyland
npm install
```

### 2. Configurer la base de données

Créer une base MySQL nommée `yummyland` :

```sql
CREATE DATABASE yummyland CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurer les variables d'environnement

Copier `.env.example` en `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

Modifier `.env` :

```env
DATABASE_URL="mysql://VOTRE_USER:VOTRE_MOT_DE_PASSE@localhost:3306/yummyland"
NEXTAUTH_SECRET="une_chaine_aleatoire_longue_et_secrete"
NEXTAUTH_URL="http://localhost:3000"
```

> Pour générer un secret : `openssl rand -base64 32`

### 4. Créer les tables avec Prisma

```bash
npx prisma db push
```

### 5. Peupler la base avec les produits

```bash
npm run prisma:seed
```

### 6. Lancer le serveur

```bash
npm run dev
```

Ouvrir http://localhost:3000 🎉

---

## 📁 Structure du projet

```
yummyland/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   ← NextAuth
│   │   │   └── register/route.ts        ← Inscription
│   │   ├── cart/
│   │   │   ├── route.ts                 ← GET/POST panier
│   │   │   └── [itemId]/route.ts        ← PATCH/DELETE article
│   │   └── products/route.ts            ← GET produits
│   ├── cart/page.tsx                    ← Page panier
│   ├── login/page.tsx                   ← Page connexion
│   ├── register/page.tsx               ← Page inscription
│   ├── shop/page.tsx                    ← Boutique
│   ├── layout.tsx                       ← Layout global
│   └── page.tsx                         ← Page d'accueil
├── components/
│   ├── Navbar.tsx
│   └── SessionProvider.tsx
├── lib/
│   ├── auth.ts                          ← Config NextAuth
│   └── prisma.ts                        ← Client Prisma
├── prisma/
│   ├── schema.prisma                    ← Schéma BDD
│   └── seed.ts                          ← Données de démo
└── .env.example
```

---

## 🗄️ Schéma base de données

| Table      | Description                          |
|------------|--------------------------------------|
| `User`     | Utilisateurs (nom, email, password)  |
| `Product`  | Produits Jellycat (3 catégories)     |
| `Cart`     | Panier lié à chaque utilisateur      |
| `CartItem` | Articles du panier (produit + qté)   |

---

## 🎯 Fonctionnalités

- ✅ Inscription avec création automatique du panier
- ✅ Connexion / Déconnexion (JWT)
- ✅ Boutique filtrée par catégorie
- ✅ Ajout au panier depuis la boutique
- ✅ Modification de quantité dans le panier
- ✅ Suppression d'article du panier
- ✅ Total du panier calculé en temps réel

---

## 🛠️ Commandes utiles

```bash
# Voir la BDD dans un interface visuelle
npx prisma studio

# Régénérer le client Prisma après modif du schema
npx prisma generate

# Réinitialiser et repeupler
npx prisma db push --force-reset && npm run prisma:seed
```
