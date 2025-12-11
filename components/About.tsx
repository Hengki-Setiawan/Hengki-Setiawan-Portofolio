import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Target, Briefcase, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

interface AboutContent {
  section_label: string;
  title_1: string;
  title_highlight: string;
  title_2: string;
  description_1: string;
  description_2: string;
  card_1_title: string;
  card_1_desc: string;
  card_1_subdesc: string;
  card_2_title: string;
  card_2_desc: string;
  card_3_title: string;
  card_3_desc: string;
  card_4_title: string;
  card_4_desc: string;
}

interface ImageItem {
  src: string;
  alt: string;
  caption: string;
}

// Default content as fallback
const defaultContent: AboutContent = {
  section_label: 'Tentang Saya',
  title_1: 'Lebih dari sekadar',
  title_highlight: 'Mahasiswa.',
  title_2: 'Seorang Praktisi Digital.',
  description_1: 'Halo! Saya Hengki Setiawan. Saya percaya bahwa era digital membutuhkan generalis yang spesifik.',
  description_2: 'Sebagai mahasiswa Bisnis Digital di Universitas Negeri Makassar, saya tidak hanya belajar teori. Saya mempraktikkannya dengan membangun brand clothing sendiri, mengelola komunitas online yang aktif, dan mengembangkan skill teknis dalam pengembangan web & otomasi.',
  card_1_title: 'Pendidikan',
  card_1_desc: 'Mahasiswa Bisnis Digital (UNM)',
  card_1_subdesc: 'Alumni SMK 4 Makassar',
  card_2_title: 'Fokus Utama',
  card_2_desc: 'Business Development & Tech',
  card_3_title: 'Pengalaman',
  card_3_desc: 'Owner, Admin & Ex-Retail',
  card_4_title: 'Domisili',
  card_4_desc: 'Makassar, Indonesia'
};

const defaultImages: ImageItem[] = [
  {
    src: '/images/hengki-team.jpg',
    alt: 'Hengki Setiawan - Juara 1 Tim',
    caption: '🏆 Juara 1 - Tim Achievement'
  },
  {
    src: '/images/hengki-award.jpg',
    alt: 'Hengki Setiawan - Pemenang Lomba',
    caption: '✨ Pencapaian & Prestasi'
  }
];

const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [images, setImages] = useState<ImageItem[]>(defaultImages);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', 'about')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const contentMap: Record<string, string> = {};
          const imageList: ImageItem[] = [];

          data.forEach((item: any) => {
            if (item.key.startsWith('image_')) {
              imageList.push({
                src: item.image_url || '',
                alt: `Image ${item.key}`,
                caption: item.value || ''
              });
            } else {
              contentMap[item.key] = item.value || '';
            }
          });

          setContent(prev => ({
            ...prev,
            ...contentMap
          }));

          if (imageList.length > 0) {
            setImages(imageList.filter(img => img.src)); // Only keep images with URLs
          }
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Keep default content on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Auto-slide effect every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="about" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Column: Image Carousel */}
          <div className="order-2 md:order-1 relative">
            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-2xl z-0"></div>

                {/* Carousel Container */}
                <div className="relative bg-slate-100 rounded-2xl overflow-hidden shadow-xl z-10 aspect-[4/5] md:aspect-square">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}

                  {/* Indicator Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImage ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Content */}
          <div className="order-1 md:order-2">
            <Reveal>
              <h4 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">{content.section_label}</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {content.title_1} <span className="text-primary">{content.title_highlight}</span><br />
                {content.title_2}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                {content.description_1}
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {content.description_2}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Reveal delay={0.2}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{content.card_1_title}</h3>
                    <p className="text-sm text-slate-500">{content.card_1_desc}</p>
                    {content.card_1_subdesc && (
                      <p className="text-xs text-slate-400 mt-1">{content.card_1_subdesc}</p>
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{content.card_2_title}</h3>
                    <p className="text-sm text-slate-500">{content.card_2_desc}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{content.card_3_title}</h3>
                    <p className="text-sm text-slate-500">{content.card_3_desc}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{content.card_4_title}</h3>
                    <p className="text-sm text-slate-500">{content.card_4_desc}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;