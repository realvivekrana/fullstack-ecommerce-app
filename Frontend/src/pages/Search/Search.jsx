import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SearchX } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import { ProductCard, ProductCardSkeleton } from '@/components/product';
import { productService } from '@/services';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await productService.searchProducts(query);
        setResults(res.data.data.products.map((p) => ({ ...p, id: p._id })));
      } catch (error) {
        toast.error('Search failed. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'Search' }]} />

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Search results for "{query}"
      </h1>
      <p className="text-sm text-gray-500 mb-6">{loading ? 'Searching…' : `${results.length} products found`}</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No results found"
          description="Try searching with different keywords or browse our categories instead."
          actionLabel="Browse Shop"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;