import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCollection.css';
import whiteShirtFront from '../images/white_shirt_front.png';
import trousersImg from '../images/tr.jpg';
import denimJeansImg from '../images/denim-jeans.jpg';

const collections = [
    {
        label:   'Shirts',
        heading: 'The Shirt Edit',
        link:    '/shirts',
        cta:     'Shop Shirts',
        img:     whiteShirtFront,
    },
    {
        label:   'Trousers',
        heading: 'Tailored Trousers',
        link:    '/trousers',
        cta:     'Shop Trousers',
        img:     trousersImg,
    },
    {
        label:   'Denim',
        heading: 'Premium Denim',
        link:    '/trousers',
        cta:     'Shop Jeans',
        img:     denimJeansImg,
    },
];

const FeaturedCollection = () => {
    return (
        <section className="featured-collection">
            <div className="section-header">
                <h2>Featured Collections</h2>
                <p>Shop the Season</p>
            </div>
            <div className="collection-grid">
                {collections.map((col) => (
                    <div className="collection-card" key={col.label}>
                        <img src={col.img} alt={col.heading} />
                        <div className="collection-content">
                            <h3>{col.heading}</h3>
                            <Link to={col.link} className="collection-btn">{col.cta}</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCollection;
