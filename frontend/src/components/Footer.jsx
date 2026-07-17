import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0a1a] text-gray-400 border-t border-purple-950/40 pt-16 pb-8 relative overflow-hidden z-10">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-right">
        
        {/* Column 1: Brand and Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-start">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6320ee] to-[#863bff] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30">
              <span className="text-white font-black text-lg leading-none">D</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              DigiStore
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 leading-relaxed">
            بزرگ‌ترین بازارچه تخصصی چندفروشندگی جهت عرضه، خرید و تحویل آنی لایسنس‌های نرم‌افزاری، اشتراک پلتفرم‌های بین‌المللی و دوره‌های آموزشی ویدئویی تحت نظارت دپارتمان مهندسی نرم‌افزار.
          </p>
          <div className="flex gap-3 pt-2">
            <span className="w-8 h-8 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-center text-sm cursor-pointer hover:bg-[#6320ee] hover:text-white transition-all">✈️</span>
            <span className="w-8 h-8 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-center text-sm cursor-pointer hover:bg-[#6320ee] hover:text-white transition-all">📸</span>
            <span className="w-8 h-8 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-center text-sm cursor-pointer hover:bg-[#6320ee] hover:text-white transition-all">💻</span>
          </div>
        </div>

        {/* Column 2: Consolidated Quick Links & Dashboards */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-r-2 border-[#6320ee] pr-2.5">
            ناوبری و پنل‌ها
          </h4>
          <ul className="space-y-2.5 text-xs font-bold">
            <li>
              <Link to="/marketplace" className="hover:text-[#863bff] transition-colors flex items-center gap-1.5">
                <span>🏪</span> بازارچه محصولات دیجیتال
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#863bff] transition-colors flex items-center gap-1.5">
                <span>🛒</span> سبد خرید و فاکتور
              </Link>
            </li>
            <li>
              <Link to="/buyer/dashboard" className="hover:text-[#863bff] transition-colors flex items-center gap-1.5">
                <span>📚</span> کتابخانه و لایسنس‌های من
              </Link>
            </li>
            <li>
              <Link to="/seller/dashboard" className="hover:text-[#863bff] transition-colors flex items-center gap-1.5">
                <span>📈</span> پنل مدیریت فروشندگان
              </Link>
            </li>
            <li>
              <Link to="/register?role=SELLER" className="hover:text-[#863bff] transition-colors flex items-center gap-1.5">
                <span>👨‍🏫</span> ثبت‌نام مدرسان / تأمین‌کنندگان
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Location and Neshan Maps Embed */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-r-2 border-[#6320ee] pr-2.5">
            آدرس دانشکده
          </h4>
          <p className="text-[11px] font-bold text-gray-400 leading-relaxed mb-3">
            تهران، اوین، میدان شهریاری، دانشگاه شهید بهشتی، دانشکده مهندسی و علوم کامپیوتر
          </p>
          {/* SBU Faculty of Computer Engineering Neshan Maps Iframe */}
          <div className="w-full h-28 rounded-xl overflow-hidden border border-purple-900/40 shadow-inner">
            <iframe 
              src="https://neshan.org/maps/places/3a16780a91ab697a68fbf2fe9026f8b3#c35.802-51.394-19z-0p" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="SBU Computer Engineering Faculty Neshan Map"
            ></iframe>
          </div>
        </div>

        {/* Column 4: Development Team (SBU) */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-r-2 border-[#6320ee] pr-2.5">
            تیم مهندسی نرم‌افزار SBU
          </h4>
          <ul className="space-y-2 text-[11px] font-semibold text-gray-500">
            <li className="flex justify-between items-center bg-purple-950/10 p-2 rounded-xl border border-purple-950/30">
              <span className="font-black text-gray-300">روزبه سلطانی</span>
              <span className="font-mono text-[10px] text-purple-400">402243072</span>
            </li>
            <li className="flex justify-between items-center bg-purple-950/10 p-2 rounded-xl border border-purple-950/30">
              <span className="font-black text-gray-300">عرفان پنجه‌شاهی</span>
              <span className="font-mono text-[10px] text-purple-400">402243046</span>
            </li>
            <li className="flex justify-between items-center bg-purple-950/10 p-2 rounded-xl border border-purple-950/30">
              <span className="font-black text-gray-300">ماهان بانشی</span>
              <span className="font-mono text-[10px] text-purple-400">402243042</span>
            </li>
            <li className="flex justify-between items-center bg-purple-950/10 p-2 rounded-xl border border-purple-950/30">
              <span className="font-black text-gray-300">سید محمدمهدی میرمطهری</span>
              <span className="font-mono text-[10px] text-purple-400">402243106</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-purple-950/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right">
        <p className="text-[10px] font-bold text-gray-600">
          این پروژه به عنوان مستند نهایی فاز سوم درس مهندسی نرم‌افزار توسعه یافته است.
        </p>
        <p className="text-[10px] font-black text-gray-500 tracking-wide font-mono">
          © 2026 DigiStore Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}