import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";
import fit1 from "../images/fit1.jpg";
import fit5 from "../images/fit5.jpg";
import fit11 from "../images/fit11.jpg";

const slides = [
  {
    image: fit1,
    heading: "Train Hard. Look Good.",
    sub: "Premium gym apparel built for performance",
    link: "/men",
    cta: "Shop Men's",
  },
  {
    image: fit5,
    heading: "Own Your Grind",
    sub: "Gear & accessories for every workout",
    link: "/gear",
    cta: "Shop Gear",
  },
  {
    image: fit11,
    heading: "New Arrivals",
    sub: "Fresh drops for the season",
    link: "/women",
    cta: "Shop Women's",
  },
];

function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="hero-carousel">
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div key={idx} className="slide">
            <div
              className="slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="overlay" />
              <div className="content">
                <h1>{slide.heading}</h1>
                <p>{slide.sub}</p>
                <Link to={slide.link} className="hero-cta-btn">{slide.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroCarousel;
