"use client";

import { Button } from "~/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden px-8 py-24 md:py-32 lg:px-16">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fbf7f1] via-[#f5eddf] to-[#cc9a6b]" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto">
        <div className="grid items-center gap-24 lg:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl leading-tight font-bold text-balance text-[#341d16] md:text-6xl lg:text-7xl">
                Dive Into a World of{" "}
                <span className="text-[#b46d42] italic">Stories</span>
              </h1>

              <p className="text-xl font-medium text-pretty text-[#623c2c] md:text-2xl">
                Discover Your Next Favorite Book Today
              </p>

              <p className="max-w-2xl text-lg text-pretty text-[#965738]">
                From bestselling novels to hidden gems, explore our curated
                collection of books that will transport you to new worlds and
                ignite your imagination.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="transform rounded-xl bg-[#c2814d] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#b46d42] hover:shadow-xl"
              >
                Shop Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 border-[#b46d42] bg-transparent px-8 py-4 text-lg font-semibold text-[#b46d42] transition-all duration-300 hover:bg-[#b46d42] hover:text-white"
              >
                Browse Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#341d16]">50K+</div>
                <div className="text-sm font-medium text-[#965738]">
                  Books Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#341d16]">25K+</div>
                <div className="text-sm font-medium text-[#965738]">
                  Happy Readers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#341d16]">4.9★</div>
                <div className="text-sm font-medium text-[#965738]">
                  Customer Rating
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-[#ead8c0] opacity-60" />
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[#dcbc95] opacity-40" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl bg-white/20 p-8 shadow-2xl backdrop-blur-sm">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Stack of beautiful books"
                  width={400}
                  height={500}
                  className="h-auto w-full rounded-2xl shadow-lg"
                  priority
                />

                {/* Floating Book Icons */}
                <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5eddf] shadow-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="absolute -bottom-2 -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#ead8c0] shadow-lg">
                  <span className="text-xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23341d16' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  );
}
