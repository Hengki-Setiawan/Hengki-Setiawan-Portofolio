import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

interface Project {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  link?: string;
}

const Gallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((work, index) => (
              <Reveal key={work.id} delay={index * 0.2}>
                <Link to={`/projects/${work.id}`}>
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
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;