import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const prisma = new PrismaClient();

async function main() {
  const salt = process.env.HASH_SALT;
  if (!salt) {
      throw new Error("HASH_SALT is not set in environment variables");
  }

  const saltedPassword = 'password123' + salt;
  const hashedPassword = await bcrypt.hash(saltedPassword, 10);

  const adminRole = await prisma.roles.createMany({
    data: [
      {
        name: "User",
      },
      {
        name: "Admin",
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
      email: "user1@gmail.com",
      token: uuid().toString(),
      role_id: 2,
    },
  });

  const user2 = await prisma.users.create({
      data: {
        username: "john_doe",
        password: hashedPassword,
        email: "john_doe@gmail.com",
        token: uuid().toString(),
        role_id: 3
      },
    });

  const user3 = await prisma.users.create({
      data: {
        username: "jane_smith",
        password: hashedPassword,
        email: "jane_smith@gmail.com",
        token: uuid().toString(),
        role_id: 4
      },
    });
  const user4 = await prisma.users.create({
      data: {
        username: "bob_johnson",
        password: hashedPassword,
        email: "bob_johnson@gmail.com",
        token: uuid().toString(),
        role_id: 1
      },
    });

    
  const user5 = await prisma.users.create({
      data: {
        username: "alice_brown",
        password: hashedPassword,
        email: "alice_brown@gmail.com",
        token: uuid().toString(),
        role_id: 2
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
      confirmation_status: "Sedang_diproses",
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
      confirmation_status: "Selesai",
      confirmation_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
  }),

  await prisma.wasteCategory.createMany({
    data: wasteCategories,
  });

  // Seed UOMs
  const uoms = [{ unit: "Kilogram" }];
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
    {waste_type_id: 1, uom_id: 1, price: 500, isActive: true, start_date: new Date() },
    {waste_type_id: 2, uom_id: 1, price: 300, isActive: true, start_date: new Date() },
    {waste_type_id: 3, uom_id: 1, price: 1000, isActive: true, start_date: new Date() },
    {waste_type_id: 4, uom_id: 1, price: 800, isActive: true, start_date: new Date() },
    {waste_type_id: 5, uom_id: 1, price: 600, isActive: true, start_date: new Date() },
    {waste_type_id: 6, uom_id: 1, price: 5000, isActive: true, start_date: new Date() },
    {waste_type_id: 7, uom_id: 1, price: 1500, isActive: true, start_date: new Date() },
  ];
  await prisma.pricelist.createMany({
    data: pricelist,
  });

  await prisma.articleCategory.create({
    data: { category: 'Recycling' } 
  });

  await prisma.articleCategory.create({
    data: { category: 'Composting' } 
  });

  await prisma.articleCategory.create({
    data: { category: 'Reducing Waste' } 
  });

  await prisma.videoCategory.create({
    data: { category: 'Recycling Tutorial' }
  });

  await prisma.videoCategory.create({
    data: { category: 'Waste reduction tips' }
  });

  await prisma.videoCategory.create({
    data: { category: 'Composting Trick' }
  });

  // Seed Articles
  await prisma.articles.create({
    data: {
        title: "Pengelolaan Sampah Plastik",
        content: `<p>Mengelola sampah plastik secara efektif memerlukan langkah-langkah berkelanjutan yang dapat dimulai dari diri sendiri hingga skala komunitas atau industri. Berikut adalah beberapa cara untuk mengelola sampah plastik:</p>
         <ul>
             <li>Gunakan barang yang bisa dipakai ulang, seperti botol minum dan tas kain.</li>
             <li>Pisahkan plastik bersih yang dapat didaur ulang, lalu kirim ke pusat daur ulang atau bank sampah.</li>
             <li>Manfaatkan plastik bekas untuk barang berguna, seperti pot tanaman atau kerajinan tangan.</li>
             <li>Cari komunitas atau program yang menawarkan hadiah atau poin untuk penukaran sampah plastik.</li>
             <li>Ikut serta dalam kegiatan bersih-bersih untuk mengurangi sampah plastik di lingkungan sekitar.</li>
         </ul>`,
        isPublished: true,
        created_date: new Date(),
        thumbnail_url: 'https://tokoweb.co/wp-content/uploads/2020/10/Demo-Website-02-1024x521.jpg',
        article_order: 1,
        user: {
          connect: { username: 'user1' }
        },
        category: {
          connect: { id: 1 }
        }
      }
  });

  await prisma.articles.create({
    data: {
        title: "Memilih Jenis Visa Korea yang Tepat. Butuh Cepat? Ada Express Visa!",
        content: `<p style="text-align: justify;"><span style="font-weight: 400;">Cara membuat visa Korea Selatan 2024 yang pertama adalah menentukan jenis visa yang kamu butuhkan. Untuk pilihan jenis visa Korea ada beberapa, di antaranya adalah:</span></p>
         <ul style="text-align: justify;">
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Single Visa (Kunjungan di bawah 90 hari) Rp856.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Single Visa Express (Kunjungan di bawah 90 hari) Rp1.318.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Single Visa Khusus (Kunjungan di atas 91 hari) Rp1.164.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Double Visa (Kunjungan sebanyak 2x dan berlaku hingga 6 bulan) Rp1.318.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Double Visa Express (Kunjungan sebanyak 2x dan berlaku hingga 6 bulan) Rp1.934.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Multiple Visa (Kunjungan berkali-kali dengan masa berlaku selama 5 tahun) Rp1.626.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Multiple Visa Express (Kunjungan berkali-kali dengan masa berlaku selama 5 tahun) Rp2.242.000</span></li>
             <li style="font-weight: 400;" aria-level="1"><span style="font-weight: 400;">Grup Visa (Grup wisatawan minimal 5 orang dan maksimal 50 orang dengan jadwal keberangkatan dan kepulangan yang sama, khusus pengajuan travel agen yang terdaftar di Kedubes Korea di Indonesia)</span></li>
         </ul>`,
        isPublished: true,
        created_date: new Date(),
        article_order: 1,
        thumbnail_url: 'https://cdn-web-2.ruangguru.com/landing-pages/assets/cab2b02d-5c7a-4b73-a628-0f6397b29662.png',
        user: {
          connect: { username: 'user1' }
        },
        category: {
          connect: { id: 2 }
        }
      }
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
      isActive: true,
      video_order: 2,
      user: {
        connect: { username: 'user1' }
      },
      category: {
        connect: { id: 2 }
      }
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
