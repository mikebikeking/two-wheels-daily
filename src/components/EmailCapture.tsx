import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email already exists
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setStatus('error');
        setErrorMessage('This email is already subscribed');
        return;
      }

      // Add subscription to Firestore
      await addDoc(subscriptionsRef, {
        email: normalizedEmail,
        createdAt: serverTimestamp(),
        source: 'website', // Track where the subscription came from
        active: true
      });

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing email:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to subscribe. Please try again.'
      );
    }
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
        Welcome to the team. Check your inbox.
      </motion.p>
      }

      {status === 'error' && errorMessage &&
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="absolute -bottom-8 left-0 text-red-400 text-xs font-mono uppercase tracking-wider">
        {errorMessage}
      </motion.p>
      }
    </form>);

}