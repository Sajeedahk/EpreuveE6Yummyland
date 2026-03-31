# EpreuveE6 Projet 1

## Présentation de Yummyland

Projet : Application e-commerce de vente de Jellycat en Next.JS, Les clients peuvent commander des articles comme des doudous / sac à dos  / porte-clés et les admins peuvent ajouter des articles et regarder les commandes réalisées ! 



voir la documentation du projet détaillé -> [YummyLand_Documentation.pdf](https://github.com/user-attachments/files/26332193/YummyLand_Documentation.pdf)


---

## Fonctionnalités principales

Authentification (inscription / connexion / déconnexion)

Gestion des profils (Modification du mot de passe / email)

Système de Panier ( ajout au panier / suppression du panier / modifier quantité) 

Système Administrateur ( ajout / suppression de produit)

Système de Commande ( utilisateur peut passer une commande et voir l'historique)

---

## Installation et lancement

### Prérequis

MySQL 
Next.js
Prisma

### Étapes d'installation

Cloner le projet

```
git clone https://github.com/Sajeedahk/EpreuveE6Yummyland
cd EpreuveE6Yummyland
```
```
npm install
npx prisma db push
```
Dans le terminal laragon 
```
cd EpreuveE6Yummyland
mysql -u root
source bdd.sql
```
Puis sur le terminal Visual Studio Code
```
npm run dev
```

Puis accéder à l'application :

Ouvrir un navigateur web
Aller à l'adresse http://localhost:3000



pour se connecter a l'espace ADMIN : 

identifiant : sajeedah@gmail.com

Mot de passe : Password

---

## Modèle Conceptuel de Données (MCD)
<img width="866" height="606" alt="Capture d&#39;écran 2026-03-31 142737" src="https://github.com/user-attachments/assets/d64194c2-3134-452d-94fd-6826a0793760" />


---

## Diagramme de Cas d'Utilisation

<img width="1017" height="725" alt="YummylandUseCase" src="https://github.com/user-attachments/assets/5be3465b-3fbb-41b7-884c-29f9c592bd35" />

---

## Technologies utilisées

Next.js

NextAuth.js (authentification JWT)

Prisma (ORM)

MySQL (base de données)

Tailwind CSS (styles)

bcryptjs (hashage des mots de passe)


