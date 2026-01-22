import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
interface NavigationProps {
  onOpenModal: () => void;
}
const navLinks = [
{
  name: 'Pro Coverage',
  path: '/pro-coverage',
  color: 'hover:text-[#DFFF00]'
},
{
  name: 'Gear Tech',
  path: '/gear-tech',
  color: 'hover:text-[#E11D48]'
},
{
  name: 'Industry News',
  path: '/industry-news',
  color: 'hover:text-[#06B6D4]'
},
{
  name: 'Ride Inspiration',
  path: '/ride-inspiration',
  color: 'hover:text-white'
}];

export function Navigation({ onOpenModal }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-black/90 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>

        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative group z-50">
            <span className="text-2xl font-black italic tracking-tighter text-white">
              TWD
              <span className="text-[#DFFF00]">.</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DFFF00] transition-all group-hover:w-full" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`
                  text-sm font-bold uppercase tracking-widest transition-colors duration-300
                  ${location.pathname === link.path ? 'text-white' : 'text-white/60'}
                  ${link.color}
                `}>

                {link.name}
                {location.pathname === link.path &&
              <motion.div
                layoutId="underline"
                className="h-0.5 bg-current w-full mt-1" />

              }
              </Link>
            )}
            <button
              onClick={onOpenModal}
              className="
                px-5 py-2 bg-[#DFFF00] text-black text-xs font-black uppercase tracking-widest
                hover:bg-white transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]
                active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]
              ">





              Subscribe
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>

            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200
          }}
          className="fixed inset-0 z-40 bg-black border-l border-white/10 md:hidden flex flex-col justify-center px-8">

            <div className="flex flex-col gap-8">
              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className="text-3xl font-black uppercase tracking-tighter text-white hover:text-[#DFFF00] transition-colors">

                  {link.name}
                </Link>
            )}
              <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModal();
              }}
              className="mt-8 w-full py-4 bg-[#E11D48] text-white font-black uppercase tracking-widest text-xl shadow-[4px_4px_0px_0px_rgba(6,182,212,0.5)]">

                Get Daily Dose
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}