import React from 'react';
import { motion } from 'framer-motion';
interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
  category: string;
}
export function PageHero({
  title,
  subtitle,
  image,
  accentColor,
  category
}: PageHeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center grayscale contrast-125 brightness-50" />

        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
            'radial-gradient(circle, transparent 20%, #000 120%)'
          }} />

      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}>

          <div
            className="inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest text-black"
            style={{
              backgroundColor: accentColor
            }}>

            {category}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-mono max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Decorative Border Bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{
          backgroundColor: accentColor
        }} />

    </section>);

}