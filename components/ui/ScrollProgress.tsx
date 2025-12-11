import React, { useState, useEffect } from 'react';

const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
            <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150 ease-out shadow-sm shadow-primary/50"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgress;
