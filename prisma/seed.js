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
      {
        name: "Waste collector",
      },
      {
        name: "Educator",
      },
    ]
    
  });
  // Seed Waste Categories
  const wasteCategories = [
    { category: "Karton"},
    { category: "Kertas"},
    { category: "Plastik"},
    { category: "Minyak Jelantah" },
    { category: "Kaca/Beling" },
  ];

  const user1 = await prisma.users.create({
    data: {
      username: "user1",
      password: hashedPassword,
      phone: "081234567890",
      token: uuid().toString(),
      role_id: 1,
    },
  });

  const user2 = await prisma.users.create({
      data: {
        username: "john_doe",
        password: hashedPassword,
        phone: "081234567891",
        token: uuid().toString(),
        role_id: 2
      },
    });

  const user3 = await prisma.users.create({
      data: {
        username: "jane_smith",
        password: hashedPassword,
        phone: "081234567892",
        token: uuid().toString(),
        role_id: 2
      },
    });
  const user4 = await prisma.users.create({
      data: {
        username: "bob_johnson",
        password: hashedPassword,
        phone: "081234567893",
        token: uuid().toString(),
        role_id: 3
      },
    });

    
  const user5 = await prisma.users.create({
      data: {
        username: "alice_brown",
        password: hashedPassword,
        phone: "081234567894",
        token: uuid().toString(),
        role_id: 4
      },
  });

  await prisma.secretQuestion.create({
    data: {
      question_text: "Apa warna favorit anda?"
    }
  });

  await prisma.secretQuestion.create({
    data: {
      question_text: "Apa nama jalan tempat anda tinggal saat kecil?"
    }
  });

  await prisma.secretQuestion.create({
    data: {
      question_text: "Apa makanan kesukaan anda?"
    }
  });

  await prisma.secretQuestion.create({
    data: {
      question_text: "Siapa tokoh favorit anda?"
    }
  });

  await prisma.secretQuestion.create({
    data: {
      question_text: "Apa hobi anda?"
    }
  });

  await prisma.paymentRequest.create({
    data: {
      user_id: user2.id,
      request_date: new Date(),
      request_amount: 1000000,
      expected_payment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      payment_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      payment_by: user4.id,
      confirmation_status: 'Waiting_For_Confirmation',
      confirmation_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
  }),
  
  // Successful payments
  await prisma.paymentRequest.create({
    data: {
      user_id: user3.id,
      request_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      request_amount: 2500000,
      expected_payment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      payment_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      payment_by: user4.id,
      confirmation_status: 'Success',
      confirmation_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
  }),

  await prisma.wasteCategory.createMany({
    data: wasteCategories,
  });

  // Seed UOMs
  const uoms = [{ unit: "Liter" }, { unit: "Kilogram" }];
  await prisma.uOM.createMany({
    data: uoms,
  });

  const wasteTypes = [
    {type: "Kertas Karton", waste_category_id: 1},
    {type: "Kertas Kemasan", waste_category_id: 2},
    {type: "Plastik Botol", waste_category_id: 3},
    {type: "Plastik Kantong", waste_category_id: 3},
    {type: "Minyak Jelantah", waste_category_id: 4},
    {type: "Kaca Cermin", waste_category_id: 5},
    {type: "Kaca Beling", waste_category_id: 5},
  ]

  await prisma.wasteType.createMany({
    data: wasteTypes,
  });

  // Seed Pricelist
  const pricelist = [
    {waste_type_id: 1, uom_id: 2, price: 500, isActive: true, start_date: new Date() },
    {waste_type_id: 2, uom_id: 2, price: 300, isActive: true, start_date: new Date() },
    {waste_type_id: 3, uom_id: 2, price: 1000, isActive: true, start_date: new Date() },
    {waste_type_id: 4, uom_id: 2, price: 800, isActive: true, start_date: new Date() },
    {waste_type_id: 5, uom_id: 2, price: 600, isActive: true, start_date: new Date() },
    {waste_type_id: 6, uom_id: 1, price: 5000, isActive: true, start_date: new Date() },
    {waste_type_id: 7, uom_id: 2, price: 1500, isActive: true, start_date: new Date() },
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

console.log('Seed data created successfully');

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
