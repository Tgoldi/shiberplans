import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ComparisonSlider({ beforeImage, afterImage, beforeLabel = "לפני", afterLabel = "אחרי" }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (clientX) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
        handleMove(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        const handleGlobalMouseMove = (e) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleGlobalMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative w-fit mx-auto rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchStart={(e) => handleMove(e.touches[0].clientX)}
        >
            {/* After Image (Background - Professional / Final) - Sets the container height */}
            <div className="relative">
                <img
                    src={afterImage}
                    alt="After"
                    className="max-h-[70vh] w-auto block"
                    draggable="false"
                />
                <div className="absolute top-4 right-4 bg-purple-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur shadow-lg border border-purple-400/50 z-10 pointer-events-none">
                    {afterLabel}
                </div>
            </div>

            {/* Before Image (Foreground - Rec709 / Basic) - Absolute Overlay */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable="false"
                />
                <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur border border-white/20 z-10 pointer-events-none">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-black/20">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center gap-[2px]">
                        <div className="w-[2px] h-4 bg-gray-400 rounded-full" />
                        <div className="w-[2px] h-4 bg-gray-400 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Instructions Overlay (Fades out on interaction) */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isDragging ? 0 : 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-medium tracking-widest uppercase pointer-events-none bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm"
            >
                Drag to compare
            </motion.div>
        </div>
    );
}
