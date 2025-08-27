# 🌟 EasyBaby — CursorRules & Project Blueprint

> **Note**: Ce document est la source unique de vérité pour la portée et les conventions du projet EasyBaby.

## 📚 Table des Matières

- [Stack Technique](#-stack-technique)
- [Portée du Produit](#-portée-du-produit)
- [Structure du Projet](#-structure-du-projet)
- [Modèle de Données](#-modèle-de-données)
- [Rôles & Accès](#-rôles--accès)
- [Routes & Pages](#-routes--pages)
- [Logique Métier](#-logique-métier)
- [Paiements & Dépôts](#-paiements--dépôts)
- [Emails & Calendrier](#-emails--calendrier)
- [API Routes](#-api-routes)
- [Composants & UX](#-composants--ux)
- [Légal & Consentement](#-légal--consentement)
- [Internationalisation](#-internationalisation)
- [Tests](#-tests)
- [Configuration & DX](#-configuration--dx)

## 🔧 Stack Technique

### Framework & Base
- Next.js 14+ (App Router)
- TypeScript strict mode
- React 18
- Tailwind CSS
- shadcn/ui
- lucide-react (icônes)

### État & Données
- Server Actions + React Query
- PostgreSQL via Prisma ORM
- NextAuth (authentification admin)

### Services Externes
- Stripe (PaymentIntent + SetupIntent)
- Resend/SendGrid (emails)
- UploadThing/S3 (stockage futur)
- Vercel Analytics
- Vercel Cron (tâches planifiées)

### Outils de Développement
- ESLint
- Prettier
- Vitest
- Playwright
- next-intl

## 🎯 Portée du Produit (V1)

### Applications
1. **Admin**
   - CRUD Hôtels
   - Gestion des stocks
   - Gestion des réservations
   - Rapports de revenus
   - Gestion des codes promo

2. **Utilisateur**
   - Parcours ville → produit → hôtel → dates
   - Paiement (pré-autorisation dépôt)
   - Réception QR/email
   - Sans compte requis

### Points Clés
- Un seul hôtel client au lancement
- Pas de comptes hôtels
- Interface desktop uniquement

## 📁 Structure du Projet

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

### Conventions Importantes
- Route groups pour séparer admin/user
- Protection middleware + NextAuth
- UTC en base, timezone locale en affichage

## 🗃️ Modèle de Données

[Le schéma Prisma complet est maintenu dans `/prisma/schema.prisma`]

### Entités Principales
- City
- Hotel
- Product
- InventoryItem
- Reservation
- DiscountCode
- RevenueAgreement
- AdminUser

### Règles Métier Critiques
- Pas de double réservation
- TTL sur réservations en attente
- Calcul de disponibilité atomique

## 🔐 Rôles & Accès

### Admin
- Accès complet interface admin
- Protection par NextAuth
- Role 'admin' requis

### Utilisateur
- Accès public
- Pas de compte requis
- Collecte email/téléphone au checkout

### Hôtels
- Pas de compte
- Gestion par admin
- Notifications par email

## 🌐 Routes & Pages

### Utilisateur
- `/[locale]` → Marketing + sélecteur ville
- `/[locale]/city/[citySlug]` → Produits disponibles
- `/[locale]/product/[productId]` → Détail + réservation
- `/[locale]/checkout` → Paiement
- `/[locale]/reservation/[code]` → Confirmation

### Admin
- `/admin/dashboard` → KPIs
- `/admin/hotels` → CRUD hôtels
- `/admin/stock` → Gestion stocks
- `/admin/reservations` → Suivi réservations
- `/admin/reports` → Exports

## 💡 Logique Métier

### Disponibilité
```typescript
// Règle de chevauchement
A.start < B.end && A.end > B.start
```

### Calcul Revenue
- PLATFORM_70: 70% plateforme / 30% hôtel
- HOTEL_70: 30% plateforme / 70% hôtel
- Code promo peut modifier le split

## 💳 Paiements & Dépôts

### Stripe
- PaymentIntent (pré-autorisation)
- SetupIntent (charge post-séjour)
- Webhook sécurisé
- Pas de capture immédiate

### Réclamations
- Création par admin
- Charge différée possible
- Notification hôtel

## ✉️ Emails & Calendrier

### Templates
1. **Confirmation Utilisateur**
   - QR code
   - Détails réservation
   - Code promo hôtel

2. **Notification Hôtel**
   - Détails réservation
   - ICS pickup/dropoff
   - Instructions

## 🧱 Composants & UX

### Composants Requis
- CitySelect
- ProductCard
- HotelPicker
- DateTimeRangePicker
- CheckoutSummary
- QRDisplay
- KPIStat
- DataTable

### UX Guidelines
- États vides
- Gestion erreurs
- Accessibilité
- Responsive desktop

## ⚙️ Configuration

### Variables d'Environnement
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
APP_BASE_URL=
DEFAULT_CITY_SLUG=paris
SUPPORT_EMAIL=support@easybaby.io
```

### Flags Configuration
```typescript
RESERVATION_PENDING_TTL_MIN=10
REVENUE_SHARE_DEFAULT=PLATFORM_70
DEPOSIT_AUTH_DAYS=7
```

## 🧪 Tests

### Critiques
- Chevauchement disponibilité
- Expiration TTL
- Webhooks Stripe
- Templates emails

### E2E
- Parcours réservation
- Interface admin
- Exports

## 📝 Textes Légaux

### Consentement Paiement
> Je comprends que 0€ est prélevé maintenant. En cas de non-retour ou d'article endommagé, EasyBaby pourra débiter ma carte à hauteur de la caution indiquée.

### Footer Email Hôtel
> Pour toute réclamation (non-retour/casse), répondez à cet email avec le code de réservation.

## 🌍 Internationalisation

### Langues
- Français (défaut)
- Anglais

### Formats
- Dates: dd/MM/yyyy HH:mm
- Monnaie: EUR
- Messages: next-intl

## ✅ Définition of Done V1

1. Interface admin fonctionnelle
2. Parcours utilisateur complet
3. Intégration Stripe validée
4. Gestion disponibilité robuste
5. Démo single-hôtel Paris
6. Tests critiques passants
7. Documentation complète

---

> Ce document doit être strictement suivi lors de la génération et modification du code.
