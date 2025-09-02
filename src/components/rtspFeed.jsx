import React, { useState, useRef, useEffect } from 'react';
import { FiVideo, FiWifi, FiWifiOff, FiSettings, FiMonitor } from 'react-icons/fi';

const RtspFeed = () => {
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [gpuStatus, setGpuStatus] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'
  const videoRef = useRef(null);

  // Check GPU status
  const checkGpuStatus = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/gpu_status`);
      if (response.ok) {
        const data = await response.json();
        setGpuStatus(data);
      }
    } catch (err) {
      console.error('Failed to get GPU status:', err);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      
      const response = await fetch(`${apiEndpoint}/gpu_status`);
      if (response.ok) {
        setConnectionStatus('connected');
        setError(null);
        checkGpuStatus();
        alert('✅ API เชื่อมต่อสำเร็จ!');
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('ไม่สามารถเชื่อมต่อกับ API ได้: ' + err.message);
    }
  };

  // Start video stream
  const startStream = () => {
    if (videoRef.current && apiEndpoint) {
      setIsConnected(true);
      setError(null);
      videoRef.current.src = `${apiEndpoint}/video_feed`;
      
      videoRef.current.onload = () => {
        setConnectionStatus('connected');
      };
      
      videoRef.current.onerror = () => {
        setIsConnected(false);
        setConnectionStatus('error');
        setError('ไม่สามารถโหลดสตรีมวิดีโอได้');
      };
    }
  };

  // Stop video stream
  const stopStream = () => {
    if (videoRef.current) {
      videoRef.current.src = '';
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  };

  // Auto-check GPU status when API endpoint changes
  useEffect(() => {
    if (apiEndpoint) {
      const timeoutId = setTimeout(() => {
        checkGpuStatus();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [apiEndpoint]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <FiWifi className="text-green-500" />;
      case 'connecting': return <FiWifi className="text-yellow-500 animate-pulse" />;
      case 'error': return <FiWifiOff className="text-red-500" />;
      default: return <FiWifiOff className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 pb-16">
      <div className="text-center py-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 text-transparent bg-clip-text">
          RTSP Live Detection Stream
        </h1>
        <p className="text-sm text-gray-500 mt-2">สตรีมสดจากกล้อง RTSP พร้อมการตรวจจับแบบเรียลไทม์</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* API Configuration */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-5 shadow-sm">
            <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FiSettings className="text-blue-500" />
              API Configuration
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="http://localhost:8000"
                />
                <button
                  onClick={testConnection}
                  disabled={connectionStatus === 'connecting'}
                  className="px-3 py-2 text-xs font-medium rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow disabled:opacity-50"
                >
                  {connectionStatus === 'connecting' ? 'Testing...' : 'Test'}
                </button>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center gap-2 text-xs">
                {getStatusIcon(connectionStatus)}
                <span className={getStatusColor(connectionStatus)}>
                  {connectionStatus === 'connected' && 'เชื่อมต่อแล้ว'}
                  {connectionStatus === 'connecting' && 'กำลังเชื่อมต่อ...'}
                  {connectionStatus === 'error' && 'เชื่อมต่อไม่ได้'}
                  {connectionStatus === 'disconnected' && 'ยังไม่ได้เชื่อมต่อ'}
                </span>
              </div>
            </div>
          </div>

          {/* Stream Controls */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FiVideo className="text-purple-500" />
              Stream Controls
            </h3>
            <div className="space-y-3">
              <button
                onClick={startStream}
                disabled={!apiEndpoint || isConnected}
                className="w-full py-2.5 text-sm font-semibold rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow hover:from-green-600 hover:to-emerald-600 disabled:opacity-40"
              >
                {isConnected ? 'Streaming...' : 'Start Stream'}
              </button>
              <button
                onClick={stopStream}
                disabled={!isConnected}
                className="w-full py-2.5 text-sm font-semibold rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:from-red-600 hover:to-pink-600 disabled:opacity-40"
              >
                Stop Stream
              </button>
            </div>
          </div>

          {/* GPU Status */}
          {gpuStatus && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FiMonitor className="text-orange-500" />
                GPU Status
              </h3>
              {gpuStatus.gpu_available ? (
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Available</span>
                  </div>
                  <div><span className="font-medium">Name:</span> {gpuStatus.gpu_name}</div>
                  <div><span className="font-medium">Memory Allocated:</span> {(gpuStatus.gpu_memory_allocated / 1024 / 1024).toFixed(1)} MB</div>
                  <div><span className="font-medium">Memory Reserved:</span> {(gpuStatus.gpu_memory_reserved / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>GPU not available</span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700 px-4 py-3 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Video Stream */}
        <div className="lg:col-span-3">
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-black p-4 min-h-[480px] flex items-center justify-center">
            {!isConnected && (
              <div className="text-center text-sm text-gray-400">
                <FiVideo className="mx-auto mb-2 text-2xl" />
                <p>กด "Start Stream" เพื่อเริ่มสตรีม</p>
              </div>
            )}
            
            <img
              ref={videoRef}
              className={`max-w-full max-h-full rounded-lg transition-opacity duration-300 ${
                isConnected ? 'opacity-100' : 'opacity-0'
              }`}
              alt="RTSP Stream"
              style={{ 
                display: isConnected ? 'block' : 'none',
                objectFit: 'contain'
              }}
            />
            
            {/* Stream Status Overlay */}
            {isConnected && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-white font-medium">LIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RtspFeed;
