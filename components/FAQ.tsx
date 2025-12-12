import React, { useState, useEffect } from 'react';
import { Plus, Minus, HelpCircle, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import TranslatedText from './TranslatedText';

const defaultFaqs = [
  { id: '1', question: "Apakah Anda menerima proyek freelance?", answer: "Ya, saya terbuka untuk proyek freelance." },
  { id: '2', question: "Berapa lama waktu pengerjaan website?", answer: "Tergantung kompleksitasnya, 3-7 hari untuk sederhana." },
  { id: '3', question: "Apakah jasa ini termasuk desain?", answer: "Ya, saya menggunakan pendekatan 'Code-First' dengan UI/UX modern." },
];

interface FAQData {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

const FAQ: React.FC = () => {
  const { t } = useTranslation();
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('faq.title')}</h2>
            <p className="text-slate-600">
              {t('faq.description')}
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
                      <TranslatedText>{faq.question}</TranslatedText>
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
                      <TranslatedText>{faq.answer}</TranslatedText>
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