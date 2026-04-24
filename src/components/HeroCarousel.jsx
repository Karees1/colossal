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
    heading: "Dress Sharp. Stand Out.",
    sub: "Premium shirts & trousers for every occasion",
    link: "/shirts",
    cta: "Shop Shirts",
  },
  {
    image: fit5,
    heading: "Step Up Your Sole Game",
    sub: "Sneakers, boots & formal shoes — all in one place",
    link: "/footwear",
    cta: "Shop Footwear",
  },
  {
    image: fit11,
    heading: "New Arrivals",
    sub: "Fresh drops — jackets, chinos, accessories & more",
    link: "/outerwear",
    cta: "Shop Outerwear",
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
