import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCollection.css';
import shirtsImg from '../images/fit17.jpg';
import trousersImg from '../images/fit16.jpg';
import footwearImg from '../images/fit9.jpg';

const FeaturedCollection = () => {
    return (
        <section className="featured-collection">
            <div className="section-header">
                <h2>Featured Collections</h2>
                <p>Shop the Season</p>
            </div>
            <div className="collection-grid">
                <div className="collection-card">
                    <img src={shirtsImg} alt="Shirts Collection" />
                    <div className="collection-content">
                        <h3>Shirts</h3>
                        <Link to="/shirts" className="collection-btn">Shop Shirts</Link>
                    </div>
                </div>
                <div className="collection-card">
                    <img src={trousersImg} alt="Trousers Collection" />
                    <div className="collection-content">
                        <h3>Trousers</h3>
                        <Link to="/trousers" className="collection-btn">Shop Trousers</Link>
                    </div>
                </div>
                <div className="collection-card">
                    <img src={footwearImg} alt="Footwear Collection" />
                    <div className="collection-content">
                        <h3>Footwear</h3>
                        <Link to="/footwear" className="collection-btn">Shop Footwear</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;
