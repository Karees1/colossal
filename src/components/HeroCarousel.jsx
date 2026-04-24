import React from "react";
import Slider from "react-slick";
import "./HeroCarousel.css";

const images = [
  "/utilities/images/david-lezcano-NfZiOJzZgcg-unsplash.jpg"

];

function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false
  };

  return (
    <div className="hero-carousel">
      <Slider {...settings}>
        {images.map((url, idx) => (
          <div key={idx} className="slide">
            <div
              className="slide-bg"
              style={{ backgroundImage: `url(${url})` }}
            >
              <div className="overlay" />
              <div className="content">
                <h1>Refined Elegance</h1>
                <button>Shop Collection</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroCarousel;
