import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Hero from '@/components/common/Hero';
import TrustBadges from '@/components/common/TrustBadges';
import CategoryShowcase from '@/components/common/CategoryShowcase';
import OffersBanner from '@/components/common/OffersBanner';
import Testimonials from '@/components/common/Testimonials';
import NewsletterCTA from '@/components/common/NewsletterCTA';
import { ProductSection } from '@/components/product';
import { productService } from '@/services';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, bestSellersRes, flashSaleRes] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getBestSellers(),
          productService.getFlashSaleProducts(),
        ]);

        setFeatured(featuredRes.data.data.map((p) => ({ ...p, id: p._id })));
        setBestSellers(bestSellersRes.data.data.map((p) => ({ ...p, id: p._id })));
        setFlashSale(flashSaleRes.data.data.map((p) => ({ ...p, id: p._id })));
      } catch (error) {
        toast.error('Could not load products. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      <Hero />
      <TrustBadges />
      <CategoryShowcase />

      <ProductSection
        title="Flash Sale"
        subtitle="Grab these deals before they're gone"
        products={flashSale}
        loading={loading}
        viewAllLink="/shop?tag=flash-sale"
      />

      <OffersBanner />

      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked for you"
        products={featured}
        loading={loading}
        viewAllLink="/shop?tag=featured"
      />

      <div className="bg-gray-50">
        <ProductSection
          title="Best Sellers"
          subtitle="Most loved by our customers"
          products={bestSellers}
          loading={loading}
          viewAllLink="/shop?tag=bestseller"
        />
      </div>

      <Testimonials />
      <NewsletterCTA />
    </div>
  );
}

export default Home;