import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CATEGORY_TILES = [
  {
    id: 'men',
    name: 'Men',
    count: '320+ items',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'women',
    name: 'Women',
    count: '480+ items',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    count: '210+ items',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'home',
    name: 'Home & Living',
    count: '150+ items',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80&auto=format&fit=crop',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

function CategoryShowcase() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)] mb-2">
          Collections
        </span>
        <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-gray-900 tracking-tight">
          Shop by Category
        </h2>
        <p className="text-[14px] text-gray-500 mt-1.5">Explore our curated collections</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
      >
        {CATEGORY_TILES.map((cat) => (
          <motion.div key={cat.id} variants={tileVariants}>
            <Link
              to={`/shop?category=${cat.id}`}
              className="group relative block aspect-[4/5] rounded-[20px] overflow-hidden bg-gray-100
                shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
                hover:-translate-y-1
                transition-all duration-300 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={`${cat.name} category`}
                loading="lazy"
                decoding="async"
                width={600}
                height={750}
                className="w-full h-full object-cover
                  transition-transform duration-500 ease-out
                  group-hover:scale-[1.06]"
              />

              {/* Gradient overlay — deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t
                from-black/70 via-black/15 to-transparent
                transition-opacity duration-300
                group-hover:from-black/80" />

              {/* Arrow icon — fades + slides in */}
              <div className="absolute top-3.5 right-3.5
                w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                flex items-center justify-center
                shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                opacity-0 -translate-y-1
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-250">
                <ArrowUpRight size={15} className="text-gray-900" aria-hidden="true" />
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="text-white font-bold text-[15px] sm:text-[17px] leading-tight
                  group-hover:translate-y-[-2px] transition-transform duration-250">
                  {cat.name}
                </h3>
                <p className="text-white/65 text-[11.5px] mt-0.5 transition-all duration-250
                  group-hover:text-white/80">
                  {cat.count}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default CategoryShowcase;
