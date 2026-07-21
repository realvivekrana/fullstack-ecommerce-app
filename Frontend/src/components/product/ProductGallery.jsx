import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';

function ProductGallery({ images = [], name }) {
  const gallery = images.length > 0 ? images : [FALLBACK];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-[22px] overflow-hidden bg-gray-50
        ring-1 ring-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={gallery[active]}
            alt={`${name} — view ${active + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
              className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[12px]
                overflow-hidden shrink-0 border-2 transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]
                ${active === i
                  ? 'border-[var(--color-primary)] shadow-[0_0_0_2px_rgba(255,107,53,0.18)]'
                  : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'
                }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
