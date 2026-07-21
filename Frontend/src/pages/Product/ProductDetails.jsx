import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ProductGallery, ProductSection } from '@/components/product';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, calculateDiscountPercent } from '@/utils/formatCurrency';
import { productService } from '@/services';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await productService.getProductById(id);
        const fetchedProduct = { ...res.data.data, id: res.data.data._id };
        setProduct(fetchedProduct);
        setQuantity(1);

        const relatedRes = await productService.getRelatedProducts(id);
        setRelated(relatedRes.data.data.map((p) => ({ ...p, id: p._id })));
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (notFound) return <Navigate to="/404" replace />;

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 animate-pulse">
          <div className="aspect-square rounded-xl bg-gray-100" />
          <div className="space-y-4 pt-4">
            <div className="h-7 bg-gray-100 rounded w-3/4" />
            <div className="h-5 bg-gray-100 rounded w-1/3" />
            <div className="h-9 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const discount = calculateDiscountPercent(product.mrp, product.price);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
        <ProductGallery images={product.images?.length ? product.images : [product.image]} name={product.name} />

        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
            {product.inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="outline">Out of Stock</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base sm:text-lg text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                <Badge variant="primary">{discount}% OFF</Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description ||
              'Crafted with premium materials for everyday comfort and durability. Designed to complement your style while offering long-lasting quality you can rely on.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-10 sm:w-10 sm:h-11 flex items-center justify-center text-gray-500"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 sm:w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-10 sm:w-10 sm:h-11 flex items-center justify-center text-gray-500"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 hover:border-[var(--color-primary)] order-3 sm:order-none"
            >
              <Heart size={18} className={wishlisted ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-400'} />
            </button>

            <Button onClick={handleAddToCart} disabled={!product.inStock} size="lg" className="w-full sm:flex-1 sm:w-auto order-2">
              <ShoppingCart size={18} /> Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-gray-100">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'Orders above ₹999' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '7 day policy' },
              { icon: ShieldCheck, label: 'Secure Payment', sub: '100% protected' },
            ].map((f) => (
              <div key={f.label} className="text-center">
                <f.icon size={18} className="mx-auto text-gray-400 mb-1.5 sm:w-5 sm:h-5" />
                <p className="text-[11px] sm:text-xs font-medium text-gray-700">{f.label}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-400">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="-mx-4 lg:-mx-6 mt-8">
          <ProductSection title="Related Products" products={related} />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;