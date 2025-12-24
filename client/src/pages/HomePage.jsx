import React from 'react'

import { Banner, Hero } from '../components/layout'
import { FeatureSection, Testimonial } from '../components/sections'



const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <Banner />
      <Testimonial />
    </div>
  )
}

export default HomePage
