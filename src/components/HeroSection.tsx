import React from 'react';
import { motion } from 'framer-motion';
import { EmailCapture } from './EmailCapture';
import { ChevronRight } from 'lucide-react';
export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex flex-col lg:flex-row">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />


      {/* Left Side: Image & Overlay */}
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <motion.img
          initial={{
            scale: 1.1
          }}
          animate={{
            scale: 1
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut'
          }}
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
          alt="Cyclist in motion"
          className="w-full h-full object-cover object-center grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-700" />


        {/* Decorative Overlay Text */}
        <div className="absolute bottom-8 left-8 z-20 hidden lg:block">
          <div className="flex items-center gap-2 text-white/40 font-mono text-xs uppercase tracking-[0.2em]">
            <span className="w-2 h-2 bg-[#E11D48]" />
            System Status: Online
          </div>
          <div className="text-[10rem] font-black text-white/5 leading-none select-none absolute -bottom-20 -left-10">
            RIDE
          </div>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="relative w-full lg:w-1/2 h-auto lg:h-screen flex items-center justify-center p-6 lg:p-12 z-20">
        <motion.div
          initial={{
            opacity: 0,
            x: 50
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.8,
            delay: 0.2
          }}
          className="w-full max-w-xl">

          {/* Floating Dashboard Box */}
          <div className="relative bg-[#111]/90 backdrop-blur-md border-2 border-white p-8 lg:p-12 shadow-[8px_8px_0px_0px_#DFFF00]">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-[#DFFF00] text-black px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              Daily Briefing
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] mb-4 tracking-tighter">
              TWO <br />
              WHEELS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                DAILY
              </span>
            </h1>

            <p className="text-[#DFFF00] text-lg lg:text-xl font-medium mb-8 max-w-md font-mono">
              // Pro racing. Gear tech. Industry news. <br />
              <span className="text-white/60">
                Delivered to your inbox every morning.
              </span>
            </p>

            <div className="mb-8">
              <EmailCapture />
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#E11D48]" />
                <span>15k+ Riders</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-[#E11D48]" />
                <span>Daily Updates</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#E11D48]" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#E11D48]" />
          </div>
        </motion.div>
      </div>
    </section>);

}