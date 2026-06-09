import React from 'react';
import { Award } from 'lucide-react';
import { HeroSectionAction } from './hero-section-action';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] py-8 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#573e1c]/10 rounded-full text-[#573e1c] text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                <span>100% Sản phẩm sạch, không chất bảo quản</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#573e1c] leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                Bánh Tráng gạo truyền thống
              </h1>
              <p className="text-xl text-[#8b6a42] leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                Trải nghiệm các loại bánh nhúng giòn rụm, ngon miệng. Giữ được hương vị truyền thống của bánh tráng gạo nhúng nước Bình Định
              </p>
            </div>
            <HeroSectionAction />
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative z-10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#573e1c]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src='/AP-logo.jpg'
                alt="Bánh Tráng gạo truyền thống"
                className="relative rounded-2xl shadow-2xl w-full h-[380px] lg:h-[540px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-[#573e1c] rounded-2xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-[#8b6a42] rounded-2xl -z-20 transition-transform duration-500 delay-100 group-hover:-translate-x-2 group-hover:translate-y-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}