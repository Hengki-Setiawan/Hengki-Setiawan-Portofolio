import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import Reveal from './Reveal';

const Contact: React.FC = () => {
  const phoneNumber = "62895803463032";
  const message = "Halo Kak Hengki, saya melihat portfolio Anda dan tertarik untuk berdiskusi/kerjasama.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <Reveal>
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
            
            {/* Decoration Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Mari Bekerja Sama
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Saya terbuka untuk diskusi proyek web development, strategi konten, atau sekadar bertukar ide tentang bisnis digital.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-primary hover:bg-slate-50 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Chat WhatsApp
              </a>
              
              <div className="flex items-center gap-3 text-white px-8 py-4 bg-primaryDark/30 rounded-full border border-white/10 backdrop-blur-sm">
                <Phone className="w-5 h-5" />
                <span className="font-mono text-lg">0895-8034-63032</span>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;