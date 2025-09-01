import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoFeed from './components/VideoFeed';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Vehicle Detection and Counting for Thai Roads using Deep Learning
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            การพัฒนาโมเดลการรู้จำและนับจำนวนยานพาหนะบนท้องถนนในประเทศไทยโดยใช้การเรียนรู้เชิงลึกสำหรับการใช้งานบนเว็บไซต์
          </p>
        </div>
        
        {/* Content */}
        {activeTab === 'live' && (
          <div className="flex justify-center">
            <VideoFeed />
          </div>
        )}
        
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
