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
      base: 'bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 hover:border-primary/40',
    },
    peach: {
      base: 'bg-amber/10 border border-amber/25 text-amber hover:bg-amber/15 hover:border-amber/40',
    },
    teal: {
      base: 'bg-accent/10 border border-accent/25 text-accent hover:bg-accent/15 hover:border-accent/40',
    },
    solid: {
      base: 'bg-primary text-white border border-transparent hover:bg-primary-dark shadow-soft',
    },
    solid_teal: {
      base: 'bg-accent text-noir font-semibold border border-transparent hover:bg-accent-dark',
    },
    ghost: {
      base: 'bg-transparent border border-slate text-cream/55 hover:text-cream hover:border-cream/20',
    },
    danger: {
      base: 'bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/15',
    },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      whileHover={{
        scale: disabled ? 1 : 1.015,
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-all duration-300 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${v.base} ${s} ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </motion.button>
  );
}
