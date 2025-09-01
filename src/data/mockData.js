export const mockData = {
  "vehicle_types": [
    { "ID_Type": 1, "Name_Thai": "รถยนต์" },
    { "ID_Type": 2, "Name_Thai": "รถจักรยานยนต์" },
    { "ID_Type": 3, "Name_Thai": "รถบรรทุก" },
    { "ID_Type": 4, "Name_Thai": "รถตู้" }
  ],
  "cameras": [
    { "ID_Camera": 1, "Camera_Name": "กล้องทางเข้า A", "Location": "ถนนสายหลัก", "Zone": "โซนเหนือ", "RTSP_Camera": "rtsp://cam1/stream" },
    { "ID_Camera": 2, "Camera_Name": "กล้องทางเข้า B", "Location": "สี่แยกใหญ่", "Zone": "โซนใต้", "RTSP_Camera": "rtsp://cam2/stream" }
  ],
  "detected_vehicles": [
    { "ID_Car": 101, "ID_Type": 1, "ID_Camera": 1, "Time_Stamp": "2025-07-21T08:15:00", "Confidence_Score": 0.95 },
    { "ID_Car": 102, "ID_Type": 2, "ID_Camera": 2, "Time_Stamp": "2025-07-21T09:30:00", "Confidence_Score": 0.87 },
    { "ID_Car": 103, "ID_Type": 3, "ID_Camera": 1, "Time_Stamp": "2025-07-21T10:05:00", "Confidence_Score": 0.92 },
    { "ID_Car": 104, "ID_Type": 1, "ID_Camera": 2, "Time_Stamp": "2025-07-20T14:20:00", "Confidence_Score": 0.81 },
    { "ID_Car": 105, "ID_Type": 4, "ID_Camera": 1, "Time_Stamp": "2025-07-20T15:45:00", "Confidence_Score": 0.76 }
  ],
  "total_daily": [
    {
      "date": "2025-07-21",
      "vehicle_counts": {
        "รถยนต์": 10,
        "รถจักรยานยนต์": 15,
        "รถบรรทุก": 5,
        "รถตู้": 3
      }
    },
    {
      "date": "2025-07-20",
      "vehicle_counts": {
        "รถยนต์": 8,
        "รถจักรยานยนต์": 12,
        "รถบรรทุก": 4,
        "รถตู้": 2
      }
    }
  ],
  "total_weekly": [
    {
      "week": "2025-W29",
      "vehicle_counts": {
        "รถยนต์": 55,
        "รถจักรยานยนต์": 70,
        "รถบรรทุก": 25,
        "รถตู้": 12
      }
    }
  ]
}
