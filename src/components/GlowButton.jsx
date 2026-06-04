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
      base: 'bg-gradient-to-r from-coral/20 to-teal/15 border border-coral/35 text-coral hover:from-coral/30 hover:to-teal/25 hover:border-coral/55',
      glow: 'rgba(255,107,107,0.45)',
    },
    peach: {
      base: 'bg-gradient-to-r from-sun/20 to-coral/15 border border-sun/35 text-sun hover:from-sun/30 hover:to-coral/25 hover:border-sun/55',
      glow: 'rgba(255,217,61,0.45)',
    },
    teal: {
      base: 'bg-gradient-to-r from-teal/20 to-violet/15 border border-teal/35 text-teal hover:from-teal/30 hover:to-violet/25 hover:border-teal/55',
      glow: 'rgba(78,205,196,0.45)',
    },
    solid: {
      base: 'bg-gradient-to-r from-coral to-coral-light text-white border border-transparent hover:from-coral-dark hover:to-coral shadow-lg',
      glow: 'rgba(255,107,107,0.55)',
    },
    solid_teal: {
      base: 'bg-gradient-to-r from-teal to-teal-light text-navy font-semibold border border-transparent hover:from-teal-dark hover:to-teal',
      glow: 'rgba(78,205,196,0.55)',
    },
    ghost: {
      base: 'bg-transparent border border-white/15 text-cream/65 hover:text-cream hover:border-white/25',
      glow: 'rgba(255,255,255,0.2)',
    },
    danger: {
      base: 'bg-coral/10 border border-coral/35 text-coral hover:bg-coral/20',
      glow: 'rgba(255,107,107,0.45)',
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
