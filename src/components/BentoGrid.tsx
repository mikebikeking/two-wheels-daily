import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Wrench, Newspaper, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const items = [
{
  title: 'Pro Coverage',
  description:
  'Race results, analysis, and transfer rumors from the peloton.',
  icon: Trophy,
  color: 'border-[#DFFF00]',
  textColor: 'text-[#DFFF00]',
  colSpan: 'col-span-1 md:col-span-2 lg:col-span-1',
  path: '/pro-coverage'
},
{
  title: 'Gear Tech',
  description:
  'Deep dives into the latest aero frames, groupsets, and marginal gains.',
  icon: Wrench,
  color: 'border-[#E11D48]',
  textColor: 'text-[#E11D48]',
  colSpan: 'col-span-1 md:col-span-2 lg:col-span-1',
  path: '/gear-tech'
},
{
  title: 'Industry News',
  description: 'Business moves, sponsorships, and the politics of cycling.',
  icon: Newspaper,
  color: 'border-[#06B6D4]',
  textColor: 'text-[#06B6D4]',
  colSpan: 'col-span-1 md:col-span-2 lg:col-span-1',
  path: '/industry-news'
},
{
  title: 'Ride Inspiration',
  description: 'Epic routes, coffee stops, and weekend warrior guides.',
  icon: Zap,
  color: 'border-white',
  textColor: 'text-white',
  colSpan: 'col-span-1 md:col-span-2 lg:col-span-1',
  path: '/ride-inspiration'
}];

export function BentoGrid() {
  return (
    <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
          'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />


      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
            What You Get
          </h2>
          <div className="h-1 w-24 bg-[#E11D48] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map((item, index) =>
          <Link to={item.path} key={index} className={item.colSpan}>
              <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1
              }}
              whileHover={{
                y: -5
              }}
              className={`
                  relative group bg-[#111] p-8 border-2 ${item.color} h-full
                  shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]
                  transition-all duration-300 cursor-pointer
                `}>

                <div className="flex justify-between items-start mb-6">
                  <div
                  className={`p-3 bg-white/5 rounded-none border border-white/10 ${item.textColor}`}>

                    <item.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Decorative Tech Lines */}
                <div className="absolute bottom-4 right-4 flex gap-1">
                  <div
                  className={`w-1 h-1 rounded-full ${item.textColor.replace('text-', 'bg-')}`} />

                  <div className="w-1 h-1 rounded-full bg-gray-700" />
                  <div className="w-1 h-1 rounded-full bg-gray-700" />
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}