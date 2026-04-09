const generateThumbnail = (url: string) => `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

export interface Website {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail_url: string | null;
    category: string;
    technologies: string[];
    status: string;
    featured: boolean;
    order_index: number;
    is_active: boolean;
}

export const staticProjects: Website[] = [
    {
        id: 'proj-1',
        title: 'Kaos Kami',
        description: 'E-Commerce store brand apparel Kaos Kami dengan antarmuka yang clean dan responsif untuk memaksimalkan konversi.',
        url: 'https://www.kaoskami.biz.id/',
        thumbnail_url: generateThumbnail('https://www.kaoskami.biz.id/'),
        category: 'ecommerce',
        technologies: ['React', 'Next.js', 'Tailwind CSS'],
        status: 'live',
        featured: true,
        order_index: 101,
        is_active: true
    },
    {
        id: 'proj-2',
        title: 'MoodLab',
        description: 'Digital Agency & Services platform. Menawarkan layanan profesional di bidang web & creative.',
        url: 'https://www.moodlab.web.id/',
        thumbnail_url: generateThumbnail('https://www.moodlab.web.id/'),
        category: 'corporate',
        technologies: ['React', 'TypeScript', 'Framer Motion'],
        status: 'live',
        featured: true,
        order_index: 102,
        is_active: true
    },
    {
        id: 'proj-3',
        title: 'Simbis Data',
        description: 'Sistem Informasi Bisnis dan Data terpadu. Membantu pengelolaan metrik operasional perusahaan.',
        url: 'https://simbisdata.vercel.app/',
        thumbnail_url: generateThumbnail('https://simbisdata.vercel.app/'),
        category: 'corporate',
        technologies: ['React', 'Supabase', 'Vite'],
        status: 'live',
        featured: true,
        order_index: 103,
        is_active: true
    },
    {
        id: 'proj-4',
        title: 'Absen Cryptogen',
        description: 'Aplikasi Absensi digital untuk karyawan & tim berbasis web dengan validasi keamanan tinggi.',
        url: 'https://absen-cryptogen.vercel.app/',
        thumbnail_url: generateThumbnail('https://absen-cryptogen.vercel.app/'),
        category: 'other',
        technologies: ['React', 'Tailwind CSS', 'PostgreSQL'],
        status: 'live',
        featured: false,
        order_index: 104,
        is_active: true
    },
    {
        id: 'proj-5',
        title: 'Prediksi MCGG',
        description: 'Tools analitik & prediksi data untuk parameter MCGG. Menggunakan algoritma probabilitas real-time.',
        url: 'https://prediksi-mcgg-phi.vercel.app/',
        thumbnail_url: generateThumbnail('https://prediksi-mcgg-phi.vercel.app/'),
        category: 'other',
        technologies: ['React', 'Vite', 'Algorithm'],
        status: 'live',
        featured: false,
        order_index: 105,
        is_active: true
    },
    {
        id: 'proj-6',
        title: 'Pilih Pilih',
        description: 'Aplikasi pemungutan suara (Voting System) dan seleksi opsi cerdas berbasis UI yang intuitif.',
        url: 'https://pilihpilih.vercel.app/',
        thumbnail_url: generateThumbnail('https://pilihpilih.vercel.app/'),
        category: 'other',
        technologies: ['React', 'Tailwind', 'Firebase'],
        status: 'live',
        featured: false,
        order_index: 106,
        is_active: true
    },
    {
        id: 'proj-7',
        title: 'Edu Panca Indra',
        description: 'Aplikasi pembelajaran interaktif untuk siswa mengenai Panca Indra manusia dengan media visual.',
        url: 'https://aplikasi-belajar-panca-indra.vercel.app/',
        thumbnail_url: generateThumbnail('https://aplikasi-belajar-panca-indra.vercel.app/'),
        category: 'other',
        technologies: ['React Native Web', 'CSS', 'Framer'],
        status: 'live',
        featured: true,
        order_index: 107,
        is_active: true
    },
    {
        id: 'proj-8',
        title: 'SCM Aneka Baut',
        description: 'Dashboard Supply Chain Management terintegrasi khusus untuk inventarisasi dan logistik rantai pasok.',
        url: 'https://scm-aneka-baut.vercel.app/dashboard',
        thumbnail_url: generateThumbnail('https://scm-aneka-baut.vercel.app/'),
        category: 'corporate',
        technologies: ['React', 'Recharts', 'Supabase'],
        status: 'live',
        featured: true,
        order_index: 108,
        is_active: true
    },
    {
        id: 'proj-9',
        title: 'ENG Video Downloader',
        description: 'Utility downloader video berkecepatan tinggi dengan antarmuka UX yang dioptimalkan.',
        url: 'https://eng-video-downloader.vercel.app/',
        thumbnail_url: generateThumbnail('https://eng-video-downloader.vercel.app/'),
        category: 'other',
        technologies: ['Next.js', 'API Integration'],
        status: 'live',
        featured: false,
        order_index: 109,
        is_active: true
    },
    {
        id: 'proj-10',
        title: 'CareerPath ID',
        description: 'Platform roadmap karir dan perencanaan profesional bagi talenta digital Indonesia.',
        url: 'https://careerpath-id.vercel.app/',
        thumbnail_url: generateThumbnail('https://careerpath-id.vercel.app/'),
        category: 'landing',
        technologies: ['React', 'Vite', 'Tailwind CSS'],
        status: 'live',
        featured: true,
        order_index: 110,
        is_active: true
    }
];
