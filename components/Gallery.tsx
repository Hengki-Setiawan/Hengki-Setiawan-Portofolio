import React from 'react';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';

const works = [
  {
    id: 1,
    category: 'Fashion Brand',
    title: 'Koleksi Kaos Kami',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Desain streetwear original dengan tema urban & tipografi.'
  },
  {
    id: 2,
    category: 'Community & Content',
    title: 'Meme & Engagement',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Konten viral yang membangun interaksi komunitas organik.'
  },
  {
    id: 3,
    category: 'Web Development',
    title: 'Modern Web Apps',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Pengembangan website responsif dengan React & Tailwind.'
  }
];

const Gallery: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Galeri Karya</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Bukti visual dari dedikasi dalam bisnis fashion, manajemen konten, dan teknologi.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {works.map((work, index) => (
            <Reveal key={work.id} delay={index * 0.2}>
              <div className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={work.image} 
                    alt={work.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2">{work.category}</span>
                  <h3 className="text-white text-xl font-bold mb-1">{work.title}</h3>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{work.description}</p>
                  <div className="flex items-center text-white text-sm font-medium">
                    Lihat Detail <ExternalLink className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;