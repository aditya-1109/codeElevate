import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';

export default function Shell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100 font-sans overflow-hidden">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 lg:pl-16">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Page Scroll Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
