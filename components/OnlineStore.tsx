import React from 'react';
import { ShoppingBag, Star, ExternalLink } from 'lucide-react';
import Reveal from './Reveal';

const OnlineStore: React.FC = () => {
    return (
        <section id="store" className="py-24 bg-surface relative overflow-hidden border-t border-slate-200">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
                <Reveal width="100%" className="w-full max-w-4xl">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                        
                        <div className="relative z-10 flex-shrink-0 w-48 h-48 bg-white rounded-full p-2 shadow-xl flex items-center justify-center overflow-hidden border-4 border-orange-300">
                            <img 
                                src="/images/Logo kaos kami.png" 
                                alt="Kaos Kami Logo" 
                                className="w-full h-full object-contain" 
                                onError={(e) => { 
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src = 'https://ui-avatars.com/api/?name=Kaos+Kami&background=ea580c&color=fff&size=200&bold=true'; 
                                }} 
                            />
                        </div>
                        
                        <div className="relative z-10 w-full flex flex-col items-center md:items-start">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium mb-4">
                                <ShoppingBag className="w-4 h-4" />
                                Official Merchandise
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-2 leading-tight">
                                Kaos Kami
                            </h2>
                            
                            <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-300 mb-6 font-bold">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-white ml-2 text-sm">Top Rated Store</span>
                            </div>
                            
                            <p className="text-orange-50 text-lg mb-8 max-w-md">
                                Temukan koleksi apparel dan merchandise eksklusif dengan kualitas premium di toko online resmi kami.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <a 
                                    href="https://shopee.co.id/kaos_kami?categoryId=100011&entryPoint=ShopByPDP&itemId=27288469469" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-orange-600 font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Shopee
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <a 
                                    href="#" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    TikTok Shop
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default OnlineStore;
