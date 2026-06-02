import { motion } from 'framer-motion';

export default function GlowButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
}) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-lavender/20 to-dusty/15 border border-lavender/30 text-lavender hover:from-lavender/30 hover:to-dusty/25 hover:border-lavender/50',
      glow: 'rgba(196,181,253,0.4)',
    },
    peach: {
      base: 'bg-gradient-to-r from-peach/20 to-lavender/15 border border-peach/30 text-peach hover:from-peach/30 hover:to-lavender/25 hover:border-peach/50',
      glow: 'rgba(254,203,161,0.4)',
    },
    solid: {
      base: 'bg-lavender text-noir hover:bg-lavender/90 border border-transparent',
      glow: 'rgba(196,181,253,0.5)',
    },
    ghost: {
      base: 'bg-transparent border border-white/10 text-cream/60 hover:text-cream hover:border-white/20',
      glow: 'rgba(255,255,255,0.2)',
    },
    danger: {
      base: 'bg-dusty/10 border border-dusty/30 text-dusty hover:bg-dusty/20',
      glow: 'rgba(232,160,191,0.4)',
    },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      whileHover={{
        scale: disabled ? 1 : 1.03,
        boxShadow: disabled ? 'none' : `0 0 30px ${v.glow}`,
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-300 backdrop-blur-sm cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${v.base} ${s} ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </motion.button>
  );
}
