import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, Target, Briefcase, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';
import Guestbook from './Guestbook';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    <section id="about" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Column: Image Carousel */}
          <div className="order-2 md:order-1 relative">
            <Reveal delay={0.2} width="100%">
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-2xl z-0"></div>

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
            <Reveal width="100%">
              <h4 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">{t('about.section_label')}</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {t('about.title_1')} <span className="text-primary">{t('about.title_highlight')}</span><br />
                {t('about.title_2')}
              </h2>
            </Reveal>

            <Reveal delay={0.1} width="100%">
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                {t('about.description_1')}
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('about.description_2')}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Reveal delay={0.2} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{t('about.education')}</h3>
                    <p className="text-sm text-slate-500">{t('about.education_desc')}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('about.education_subdesc')}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{t('about.focus')}</h3>
                    <p className="text-sm text-slate-500">{t('about.focus_desc')}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{t('about.experience')}</h3>
                    <p className="text-sm text-slate-500">{t('about.experience_desc')}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5} width="100%">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{t('about.location')}</h3>
                    <p className="text-sm text-slate-500">{t('about.location_desc')}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <Guestbook />
        </div>
      </div>
    </section>
  );
};

export default About;