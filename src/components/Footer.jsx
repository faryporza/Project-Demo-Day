import React from "react";
import { FiFacebook, FiTwitter, FiGithub, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-6 py-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">
              Vehicle Detection and Counting for Thai Roads using Deep Learning
            </h3>
            <p className="text-sm leading-relaxed">
              การพัฒนาโมเดลการรู้จำและนับจำนวนยานพาหนะบนท้องถนนในประเทศไทยโดยใช้การเรียนรู้เชิงลึก
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-md font-semibold mb-3 text-white">
              ลิงก์ที่เป็นประโยชน์
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  คู่มือการใช้งาน
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  การสนับสนุน
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  ข้อมูลทางเทคนิค
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-md font-semibold mb-3 text-white">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiMail /> 66025694@up.ac.th
              </li>
              <li>ที่อยู่: มหาวิทยาลัยพะเยา, ประเทศไทย</li>
            </ul>
            {/* Socials */}
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-sky-500 transition-colors"
              >
                <FiTwitter />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors"
              >
                <FiGithub />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vehicle Detection and Counting for Thai Roads using Deep Learning. สงวนลิขสิทธิ์ทั้งหมด.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
