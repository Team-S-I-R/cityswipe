
import React from 'react';
import Header from '../cs-componets/header';
import PricingPage from './page';
export default async function PricingLayout() {


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PricingPage />
      </main>
    </div>
  )
}

