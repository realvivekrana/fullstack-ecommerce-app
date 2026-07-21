import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { ROUTES } from '@/constants';

/* ─── animation variants ─────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

/* ─── trust pill data ────────────────────────────────────────────────────── */
const TRUST_PILLS = [
  { icon: Truck,        label: 'Free delivery over ₹999' },
  { icon: RotateCcw,   label: '30-day returns'           },
  { icon: ShieldCheck, label: 'Secure payments'          },
];

/* ─── stat data ──────────────────────────────────────────────────────────── */
const STATS = [
  { value: '50K+',  label: 'Happy customers' },
  { value: '2000+', label: 'Premium products' },
  { value: '4.8★',  label: 'Average rating'  },
];

function Hero() {
  return (
    <section
      aria-label="Hero banner"
      className="relative isolate overflow-hidden bg-[var(--color-secondary)]"
    >
      {/* ── decorative blobs ─────────────────────────────────────────────── */}
      {/* Primary warm glow — top right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-[var(--color-primary)]/18 blur-[96px]"
      />
      {/* Cool accent — bottom left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-[80px]"
      />
      {/* Subtle centre vignette for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/20"
      />

      {/* ── fine dot-grid texture overlay ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── main content ─────────────────────────────────────────────────── */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 xl:py-32">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

          {/* ── LEFT: copy ─────────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Badge */}
            <motion.span
              {...fadeIn(0.05)}
              className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11.5px] font-semibold tracking-wide uppercase"
            >
              <Sparkles size={12} aria-hidden="true" />
              New Season Arrivals
            </motion.span>

            {/* Heading */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-6"
            >
              Style that speaks
              <br />
              <span className="text-[var(--color-primary)] italic">
                before you do.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUp(0.18)}
              className="text-gray-300/90 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.75] mb-9 max-w-[480px]"
            >
              Discover premium fashion, electronics, and home essentials —
              curated for everyday living and delivered straight to your door.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.24)}
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10"
            >
              {/* Primary CTA */}
              <Link
                to={ROUTES.SHOP}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[14.5px] text-white
                  bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
                  shadow-[0_4px_20px_rgba(255,107,53,0.38)]
                  hover:shadow-[0_6px_28px_rgba(255,107,53,0.52)]
                  hover:brightness-110
                  active:scale-[0.97]
                  transition-all duration-200 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-secondary)]"
              >
                Shop Now
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              {/* Ghost CTA */}
              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl font-medium text-[14px] text-white/75
                  border border-white/15
                  hover:text-white hover:border-white/30 hover:bg-white/5
                  active:scale-[0.97]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Learn more
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              {...fadeIn(0.32)}
              className="flex flex-wrap gap-2 mb-10 lg:mb-12"
            >
              {TRUST_PILLS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-gray-400 text-[11.5px] font-medium"
                >
                  <Icon size={12} aria-hidden="true" className="text-[var(--color-primary)] shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeIn(0.38)}
              className="flex flex-wrap items-center gap-6 sm:gap-10 pt-7 border-t border-white/10"
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-1">
                    {value}
                  </p>
                  <p className="text-[11.5px] text-gray-500 tracking-wide">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: image ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
            {/* Glow halo behind the card */}
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-3xl bg-[var(--color-primary)]/20 blur-3xl scale-110"
            />

            {/* Image card */}
            <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden
              shadow-[0_24px_60px_rgba(0,0,0,0.40)] ring-1 ring-white/10">
              {/* Taller on mobile so it's visible; landscape on sm+; portrait on lg */}
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4] xl:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85&auto=format&fit=crop"
                  alt="A model showcasing the new season premium fashion collection"
                  width={900}
                  height={675}
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Bottom gradient overlay for legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              />

              {/* Floating badge — top left */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
                className="absolute top-3 left-3 sm:top-4 sm:left-4
                  flex items-center gap-1.5 sm:gap-2
                  px-2.5 sm:px-3 py-1.5 sm:py-2
                  rounded-lg sm:rounded-xl
                  bg-white/90 backdrop-blur-sm shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true" />
                <span className="text-[11px] sm:text-[12px] font-semibold text-gray-800 whitespace-nowrap">
                  New arrivals just dropped
                </span>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4
                  flex flex-col items-end
                  px-3 sm:px-3.5 py-2 sm:py-2.5
                  rounded-lg sm:rounded-xl
                  bg-[var(--color-secondary)]/80 backdrop-blur-sm shadow-lg border border-white/10"
              >
                <span className="text-[10px] sm:text-[11px] text-gray-400 leading-none mb-1">Starting from</span>
                <span className="text-[15px] sm:text-[18px] font-extrabold text-white leading-none">₹499</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
