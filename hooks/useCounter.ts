import { useState, useEffect, useRef } from 'react';

interface UseCounterOptions {
    start?: number;
    end: number;
    duration?: number;
    delay?: number;
}

export const useCounter = ({ start = 0, end, duration = 2000, delay = 0 }: UseCounterOptions) => {
    const [count, setCount] = useState(start);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        setIsVisible(true);
                        hasAnimated.current = true;
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const startTime = Date.now() + delay;
        const endTime = startTime + duration;

        const updateCount = () => {
            const now = Date.now();

            if (now < startTime) {
                requestAnimationFrame(updateCount);
                return;
            }

            if (now >= endTime) {
                setCount(end);
                return;
            }

            const progress = (now - startTime) / duration;
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(start + (end - start) * easeOutQuart);

            setCount(currentCount);
            requestAnimationFrame(updateCount);
        };

        requestAnimationFrame(updateCount);
    }, [isVisible, start, end, duration, delay]);

    return { count, elementRef };
};
