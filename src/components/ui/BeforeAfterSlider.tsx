"use client";

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export function BeforeAfterSlider({ 
    beforeImage, 
    afterImage, 
    beforeLabel = "Πριν", 
    afterLabel = "Μετά" 
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-slide effect to subtly show it's interactive
    useEffect(() => {
        if (hasInteracted) return;
        
        const interval = setInterval(() => {
            setSliderPosition(prev => {
                // Subtle oscillation between 45% and 55%
                const time = Date.now() / 1500;
                return 50 + Math.sin(time) * 15;
            });
        }, 50);
        
        return () => clearInterval(interval);
    }, [hasInteracted]);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        
        setSliderPosition(percent);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent | globalThis.TouchEvent | globalThis.MouseEvent) => {
        if (!isDragging) return;
        
        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as MouseEvent | globalThis.MouseEvent).clientX;
        }
        
        handleMove(clientX);
    };

    // Attach global listeners for smooth dragging outside the container
    useEffect(() => {
        const handleGlobalMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
            onPointerMove(e);
        };
        
        const handleGlobalUp = () => {
            setIsDragging(false);
        };
        
        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('touchmove', handleGlobalMove, { passive: false });
            window.addEventListener('mouseup', handleGlobalUp);
            window.addEventListener('touchend', handleGlobalUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [isDragging]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden select-none cursor-ew-resize shadow-2xl group border border-brand-200"
            onMouseDown={(e: MouseEvent) => {
                setIsDragging(true);
                setHasInteracted(true);
                handleMove(e.clientX);
            }}
            onTouchStart={(e: TouchEvent) => {
                setIsDragging(true);
                setHasInteracted(true);
                handleMove(e.touches[0].clientX);
            }}
        >
            {/* After Image (Background) */}
            <Image 
                src={afterImage} 
                alt="After" 
                fill 
                className="object-cover pointer-events-none"
                priority
            />
            {/* After Label */}
            <div className="absolute top-4 right-4 bg-navy-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {afterLabel}
            </div>

            {/* Before Image (Clipped) */}
            <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <Image 
                    src={beforeImage} 
                    alt="Before" 
                    fill 
                    className="object-cover pointer-events-none"
                    priority
                />
                {/* Before Label */}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-navy-900 px-3 py-1 rounded-full font-bold text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider Line & Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <ChevronLeft className="w-4 h-4 text-brand-950 -mr-1" />
                    <ChevronRight className="w-4 h-4 text-brand-950 -ml-1" />
                </div>
            </div>
        </div>
    );
}
