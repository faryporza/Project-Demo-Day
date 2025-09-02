import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Computer Science 66
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="hidden md:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'live'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab('rtspFeed')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'rtspFeed'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
              }`}
            >
              RTSP Stream
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
              }`}
            >
              แผงควบคุม
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
              เริ่มต้นใช้งาน
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Tabs */}
        <div className="md:hidden mt-4 flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'live'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab('rtspFeed')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rtspFeed'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
            }`}
          >
            RTSP Stream
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-600'
            }`}
          >
            แผงควบคุม
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
