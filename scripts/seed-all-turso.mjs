import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO env variables.");
  process.exit(1);
}

const client = createClient({ url, authToken });

const skills = [
  {
    category: 'tech',
    title: 'Development & AI',
    items: JSON.stringify(['TypeScript', 'JavaScript', 'HTML/CSS', 'Antigravity', 'Prompt Engineering', 'Vibe Coding']),
    order_index: 1
  },
  {
    category: 'tech',
    title: 'Deployment & Tools',
    items: JSON.stringify(['GitHub', 'Vercel', 'Turso', 'Cloudinary']),
    order_index: 2
  },
  {
    category: 'community',
    title: 'Community & Automation',
    items: JSON.stringify(['Facebook Group Management', 'Telegram Bot API', 'Community Scaling']),
    order_index: 3
  },
  {
    category: 'business',
    title: 'E-Commerce Platforms',
    items: JSON.stringify(['Shopee Seller Centre', 'Tokopedia Seller Dashboard', 'Shopify']),
    order_index: 4
  }
];

const experiences = [
  {
    title: 'Independen (Kami Depresi, Kami Bahagia, dll.)',
    role: 'Lead Admin & Manajer Komunitas',
    period: 'Nov 2021 – Sekarang',
    description: 'Membangun dan mengelola komunitas Facebook organik dengan lebih dari 500.000+ anggota aktif. Mengelola moderasi, engagement, dan strategi konten.',
    order_index: 1
  },
  {
    title: 'Kaos Kami',
    role: 'Pemilik Toko Online/Brand',
    period: 'Jun 2022 – Sekarang',
    description: 'Mendirikan brand pakaian e-commerce. Mengelola produksi, pemasaran digital, dan operasional toko dengan rating kepuasan pelanggan 4.9/5.0.',
    order_index: 2
  },
  {
    title: 'PT Midi Utama Indonesia Tbk (Alfamidi)',
    role: 'Staf Toko',
    period: 'Sep 2021 – Agu 2022',
    description: 'Mengelola operasional harian toko, layanan pelanggan, dan manajemen inventaris.',
    order_index: 3
  }
];

const projects = [
  {
    title: 'MoodLab',
    description: 'Platform E-Commerce Bisnis terpadu. Pemenang Juara 1 Kompetisi E-Commerce di UNM.',
    link: 'https://moodlab.web.id',
    github_link: '',
    category: 'ecommerce',
    tags: JSON.stringify(['TypeScript', 'Fullstack', 'Vite']),
    is_featured: 1,
    order_index: 1
  },
  {
    title: 'Kaos Kami',
    description: 'Situs resmi brand Kaos Kami dengan integrasi sistem belanja yang mulus.',
    link: 'https://kaoskami.biz.id',
    github_link: '',
    category: 'ecommerce',
    tags: JSON.stringify(['TypeScript', 'Web Dev', 'Tailwind']),
    is_featured: 1,
    order_index: 2
  },
  {
    title: 'Kaos Kami SCM',
    description: 'Sistem Manajemen Rantai Pasok untuk efisiensi logistik dan inventaris brand.',
    link: '',
    github_link: 'https://github.com/Hengki-Setiawan/SCM-Kaos-Kami',
    category: 'dashboard',
    tags: JSON.stringify(['TypeScript', 'SCM', 'Management']),
    is_featured: 0,
    order_index: 3
  },
  {
    title: 'SimbisData',
    description: 'Dashboard Business Intelligence untuk visualisasi data bisnis real-time.',
    link: '',
    github_link: '',
    category: 'dashboard',
    tags: JSON.stringify(['Data Viz', 'Web', 'Analytics']),
    is_featured: 1,
    order_index: 4
  }
];

const cv_entries = [
  {
    section: 'education',
    title: 'Universitas Negeri Makassar (UNM)',
    subtitle: 'S1 Bisnis Digital',
    date_range: '2023 – Sekarang',
    description: 'Mahasiswa aktif dengan fokus pada transformasi digital bisnis dan teknologi.',
    order_index: 1
  },
  {
    section: 'education',
    title: 'SMK N 4 Makassar',
    subtitle: 'SMK – Pemasaran Digital',
    date_range: '2018 – 2021',
    description: 'Mempelajari dasar-dasar pemasaran, branding, dan komunikasi bisnis.',
    order_index: 2
  },
  {
    section: 'certification',
    title: 'Juara 1 Kompetisi E-Commerce',
    subtitle: 'Program Studi Bisnis Digital UNM',
    date_range: '2024',
    description: 'Penghargaan atas inovasi dalam membangun platform e-commerce terpadu.',
    order_index: 1
  }
];

const cv_profile = {
  id: uuidv4(),
  summary: 'Mahasiswa S1 Bisnis Digital sekaligus wirausaha digital dengan rekam jejak yang terbukti dalam membangun dan mengelola komunitas Facebook organik dengan lebih dari 500.000+ anggota aktif. Web Developer mandiri yang memanfaatkan tools AI modern dan pendekatan vibe coding.',
  contact_email: 'hengkisetiawan461@gmail.com',
  contact_phone: '+62 895-8034-63032',
  address: 'Makassar, Sulawesi Selatan',
  website_url: 'https://hengkisetiawan.my.id'
};

const site_content = [
  { section: 'hero', key: 'name_first', value: 'Hengki' },
  { section: 'hero', key: 'name_last', value: 'Setiawan' },
  { section: 'hero', key: 'role_1', value: 'Digital Entrepreneur' },
  { section: 'hero', key: 'role_2', value: 'Web Developer & Vibe Coder' },
  { section: 'hero', key: 'github_url', value: 'https://github.com/Hengki-Setiawan' },
  { section: 'hero', key: 'linkedin_url', value: 'https://linkedin.com/in/hengki-setiawan' }
];

async function seed() {
  try {
    console.log("Emptying tables...");
    await client.execute("DELETE FROM skills");
    await client.execute("DELETE FROM experiences");
    await client.execute("DELETE FROM projects");
    await client.execute("DELETE FROM cv_entries");
    await client.execute("DELETE FROM cv_profile");
    await client.execute("DELETE FROM site_content");

    console.log("Seeding skills...");
    for (const item of skills) {
      await client.execute({
        sql: "INSERT INTO skills (id, category, title, items, order_index) VALUES (?, ?, ?, ?, ?)",
        args: [uuidv4(), item.category, item.title, item.items, item.order_index]
      });
    }

    console.log("Seeding experiences...");
    for (const item of experiences) {
      await client.execute({
        sql: "INSERT INTO experiences (id, title, role, period, description, order_index) VALUES (?, ?, ?, ?, ?, ?)",
        args: [uuidv4(), item.title, item.role, item.period, item.description, item.order_index]
      });
    }

    console.log("Seeding projects...");
    for (const item of projects) {
      await client.execute({
        sql: "INSERT INTO projects (id, title, description, link, github_link, category, tags, is_featured, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [uuidv4(), item.title, item.description, item.link, item.github_link, item.category, item.tags, item.is_featured, item.order_index]
      });
    }

    console.log("Seeding cv_entries...");
    for (const item of cv_entries) {
      await client.execute({
        sql: "INSERT INTO cv_entries (id, section, title, subtitle, date_range, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [uuidv4(), item.section, item.title, item.subtitle, item.date_range, item.description, item.order_index]
      });
    }

    console.log("Seeding cv_profile...");
    await client.execute({
      sql: "INSERT INTO cv_profile (id, summary, contact_email, contact_phone, address, website_url) VALUES (?, ?, ?, ?, ?, ?)",
      args: [cv_profile.id, cv_profile.summary, cv_profile.contact_email, cv_profile.contact_phone, cv_profile.address, cv_profile.website_url]
    });

    console.log("Seeding site_content...");
    for (const item of site_content) {
      await client.execute({
        sql: "INSERT INTO site_content (id, section, key, value) VALUES (?, ?, ?, ?)",
        args: [uuidv4(), item.section, item.key, item.value]
      });
    }

    console.log("✅ Seeding complete!");
  } catch (e) {
    console.error("❌ Seeding failed:", e);
  } finally {
    process.exit(0);
  }
}

seed();
