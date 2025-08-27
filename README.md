# EasyBaby

Plateforme de location d'équipements pour bébé dans les hôtels.

## 📋 Description

EasyBaby est une plateforme qui permet aux hôtels de proposer à leurs clients des équipements pour bébé (poussettes, lits parapluie, etc.) à emprunter pendant leur séjour. La plateforme gère les réservations, les disponibilités, les paiements (cautions) et les communications entre les clients et les hôtels.

## 🛠️ Technologies

- **Framework**: Next.js 14+ (App Router) avec TypeScript
- **UI**: React 18, Tailwind CSS, shadcn/ui, lucide-react icons
- **État**: Server Actions + React Query
- **Base de données**: PostgreSQL via Prisma ORM
- **Authentification**: NextAuth (admin uniquement)
- **Paiements**: Stripe
- **Emails**: Resend + ICS calendar
- **Internationalisation**: next-intl (FR/EN)

## 🚀 Installation

### Prérequis

- Node.js 20+
- PostgreSQL
- Compte Stripe (pour les paiements)
- Compte Resend (pour les emails)

### Étapes d'installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-username/easybaby.git
cd easybaby
```

2. Installer les dépendances :

```bash
cd apps/web
npm install
```

3. Configurer les variables d'environnement :

Créer un fichier `.env` dans le dossier `apps/web` avec les variables suivantes :

```
DATABASE_URL="postgresql://username:password@localhost:5432/easybaby"
NEXTAUTH_SECRET="votre-secret-très-sécurisé"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="votre-clé-api-resend"
STRIPE_SECRET_KEY="votre-clé-secrète-stripe"
STRIPE_WEBHOOK_SECRET="votre-secret-webhook-stripe"
APP_BASE_URL="http://localhost:3000"
SUPPORT_EMAIL="support@easybaby.io"
NEXT_PUBLIC_DEFAULT_CITY_SLUG="paris"
RESERVATION_PENDING_TTL_MIN=10
DEPOSIT_AUTH_DAYS=7
```

4. Créer la base de données et appliquer le schéma :

```bash
npx prisma db push
```

5. Remplir la base de données avec les données de démonstration :

```bash
npm run seed
```

6. Lancer l'application en mode développement :

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## 📱 Utilisation

### Interface utilisateur

- Accès à la page d'accueil : [http://localhost:3000](http://localhost:3000)
- Parcours utilisateur : Sélection ville > Produit > Hôtel > Dates > Paiement > Confirmation

### Interface admin

- Accès à l'interface admin : [http://localhost:3000/admin](http://localhost:3000/admin)
- Identifiants par défaut :
  - Email : `admin@easybaby.io`
  - Mot de passe : `admin123`

## 🔄 Flux Complet

### Admin Side (Démarrage à zéro)

1. **Ajouter une ville**
   - La ville apparaît sur le user side avec "0 hôtels, 0 produits"

2. **Ajouter un hôtel dans la ville**
   - Entrer toutes les informations relatives à l'hôtel
   - La ville affiche "1 hôtel, 0 produits" côté utilisateur

3. **Ajouter des produits**
   - Créer des produits avec prix horaires, journaliers et caution
   - Aucun impact immédiat côté utilisateur

4. **Ajouter des produits au stock d'un hôtel**
   - Sélectionner un hôtel et ajouter des produits à son stock
   - La ville affiche "1 hôtel, X produits" côté utilisateur

5. **Configurer le code promo de l'hôtel**
   - Définir un code promo qui modifie la répartition des revenus
   - Ce code sera affiché à l'utilisateur lors de la confirmation

### User Side

1. **Sélectionner une ville**
   - Voir les villes avec nombre d'hôtels et produits disponibles

2. **Sélectionner un produit**
   - Voir les détails du produit (prix horaire, journalier, caution)

3. **Sélectionner les dates et hôtels**
   - Choisir les dates de retrait et retour
   - Sélectionner les hôtels (uniquement ceux avec disponibilité)

4. **Paiement**
   - Saisir les informations personnelles
   - Appliquer éventuellement un code promo hôtel
   - Pré-autorisation de la caution

5. **Confirmation**
   - Recevoir un code de réservation alphanumérique
   - Voir le code de réduction pour l'hôtel
   - Recevoir un email de confirmation (l'hôtel également)

## 🔄 Tâches planifiées

L'application utilise deux tâches cron importantes :

1. **Expiration des réservations en attente** : Exécutée toutes les 10 minutes pour libérer le stock réservé mais non confirmé.
2. **Règlement des revenus** : Exécutée quotidiennement pour calculer les parts de revenus entre la plateforme et les hôtels.

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test
```

## 📊 Structure du projet

```
/apps/web
  /app
    /(public)
      /[locale]
        /(marketing)
        /(user)
          /city
          /product
          /checkout
          /reservation
        /(admin)
          /dashboard
          /hotels
          /stock
          /reservations
          /reports
    /api
      /admin
      /public
  /components
  /lib
  /styles
  /types
  env.mjs
/prisma
  schema.prisma
/scripts
  seed.ts
```

## 🌍 Internationalisation

L'application prend en charge deux langues :

- Français (par défaut) : `/fr`
- Anglais : `/en`

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

Développé avec ❤️ par [Votre Nom]