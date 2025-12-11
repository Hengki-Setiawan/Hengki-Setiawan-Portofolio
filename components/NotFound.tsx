import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />

            <div className="text-center relative z-10 max-w-lg">
                {/* 404 Text */}
                <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 -mt-4">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-slate-400 mb-8 text-lg">
                    Oops! Sepertinya halaman yang Anda cari tidak ada atau sudah dipindahkan.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
                    >
                        <Home className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Halaman Sebelumnya
                    </button>
                </div>

                {/* Fun element */}
                <div className="mt-12 p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex items-center justify-center gap-3 text-slate-300">
                        <Search className="w-5 h-5 text-primary" />
                        <span>Mungkin Anda mencari:</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {['About', 'Projects', 'Contact', 'Services'].map((item) => (
                            <a
                                key={item}
                                href={`/#${item.toLowerCase()}`}
                                className="px-4 py-2 bg-white/5 hover:bg-primary/20 text-slate-300 hover:text-primary rounded-full text-sm transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
