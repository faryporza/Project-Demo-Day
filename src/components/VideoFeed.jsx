import React, { useState, useRef, useCallback } from 'react';

const VideoFeed = () => {
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJSON, setShowJSON] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const canvasRef = useRef(null);

  const resetAll = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDetections([]);
    setError(null);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // เลือกรูป
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setDetections([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileInputChange = (e) => handleImageSelect(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files[0]);
  };
  const onDragOver = (e) => e.preventDefault();

  // Upload รูปไป API
  const handleUpload = async () => {
    if (!selectedImage) {
      setError("กรุณาเลือกรูปภาพก่อน");
      return;
    }
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const response = await fetch(`${apiEndpoint}/predict`, {
        method: "POST",
        body: formData,
        headers: { 'ngrok-skip-browser-warning': 'any', 'User-Agent': 'MyApp/1.0' }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setDetections(result.detections || []);
        drawDetections(result.detections || []);
      } else {
        setError(result.error || "API ส่งกลับมาไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับ API ได้: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // วาด bounding box
  const palette = useRef({});
  const getColor = (cls) => {
    if (!palette.current[cls]) {
      const h = (cls * 57) % 360;
      palette.current[cls] = `hsl(${h} 85% 55%)`;
    }
    return palette.current[cls];
  };

  const drawDetections = useCallback((detectionResults, hover = null) => {
    if (!imagePreview) return;
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      const maxDisplayW = 1100;
      const scale = img.width > maxDisplayW ? maxDisplayW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      detectionResults.forEach((det, i) => {
        const [x1, y1, x2, y2] = det.bbox;
        const sx1 = x1 * scale;
        const sy1 = y1 * scale;
        const w = (x2 - x1) * scale;
        const h = (y2 - y1) * scale;
        const color = getColor(det.class);
        const active = i === hover;
        ctx.lineWidth = active ? 4 : 2.2;
        ctx.strokeStyle = color;
        ctx.shadowColor = active ? color : 'transparent';
        ctx.shadowBlur = active ? 12 : 0;
        ctx.strokeRect(sx1, sy1, w, h);
        ctx.shadowBlur = 0;

        const label = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;
        ctx.font = "600 13px 'Inter', sans-serif";
        const txtW = ctx.measureText(label).width + 10;
        const boxH = 20;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(sx1, sy1 - boxH < 0 ? sy1 : sy1 - boxH, txtW, boxH);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.fillText(label, sx1 + 5, sy1 - boxH < 0 ? sy1 + 14 : sy1 - boxH + 14);
      });
    };
    img.src = imagePreview;
  }, [imagePreview]);

  // redraw on hover
  const handleHover = (i) => {
    setHoverIndex(i);
    drawDetections(detections, i);
  };

  // export image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'detection_result.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(detections, null, 2));
  };

  // ตรวจสอบ API /health
  const checkApiHealth = async () => {
    try {
      const res = await fetch(`${apiEndpoint}/health`, {
        headers: { 'ngrok-skip-browser-warning': 'any', 'User-Agent': 'MyApp/1.0' }
      });
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('text/html')) throw new Error('ngrok warning');
      const data = await res.json();
      if (data.status === "healthy") {
        setError(null);
        alert("✅ API พร้อมใช้งาน");
      } else setError("⚠️ API ไม่ปกติ");
    } catch (e) {
      setError("เชื่อมต่อไม่ได้: " + e.message);
    }
  };

  const classSummary = detections.reduce((acc, d) => {
    acc[d.class_name] = (acc[d.class_name] || 0) + 1;
    return acc;
  }, {});
  const summaryEntries = Object.entries(classSummary);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 pb-16">
      <div className="text-center py-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
          YOLO Object Detection Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-2">อัปโหลดรูป → วิเคราะห์ → ดาวน์โหลดผลลัพธ์</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="space-y-6 lg:col-span-1">
          {/* API Config */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur p-5 shadow-sm">
              <h2 className="font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" /> API Configuration
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="http://localhost:5001"
                />
                <button
                  onClick={checkApiHealth}
                  className="px-3 py-2 text-xs font-medium rounded-md bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow"
                >
                  Test
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowJSON((s) => !s)}
                  disabled={!detections.length}
                  className="flex-1 text-xs px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                >
                  {showJSON ? "Hide JSON" : "Show JSON"}
                </button>
                <button
                  onClick={copyJSON}
                  disabled={!detections.length}
                  className="flex-1 text-xs px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40"
                >
                  Copy JSON
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!detections.length}
                  className="flex-1 text-xs px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40"
                >
                  Download
                </button>
              </div>
              <button
                onClick={resetAll}
                className="mt-3 w-full text-xs px-3 py-2 rounded-md bg-red-500/90 text-white hover:bg-red-600"
              >
                Clear
              </button>
            </div>

          {/* Upload Area */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="group rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition p-6 text-center bg-gray-50 dark:bg-gray-900"
          >
            <input
              id="fileInputHidden"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />
            <div
              onClick={() => document.getElementById('fileInputHidden').click()}
              className="cursor-pointer"
            >
              <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 16v-8m0 0-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20h12a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                คลิกหรือวางไฟล์ที่นี่
              </p>
              <p className="text-xs text-gray-500 mt-1">รองรับไฟล์รูปภาพทุกชนิด</p>
            </div>
            {selectedImage && (
              <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 truncate">
                📄 {selectedImage.name}
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedImage || isLoading}
              className="mt-5 w-full py-2.5 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40"
            >
              {isLoading ? "Analyzing..." : "Detect Objects"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700 px-4 py-3 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Summary */}
          {summaryEntries.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-semibold mb-2">Summary</h3>
              <div className="flex flex-wrap gap-2">
                {summaryEntries.map(([k, v]) => (
                  <span
                    key={k}
                    className="px-2.5 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  >
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* JSON */}
          {showJSON && detections.length > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 text-green-300 text-[11px] p-3 font-mono max-h-64 overflow-auto">
              <pre>{JSON.stringify(detections, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Right Panel (Canvas & Results) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 min-h-[420px] flex items-center justify-center">
            {!imagePreview && (
              <div className="text-center text-sm text-gray-400">
                (ยังไม่เลือกรูป)
              </div>
            )}
            {imagePreview && (
              <canvas
                ref={canvasRef}
                className="max-w-full w-full h-auto rounded-md shadow-sm transition"
                style={{ background: '#111' }}
              />
            )}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                <p className="mt-3 text-xs font-medium tracking-wide text-gray-600 dark:text-gray-300">
                  Processing...
                </p>
              </div>
            )}
          </div>

            {detections.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">
                    Results ({detections.length})
                  </h3>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    Hover to highlight
                  </span>
                </div>
                <ul className="space-y-2 max-h-72 overflow-auto pr-1 custom-scroll">
                  {detections.map((det, i) => (
                    <li
                      key={i}
                      onMouseEnter={() => handleHover(i)}
                      onMouseLeave={() => handleHover(null)}
                      className={`group relative border rounded-lg px-3 py-2 text-xs flex flex-col gap-1 transition
                        ${hoverIndex === i
                          ? 'border-blue-500 shadow-sm bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm"
                          style={{ background: getColor(det.class) }}
                        />
                        <span className="font-semibold">{det.class_name}</span>
                        <span className="text-[11px] text-gray-500">#{det.class}</span>
                        <span className="ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        [{det.bbox.map(v => v.toFixed(0)).join(', ')}]
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
