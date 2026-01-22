import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
interface EmailCaptureProps {
  variant?: 'default' | 'minimal';
  placeholder?: string;
  buttonText?: string;
  id?: string;
}
export function EmailCapture({
  variant = 'default',
  placeholder = 'Enter your email',
  buttonText = 'Join the Ride',
  id = 'email-input'
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'>(
    'idle');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
      <div className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            id={id}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-black/50 border-2 border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#DFFF00] transition-colors placeholder:text-gray-500 font-mono text-sm uppercase tracking-wider"
            aria-label="Email address" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#DFFF00]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#DFFF00]" />
        </div>

        <motion.button
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`
            relative px-6 py-3 font-bold uppercase tracking-widest text-black transition-all
            ${status === 'success' ? 'bg-[#06B6D4]' : 'bg-[#DFFF00] hover:bg-[#E1FF1F]'}
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]
            hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]
            hover:translate-x-[2px] hover:translate-y-[2px]
          `}>

          {status === 'loading' ?
          <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Processing
            </span> :
          status === 'success' ?
          <span className="flex items-center gap-2">
              Sent <ArrowRight className="w-4 h-4" />
            </span> :

          <span className="flex items-center gap-2">
              {buttonText} <ArrowRight className="w-4 h-4" />
            </span>
          }
        </motion.button>
      </div>

      {status === 'success' &&
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="absolute -bottom-8 left-0 text-[#06B6D4] text-xs font-mono uppercase tracking-wider">

          // Welcome to the team. Check your inbox.
        </motion.p>
      }
    </form>);

}