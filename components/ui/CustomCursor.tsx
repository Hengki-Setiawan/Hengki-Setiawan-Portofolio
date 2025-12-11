import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseenter', onMouseEnter);
            document.addEventListener('mouseleave', onMouseLeave);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable element
            const target = e.target as HTMLElement;
            const isClickable =
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') !== null ||
                target.closest('button') !== null;

            setIsPointer(isClickable);
        };

        const onMouseEnter = () => setIsHidden(false);
        const onMouseLeave = () => setIsHidden(true);
        const onMouseDown = () => setIsClicked(true);
        const onMouseUp = () => setIsClicked(false);

        addEventListeners();
        return removeEventListeners;
    }, []);

    // Don't render on touch devices
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return null;
    }

    return (
        <>
            <style>{`
        body {
          cursor: none;
        }
        a, button, input, textarea, select {
          cursor: none;
        }
      `}</style>
            <div
                className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* Main Dot */}
                <div
                    className={`bg-primary rounded-full transition-all duration-200 ease-out
            ${isPointer ? 'w-8 h-8 opacity-30' : 'w-3 h-3 opacity-100'}
            ${isClicked ? 'scale-75' : 'scale-100'}
          `}
                />

                {/* Outer Ring (optional, adds more "tech" feel) */}
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary rounded-full transition-all duration-300 ease-out
            ${isPointer ? 'w-12 h-12 opacity-100 border-2' : 'w-8 h-8 opacity-30'}
            ${isClicked ? 'scale-90' : 'scale-100'}
          `}
                />
            </div>
        </>
    );
};

export default CustomCursor;
