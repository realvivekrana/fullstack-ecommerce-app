import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const BADGES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    sub: 'On all orders above ₹999',
    detail: 'No hidden charges. Ever.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    sub: '100% protected checkout',
    detail: 'Encrypted end-to-end.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    sub: '7-day hassle-free policy',
    detail: 'No questions asked.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    sub: 'Always here to help',
    detail: 'Chat, email, or call.',
  },
];

/* stagger children as they enter the viewport */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function TrustBadges() {
  return (
    <section aria-label="Why shop with us" className="bg-white border-y border-gray-100/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">

        {/* Optional eyebrow — removed on very small screens to keep it lean */}
        <p className="hidden sm:block text-center text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gray-400 mb-8">
          Why thousands choose ShopVerse
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
        >
          {BADGES.map(({ icon: Icon, title, sub, detail }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group relative flex flex-col items-start gap-4 p-5 sm:p-6
                rounded-[18px] bg-white
                border border-gray-100
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)]
                hover:-translate-y-1
                transition-all duration-300 ease-out
                cursor-default"
            >
              {/* Accent line — slides in on hover */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-6 right-6 h-[2.5px] rounded-b-full
                  bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]
                  scale-x-0 group-hover:scale-x-100
                  origin-left transition-transform duration-300 ease-out"
              />

              {/* Icon container */}
              <div
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl
                  bg-[var(--color-primary)]/8
                  group-hover:bg-[var(--color-primary)]/14
                  transition-colors duration-300"
              >
                <Icon
                  size={22}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Text */}
              <div className="space-y-1 min-w-0">
                <p className="text-[14px] sm:text-[15px] font-bold text-gray-900 leading-snug">
                  {title}
                </p>
                <p className="text-[12.5px] sm:text-[13px] text-gray-500 leading-snug">
                  {sub}
                </p>
                {/* Detail line — fades in on hover, hidden on mobile to stay clean */}
                <p
                  className="hidden sm:block text-[11.5px] text-gray-400
                    max-h-0 overflow-hidden opacity-0
                    group-hover:max-h-10 group-hover:opacity-100
                    transition-all duration-300 ease-out pt-0 group-hover:pt-0.5"
                >
                  {detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustBadges;
