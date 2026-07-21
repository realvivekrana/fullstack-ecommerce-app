import { Truck, ShieldCheck, Heart, Users } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { APP_NAME } from '@/constants';

const VALUES = [
  { icon: ShieldCheck, title: 'Quality First', desc: 'Every product is curated and checked for lasting quality.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Reliable shipping so your order reaches you on time, every time.' },
  { icon: Heart, title: 'Customer Focused', desc: 'Your satisfaction drives every decision we make.' },
  { icon: Users, title: 'Community Driven', desc: 'Built for everyday shoppers who deserve better options.' },
];

const STATS = [
  { value: '50K+', label: 'Happy customers' },
  { value: '2000+', label: 'Products listed' },
  { value: '15+', label: 'Cities served' },
  { value: '4.8★', label: 'Average rating' },
];

function About() {
  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <Breadcrumbs items={[{ label: 'About' }]} />
      </div>

      {/* Hero */}
      <div className="bg-[var(--color-secondary)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-14 sm:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Style, curated for <span className="text-[var(--color-primary)]">everyday living.</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            ShopVerse started with a simple idea — shopping online should feel effortless,
            trustworthy, and enjoyable. We bring together fashion, electronics, and home
            essentials in one place, backed by fast delivery and real customer care.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="text-center max-w-lg mx-auto mb-10">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">What we stand for</h2>
          <p className="text-sm text-gray-500 mt-2">The principles that guide everything we build.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((value) => (
            <div key={value.title} className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                <value.icon size={20} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{value.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;