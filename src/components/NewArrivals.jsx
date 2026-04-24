import React, { useState, useEffect } from "react";
import "./NewArrivals.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { cartManager } from "../utils/cartManager";
import { favoritesManager } from "../utils/favoritesManager";

// Import images
import fit17 from "../images/fit17.jpg";
import fit15 from "../images/fit15.jpg";
import fit16 from "../images/fit16.jpg";
import fit14 from "../images/fit14.jpg";
import fit12 from "../images/fit12.jpg";
import fit11 from "../images/fit11.jpg";
import fit10 from "../images/fit10.jpg";
import fit1 from "../images/fit1.jpg";
// import fit2 from "../images/fit2.jpg";
// import fit4 from "../images/fit4.jpg";
// import fit5 from "../images/fit5.jpg";
// import fit6 from "../images/fit6.jpg";
// import fit7 from "../images/fit7.jpg";
// import fit8 from "../images/fit8.jpg";
// import fit9 from "../images/fit9.jpg";




// Static products for initial site look
export const products = [
  {
    id: 1,
    title: "Black Muscle Tee",
    price: "$32",
    frontImg: fit17,
    backImg: fit15,
    category: "men",
    description: "Premium cotton muscle tee designed for intense workouts.",
    slug: "black-muscle-tee",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#000000", available: true }
    ],
    specifications: {
      material: "80% Cotton, 20% Polyester",
      fit: "Regular Fit",
      care: "Machine wash cold"
    }
  },
  {
    id: 2,
    title: "Grey Hoodie",
    price: "$55",
    frontImg: fit16,
    backImg: fit14,
    category: "men",
    description: "Heavyweight cotton hoodie perfect for pre and post workout.",
    slug: "grey-hoodie",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Heather Grey", value: "#969696", available: true }
    ],
    specifications: {
      material: "80% Cotton, 20% Polyester",
      fit: "Regular Fit",
      care: "Machine wash cold"
    }
  },
  {
    id: 3,
    title: "Hybrid Joggers",
    price: "$48",
    frontImg: fit12,
    backImg: fit11,
    category: "men",
    description: "Versatile joggers that transition from gym to street seamlessly.",
    slug: "hybrid-joggers",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal", value: "#333333", available: true }
    ],
    specifications: {
      material: "80% Cotton, 20% Polyester",
      fit: "Tapered",
      care: "Machine wash cold"
    }
  },
  {
    id: 4,
    title: "Power Shorts",
    price: "$28",
    frontImg: fit10,
    backImg: fit1,
    category: "men",
    description: "Performance shorts designed for maximum mobility and comfort.",
    slug: "power-shorts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#000000", available: true }
    ],
    specifications: {
      material: "80% Cotton, 20% Polyester",
      fit: "Regular Fit",
      care: "Machine wash cold"
    }
  }
];

// Fallback placeholder (use an imported image)
const placeholderImg = fit17;

// Resolve image URL for various formats: absolute URL, root-relative path, or imported module
function resolveImageUrl(img) {
  if (!img) return placeholderImg;
  if (typeof img !== 'string') return img; // imported module or processed asset
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return `${window.location.origin}${img}`;
  return img;
}

function NewArrivals() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(favoritesManager.getFavorites());
  }, []);

  const handleFavoriteClick = (product) => {
    let updatedFavorites;

    if (favoritesManager.isFavorite(product.id)) {
      updatedFavorites = favoritesManager.removeFromFavorites(product.id);
      console.log(`Removed ${product.title} from favorites`);
    } else {
      updatedFavorites = favoritesManager.addToFavorites(product);
      console.log(`Added ${product.title} to favorites`);
    }

    setFavorites(updatedFavorites);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleCartClick = (product) => {
    // Ensure price is numeric: convert from price string if necessary
    const unitPrice = typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price;
    const cartItem = {
      id: product.id,
      title: product.title,
      frontImg: (product.images && product.images[0]) || placeholderImg,
      price: unitPrice,
      quantity: 1,
      selectedSize: product.sizes && product.sizes.length ? product.sizes[0] : null,
    };

    cartManager.addToCart(cartItem);
    console.log(`Added ${product.title} to cart`);
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`Added ${product.title} to cart!`);
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
        {products.map((product) => {
          const isFavorited = favoritesManager.isFavorite(product.id);
          const rawImg = (product.images && product.images.length ? product.images[0] : null) || product.frontImg || product.backImg || null;
          const imgSrc = rawImg ? resolveImageUrl(rawImg) : placeholderImg;

          return (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="image-wrap">
                  <img src={imgSrc} alt={product.title} />
                </div>
              </Link>

              <p className="product-title">{product.title}</p>
              <p className="price">{typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}</p>

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