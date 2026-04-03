import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CoveredRisks from '../components/CoveredRisks';
import Pricing from '../components/Pricing';
import Rules from '../components/Rules';
import DashboardPreview from '../components/DashboardPreview';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <CoveredRisks />
      <Pricing />
      <Rules />
      <DashboardPreview />
      <CTA />
    </div>
  );
};

export default Home;
