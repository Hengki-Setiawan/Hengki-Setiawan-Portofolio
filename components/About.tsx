import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Target, Briefcase, Trophy, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';

interface ImageItem {
  src: string;
  alt: string;
  caption: string;
}

const defaultImages: ImageItem[] = [
  {
    src: '/images/hengki-team.jpg',
    alt: 'Hengki Setiawan - Juara 1 E-Commerce UNM',
    caption: '🏆 Juara 1 E-Commerce — UNM'
  },
  {
    src: '/images/hengki-award.jpg',
    alt: 'Hengki Setiawan — Achievement',
    caption: '✨ Achievement & Prestasi'
  }
];

const About: React.FC = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageItem[]>(defaultImages);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await db
          .from('site_content')
          .select('*')
          .eq('section', 'about')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const imageList: ImageItem[] = [];

          data.forEach((item: any) => {
            if (item.key.startsWith('image_')) {
              imageList.push({
                src: item.image_url || '',
                alt: `Image ${item.key}`,
                caption: item.value || ''
              });
            }
          });

          if (imageList.length > 0) {
            setImages(imageList.filter(img => img.src));
          }
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="about" className="py-24 bg-dark relative scroll-mt-20 border-t border-slate-200">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Column: Image Carousel */}
          <div className="order-2 md:order-1 relative">
            <Reveal delay={0.2} width="100%">
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-2xl z-0"></div>

                <div className="relative bg-surface rounded-2xl overflow-hidden shadow-xl z-10 aspect-[4/5] md:aspect-square border border-slate-200">
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
                        style={{ imageRendering: 'high-quality', transform: 'translateZ(0)' }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white font-medium">{image.caption}</p>
                      </div>
                    </div>
                  ))}

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

          {/* Right Column: Content with REAL CV data */}
          <div className="order-1 md:order-2">
            <Reveal width="100%">
              <h4 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">Tentang Saya</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-6 font-display">
                Digital <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Entrepreneur</span><br />
                & Web Developer
              </h2>
            </Reveal>

            <Reveal delay={0.1} width="100%">
              <p className="text-textMuted mb-6 leading-relaxed text-lg">
                Mahasiswa S1 Bisnis Digital di Universitas Negeri Makassar sekaligus wirausaha digital 
                dengan pengalaman membangun dan mengelola komunitas Facebook organik lebih dari 
                <strong className="text-textMain"> 500.000+ anggota aktif</strong>.
              </p>
              <p className="text-textMuted mb-8 leading-relaxed">
                Owner <strong className="text-textMain">Kaos Kami</strong>, brand pakaian e-commerce dengan 
                rating kepuasan pelanggan 4.9/5.0 di Shopee dan 5.0/5.0 di Tokopedia. 
                Web Developer mandiri yang memanfaatkan AI tools modern dan pendekatan vibe coding.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Reveal delay={0.2} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-textMain">Pendidikan</h3>
                    <p className="text-sm text-textMuted">S1 Bisnis Digital — UNM</p>
                    <p className="text-xs text-textMuted/70 mt-1">SMK N 4 Makassar (Pemasaran Digital)</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-textMain">Prestasi</h3>
                    <p className="text-sm text-textMuted">Juara 1 Kompetisi E-Commerce UNM</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-textMain">Pengalaman</h3>
                    <p className="text-sm text-textMuted">Owner Kaos Kami · Lead Admin Komunitas</p>
                    <div className="mt-2 inline-block bg-primary/10 border border-primary/20 rounded px-2.5 py-1">
                      <p className="text-xs text-primary font-bold">Ex. Staff Alfamidi (2021-2022)</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary border border-secondary/20">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-textMain">Lokasi</h3>
                    <p className="text-sm text-textMuted">Makassar, Sulawesi Selatan</p>
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