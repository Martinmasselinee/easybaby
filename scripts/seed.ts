import { PrismaClient, ShareType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Démarrage du seed...");

    // Nettoyer la base de données avant de seeder
    console.log("🧹 Nettoyage de la base de données...");
    await cleanDatabase();

    // Créer un utilisateur admin
    console.log("👤 Création de l'utilisateur admin...");
    const adminUser = await createAdminUser();
    console.log(`✅ Admin créé: ${adminUser.email}`);

    // Créer la ville de Paris
    console.log("🏙️ Création de la ville...");
    const paris = await createCity();
    console.log(`✅ Ville créée: ${paris.name}`);

    // Créer l'hôtel de démonstration
    console.log("🏨 Création de l'hôtel de démonstration...");
    const hotel = await createHotel(paris.id);
    console.log(`✅ Hôtel créé: ${hotel.name}`);

    // Créer les produits
    console.log("🛒 Création des produits...");
    const products = await createProducts();
    console.log(`✅ ${products.length} produits créés`);

    // Créer l'inventaire pour l'hôtel
    console.log("📦 Création de l'inventaire...");
    await createInventory(hotel.id, products);
    console.log("✅ Inventaire créé");

    // Créer un accord de revenus pour l'hôtel
    console.log("💰 Création de l'accord de revenus...");
    await createRevenueAgreement(hotel.id);
    console.log("✅ Accord de revenus créé");

    console.log("✅ Seed terminé avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanDatabase() {
  // Supprimer les données existantes dans l'ordre inverse des dépendances
  await prisma.claim.deleteMany();
  await prisma.paymentAudit.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.revenueAgreement.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.product.deleteMany();
  await prisma.city.deleteMany();
  await prisma.adminUser.deleteMany();
}

async function createAdminUser() {
  const passwordHash = await hash("admin123", 12);
  
  return prisma.adminUser.create({
    data: {
      email: "admin@easybaby.io",
      passwordHash,
      role: "admin",
    },
  });
}

async function createCity() {
  return prisma.city.create({
    data: {
      name: "Paris",
      slug: "paris",
    },
  });
}

async function createHotel(cityId: string) {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Hôtel Demo Paris",
      address: "123 Avenue des Champs-Élysées, 75008 Paris",
      phone: "+33123456789",
      email: "reception+demo@hotel.example",
      cityId,
      contactName: "Jean Dupont",
    },
  });

  // Créer le code de réduction pour l'hôtel
  await prisma.discountCode.create({
    data: {
      code: "HOTELPARIS70",
      hotelId: hotel.id,
      kind: ShareType.HOTEL_70,
      active: true,
    },
  });

  return hotel;
}

async function createProducts() {
  const poussette = await prisma.product.create({
    data: {
      name: "Poussette",
      description: "Poussette confortable et facile à plier",
      basePrice: 0, // Gratuit pour le pilote
      deposit: 15000, // 150€ en centimes
    },
  });

  const lit = await prisma.product.create({
    data: {
      name: "Lit parapluie",
      description: "Lit parapluie confortable et sécurisé",
      basePrice: 0, // Gratuit pour le pilote
      deposit: 20000, // 200€ en centimes
    },
  });

  return [poussette, lit];
}

async function createInventory(hotelId: string, products: any[]) {
  const inventoryPromises = products.map((product) =>
    prisma.inventoryItem.create({
      data: {
        hotelId,
        productId: product.id,
        quantity: 5, // 5 unités de chaque produit
        active: true,
      },
    })
  );

  return Promise.all(inventoryPromises);
}

async function createRevenueAgreement(hotelId: string) {
  return prisma.revenueAgreement.create({
    data: {
      hotelId,
      defaultShare: ShareType.PLATFORM_70,
      startsAt: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
