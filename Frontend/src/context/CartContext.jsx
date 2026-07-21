import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart_items';

/* ── Hydrate from localStorage once on mount ───────────────────────────── */
const loadInitialCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/* ── Pure reducer — no side-effects ────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (item) => item.id === action.payload.id && item.variant === action.payload.variant
      );
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id && item.variant === action.payload.variant
            ? { ...item, quantity: item.quantity + (action.payload.quantity ?? 1) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity ?? 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(
        (item) => !(item.id === action.payload.id && item.variant === action.payload.variant)
      );
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id && item.variant === action.payload.variant
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

/* ── Provider ───────────────────────────────────────────────────────────── */
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  /* Persist to localStorage after every change */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Silently ignore storage quota errors
    }
  }, [items]);

  /* Stable callback references — components that receive these won't re-render
     just because the parent CartProvider re-renders. */
  const addToCart = useCallback(
    (product, quantity = 1, variant = null) =>
      dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity, variant } }),
    []
  );

  const removeFromCart = useCallback(
    (id, variant = null) => dispatch({ type: 'REMOVE_ITEM', payload: { id, variant } }),
    []
  );

  const updateQuantity = useCallback(
    (id, quantity, variant = null) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, variant } }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  /* Derived values — recalculate only when items change */
  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  /* Stable context value — object identity only changes when items/totals change */
  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
