import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">YOLO Detection System</h3>
            <p className="text-gray-400 text-sm">
              ระบบตรวจจับวัตถุแบบเรียลไทม์ด้วยเทคโนโลยี AI และ Computer Vision
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">ลิงก์ที่เป็นประโยชน์</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  คู่มือการใช้งาน
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  การสนับสนุน
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  ข้อมูลทางเทคนิค
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>อีเมล: support@yolo-detection.com</li>
              <li>โทรศัพท์: 02-xxx-xxxx</li>
              <li>ที่อยู่: กรุงเทพมหานคร, ประเทศไทย</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 YOLO Detection System. สงวนลิขสิทธิ์ทั้งหมด.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
