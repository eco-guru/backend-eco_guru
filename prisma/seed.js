import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  // Seed Roles
  const adminRole = await prisma.roles.createMany({
    data: [
      {
        name: "Admin",
      },
      {
        name: "User",
      },
    ]
    
  });

  // Seed Users
  await prisma.users.create({
    data: {
      username: "user1",
      name: "admin 1",
      password: hashedPassword,
      phone: "081234567890",
      token: uuid().toString(),
      role_id: 1,
    },
  });

  // Seed Waste Categories
  const wasteCategories = [
    { category: "Karton" },
    { category: "Kertas" },
    { category: "Plastik - Botol" },
    { category: "Plastik - Kantong" },
    { category: "Plastik - Kemasan" },
    { category: "Minyak Jelantah" },
    { category: "Kaca/Beling" },
  ];
  await prisma.wasteCategory.createMany({
    data: wasteCategories,
  });

  // Seed UOMs
  const uoms = [{ unit: "Liter" }, { unit: "Kilogram" }];
  await prisma.uOM.createMany({
    data: uoms,
  });

  // Seed Pricelist
  const pricelist = [
    { waste_id: 1, uom_id: 2, price: 500, isActive: true, start_date: new Date() },
    { waste_id: 2, uom_id: 2, price: 300, isActive: true, start_date: new Date() },
    { waste_id: 3, uom_id: 2, price: 1000, isActive: true, start_date: new Date() },
    { waste_id: 4, uom_id: 2, price: 800, isActive: true, start_date: new Date() },
    { waste_id: 5, uom_id: 2, price: 600, isActive: true, start_date: new Date() },
    { waste_id: 6, uom_id: 1, price: 5000, isActive: true, start_date: new Date() },
    { waste_id: 7, uom_id: 2, price: 1500, isActive: true, start_date: new Date() },
  ];
  await prisma.pricelist.createMany({
    data: pricelist,
  });

  // Seed Articles
  await prisma.articles.create({
    data: {
      title: "Pengelolaan Sampah Plastik",
      content: "Pentingnya pengelolaan sampah plastik.",
      category: "Lingkungan",
      isPublished: true,
      created_by: "user1",
      created_date: new Date(),
      article_order: 1,
    },
  });

  // Seed Videos
  await prisma.videos.create({
    data: {
      title: "Pengolahan Sampah Menjadi Energi",
      description: "Video ini menjelaskan cara mengolah sampah menjadi energi.",
      duration: 600,
      format: "MP4",
      thumbnail_url: "https://dlh.semarangkota.go.id/wp-content/uploads/2021/02/Bank-sampah-image-nu.or_.id.jpg",
      url: "https://www.youtube.com/watch?v=qulKqnwNXQo&t=5s",
      upload_date: new Date(),
      uploaded_by: "user1",
      isActive: true,
      video_order: 2,
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
