import React, { useState } from 'react';
import { Phone, MessageSquare, Send, Loader2 } from 'lucide-react';
import Reveal from './Reveal';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const phoneNumber = "62895803463032";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <Reveal>
          <div className="bg-primary rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden relative">

            {/* Decoration Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side: Text & Info */}
              <div className="text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Mari Bekerja Sama
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  Saya terbuka untuk diskusi proyek web development, strategi konten, atau sekadar bertukar ide.
                </p>

                <div className="flex flex-col gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all flex items-center gap-3 backdrop-blur-sm"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat WhatsApp
                  </a>

                  <div className="w-fit px-6 py-3 bg-white/10 text-white rounded-full font-medium flex items-center gap-3 backdrop-blur-sm">
                    <Phone className="w-5 h-5" />
                    <span className="font-mono">0895-8034-63032</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Kirim Pesan</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="email@contoh.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primaryDark transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Kirim Pesan
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg">
                      Pesan berhasil terkirim! Terima kasih.
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
                      Gagal mengirim pesan. Silakan coba lagi.
                    </p>
                  )}
                </form>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;