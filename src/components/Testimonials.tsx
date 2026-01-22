import React from 'react';
import { Quote } from 'lucide-react';
const testimonials = [
{
  quote:
  "The only cycling newsletter I actually open. It's like a shot of espresso for my riding life.",
  author: 'Sarah J.',
  role: 'Crit Racer',
  accent: 'text-[#DFFF00]'
},
{
  quote:
  'Sharp, technical, and no fluff. Keeps me updated on the peloton without wasting my time.',
  author: 'Marcus T.',
  role: 'Weekend Warrior',
  accent: 'text-[#E11D48]'
}];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {testimonials.map((item, index) =>
          <div key={index} className="relative">
              <Quote
              className={`w-12 h-12 ${item.accent} opacity-50 mb-6 rotate-180`} />


              <blockquote className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
                "{item.quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div
                className={`w-12 h-1 bg-gradient-to-r from-current to-transparent ${item.accent}`} />

                <div>
                  <div className="text-white font-bold uppercase tracking-wider">
                    {item.author}
                  </div>
                  <div className="text-gray-500 font-mono text-sm">
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}