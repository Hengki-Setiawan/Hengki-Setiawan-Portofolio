const fs = require('fs');

// Read .env manually to avoid dotenv dependency
const envStr = fs.readFileSync('.env', 'utf8');
const env = {};
envStr.split('\n').forEach(line => {
    const cleanLine = line.replace(/\r/g, '');
    const match = cleanLine.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const generateThumbnail = (url) => `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;

const websites = [
    {
        title: 'Kaos Kami',
        description: 'E-Commerce store brand apparel Kaos Kami dengan antarmuka yang clean dan responsif untuk memaksimalkan konversi.',
        url: 'https://www.kaoskami.biz.id/',
        thumbnail_url: generateThumbnail('https://www.kaoskami.biz.id/'),
        category: 'ecommerce',
        technologies: ['React', 'Next.js', 'Tailwind CSS'],
        status: 'live',
        featured: true,
        order_index: 1,
        is_active: true
    },
    {
        title: 'MoodLab',
        description: 'Digital Agency & Services platform. Menawarkan layanan profesional di bidang web & creative.',
        url: 'https://www.moodlab.web.id/',
        thumbnail_url: generateThumbnail('https://www.moodlab.web.id/'),
        category: 'corporate',
        technologies: ['React', 'TypeScript', 'Framer Motion'],
        status: 'live',
        featured: true,
        order_index: 2,
        is_active: true
    },
    {
        title: 'Simbis Data',
        description: 'Sistem Informasi Bisnis dan Data terpadu. Membantu pengelolaan metrik operasional perusahaan.',
        url: 'https://simbisdata.vercel.app/',
        thumbnail_url: generateThumbnail('https://simbisdata.vercel.app/'),
        category: 'dashboard',
        technologies: ['React', 'Supabase', 'Vite'],
        status: 'live',
        featured: true,
        order_index: 3,
        is_active: true
    },
    {
        title: 'Absen Cryptogen',
        description: 'Aplikasi Absensi digital untuk karyawan & tim berbasis web dengan validasi keamanan tinggi.',
        url: 'https://absen-cryptogen.vercel.app/',
        thumbnail_url: generateThumbnail('https://absen-cryptogen.vercel.app/'),
        category: 'utility',
        technologies: ['React', 'Tailwind CSS', 'PostgreSQL'],
        status: 'live',
        featured: false,
        order_index: 4,
        is_active: true
    },
    {
        title: 'Prediksi MCGG',
        description: 'Tools analitik & prediksi data untuk parameter MCGG. Menggunakan algoritma probabilitas real-time.',
        url: 'https://prediksi-mcgg-phi.vercel.app/',
        thumbnail_url: generateThumbnail('https://prediksi-mcgg-phi.vercel.app/'),
        category: 'utility',
        technologies: ['React', 'Vite', 'Algorithm'],
        status: 'live',
        featured: false,
        order_index: 5,
        is_active: true
    },
    {
        title: 'Pilih Pilih',
        description: 'Aplikasi pemungutan suara (Voting System) dan seleksi opsi cerdas berbasis UI yang intuitif.',
        url: 'https://pilihpilih.vercel.app/',
        thumbnail_url: generateThumbnail('https://pilihpilih.vercel.app/'),
        category: 'utility',
        technologies: ['React', 'Tailwind', 'Firebase'],
        status: 'live',
        featured: false,
        order_index: 6,
        is_active: true
    },
    {
        title: 'Edu Panca Indra',
        description: 'Aplikasi pembelajaran interaktif untuk siswa mengenai Panca Indra manusia dengan media visual.',
        url: 'https://aplikasi-belajar-panca-indra.vercel.app/',
        thumbnail_url: generateThumbnail('https://aplikasi-belajar-panca-indra.vercel.app/'),
        category: 'education',
        technologies: ['React Native Web', 'CSS', 'Framer'],
        status: 'live',
        featured: true,
        order_index: 7,
        is_active: true
    },
    {
        title: 'SCM Aneka Baut',
        description: 'Dashboard Supply Chain Management terintegrasi khusus untuk inventarisasi dan logistik rantai pasok.',
        url: 'https://scm-aneka-baut.vercel.app/dashboard',
        thumbnail_url: generateThumbnail('https://scm-aneka-baut.vercel.app/'),
        category: 'dashboard',
        technologies: ['React Admin', 'Recharts', 'Supabase'],
        status: 'live',
        featured: true,
        order_index: 8,
        is_active: true
    },
    {
        title: 'ENG Video Downloader',
        description: 'Utility downloader video berkecepatan tinggi dengan antarmuka UX yang dioptimalkan.',
        url: 'https://eng-video-downloader.vercel.app/',
        thumbnail_url: generateThumbnail('https://eng-video-downloader.vercel.app/'),
        category: 'utility',
        technologies: ['Next.js', 'API Integration'],
        status: 'live',
        featured: false,
        order_index: 9,
        is_active: true
    },
    {
        title: 'CareerPath ID',
        description: 'Platform roadmap karir dan perencanaan profesional bagi talenta digital Indonesia.',
        url: 'https://careerpath-id.vercel.app/',
        thumbnail_url: generateThumbnail('https://careerpath-id.vercel.app/'),
        category: 'landing',
        technologies: ['React', 'Vite', 'Tailwind CSS'],
        status: 'live',
        featured: true,
        order_index: 10,
        is_active: true
    }
];

async function seed() {
    console.log('Inserting native fetch...');
    for(const site of websites) {
        const res = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/websites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(site)
        });
        
        if (!res.ok) {
            const err = await res.text();
            console.error('Failed to insert: ', site.title, err);
        } else {
            console.log('Inserted: ', site.title);
        }
    }
    console.log('Done mapping.');
}

seed();
