import React, { useState, useEffect } from "react";
import "./NewArrivals.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { cartManager } from "../utils/cartManager";
import { favoritesManager } from "../utils/favoritesManager";
import { showToast } from "./Toast";

// Keep your image imports as a fallback/placeholder
import fit17 from "../images/fit4.jpg";

// Placeholder if image is missing
const placeholderImg = fit17;

function resolveImageUrl(img) {
    if (!img) return placeholderImg;

    // If it is your clean DB filename ("men.jpg"), add the folder
    if (img.startsWith('http')) return img;
    return `/utilities/images/${img}`;
}
function NewArrivals() {
    const [favorites, setFavorites] = useState([]);

    // <--- 1. NEW STATE: To hold products from the database
    const [dbProducts, setDbProducts] = useState([]);

    useEffect(() => {
        setFavorites(favoritesManager.getFavorites());
        fetchProducts(); // <--- Call the fetcher on load
    }, []);

    // <--- 2. THE FETCHER: Get data from Port 5000
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const data = await response.json();
            console.log("New Arrivals loaded:", data);
            setDbProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err.message);
        }
    };

    const handleFavoriteClick = (product) => {
        // ... (Your existing logic is fine here)
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
        // Handle 'price' being a number (DB) or string
        const unitPrice = typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price;

        const cartItem = {
            id: product.id,
            title: product.name,
            frontImg: product.frontimg || product.image || placeholderImg,
            price: unitPrice,
            quantity: 1,
            selectedSize: product.sizes && product.sizes.length ? product.sizes[0] : "M", // Default size if DB is missing it
        };

        cartManager.addToCart(cartItem);
        window.dispatchEvent(new Event('cartUpdated'));
        showToast(`Added ${cartItem.title} to cart!`);
    };

    return (
        <section className="new-arrivals-section">
            <div className="section-header">
                <h2>New Arrivals</h2>
                <div className="mini-nav">
                    <span>Men</span>
                    <span>Women</span>
                    <span>Gear</span>
                </div>
            </div>




            <div className="product-scroll">
                {dbProducts.map((product) => {
                    const isFavorited = favoritesManager.isFavorite(product.id);

                    // --- IMAGE LOGIC ---
                    const frontSrc = resolveImageUrl(product.frontimg || product.image);

                    // Use back_image if available, otherwise fallback to main image
                    const backSrc = resolveImageUrl(product.backimg || product.back_image || product.frontimg || product.image);

                    // Name Logic (DB uses 'name')
                    const displayName = product.name;

                    return (
                        <div key={product.id} className="product-card">
                            <Link to={`/product/${product.id}`} className="product-link">

                                {/* THE FIX: Render TWO images inside image-wrap */}
                                <div className="image-wrap hover-effect">
                                    <img
                                        src={frontSrc}
                                        alt={displayName}
                                        className="img-front"
                                    />
                                    <img
                                        src={backSrc}
                                        alt={`${displayName} back`}
                                        className="img-back"
                                    />
                                </div>

                            </Link>

                            <p className="product-title">{displayName}</p>

                            {/* Price Logic */}
                            <p className="price">
                                {typeof product.price === 'number'
                                    ? `KSh ${product.price}`
                                    : product.price}
                            </p>

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
        </section>
    );
}

export default NewArrivals;