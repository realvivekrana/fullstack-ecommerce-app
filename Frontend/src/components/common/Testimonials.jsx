import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    role: 'Verified Buyer',
    rating: 5,
    text: 'The quality exceeded my expectations and delivery was super fast. Definitely shopping here again!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    name: 'Rohit Verma',
    role: 'Verified Buyer',
    rating: 5,
    text: 'Great prices, smooth checkout, and the product looked exactly like the pictures. Highly recommend.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  {
    name: 'Priya Nair',
    role: 'Verified Buyer',
    rating: 4,
    text: 'Customer support was really helpful when I needed to exchange a size. Smooth experience overall.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

function Testimonials() {
  return (
    <section className="bg-gray-50/70 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-xl mx-auto mb-10 sm:mb-12"
        >
          <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)] mb-3">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-gray-900 tracking-tight">
            Loved by our customers
          </h2>
          <p className="text-[14px] text-gray-500 mt-2.5 leading-relaxed">
            Don't just take our word for it — hear what our customers have to say.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="group relative flex flex-col bg-white
                rounded-[20px] border border-gray-100/80 p-6 sm:p-7
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                hover:-translate-y-1
                transition-all duration-300 ease-out"
            >
              {/* Large quote mark — decorative */}
              <Quote
                size={32}
                aria-hidden="true"
                className="absolute top-5 right-5 text-[var(--color-primary)]/10
                  group-hover:text-[var(--color-primary)]/18
                  transition-colors duration-300"
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    aria-hidden="true"
                    className={
                      i < t.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    }
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-[13.5px] text-gray-600 leading-[1.7] mb-6 flex-1">
                "{t.text}"
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                <img
                  src={t.avatar}
                  alt={`${t.name}, verified buyer`}
                  loading="lazy"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover
                    ring-2 ring-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                />
                <div>
                  <p className="text-[13.5px] font-bold text-gray-900 leading-tight">{t.name}</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
