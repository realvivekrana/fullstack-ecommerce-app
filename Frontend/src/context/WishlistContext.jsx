import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'wishlist_items';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* Persist on change */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Silently ignore storage quota errors
    }
  }, [items]);

  /* Build a Set of IDs for O(1) membership lookup — recomputed only when
     the items array reference changes. */
  const wishlistIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  /* Stable callbacks */
  const isInWishlist = useCallback(
    (id) => wishlistIds.has(id),
    [wishlistIds]
  );

  const toggleWishlist = useCallback((product) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const removeFromWishlist = useCallback(
    (id) => setItems((prev) => prev.filter((item) => item.id !== id)),
    []
  );

  const value = useMemo(
    () => ({ items, isInWishlist, toggleWishlist, removeFromWishlist }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
