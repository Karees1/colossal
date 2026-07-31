import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import placeholderImg from "../images/fit17.jpg";
import { cartManager } from '../utils/cartManager';
import { favoritesManager } from '../utils/favoritesManager';
import { showToast } from '../components/Toast';
import CountUp from '../components/CountUp';
import { useReveal, prefersReducedMotion } from '../hooks/useReveal';
import { supabase } from '../lib/supabaseClient';
import { resolveImageUrl as resolveStorageUrl } from '../utils/resolveImageUrl';

const PLACEHOLDER_RATING = 4.7;
const PLACEHOLDER_REVIEW_COUNT = 18;
const FIT_OPTIONS = ['Slim', 'Regular', 'Classic', 'Relaxed'];

const PERKS = [
  { title: '30-day returns', sub: 'Free, no questions.' },
  { title: 'In-house tailor', sub: 'Alterations on every order.' },
  { title: 'Free pickup', sub: 'CBD & Westlands.' },
];

const TABS = [
  { key: 'details', label: 'Details' },
  { key: 'fit', label: 'Fit & sizing' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'care', label: 'Care' },
];

const STATIC_REVIEWS = [
  {
    stars: 5,
    body: '"Exactly as advertised. Wore it to a board meeting and a wedding the same week — held up beautifully."',
    name: 'James K.',
    meta: '2 weeks ago',
  },
  {
    stars: 5,
    body: '"Excellent quality for the price. The material breathes well in the Nairobi heat. Will be back for another."',
    name: 'Daniel M.',
    meta: '1 month ago',
  },
  {
    stars: 4,
    body: '"Great piece overall. Took half a star off because it ran a touch snug — sized up and it\'s perfect now."',
    name: 'Anthony O.',
    meta: '1 month ago',
  },
];

const STAGGER_STEP = 70;
const GRID_STAGGER_STEP = 90;

function Stars({ count }) {
  return <span className="pdp-stars">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>;
}

function RelatedCard({ product, index, onQuickAdd, resolveImageUrl }) {
  const [ref, inView] = useReveal();
  const name = product.name || product.title;
  const rawImg = product.frontimg || product.image || product.frontImg;
  const price = typeof product.price === 'number' ? `KSh ${product.price.toLocaleString()}` : product.price;

  return (
    <article
      ref={ref}
      className={`pdp-related pdp-reveal ${inView ? 'in' : ''}`}
      style={{ '--d': `${index * GRID_STAGGER_STEP}ms` }}
    >
      <Link to={`/product/${product.id}`} className="pdp-related-link">
        <div className="pdp-related-art">
          <img src={resolveImageUrl(rawImg)} alt={name} />
          <span className="pdp-related-cat">{product.category}</span>
          <button className="pdp-related-add" onClick={(e) => onQuickAdd(e, product)}>+ Add</button>
        </div>
        <div className="pdp-related-info">
          <span className="pdp-related-name">{name}</span>
          <span className="pdp-related-price">{price}</span>
        </div>
      </Link>
    </article>
  );
}

function ReviewCard({ review, index }) {
  const [ref, inView] = useReveal();
  return (
    <article
      ref={ref}
      className={`pdp-review pdp-reveal ${inView ? 'in' : ''}`}
      style={{ '--d': `${index * GRID_STAGGER_STEP}ms` }}
    >
      <div className="pdp-review-head">
        <Stars count={review.stars} />
        <span className="pdp-review-verified">✓ verified buyer</span>
      </div>
      <p className="pdp-review-body">{review.body}</p>
      <span className="pdp-review-meta">{review.name} · {review.meta}</span>
    </article>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFit, setSelectedFit] = useState('Regular');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [stickyVisible, setStickyVisible] = useState(false);
  const [ink, setInk] = useState({ left: 0, width: 0 });

  const buyEndRef = useRef(null);
  const tabBtnRefs = useRef({});

  // reveal hooks — one per animated section, called unconditionally so hook
  // order stays stable regardless of whether the section ends up rendered
  const [galleryRef, galleryIn] = useReveal();
  const [catRef, catIn] = useReveal();
  const [nameRef, nameIn] = useReveal();
  const [rowRef, rowIn] = useReveal();
  const [ratingRef, ratingIn] = useReveal();
  const [descRef, descIn] = useReveal();
  const [colorBlockRef, colorBlockIn] = useReveal();
  const [sizeBlockRef, sizeBlockIn] = useReveal();
  const [fitBlockRef, fitBlockIn] = useReveal();
  const [actionsRef, actionsIn] = useReveal();
  const [perksRef, perksIn] = useReveal();
  const [tabsHeadRef, tabsHeadIn] = useReveal();
  const [completeHeadRef, completeHeadIn] = useReveal();
  const [reviewsHeadRef, reviewsHeadIn] = useReveal();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setActiveImageIndex(0);
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedFit('Regular');
      setQuantity(1);
      setActiveTab('details');
      try {
        const { data: found, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        if (fetchError || !found) throw new Error('Product not found');

        setProduct(found);
        setWishlisted(favoritesManager.isFavorite(found.id));

        if (found.category) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .ilike('category', found.category);
          setRelatedProducts((relatedData || []).filter(p => p.id !== found.id).slice(0, 4));
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // sticky add-to-cart bar: shows once the buy panel scrolls out of view
  useEffect(() => {
    if (!product) return;
    const el = buyEndRef.current;
    if (!el || prefersReducedMotion()) return;
    const io = new IntersectionObserver(([entry]) => {
      setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  // tabs ink bar
  const positionInk = useCallback(() => {
    const btn = tabBtnRefs.current[activeTab];
    if (btn) setInk({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeTab]);

  useLayoutEffect(() => {
    if (product) positionInk();
  }, [positionInk, product]);

  useEffect(() => {
    window.addEventListener('resize', positionInk);
    return () => window.removeEventListener('resize', positionInk);
  }, [positionInk]);

  if (loading) return <div className="product-loading">Loading product...</div>;
  if (error || !product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
        <p>{error ? error : "Sorry, we couldn't find the product you're looking for."}</p>
        <Link to="/" className="back-to-home">Back to Home</Link>
      </div>
    );
  }

  const getPriceNumber = (price) => {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  };

  const productPrice = getPriceNumber(product.price);
  const comparePrice = Math.round(productPrice * 1.3);
  const totalPrice = productPrice * quantity;

  const resolveImageUrl = (imgPath) => {
    if (Array.isArray(imgPath)) imgPath = imgPath[0];
    return resolveStorageUrl(imgPath, placeholderImg);
  };

  const productName = product.name || product.title || "Product";
  const dbImage = product.frontimg || product.image_url || product.image || product.frontImg;
  const dbBackImage = product.backimg || product.back_image || product.backImg;

  let images = [];
  if (dbImage) images.push({ url: resolveImageUrl(dbImage), alt: 'Front view' });
  if (dbBackImage) images.push({ url: resolveImageUrl(dbBackImage), alt: 'Back view' });
  if (product.images && product.images.length) {
    product.images.forEach((url, i) => {
      const resolved = resolveImageUrl(url);
      if (!images.some(img => img.url === resolved)) {
        images.push({ url: resolved, alt: `${productName} ${i + 1}` });
      }
    });
  }
  const hasRealImages = images.length > 0;
  if (!hasRealImages) {
    images = [{ url: null, alt: 'Photography coming soon', placeholder: true }];
  }

  const activeImage = images[Math.min(activeImageIndex, images.length - 1)];

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  const categoryLabel = [product.category, product.sub_category].filter(Boolean).join(' · ');
  const sku = `GTM-${(product.category || 'GEN').slice(0, 3).toUpperCase()}-${product.id}`;

  const handleThumbClick = (index) => {
    if (index === activeImageIndex || wiping) return;
    if (prefersReducedMotion()) { setActiveImageIndex(index); return; }
    setWiping(true);
    setTimeout(() => {
      setActiveImageIndex(index);
      setWiping(false);
    }, 280);
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      showToast('Please select a size first', 'error');
      return;
    }
    if (hasColors && !selectedColor) {
      showToast('Please select a color first', 'error');
      return;
    }
    if (addedToCart) return;

    const cartItem = {
      id: product.id,
      title: productName,
      price: productPrice,
      priceDisplay: product.price,
      frontImg: dbImage ? resolveImageUrl(dbImage) : placeholderImg,
      selectedSize: selectedSize || 'One Size',
      selectedColor: selectedColor || 'Default',
      selectedFit,
      quantity,
    };

    cartManager.addToCart(cartItem);
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`Added ${quantity}× ${productName} to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleToggleWishlist = () => {
    if (wishlisted) {
      favoritesManager.removeFromFavorites(product.id);
      setWishlisted(false);
    } else {
      favoritesManager.addToFavorites(product);
      setWishlisted(true);
      if (!prefersReducedMotion()) {
        setBurst(true);
        setTimeout(() => setBurst(false), 650);
      }
      showToast(`Added ${productName} to favorites!`);
    }
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleQuickAdd = (e, relProduct) => {
    e.preventDefault();
    const rName = relProduct.name || relProduct.title;
    const rPrice = getPriceNumber(relProduct.price);
    const rImg = relProduct.frontimg || relProduct.image || relProduct.frontImg;
    cartManager.addToCart({
      id: relProduct.id,
      title: rName,
      price: rPrice,
      priceDisplay: relProduct.price,
      frontImg: resolveImageUrl(rImg),
      selectedSize: relProduct.sizes && relProduct.sizes.length ? relProduct.sizes[0] : 'One Size',
      selectedColor: 'Default',
      quantity: 1,
    });
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`Added ${rName} to cart!`);
  };

  const getAddToCartLabel = () => {
    if (addedToCart) return '✓ Added to cart';
    if (hasSizes && !selectedSize) return 'Select Size First';
    if (hasColors && !selectedColor) return 'Select Color First';
    return `Add to cart — KSh ${totalPrice.toLocaleString()}`;
  };

  const isAddToCartDisabled = (hasSizes && !selectedSize) || (hasColors && !selectedColor);

  return (
    <div className="product-detail-page pdp-page">
      {/* sticky add-to-cart bar */}
      <div className={`pdp-stickybar ${stickyVisible ? 'show' : ''}`}>
        <div className="pdp-stickybar-in">
          {activeImage.placeholder ? (
            <span className="pdp-stickybar-thumb pdp-ph pdp-ph--charcoal" />
          ) : (
            <img className="pdp-stickybar-thumb" src={images[0].url} alt={productName} />
          )}
          <span className="pdp-stickybar-meta">
            <span className="pdp-stickybar-name">{productName}</span>
            <span className="pdp-stickybar-sub">{categoryLabel}</span>
          </span>
          {hasSizes && (
            <div className="pdp-stickybar-sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`pdp-size ${selectedSize === size ? 'on' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <span className="pdp-stickybar-price">KSh {totalPrice.toLocaleString()}</span>
          <button
            className={`pdp-cta ${addedToCart ? 'on' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
          >
            {addedToCart ? '✓ Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* breadcrumb */}
      <nav className="pdp-crumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to={`/${(product.category || '').toLowerCase()}`}>{product.category}</Link><span>›</span>
        <span className="pdp-crumb-current">{productName}</span>
      </nav>

      {/* hero grid */}
      <main className="pdp">
        <div className="pdp-grid">

          {/* gallery */}
          <div ref={galleryRef} className={`pdp-gallery pdp-reveal ${galleryIn ? 'in' : ''}`}>
            <div className="pdp-gallery-main">
              <div className={`pdp-gallery-stage ${wiping ? 'wiping' : ''}`}>
                <div className="pdp-gallery-zoomwrap">
                  {activeImage.placeholder ? (
                    <span className="pdp-ph pdp-ph--charcoal">
                      <span className="pdp-ph-mono">{productName.charAt(0).toUpperCase()}</span>
                    </span>
                  ) : (
                    <img src={activeImage.url} alt={activeImage.alt} />
                  )}
                </div>
              </div>
              <span className="pdp-gallery-tagline">{activeImage.alt}</span>
              <span className="pdp-gallery-counter">{activeImageIndex + 1} / {images.length}</span>
            </div>
            {images.length > 1 && (
              <div className="pdp-gallery-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pdp-gallery-thumb ${activeImageIndex === i ? 'on' : ''}`}
                    onClick={() => handleThumbClick(i)}
                  >
                    <img src={img.url} alt={img.alt} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* buy panel */}
          <div className="pdp-buy">
            <span
              ref={catRef}
              className={`pdp-buy-cat pdp-reveal ${catIn ? 'in' : ''}`}
              style={{ '--d': `${0 * STAGGER_STEP}ms` }}
            >
              {categoryLabel}
            </span>

            <h1
              ref={nameRef}
              className={`pdp-buy-name pdp-reveal pdp-mask ${nameIn ? 'in' : ''}`}
              style={{ '--d': `${1 * STAGGER_STEP}ms` }}
            >
              {productName}
            </h1>

            <div
              ref={rowRef}
              className={`pdp-buy-row pdp-reveal ${rowIn ? 'in' : ''}`}
              style={{ '--d': `${2 * STAGGER_STEP}ms` }}
            >
              <span className="pdp-buy-price">KSh <CountUp value={productPrice} decimals={0} /></span>
              <span className="pdp-buy-compare">KSh {comparePrice.toLocaleString()}</span>
              <span className="pdp-buy-stock">In stock — ships 1–2 days</span>
            </div>

            <div
              ref={ratingRef}
              className={`pdp-buy-rating pdp-reveal ${ratingIn ? 'in' : ''}`}
              style={{ '--d': `${3 * STAGGER_STEP}ms` }}
            >
              <Stars count={5} />
              <span><CountUp value={PLACEHOLDER_RATING} decimals={1} />/5 · <CountUp value={PLACEHOLDER_REVIEW_COUNT} decimals={0} /> reviews</span>
            </div>

            <p
              ref={descRef}
              className={`pdp-buy-desc pdp-reveal ${descIn ? 'in' : ''}`}
              style={{ '--d': `${4 * STAGGER_STEP}ms` }}
            >
              {product.description}
            </p>

            {hasColors && (
              <div
                ref={colorBlockRef}
                className={`pdp-buy-block pdp-f-block pdp-reveal ${colorBlockIn ? 'in' : ''}`}
                style={{ '--d': `${5 * STAGGER_STEP}ms` }}
              >
                <div className="pdp-f-label">
                  <span>Color</span>
                  <span className="pdp-val">{selectedColor || 'Choose a color'}</span>
                </div>
                <div className="pdp-colors">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`pdp-color ${selectedColor === color.name ? 'on' : ''}`}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ background: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {hasSizes && (
              <div
                ref={sizeBlockRef}
                className={`pdp-buy-block pdp-f-block pdp-reveal ${sizeBlockIn ? 'in' : ''}`}
                style={{ '--d': `${6 * STAGGER_STEP}ms` }}
              >
                <div className="pdp-f-label"><span>Size</span></div>
                <div className="pdp-sizes">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`pdp-size ${selectedSize === size ? 'on' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              ref={fitBlockRef}
              className={`pdp-buy-block pdp-f-block pdp-reveal ${fitBlockIn ? 'in' : ''}`}
              style={{ '--d': `${7 * STAGGER_STEP}ms` }}
            >
              <div className="pdp-f-label">
                <span>Fit</span>
                <span className="pdp-val">{selectedFit}</span>
              </div>
              <div className="pdp-fits">
                {FIT_OPTIONS.map((fit) => (
                  <button
                    key={fit}
                    className={`pdp-fit ${selectedFit === fit ? 'on' : ''}`}
                    onClick={() => setSelectedFit(fit)}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={actionsRef}
              className={`pdp-buy-actions pdp-reveal ${actionsIn ? 'in' : ''}`}
              style={{ '--d': `${8 * STAGGER_STEP}ms` }}
            >
              <div className="pdp-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</button>
              </div>
              <button
                className={`pdp-cta pdp-cta-full ${addedToCart ? 'on' : ''} ${isAddToCartDisabled ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
              >
                {getAddToCartLabel()}
              </button>
              <button
                className={`pdp-wishlist ${burst ? 'burst' : ''}`}
                onClick={handleToggleWishlist}
                aria-label="Save to wishlist"
              >
                {wishlisted ? '♥' : '♡'}
                <span className="pdp-heart-burst" />
              </button>
            </div>

            <ul
              ref={perksRef}
              className={`pdp-buy-perks pdp-perks pdp-reveal ${perksIn ? 'in' : ''}`}
              style={{ '--d': `${9 * STAGGER_STEP}ms` }}
            >
              {PERKS.map((perk) => (
                <li key={perk.title}><b>{perk.title}</b><span>{perk.sub}</span></li>
              ))}
            </ul>

            <div ref={buyEndRef} className="pdp-buy-end" aria-hidden="true" />
          </div>

        </div>
      </main>

      {/* detail tabs */}
      <section className="pdp-tabs">
        <div className="pdp-tabs-head-wrap">
          <div ref={tabsHeadRef} className={`pdp-tabs-head pdp-reveal ${tabsHeadIn ? 'in' : ''}`}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                ref={(el) => { tabBtnRefs.current[tab.key] = el; }}
                className={`pdp-tabs-btn ${activeTab === tab.key ? 'on' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
            <span className="pdp-tabs-ink" style={{ left: ink.left, width: ink.width }} />
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="pdp-tabs-panel">
            <div className="pdp-tabs-body pdp-tabs-grid">
              <div>
                <h3>About this piece</h3>
                <ul className="pdp-tabs-list">
                  <li>Machine washable, lay flat to dry</li>
                  <li>Hand-finished at our Nairobi atelier</li>
                  <li>Considered construction, built to last</li>
                  <li>Classic, versatile cut</li>
                </ul>
              </div>
              <div>
                <h3>Composition</h3>
                <dl className="pdp-tabs-dl">
                  <dt>Material</dt><dd>{product.material || 'Premium Cotton Blend'}</dd>
                  <dt>Origin</dt><dd>Cut &amp; sewn in Nairobi</dd>
                  <dt>SKU</dt><dd>{sku}</dd>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fit' && (
          <div className="pdp-tabs-panel">
            <div className="pdp-tabs-body">
              <p className="pdp-tabs-prose">Our pieces run true to size. If you're between sizes, size down for a slimmer fit, size up for a relaxed one.</p>
              <div className="pdp-tabs-fit-table">
                <div className="pdp-tabs-fit-row pdp-tabs-fit-head"><span>Size</span><span>Chest/Waist (cm)</span><span>Fit note</span></div>
                <div className="pdp-tabs-fit-row"><span>S</span><span>86–91</span><span>Slim through body</span></div>
                <div className="pdp-tabs-fit-row"><span>M</span><span>96–101</span><span>Regular, most common</span></div>
                <div className="pdp-tabs-fit-row"><span>L</span><span>106–111</span><span>Classic, roomier chest</span></div>
                <div className="pdp-tabs-fit-row"><span>XL</span><span>116–121</span><span>Relaxed throughout</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="pdp-tabs-panel">
            <div className="pdp-tabs-body">
              <p className="pdp-tabs-prose"><b>Free pickup</b> at our Kimathi Street CBD branch and Sarit Centre, Westlands — within 24 hours of order.</p>
              <p className="pdp-tabs-prose"><b>Nairobi delivery</b> within 24–48 hours. KSh 250 fee, free over KSh 5,000.</p>
              <p className="pdp-tabs-prose"><b>Upcountry &amp; coast</b> 3–5 business days via courier. KSh 400–600 depending on county.</p>
              <p className="pdp-tabs-prose"><b>East Africa</b> (Kampala, Dar, Kigali, Bujumbura) 7–10 business days. From KSh 1,800.</p>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="pdp-tabs-panel">
            <div className="pdp-tabs-body">
              <p className="pdp-tabs-prose">Machine wash cold, gentle cycle. Hang dry; do not tumble. For pressed-crease wear, send to our atelier for a complimentary press with any purchase over KSh 5,000.</p>
            </div>
          </div>
        )}
      </section>

      {/* complete the look */}
      {relatedProducts.length > 0 && (
        <section className="pdp-complete">
          <header ref={completeHeadRef} className={`pdp-section-head pdp-reveal ${completeHeadIn ? 'in' : ''}`}>
            <span className="pdp-section-eyebrow">— COMPLETE THE LOOK —</span>
            <h2 className={`pdp-section-h pdp-mask ${completeHeadIn ? 'in' : ''}`}>Pairs <em>especially</em> well with.</h2>
          </header>
          <div className="pdp-complete-grid">
            {relatedProducts.map((rp, index) => (
              <RelatedCard
                key={rp.id}
                product={rp}
                index={index}
                onQuickAdd={handleQuickAdd}
                resolveImageUrl={resolveImageUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* reviews */}
      <section className="pdp-reviews">
        <header ref={reviewsHeadRef} className={`pdp-section-head pdp-reveal ${reviewsHeadIn ? 'in' : ''}`}>
          <span className="pdp-section-eyebrow">— WHAT THE HOUSE SAYS —</span>
          <h2 className={`pdp-section-h pdp-mask ${reviewsHeadIn ? 'in' : ''}`}>
            <CountUp value={PLACEHOLDER_RATING} decimals={1} />/5 from <em><CountUp value={PLACEHOLDER_REVIEW_COUNT} decimals={0} /> men.</em>
          </h2>
        </header>
        <div className="pdp-reviews-grid">
          {STATIC_REVIEWS.map((review, index) => (
            <ReviewCard key={review.name} review={review} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
