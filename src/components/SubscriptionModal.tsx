import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EmailCapture } from './EmailCapture';
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]" />


          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20
            }}
            className="
                pointer-events-auto
                relative w-full max-w-lg bg-[#111] 
                border-2 border-[#DFFF00] 
                shadow-[8px_8px_0px_0px_#DFFF00]
                p-8 md:p-12
              ">







              <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">

                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 bg-[#DFFF00] text-black text-xs font-bold uppercase tracking-widest mb-4">
                  Join the Peloton
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Don't Get Dropped
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                  Join 15,000+ riders getting the daily briefing. <br />
                  Pro news, gear tech, and inspiration.
                </p>
              </div>

              <EmailCapture id="modal-email" buttonText="Subscribe Now" />

              <p className="mt-6 text-center text-xs text-gray-600 font-mono uppercase tracking-widest">
                No spam. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}