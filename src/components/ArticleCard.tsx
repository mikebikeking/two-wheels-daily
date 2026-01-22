import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag: string;
  accentColor: string;
  delay?: number;
}
export function ArticleCard({
  title,
  excerpt,
  image,
  date,
  tag,
  accentColor,
  delay = 0
}: ArticleCardProps) {
  return (
    <motion.article
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
        delay
      }}
      className="group relative bg-[#111] border border-white/10 hover:border-white/20 transition-colors h-full flex flex-col">

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />

        <div className="absolute top-4 left-4">
          <span
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
            style={{
              backgroundColor: accentColor
            }}>

            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs text-gray-500 font-mono">{date}</span>
          <ArrowUpRight className="w-5 h-5 text-gray-600 transition-colors group-hover:text-white" />
        </div>

        <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
          {excerpt}
        </p>

        <div className="w-full h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
      </div>

      {/* Hover Border Effect */}
      <div
        className="absolute inset-0 border-2 border-transparent transition-colors pointer-events-none"
        style={{
          borderColor: 'transparent'
        }} // Dynamic hover color handled via group-hover in CSS or class logic if needed, but simple border is cleaner
      />
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full`}
        style={{
          backgroundColor: accentColor
        }} />

    </motion.article>);

}