
import React from 'react';
import Header from '../cs-componets/header';

export default async function PricingLayout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}

