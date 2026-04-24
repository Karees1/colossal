import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import NewArrivals from '../components/NewArrivals1';
import FeaturedCollection from './FeaturedCollection';

function Home() {
  return (
    <div>
      <HeroCarousel />
      <FeaturedCollection />
      <NewArrivals />
    </div>
  );
}

export default Home;
