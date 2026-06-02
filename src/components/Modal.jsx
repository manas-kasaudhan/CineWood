import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal({ isOpen, onClose, children, title, size = 'md' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const sizes = {
    sm: 'max-w-lg',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-noir/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={`relative w-full ${sizes[size]} glass-strong rounded-3xl border border-white/10 overflow-hidden`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                <h2 className="font-display text-xl text-cream">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 glass rounded-full flex items-center justify-center text-cream/50 hover:text-cream transition-colors border border-white/10"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Close button (no title) */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-noir/60 backdrop-blur-md rounded-full flex items-center justify-center text-cream/70 hover:text-cream border border-white/15 transition-all hover:border-white/30"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[85vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
