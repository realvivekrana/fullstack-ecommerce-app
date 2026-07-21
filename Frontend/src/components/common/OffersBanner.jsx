import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

const INITIAL_SECONDS = 6 * 3600; // 6 hours

/**
 * Returns HH:MM:SS parts from a total-seconds value.
 * Extracted so the formatter is pure and testable.
 */
function formatCountdown(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return { h, m, s };
}

function useCountdown(initialSeconds = INITIAL_SECONDS) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : initialSeconds)),
      1000
    );
    return () => clearInterval(timer);
  }, [initialSeconds]);

  return formatCountdown(timeLeft);
}

const TimeUnit = memo(function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="bg-white/15 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2
          min-w-[48px] sm:min-w-[56px] text-center border border-white/10"
      >
        {/* aria-live so screen readers announce each tick without being overwhelming */}
        <span
          aria-live="off"
          className="text-white font-extrabold text-lg sm:text-xl tabular-nums leading-none"
        >
          {value}
        </span>
      </div>
      <span className="text-white/55 text-[9.5px] font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
});

function OffersBanner() {
  const { h, m, s } = useCountdown();

  return (
    <section
      aria-label="Flash sale countdown"
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[22px] overflow-hidden
          bg-gradient-to-br from-[var(--color-primary)] via-[#ff7a45] to-[var(--color-primary-dark)]
          shadow-[0_8px_40px_rgba(255,107,53,0.30)]"
      >
        {/* Dot texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
        />

        <div className="relative px-5 sm:px-8 lg:px-10 py-6 sm:py-9
          flex flex-col sm:flex-row items-center justify-between gap-5">

          {/* Copy */}
          <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/15 border border-white/10
              items-center justify-center shrink-0">
              <Zap size={24} className="fill-white text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-1">
                Limited time only
              </p>
              <h2 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-white
                leading-tight tracking-tight">
                Flash Sale — Up to 60% Off
              </h2>
              <p className="text-[12.5px] sm:text-[13px] text-white/75 mt-1">
                Selected products only. While stocks last.
              </p>
            </div>
          </div>

          {/* Timer + CTA */}
          <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-3 sm:gap-6 shrink-0 w-full sm:w-auto">
            {/* Accessible countdown — single live region at the group level */}
            <div
              role="timer"
              aria-label={`Time remaining: ${h} hours ${m} minutes ${s} seconds`}
              className="flex items-end gap-1.5 sm:gap-2"
            >
              <TimeUnit value={h} label="Hrs" />
              <span aria-hidden="true" className="text-white/50 font-bold text-base sm:text-lg mb-4 sm:mb-5 leading-none">:</span>
              <TimeUnit value={m} label="Min" />
              <span aria-hidden="true" className="text-white/50 font-bold text-base sm:text-lg mb-4 sm:mb-5 leading-none">:</span>
              <TimeUnit value={s} label="Sec" />
            </div>

            <Link
              to="/shop?tag=flash-sale"
              className="group inline-flex items-center justify-center gap-2
                bg-white text-[var(--color-primary)]
                w-full xs:w-auto px-5 sm:px-6 py-3 rounded-xl
                text-[13.5px] font-bold whitespace-nowrap
                shadow-[0_2px_12px_rgba(0,0,0,0.12)]
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)]
                hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              Shop Now
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default memo(OffersBanner);
