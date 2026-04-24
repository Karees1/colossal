import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCollection.css';
import menImg from '../images/fit17.jpg';
import womenImg from '../images/fit16.jpg';
import gearImg from '../images/fit9.jpg';

const FeaturedCollection = () => {
    return (
        <section className="featured-collection">
            <div className="section-header">
                <h2>Featured Collections</h2>
            </div>
            <div className="collection-grid">
                <div className="collection-card">
                    <img src={menImg} alt="Men's Collection" />
                    <div className="collection-content">
                        <h3>Men's Collection</h3>
                        <Link to="/men" className="collection-btn">Shop Men</Link>
                    </div>
                </div>
                <div className="collection-card">
                    <img src={womenImg} alt="Women's Collection" />
                    <div className="collection-content">
                        <h3>Women's Collection</h3>
                        <Link to="/women" className="collection-btn">Shop Women</Link>
                    </div>
                </div>
                <div className="collection-card">
                    <img src={gearImg} alt="Gear & Accessories" />
                    <div className="collection-content">
                        <h3>Gear & Accessories</h3>
                        <Link to="/gear" className="collection-btn">Shop Gear</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;