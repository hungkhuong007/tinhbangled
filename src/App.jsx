import React, { useState } from 'react';
import Calculator from './Calculator';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="w-full max-w-[420px] bg-background-app text-gray-100 min-h-[100dvh] flex flex-col font-sans relative shadow-2xl shadow-primary/10 border-x border-border mx-auto overflow-hidden">
      
      {/* Header Section */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-background-app/85 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shadow-primary/20">
            <span className="material-symbols-outlined text-primary text-xl">architecture</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-50 uppercase bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">LED Design</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-primary transition-colors focus:outline-none">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="size-9 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-background-app overflow-hidden bg-surface relative">
            <img 
              className="w-full h-full object-cover" 
              alt="User profile avatar" 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=d4af37" 
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        
        {activeTab === 'home' && (
          <div className="animate-in slide-in-from-left-4 fade-in duration-300">
            {/* Welcome Section */}
            <section className="px-5 pt-6">
              <div className="bg-gradient-to-br from-surface to-background-app border border-border rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-45 duration-700">
                   <span className="material-symbols-outlined text-9xl text-primary">diamond</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-primary font-bold text-xl tracking-wide">Chào Bạn!</h3>
                  <p className="text-sm text-gray-400 mt-1.5 font-light">Hôm nay năng lượng Kim tài vượng.<br/>Chúc một ngày làm việc đắc lộc.</p>
                </div>
              </div>
            </section>

            {/* Quick Tools Section */}
            <section className="px-5 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-200 uppercase tracking-wider text-xs">Công cụ kỹ thuật</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                
                <div 
                  onClick={() => setActiveTab('calculator')}
                  className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">Tính Kích Thước</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Tấm LED & Điểm ảnh</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('calculator')}
                  className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">electrical_services</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">Nguồn Cấp</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Ước tính công suất</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('calculator')}
                  className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">grid_view</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">Cắt Sắt</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Sơ đồ khung viền</p>
                  </div>
                </div>

                <div 
                   onClick={() => setActiveTab('calculator')}
                   className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[20px]">request_quote</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm">Báo Giá</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Theo mét vuông</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Recent Projects Section */}
            <section className="px-5 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-200 uppercase tracking-wider text-xs">Lịch sử thiết kế</h2>
                <button className="text-primary text-xs font-semibold hover:underline">Xem lịch sử</button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 snap-x">
                
                {/* Project Card 1 */}
                <div className="min-w-[260px] snap-center bg-surface rounded-2xl border border-border overflow-hidden shadow-lg shadow-black/40">
                  <div className="h-28 w-full bg-primary/5 relative border-b border-border/50">
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent">
                      <span className="material-symbols-outlined text-5xl text-primary/30">wall_art</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-100">Bảng hiệu P2.5 Indoor</h3>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Ngang 5.76m x Cao 3.84m</p>
                    <div className="mt-4 flex justify-between items-center border-t border-border pt-3">
                      <span className="text-[10px] uppercase font-bold text-primary px-2.5 py-1 rounded bg-primary/10 tracking-widest">Đã xem</span>
                      <span className="text-[10px] text-gray-500 font-medium">Hôm qua</span>
                    </div>
                  </div>
                </div>

                {/* Project Card 2 */}
                <div className="min-w-[260px] snap-center bg-surface rounded-2xl border border-border overflow-hidden shadow-lg shadow-black/40">
                  <div className="h-28 w-full bg-primary/5 relative border-b border-border/50">
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent">
                      <span className="material-symbols-outlined text-5xl text-primary/30">storefront</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-100">Màn hình P4 Outdoor</h3>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Ngang 3.2m x Cao 1.6m</p>
                    <div className="mt-4 flex justify-between items-center border-t border-border pt-3">
                      <span className="text-[10px] uppercase font-bold text-gray-300 px-2.5 py-1 rounded bg-gray-700 tracking-widest">Bản thảo</span>
                      <span className="text-[10px] text-gray-500 font-medium">3 ngày trước</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* Màn hình Calculator */}
        {activeTab === 'calculator' && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 h-full">
            <Calculator />
          </div>
        )}

      </main>

      {/* Floating Action Button */}
      {activeTab === 'home' && (
        <div className="absolute right-5 bottom-24 z-30">
          <button 
           onClick={() => setActiveTab('calculator')}
           className="size-14 bg-gradient-to-br from-primary to-primary-dark text-black rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-3xl font-light">add</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-background-app/95 backdrop-blur-xl border-t border-border pb-safe">
        <div className="flex items-center justify-between px-6 py-3">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="text-[10px] font-medium tracking-wide">Trang chủ</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'calculator' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'calculator' ? "'FILL' 1" : "'FILL' 0" }}>calculate</span>
            <span className="text-[10px] font-medium tracking-wide">Tính Toán</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'projects' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'projects' ? "'FILL' 1" : "'FILL' 0" }}>folder_open</span>
            <span className="text-[10px] font-medium tracking-wide">Hồ sơ</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
            <span className="text-[10px] font-medium tracking-wide">Cài đặt</span>
          </button>
        </div>
      </nav>
      
    </div>
  );
}
