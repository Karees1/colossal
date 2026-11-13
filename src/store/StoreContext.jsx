import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const StoreContext = createContext();

const BAG_KEY = 'gentlemanBag';
const SAVED_KEY = 'gentlemanSaved';
const CUSTOMER_KEY = 'gentlemanCustomer';
const LEGACY_CART_KEY = 'gentlemanCart';
const LEGACY_FAVORITES_KEY = 'gentlemanFavorites';

function lineKey(productId, size, colour) {
  return `${productId}__${size || ''}__${colour || ''}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore — storage may be unavailable (private mode, quota, etc.)
  }
}

// One-time migration from the old cartManager/favoritesManager localStorage
// shapes to the new bag/saved shapes, run once on first mount.
function migrateLegacyState() {
  if (localStorage.getItem(BAG_KEY) === null && localStorage.getItem(LEGACY_CART_KEY) !== null) {
    const oldCart = readJSON(LEGACY_CART_KEY, []);
    const newBag = (Array.isArray(oldCart) ? oldCart : []).map((item) => ({
      productId: item.id,
      size: item.selectedSize || null,
      colour: item.selectedColor || null,
      qty: item.quantity || 1,
    }));
    writeJSON(BAG_KEY, newBag);
    try { localStorage.removeItem(LEGACY_CART_KEY); } catch { /* ignore */ }
  }
  if (localStorage.getItem(SAVED_KEY) === null && localStorage.getItem(LEGACY_FAVORITES_KEY) !== null) {
    const oldFavorites = readJSON(LEGACY_FAVORITES_KEY, []);
    const newSaved = (Array.isArray(oldFavorites) ? oldFavorites : []).map((item) => item.id).filter(Boolean);
    writeJSON(SAVED_KEY, newSaved);
    try { localStorage.removeItem(LEGACY_FAVORITES_KEY); } catch { /* ignore */ }
  }
}

export function StoreProvider({ children }) {
  const [bag, setBag] = useState(() => { migrateLegacyState(); return readJSON(BAG_KEY, []); });
  const [saved, setSaved] = useState(() => readJSON(SAVED_KEY, []));
  const [customer, setCustomerState] = useState(() => readJSON(CUSTOMER_KEY, { name: '', area: '' }));
  const [bagOpen, setBagOpen] = useState(false);
  const [quickLookId, setQuickLookId] = useState(null);

  useEffect(() => { writeJSON(BAG_KEY, bag); }, [bag]);
  useEffect(() => { writeJSON(SAVED_KEY, saved); }, [saved]);
  useEffect(() => { writeJSON(CUSTOMER_KEY, customer); }, [customer]);

  const bagCount = useMemo(() => bag.reduce((sum, line) => sum + (line.qty || 0), 0), [bag]);

  const addToBag = useCallback((productId, size, colour, qty = 1) => {
    setBag((prev) => {
      const key = lineKey(productId, size, colour);
      const existing = prev.find((l) => lineKey(l.productId, l.size, l.colour) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.size, l.colour) === key ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { productId, size: size || null, colour: colour || null, qty }];
    });
  }, []);

  const updateBagQty = useCallback((productId, size, colour, qty) => {
    const key = lineKey(productId, size, colour);
    setBag((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l.productId, l.size, l.colour) !== key)
        : prev.map((l) => (lineKey(l.productId, l.size, l.colour) === key ? { ...l, qty } : l))
    );
  }, []);

  const removeFromBag = useCallback((productId, size, colour) => {
    const key = lineKey(productId, size, colour);
    setBag((prev) => prev.filter((l) => lineKey(l.productId, l.size, l.colour) !== key));
  }, []);

  const clearBag = useCallback(() => setBag([]), []);

  const isSaved = useCallback((id) => saved.includes(id), [saved]);

  const toggleSaved = useCallback((id) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const setCustomer = useCallback((partial) => {
    setCustomerState((prev) => ({ ...prev, ...partial }));
  }, []);

  const openBag = useCallback(() => setBagOpen(true), []);
  const closeBag = useCallback(() => setBagOpen(false), []);
  const openQuickLook = useCallback((id) => setQuickLookId(id), []);
  const closeQuickLook = useCallback(() => setQuickLookId(null), []);

  const value = {
    bag, bagCount, addToBag, updateBagQty, removeFromBag, clearBag,
    saved, isSaved, toggleSaved,
    customer, setCustomer,
    bagOpen, openBag, closeBag,
    quickLookId, openQuickLook, closeQuickLook,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
