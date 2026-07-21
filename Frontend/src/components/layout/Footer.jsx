import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Check } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/constants';
import { categories } from '@/data/categories';

/* ── Stable year — computed once at module load, never recalculated ─────── */
const YEAR = new Date().getFullYear();

/* ── Social icons (inline SVG — lucide doesn't ship brand icons) ─────────── */
const SOCIALS = [
  {
    name: 'Instagram',
    href: '#',
    path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2c-2.7 0-3.1 0-4.1.1-1.1 0-1.8.2-2.5.5-.7.3-1.3.7-1.8 1.3-.6.5-1 1.1-1.3 1.8-.3.7-.5 1.4-.5 2.5C1.7 9.2 1.7 9.6 1.7 12s0 2.8.1 3.8c.1 1.1.2 1.8.5 2.5.3.7.7 1.3 1.3 1.8.5.6 1.1 1 1.8 1.3.7.3 1.4.5 2.5.5 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c1.1 0 1.8-.2 2.5-.5.7-.3 1.3-.7 1.8-1.3.6-.5 1-1.1 1.3-1.8.3-.7.5-1.4.5-2.5.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c0-1.1-.2-1.8-.5-2.5-.3-.7-.7-1.3-1.3-1.8-.5-.6-1.1-1-1.8-1.3-.7-.3-1.4-.5-2.5-.5-1-.1-1.4-.1-4.1-.1zm0 3.6c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4zm5.6-.2a1 1 0 1 1-2 0 1 1 0 0 1 2 0z',
  },
  {
    name: 'Facebook',
    href: '#',
    path: 'M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H7v3h2.8v8h3.2z',
  },
  {
    name: 'X / Twitter',
    href: '#',
    path: 'M18.9 3H22l-7 8 8.2 10h-6.4l-5-6.5L5 21H2l7.5-8.6L1.5 3h6.5l4.5 6 6.4-6z',
  },
  {
    name: 'YouTube',
    href: '#',
    path: 'M23 12s0-3.4-.4-5c-.3-.9-1-1.6-1.9-1.9C19 4.7 12 4.7 12 4.7s-7 0-8.7.4c-.9.3-1.6 1-1.9 1.9C1 8.6 1 12 1 12s0 3.4.4 5c.3.9 1 1.6 1.9 1.9 1.7.4 8.7.4 8.7.4s7 0 8.7-.4c.9-.3 1.6-1 1.9-1.9.4-1.6.4-5 .4-5zM9.8 15.3V8.7l6 3.3-6 3.3z',
  },
];

/* ── Payment badges (inline SVG, zero network cost) ─────────────────────── */
const PAYMENTS = [
  {
    name: 'Visa',
    viewBox: '0 0 48 32',
    content: (
      <>
        <rect width="48" height="32" rx="5" fill="#1A1F71" />
        <text x="7" y="22" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="white" letterSpacing="1">VISA</text>
      </>
    ),
  },
  {
    name: 'Mastercard',
    viewBox: '0 0 48 32',
    content: (
      <>
        <rect width="48" height="32" rx="5" fill="#252525" />
        <circle cx="18" cy="16" r="10" fill="#EB001B" />
        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
        <path d="M24 8.3a10 10 0 0 1 0 15.4A10 10 0 0 1 24 8.3z" fill="#FF5F00" />
      </>
    ),
  },
  {
    name: 'UPI',
    viewBox: '0 0 48 32',
    content: (
      <>
        <rect width="48" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
        <text x="9" y="21" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#6739B7">UPI</text>
      </>
    ),
  },
  {
    name: 'PayPal',
    viewBox: '0 0 48 32',
    content: (
      <>
        <rect width="48" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
        <text x="4"  y="21" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#003087">Pay</text>
        <text x="22" y="21" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#009CDE">Pal</text>
      </>
    ),
  },
  {
    name: 'RuPay',
    viewBox: '0 0 48 32',
    content: (
      <>
        <rect width="48" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
        <text x="3" y="21" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#E4002B">RuPay</text>
      </>
    ),
  },
];

const TRUST = ['SSL Secured', '100% Authentic', 'Easy Returns', 'Verified Seller'];

const QUICK_LINKS = [
  { label: 'Home',       to: ROUTES.HOME     },
  { label: 'Shop',       to: ROUTES.SHOP     },
  { label: 'Wishlist',   to: ROUTES.WISHLIST },
  { label: 'My Orders',  to: ROUTES.ORDERS   },
  { label: 'My Account', to: ROUTES.PROFILE  },
  { label: 'About Us',   to: ROUTES.ABOUT    },
];

const SUPPORT_LINKS = [
  { label: 'Contact Us',        to: ROUTES.CONTACT },
  { label: 'Track Your Order',  to: ROUTES.ORDERS  },
  { label: 'Returns & Refunds', to: '#'             },
  { label: 'Shipping Info',     to: '#'             },
  { label: 'FAQs',              to: '#'             },
  { label: 'Size Guide',        to: '#'             },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',     to: '#' },
  { label: 'Terms & Conditions', to: '#' },
  { label: 'Cookie Policy',      to: '#' },
  { label: 'Sitemap',            to: '#' },
];

const CONTACT_ITEMS = [
  { icon: MapPin, text: 'Mumbai, Maharashtra, India' },
  { icon: Phone,  text: '+91 98765 43210'            },
  { icon: Mail,   text: 'hello@shopverse.in'         },
];

/* ── Sub-components memoised so they never re-render from Footer state ───── */
const ColHeading = memo(function ColHeading({ children }) {
  return (
    <h3 className="text-white text-[12px] font-bold uppercase tracking-[0.12em] mb-5">
      {children}
    </h3>
  );
});

const LinkList = memo(function LinkList({ links }) {
  return (
    <ul className="space-y-3">
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link
            to={to}
            className="group inline-flex items-center gap-1.5 text-[13px] text-gray-400
              hover:text-white transition-colors duration-200"
          >
            <ArrowRight
              size={11}
              aria-hidden="true"
              className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-200 text-[var(--color-primary)] shrink-0"
            />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
});

/* ── Main footer ─────────────────────────────────────────────────────────── */
function Footer() {
  const [email,     setEmail    ] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* Cancel reset timer on unmount to avoid setState-on-unmounted warning */
  const resetTimer = useRef(null);
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    resetTimer.current = setTimeout(() => setSubmitted(false), 4000);
  }, [email]);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    []
  );

  return (
    <footer aria-label="Site footer" className="bg-[var(--color-secondary)] text-gray-400">

      {/* Brand accent strip */}
      <div
        aria-hidden="true"
        className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/60 to-transparent"
      />

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 flex flex-col gap-5">
            <Link
              to={ROUTES.HOME}
              aria-label={`${APP_NAME} — go to home`}
              className="self-start text-[22px] font-extrabold tracking-tight text-white
                hover:opacity-85 transition-opacity duration-200"
            >
              Shop<span className="text-[var(--color-primary)]">Verse</span>
            </Link>

            <p className="text-[13.5px] text-gray-400 leading-relaxed max-w-[260px]">
              Premium products, curated for everyday living — delivered to your door with care.
            </p>

            <ul className="space-y-2.5" aria-label="Contact information">
              {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-[12.5px] text-gray-500">
                  <Icon size={13} className="text-[var(--color-primary)] mt-[2px] shrink-0" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-600 mb-3">
                Follow us
              </p>
              <div className="flex items-center gap-2" role="list" aria-label="Social media">
                {SOCIALS.map(({ name, href, path }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={`${APP_NAME} on ${name}`}
                    role="listitem"
                    className="group w-9 h-9 rounded-xl bg-white/6 border border-white/8
                      flex items-center justify-center
                      hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)]
                      hover:shadow-[0_4px_14px_rgba(255,107,53,0.35)]
                      hover:-translate-y-0.5
                      transition-all duration-200
                      focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
                  >
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="currentColor" aria-hidden="true"
                      className="text-gray-400 group-hover:text-white transition-colors duration-200"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <ColHeading>Quick Links</ColHeading>
            <LinkList links={QUICK_LINKS} />
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <ColHeading>Customer Support</ColHeading>
            <LinkList links={SUPPORT_LINKS} />
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <ColHeading>Shop Categories</ColHeading>
            <ul className="space-y-3">
              {categories.map(({ id, name }) => (
                <li key={id}>
                  <Link
                    to={`/shop?category=${id}`}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-gray-400
                      hover:text-white transition-colors duration-200"
                  >
                    <ArrowRight
                      size={11}
                      aria-hidden="true"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-200 text-[var(--color-primary)] shrink-0"
                    />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + trust + payments */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 flex flex-col gap-5">

            {/* Newsletter */}
            <div>
              <ColHeading>Stay in the loop</ColHeading>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                Get early access to sales, new arrivals, and exclusive member-only offers.
              </p>

              {submitted ? (
                <div
                  role="status"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                    bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[13px] font-medium"
                >
                  <Check size={15} aria-hidden="true" />
                  You&apos;re subscribed — thanks!
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  aria-label="Footer newsletter"
                  className="flex flex-col gap-2"
                >
                  <div className="flex rounded-xl overflow-hidden border border-white/10
                    focus-within:border-[var(--color-primary)]/60
                    focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.12)]
                    transition-all duration-200"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="your@email.com"
                      aria-label="Email address for newsletter"
                      autoComplete="email"
                      required
                      className="flex-1 min-w-0 px-4 py-2.5 bg-white/5 text-white text-[13px]
                        placeholder:text-gray-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[var(--color-primary)] text-white text-[12.5px] font-semibold
                        shrink-0 hover:bg-[var(--color-primary-dark)] active:scale-95
                        transition-all duration-200
                        focus-visible:outline-2 focus-visible:outline-white"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-600">No spam, ever. Unsubscribe any time.</p>
                </form>
              )}
            </div>

            {/* Trust */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-600 mb-3">
                Our promises
              </p>
              <div className="flex flex-wrap gap-2">
                {TRUST.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      bg-white/5 border border-white/8 text-[11px] text-gray-400"
                  >
                    <Check size={9} className="text-[var(--color-primary)] shrink-0" aria-hidden="true" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Payments */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-600 mb-3">
                Accepted payments
              </p>
              <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Accepted payment methods">
                {PAYMENTS.map(({ name, viewBox, content }) => (
                  <span
                    key={name}
                    role="listitem"
                    aria-label={name}
                    className="opacity-75 hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg width="44" height="28" viewBox={viewBox} aria-hidden="true">
                      {content}
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.07]" aria-hidden="true" />

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-[12px] text-gray-600 text-center sm:text-left">
            &copy; {YEAR}{' '}
            <span className="text-gray-500 font-medium">{APP_NAME}</span>.
            {' '}All rights reserved.
          </p>

          <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {LEGAL_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-[12px] text-gray-600 hover:text-gray-300 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-gray-600
              hover:text-gray-300 transition-colors duration-200 group
              focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
          >
            Back to top
            <ArrowRight
              size={11}
              aria-hidden="true"
              className="-rotate-90 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </button>

        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
