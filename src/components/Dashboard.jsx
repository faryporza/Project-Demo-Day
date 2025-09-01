import React, { useState, useEffect } from 'react';
import { mockData } from '../data/mockData.js';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { FiPieChart, FiBarChart2, FiActivity, FiCamera, FiClock, FiHash, FiTag } from 'react-icons/fi';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState('2025-07-21');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Get vehicle type name by ID
  const getVehicleTypeName = (typeId) => {
    const vehicleType = mockData.vehicle_types.find(type => type.ID_Type === typeId);
    return vehicleType ? vehicleType.Name_Thai : 'ไม่ระบุ';
  };

  // Get camera name by ID
  const getCameraName = (cameraId) => {
    const camera = mockData.cameras.find(cam => cam.ID_Camera === cameraId);
    return camera ? camera.Camera_Name : 'ไม่ระบุ';
  };

  // Filter vehicles based on selected filters
  useEffect(() => {
    let filtered = mockData.detected_vehicles;

    if (selectedDate !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.Time_Stamp.startsWith(selectedDate)
      );
    }

    if (selectedCamera !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.ID_Camera === parseInt(selectedCamera)
      );
    }

    if (selectedVehicleType !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.ID_Type === parseInt(selectedVehicleType)
      );
    }

    setFilteredVehicles(filtered);
  }, [selectedDate, selectedCamera, selectedVehicleType]);

  const dailyStats = mockData.total_daily.find(d => d.date === selectedDate)?.vehicle_counts || {};
  const weeklyStats = mockData.total_weekly[0]?.vehicle_counts || {};
  const formatDateTime = (ts) => new Date(ts).toLocaleString('th-TH');

  // ===== Derived data for charts =====
  const pieData = Object.keys(dailyStats).map(k => ({ name: k, value: dailyStats[k] }));
  const weeklyBarData = Object.keys(weeklyStats).map(k => ({ name: k, value: weeklyStats[k] }));

  // Hourly trend (count per hour)
  const hourlyBuckets = {};
  filteredVehicles.forEach(v => {
    const h = new Date(v.Time_Stamp).getHours();
    hourlyBuckets[h] = (hourlyBuckets[h] || 0) + 1;
  });
  const lineHourlyData = Object.keys(hourlyBuckets)
    .sort((a,b)=>a-b)
    .map(h => ({ hour: `${h.padStart ? h.padStart(2,'0') : ('0'+h).slice(-2)}:00`, count: hourlyBuckets[h] }));

  // Metric cards (daily + weekly)
  const totalsDaily = Object.values(dailyStats).reduce((a,b)=>a+b,0);
  const totalsWeekly = Object.values(weeklyStats).reduce((a,b)=>a+b,0);
  const metricCards = [
    { label: 'รวมวันนี้', value: totalsDaily, icon: <FiPieChart />, color: 'from-blue-500 to-indigo-600' },
    { label: 'รวมสัปดาห์นี้', value: totalsWeekly, icon: <FiBarChart2 />, color: 'from-emerald-500 to-teal-600' },
    { label: 'บันทึกรถ (หลังกรอง)', value: filteredVehicles.length, icon: <FiActivity />, color: 'from-purple-500 to-pink-500' },
  ];

  const COLORS = ['#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6','#0EA5E9','#F472B6'];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          แผงควบคุมระบบตรวจจับยานพาหนะ
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          สรุปสถิติและภาพรวมการตรวจจับจากโมเดล
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {metricCards.map((m,i)=>(
          <div key={i} className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-r ${m.color} text-white shadow`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
            </div>
            <div className="flex items-start justify-between">
              <div className="text-3xl">{m.icon}</div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-white/70">{m.label}</p>
                <p className="text-2xl font-semibold mt-1">{m.value || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">ตัวกรอง</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">วันที่</label>
            <select
              value={selectedDate}
              onChange={e=>setSelectedDate(e.target.value)}
              className="w-full text-sm p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">ทั้งหมด</option>
              <option value="2025-07-21">21 กรกฎาคม 2025</option>
              <option value="2025-07-20">20 กรกฎาคม 2025</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">กล้อง</label>
            <select
              value={selectedCamera}
              onChange={e=>setSelectedCamera(e.target.value)}
              className="w-full text-sm p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">ทั้งหมด</option>
              {mockData.cameras.map(c=>(
                <option key={c.ID_Camera} value={c.ID_Camera}>{c.Camera_Name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">ประเภทยานพาหนะ</label>
            <select
              value={selectedVehicleType}
              onChange={e=>setSelectedVehicleType(e.target.value)}
              className="w-full text-sm p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">ทั้งหมด</option>
              {mockData.vehicle_types.map(v=>(
                <option key={v.ID_Type} value={v.ID_Type}>{v.Name_Thai}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-blue-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
              สัดส่วนยานพาหนะ (วันนี้)
            </h3>
          </div>
          <div className="flex-1">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    stroke="#fff"
                    strokeWidth={1}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-xs text-gray-400">
                ไม่มีข้อมูล
              </div>
            )}
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-emerald-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
              ยานพาหนะรายสัปดาห์
            </h3>
          </div>
          <div className="flex-1">
            {weeklyBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-xs text-gray-400">
                ไม่มีข้อมูล
              </div>
            )}
          </div>
        </div>

        {/* Hourly Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="text-purple-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
              เทรนด์จำนวนรถรายชั่วโมง
            </h3>
          </div>
          <div className="flex-1">
            {lineHourlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-gray-400">
                ไม่มีข้อมูล
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicles Table / Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-10">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-4">
          รายการยานพาหนะที่ตรวจพบ ({filteredVehicles.length})
        </h3>
        {filteredVehicles.length === 0 && (
          <div className="text-center text-xs text-gray-400 py-10">ไม่พบข้อมูลตามเงื่อนไข</div>
        )}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs uppercase">
                <th className="px-4 py-2 text-left">รหัส</th>
                <th className="px-4 py-2 text-left">ประเภท</th>
                <th className="px-4 py-2 text-left">กล้อง</th>
                <th className="px-4 py-2 text-left">เวลา</th>
                <th className="px-4 py-2 text-left">ความแม่นยำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVehicles.map(v=>(
                <tr key={v.ID_Car} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-2">{v.ID_Car}</td>
                  <td className="px-4 py-2">{getVehicleTypeName(v.ID_Type)}</td>
                  <td className="px-4 py-2">{getCameraName(v.ID_Camera)}</td>
                  <td className="px-4 py-2">{formatDateTime(v.Time_Stamp)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      v.Confidence_Score >= 0.9 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      : v.Confidence_Score >= 0.8 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {(v.Confidence_Score*100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filteredVehicles.map(v=>(
            <div key={v.ID_Car} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  <FiHash /> {v.ID_Car}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  v.Confidence_Score >= 0.9 ? 'bg-green-500/20 text-green-600'
                  : v.Confidence_Score >= 0.8 ? 'bg-yellow-500/20 text-yellow-600'
                  : 'bg-red-500/20 text-red-600'
                }`}>
                  {(v.Confidence_Score*100).toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1"><FiTag className="opacity-60"/>{getVehicleTypeName(v.ID_Type)}</div>
                <div className="flex items-center gap-1"><FiCamera className="opacity-60"/>{getCameraName(v.ID_Camera)}</div>
                <div className="flex items-center gap-1 col-span-2"><FiClock className="opacity-60"/>{formatDateTime(v.Time_Stamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-4">
          สถานะกล้อง
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {mockData.cameras.map(cam=>(
            <div key={cam.ID_Camera} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{cam.Camera_Name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-300">ออนไลน์</span>
              </div>
              <div className="text-[11px] space-y-1 text-gray-600 dark:text-gray-400">
                <div><span className="font-medium">ตำแหน่ง:</span> {cam.Location}</div>
                <div><span className="font-medium">โซน:</span> {cam.Zone}</div>
                <div className="truncate"><span className="font-medium">RTSP:</span> {cam.RTSP_Camera}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
