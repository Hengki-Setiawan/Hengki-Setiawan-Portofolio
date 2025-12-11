import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 1.5 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 1500);

        // Remove loading screen after 2 seconds
        const removeTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] bg-dark flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="text-center">
                {/* Animated Logo/Name */}
                <div className="relative">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Hengki
                        </span>
                        <span className="text-slate-300"> Setiawan</span>
                    </h1>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>

                {/* Subtitle */}
                <p className="text-slate-400 mt-4 text-sm tracking-wider uppercase animate-fade-in">
                    Digital Entrepreneur & Web Developer
                </p>
            </div>

            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '500ms' }} />
        </div>
    );
};

export default LoadingScreen;
