# Guide de déploiement d'EasyBaby

Ce document explique comment déployer l'application EasyBaby en production.

## Prérequis

- Un compte [Vercel](https://vercel.com)
- Un compte [Stripe](https://stripe.com)
- Un compte [Resend](https://resend.com)
- Une base de données PostgreSQL (Supabase, Neon, Railway, etc.)

## Étapes de déploiement

### 1. Configuration de la base de données de production

1. Créez une base de données PostgreSQL sur le fournisseur de votre choix (Supabase, Neon, Railway, etc.)
2. Notez l'URL de connexion à votre base de données, qui ressemble à :
   ```
   postgresql://username:password@hostname:port/database
   ```

### 2. Configuration de Stripe

1. Dans le tableau de bord Stripe, assurez-vous d'avoir configuré votre compte avec les informations nécessaires
2. Récupérez votre clé API secrète et votre clé API publique dans la section "Développeurs > Clés API"
3. Configurez un webhook pointant vers `https://votre-domaine.com/api/public/webhooks/stripe`
4. Sélectionnez les événements suivants à écouter :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `setup_intent.succeeded`
   - `setup_intent.setup_failed`
5. Notez la clé secrète du webhook

### 3. Configuration de Resend

1. Dans le tableau de bord Resend, vérifiez votre domaine ou utilisez un domaine de test fourni
2. Récupérez votre clé API dans la section "API Keys"

### 4. Déploiement sur Vercel

1. Connectez-vous à votre compte Vercel
2. Importez votre dépôt GitHub contenant le projet EasyBaby
3. Configurez les variables d'environnement suivantes :

```
# Base de données
DATABASE_URL="postgresql://username:password@hostname:port/database"

# NextAuth
NEXTAUTH_SECRET="votre-secret-très-sécurisé"
NEXTAUTH_URL="https://votre-domaine.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."

# Application
APP_BASE_URL="https://votre-domaine.com"
SUPPORT_EMAIL="support@easybaby.io"
NEXT_PUBLIC_DEFAULT_CITY_SLUG="paris"

# Configuration
RESERVATION_PENDING_TTL_MIN=10
DEPOSIT_AUTH_DAYS=7

# Cron
CRON_SECRET="votre-secret-pour-les-taches-cron"
```

4. Déployez l'application en cliquant sur "Deploy"

### 5. Configuration des tâches cron sur Vercel

Les tâches cron sont déjà configurées dans le fichier `vercel.json`. Assurez-vous que :

1. La variable d'environnement `CRON_SECRET` est définie
2. Les tâches cron sont activées dans les paramètres du projet Vercel

### 6. Initialisation de la base de données

1. Exécutez la commande suivante pour appliquer le schéma Prisma à votre base de données de production :
   ```
   cd apps/web && npx prisma db push
   ```

2. Exécutez le script de seed pour créer les données initiales :
   ```
   cd apps/web && npm run seed
   ```

### 7. Création d'un utilisateur admin

Pour créer un utilisateur admin, vous pouvez utiliser l'API Prisma directement :

```javascript
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const passwordHash = await hash('votre-mot-de-passe', 12);
  
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@easybaby.io',
      passwordHash,
      role: 'admin',
    },
  });
  
  console.log('Admin créé:', admin);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Enregistrez ce script dans un fichier `create-admin.js` et exécutez-le avec Node.js.

### 8. Vérification du déploiement

1. Accédez à votre domaine pour vérifier que l'application fonctionne correctement
2. Connectez-vous à l'interface d'administration avec les identifiants que vous avez créés
3. Vérifiez que les données initiales ont été correctement créées

## Surveillance et maintenance

- Configurez des alertes pour les erreurs dans la console Vercel
- Surveillez les logs de l'application pour détecter d'éventuels problèmes
- Configurez des sauvegardes régulières de votre base de données

## Mise à jour de l'application

Pour mettre à jour l'application :

1. Poussez vos modifications sur la branche principale de votre dépôt GitHub
2. Vercel déploiera automatiquement les nouvelles modifications

Si vous devez effectuer des migrations de base de données :

1. Mettez à jour votre schéma Prisma
2. Exécutez `npx prisma db push` pour appliquer les modifications à votre base de données de production
