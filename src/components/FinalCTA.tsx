import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
interface FinalCTAProps {
  onOpenModal?: () => void;
}
export function FinalCTA({ onOpenModal }: FinalCTAProps) {
  return (
    <section className="relative py-32 overflow-hidden bg-[#050505]">
      {/* Carbon Fiber / Geometric Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #111 25%, transparent 25%), 
            linear-gradient(-45deg, #111 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #111 75%), 
            linear-gradient(-45deg, transparent 75%, #111 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />


      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
          Don't Get Dropped
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-mono">
          Join 15,000+ cyclists getting faster, smarter, and more informed every
          single day.
        </p>

        <motion.button
          onClick={onOpenModal}
          whileHover={{
            scale: 1.05
          }}
          whileTap={{
            scale: 0.95
          }}
          className="
            group relative inline-flex items-center gap-4
            bg-[#E11D48] text-white text-xl md:text-2xl font-black uppercase tracking-widest
            px-12 py-6 md:px-16 md:py-8
            shadow-[0_8px_24px_rgba(6,182,212,0.5)]
            hover:shadow-[0_12px_32px_rgba(6,182,212,0.7)]
            transition-all duration-300
            clip-path-slant
          "








          style={{
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
          }}>

          <span className="relative z-10">Get Your Daily Dose</span>
          <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" />

          {/* Button Glint Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        </motion.button>

        <p className="mt-8 text-xs text-gray-600 font-mono uppercase tracking-widest">
          No Spam. Unsubscribe Anytime. 100% Free.
        </p>
      </div>
    </section>);

}