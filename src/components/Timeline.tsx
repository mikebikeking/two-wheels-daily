import React from 'react';
import { motion } from 'framer-motion';
const steps = [
{
  id: '01',
  title: 'Subscribe',
  description: 'Join for free. No spam, just speed.',
  color: 'border-[#DFFF00]',
  glow: 'shadow-[0_0_20px_rgba(223,255,0,0.3)]'
},
{
  id: '02',
  title: 'Check Inbox',
  description: 'Get the briefing every morning at 6AM.',
  color: 'border-[#06B6D4]',
  glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]'
},
{
  id: '03',
  title: 'Ride Informed',
  description: 'Hit the road smarter and faster.',
  color: 'border-[#E11D48]',
  glow: 'shadow-[0_0_20px_rgba(225,29,72,0.3)]'
}];

export function Timeline() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            How It Works
          </h2>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-12 md:gap-0">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0">
            <motion.div
              initial={{
                width: '0%'
              }}
              whileInView={{
                width: '100%'
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut'
              }}
              className="h-full bg-gradient-to-r from-[#DFFF00] via-[#06B6D4] to-[#E11D48] shadow-[0_0_15px_rgba(6,182,212,0.5)]" />

          </div>

          {/* Connecting Line (Mobile) */}
          <div className="md:hidden absolute left-1/2 top-0 w-1 h-full bg-gray-800 -translate-x-1/2 z-0">
            <motion.div
              initial={{
                height: '0%'
              }}
              whileInView={{
                height: '100%'
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut'
              }}
              className="w-full bg-gradient-to-b from-[#DFFF00] via-[#06B6D4] to-[#E11D48]" />

          </div>

          {steps.map((step, index) =>
          <motion.div
            key={step.id}
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.3
            }}
            className="relative z-10 flex flex-col items-center text-center bg-black p-4">

              {/* Hexagon Node */}
              <div className="relative w-24 h-24 mb-6 group cursor-default">
                <div
                className={`absolute inset-0 bg-black border-2 ${step.color} ${step.glow} transition-all duration-300 group-hover:scale-110`}
                style={{
                  clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-white font-mono">
                    {step.id}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm font-mono max-w-[200px]">
                {step.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}