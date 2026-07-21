import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
    >
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100
          flex items-center justify-center mb-6
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <Icon size={30} className="text-gray-300" aria-hidden="true" />
        </div>
      )}

      <h3 className="text-[18px] font-bold text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm mb-8">
          {description}
        </p>
      )}

      {actionLabel && actionTo && (
        <Button as={Link} to={actionTo} size="md">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;
