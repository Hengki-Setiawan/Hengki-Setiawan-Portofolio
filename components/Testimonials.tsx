import React, { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url?: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching testimonials:', error);
        } else {
          setTestimonials(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Apa Kata Mereka?</h2>
            <p className="text-slate-600">Kepercayaan adalah aset terbesar dalam bisnis digital.</p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.1} width="100%">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative h-full flex flex-col">
                  <div className="absolute top-6 right-8 text-primary/10">
                    <Quote size={48} fill="currentColor" />
                  </div>

                  <div className="flex gap-1 mb-6 text-yellow-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-slate-600 mb-6 italic relative z-10 flex-grow">
                    "{item.content}"
                  </p>

                  <div className="mt-auto flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                      {item.avatar_url ? (
                        <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        item.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;