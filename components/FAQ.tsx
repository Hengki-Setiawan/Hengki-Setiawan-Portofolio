import React, { useState, useEffect } from 'react';
import { Plus, Minus, HelpCircle, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

// Default FAQs as fallback
const defaultFaqs = [
  {
    id: '1',
    question: "Apakah Anda menerima proyek freelance?",
    answer: "Ya, saya terbuka untuk proyek freelance, terutama yang berkaitan dengan Web Development (Landing Page/Portfolio) dan strategi manajemen komunitas."
  },
  {
    id: '2',
    question: "Berapa lama waktu pengerjaan website?",
    answer: "Tergantung kompleksitasnya. Untuk Landing Page sederhana biasanya memakan waktu 3-7 hari, sedangkan website yang lebih kompleks bisa memakan waktu 2-4 minggu."
  },
  {
    id: '3',
    question: "Apakah jasa ini termasuk desain?",
    answer: "Ya, untuk web development saya menggunakan pendekatan 'Code-First' namun tetap memperhatikan estetika UI/UX yang modern dan profesional."
  },
  {
    id: '4',
    question: "Apa itu 'Vibe Coding'?",
    answer: "Ini adalah istilah personal saya untuk menggambarkan gaya coding yang mengalir (flow), intuitif, dan menikmati prosesnya, sehingga menghasilkan kode yang tidak hanya berfungsi tapi juga 'berjiwa'."
  }
];

interface FAQData {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQData[]>(defaultFaqs as FAQData[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setFaqs(data);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Keep default FAQs on error
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal width="100%">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-500 mb-4">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pertanyaan Umum</h2>
            <p className="text-slate-600">
              Beberapa hal yang sering ditanyakan oleh klien dan rekan kerja.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={faq.id} delay={index * 0.1} width="100%">
                <div
                  className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-primary bg-blue-50/30' : 'border-slate-200 bg-white hover:border-primary/50'}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className={`font-semibold text-lg ${openIndex === index ? 'text-primary' : 'text-slate-800'}`}>
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <Minus className="flex-shrink-0 text-primary" />
                    ) : (
                      <Plus className="flex-shrink-0 text-slate-400" />
                    )}
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
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

export default FAQ;