import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { cartManager } from '../utils/cartManager';
import { favoritesManager } from '../utils/favoritesManager';
import { showToast } from './Toast';
import fit17 from "../images/fit4.jpg"; // Fallback image
import '../components/NewArrivals.css'; // Reuse NewArrivals styling

function ProductGrid({ category: propCategory, title: propTitle }) {
    const { category: paramCategory, subcategory: paramSubcategory } = useParams();

    const category = propCategory || paramCategory;
    const subCategory = paramSubcategory;

    const title = propTitle || (subCategory
        ? subCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : (category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : 'Products'));

    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const placeholderImg = fit17;

    const resolveImageUrl = (img) => {
        if (!img) return placeholderImg;
        if (typeof img !== 'string') return placeholderImg;
        if (img.startsWith('http')) return img;
        return `/utilities/images/${img}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/products");
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();

                // Filter by category and subcategory if provided
                let filtered = data;

                if (category) {
                    filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
                }

                if (subCategory) {
                    filtered = filtered.filter(p => {
                        if (!p.sub_category) return false;
                        // Convert DB sub_category to kebab-case to compare with URL
                        const dbSub = p.sub_category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
                        return dbSub === subCategory.toLowerCase();
                    });
                }

                setProducts(filtered);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        setFavorites(favoritesManager.getFavorites());
    }, [category, subCategory]);

    const handleFavoriteClick = (product) => {
        let updatedFavorites;

        if (favoritesManager.isFavorite(product.id)) {
            updatedFavorites = favoritesManager.removeFromFavorites(product.id);
        } else {
            updatedFavorites = favoritesManager.addToFavorites(product);
        }

        setFavorites(updatedFavorites);
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    const handleCartClick = (product) => {
        const unitPrice = typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price;

        const productName = product.name || product.title;
        const productImg = product.frontimg || product.image || product.frontImg || placeholderImg;

        const cartItem = {
            id: product.id,
            title: productName,
            frontImg: productImg,
            price: unitPrice,
            quantity: 1,
            selectedSize: product.sizes && product.sizes.length ? product.sizes[0] : null,
        };

        cartManager.addToCart(cartItem);
        window.dispatchEvent(new Event('cartUpdated'));
        showToast(`Added ${productName} to cart!`);
    };

    if (loading) return <div className="product-loading">Loading products...</div>;

    return (
        <section className="new-arrivals-section">
            <div className="section-header">
                <h2>{title}</h2>
            </div>

            {error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>
            ) : products.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No products found in this category.</p>
            ) : (
                <div className="product-scroll">
                    {products.map((product) => {
                        const isFavorited = favoritesManager.isFavorite(product.id);

                        // Resolve Name and Image (DB vs Static)
                        const displayName = product.name || product.title;
                        const frontSrc = resolveImageUrl(product.frontimg || product.image || product.frontImg);
                        const backSrc = resolveImageUrl(product.backimg || product.back_image || product.frontimg || product.image || product.frontImg);

                        return (
                            <div key={product.id} className="product-card">
                                <Link to={`/product/${product.id}`} className="product-link">
                                    <div className="image-wrap hover-effect">
                                        <img src={frontSrc} alt={displayName} className="img-front" />
                                        <img src={backSrc} alt={`${displayName} back`} className="img-back" />
                                    </div>
                                </Link>

                                <p className="product-title">{displayName}</p>
                                <p className="price">{typeof product.price === 'number' ? `KSh ${product.price.toFixed(2)}` : product.price}</p>

                                <div className="icons">
                                    <i
                                        onClick={() => handleFavoriteClick(product)}
                                        className={isFavorited ? "favorited" : ""}
                                    >
                                        <FaHeart />
                                    </i>
                                    <i onClick={() => handleCartClick(product)}>
                                        <FaShoppingCart />
                                    </i>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default ProductGrid;
