import { motion } from 'framer-motion';

function HamburgerIcon({ isOpen }) {
  return (
    <div className="w-5 h-4 relative flex flex-col justify-between">
      <motion.span
        className="block h-[1.5px] w-full bg-current rounded-full"
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
      <motion.span
        className="block h-[1.5px] w-full bg-current rounded-full"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-[1.5px] w-full bg-current rounded-full"
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default HamburgerIcon;