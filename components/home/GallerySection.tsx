"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// This will be replaced by dynamic data from CMS later
const INITIAL_IMAGES = Array.from({ length: 23 }, (_, i) => `/students/${i + 1}.webp`);

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false); // Pause auto-play on interaction
  };

  const handleNextClick = () => {
    nextSlide();
    setIsAutoPlaying(false); // Pause auto-play on interaction
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying]);

  const getVisibleImages = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    return [
      { src: images[prevIndex], key: prevIndex, position: 'left' },
      { src: images[currentIndex], key: currentIndex, position: 'center' },
      { src: images[nextIndex], key: nextIndex, position: 'right' }
    ];
  };

  const visibleImages = getVisibleImages();

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-(--primary)/10 text-(--primary-foreground) text-sm font-bold mb-6 tracking-wide uppercase">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
            From Classroom to Road
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Join hundreds of happy students who passed their test with confidence.
          </p>
        </div>

        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center perspective-1000">
          
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-10 z-30 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 text-black"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNextClick}
            className="absolute right-4 md:right-10 z-30 p-3 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 text-black"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
            {visibleImages.map(({ src, key, position }) => (
              <div
                key={key}
                className={`absolute transition-all duration-700 ease-in-out
                  ${position === 'center' 
                    ? 'z-20 w-[85%] md:w-[60%] h-full opacity-100 scale-100 translate-x-0' 
                    : ''}
                  ${position === 'left' 
                    ? 'z-10 w-[60%] md:w-[45%] h-[80%] opacity-40 -translate-x-[60%] md:-translate-x-[50%] scale-90 blur-[1px] grayscale' 
                    : ''}
                  ${position === 'right' 
                    ? 'z-10 w-[60%] md:w-[45%] h-[80%] opacity-40 translate-x-[60%] md:translate-x-[50%] scale-90 blur-[1px] grayscale' 
                    : ''}
                `}
              >
                <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100
                  ${position === 'center' ? 'border-4 border-white ring-1 ring-gray-100' : ''}
                `}>
                  <Image
                    src={src}
                    alt="Student success story"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 85vw, 60vw"
                    priority={position === 'center'}
                  />
                  {position === 'center' && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white pointer-events-none">
                      <p className="font-bold text-lg drop-shadow-md">Congratulations!</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {images.slice(0, 5).map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex % 5 
                  ? 'w-8 bg-(--primary)' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
