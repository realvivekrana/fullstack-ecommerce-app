import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';

function NewsletterCTA() {
  const [email,     setEmail    ] = useState('');
  const [focused,   setFocused  ] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* Keep a ref to the reset timeout so we can cancel it if the component
     unmounts before the 5 s window elapses — prevents setState-on-unmounted warning */
  const resetTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    toast.success('Subscribed! Watch your inbox for exclusive offers.');
    resetTimer.current = setTimeout(() => setSubmitted(false), 5000);
  }, [email]);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handleFocus       = useCallback(() => setFocused(true),  []);
  const handleBlur        = useCallback(() => setFocused(false), []);

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[var(--color-secondary)] rounded-[24px]
          px-6 sm:px-12 lg:px-16 py-12 sm:py-14 lg:py-16
          text-center overflow-hidden
          shadow-[0_16px_60px_rgba(26,26,46,0.18)]"
      >
        {/* Blobs */}
        <div aria-hidden="true" className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[var(--color-primary)]/18 blur-[64px] pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-[64px] pointer-events-none" />
        {/* Dot grid */}
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative max-w-xl mx-auto">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10
            flex items-center justify-center mx-auto mb-6">
            <Mail size={22} className="text-[var(--color-primary)]" aria-hidden="true" />
          </div>

          <h2
            id="newsletter-heading"
            className="text-[22px] sm:text-[26px] lg:text-[30px] font-extrabold text-white
              tracking-tight leading-tight mb-3"
          >
            Get 10% off your first order
          </h2>
          <p className="text-[14px] sm:text-[15px] text-gray-400 leading-relaxed mb-8">
            Subscribe and stay updated on new arrivals, exclusive sales, and member-only offers.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="status"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl
                bg-emerald-500/15 border border-emerald-500/25
                text-emerald-400 text-[14px] font-semibold"
            >
              <Check size={16} aria-hidden="true" />
              You're subscribed — thanks!
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              aria-label="Newsletter subscription"
            >
              <div
                className={`flex-1 flex items-center rounded-xl border overflow-hidden
                  transition-all duration-200
                  ${focused
                    ? 'border-[var(--color-primary)]/70 shadow-[0_0_0_3px_rgba(255,107,53,0.14)]'
                    : 'border-white/12 hover:border-white/20'
                  }`}
              >
                <Mail size={15} className="text-gray-500 ml-4 shrink-0" aria-hidden="true" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  autoComplete="email"
                  className="flex-1 min-w-0 h-12 px-3 bg-white/6 text-white text-[13.5px]
                    placeholder:text-gray-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2
                  h-12 px-6 rounded-xl shrink-0
                  bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
                  text-white text-[13.5px] font-semibold
                  shadow-[0_2px_14px_rgba(255,107,53,0.35)]
                  hover:shadow-[0_4px_22px_rgba(255,107,53,0.50)]
                  hover:brightness-110 active:scale-[0.97]
                  transition-all duration-200
                  focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
              >
                Subscribe
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </form>
          )}

          <p className="text-[11.5px] text-gray-600 mt-4">
            No spam, ever. Unsubscribe any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default memo(NewsletterCTA);
