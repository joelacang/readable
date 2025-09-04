"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

const heroSlides = [
  {
    id: 1,
    image: "/images/library-1.jpg",
    title: "Discover Your Next Great Read",
    subtitle: "Explore thousands of books across every genre",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: "/images/book.jpg",
    title: "Rare & Vintage Collections",
    subtitle: "Find unique editions and timeless classics",
    cta: "Explore Collection",
  },
  {
    id: 3,
    image: "/images/book2.jpg",
    title: "Modern Reading Experience",
    subtitle: "Digital and physical books delivered to your door",
    cta: "Get Started",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  return (
    <section className="relative h-[400px] overflow-hidden sm:h-[500px] md:h-[600px] lg:h-[700px]">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
          }`}
        >
          <div
            className="relative h-full w-full bg-cover bg-center px-16 xl:px-24"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Enhanced overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="relative z-10 container mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-4xl">
                {/* Text with enhanced contrast and responsive sizing */}
                <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-2xl sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-lg filter">
                    {slide.title}
                  </span>
                </h1>

                <p className="mb-6 max-w-2xl text-lg text-white drop-shadow-xl sm:mb-8 sm:text-xl md:text-2xl lg:text-3xl">
                  <span className="rounded-md bg-black/20 px-2 py-1">
                    {slide.subtitle}
                  </span>
                </p>

                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 hover:shadow-3xl cursor-pointer border-2 border-white/20 px-6 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 sm:px-8 sm:py-6 sm:text-lg md:text-xl"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Responsive positioning */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-2 z-20 h-10 w-10 -translate-y-1/2 transform border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white sm:left-4 sm:h-12 sm:w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-2 z-20 h-10 w-10 -translate-y-1/2 transform border border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white sm:right-4 sm:h-12 sm:w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Dots Indicator - Enhanced visibility */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-sm sm:bottom-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full border border-white/30 transition-all duration-300 sm:h-3 sm:w-3 ${
              index === currentSlide
                ? "scale-110 bg-white shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
