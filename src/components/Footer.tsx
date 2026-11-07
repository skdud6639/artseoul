import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import GalleryLogo from './GalleryLogo';

export default function Footer({ language }: { language: 'ko' | 'en' }) {
  return (
    <footer className="bg-[#f2f2f2] border-t border-neutral-200/60 py-16 text-neutral-500 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-neutral-300/40 pb-12">
          {/* Branding Column */}
          <div className="md:col-span-5 space-y-4">
            <GalleryLogo className="h-8 w-auto text-neutral-800" />
            <p className="max-w-xs font-light text-neutral-500 text-[11px] leading-relaxed">
              {language === 'ko'
                ? '정제된 미니멀리즘과 절제된 공간 미학을 바탕으로, 동시대 현대 미술의 깊이 있는 예술적 담론과 마스터피스를 선보이는 갤러리입니다.'
                : 'Inspired by refined minimalist aesthetics and restrained space, showcasing contemporary art discourse and curated masterworks.'}
            </p>
          </div>

          {/* Links columns */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-neutral-800 text-[10px] tracking-widest uppercase">
              {language === 'ko' ? '기획 프로젝트' : 'Gallery Divisions'}
            </h4>
            <ul className="space-y-2 font-light text-neutral-400">
              <li>
                <Link
                  to="/exhibitions"
                  className="hover:text-neutral-800 transition-colors"
                >
                  {language === 'ko' ? '현재 기획 전시' : 'Solo Exhibitions'}
                </Link>
              </li>
              <li>
                <Link
                  to="/artworks"
                  className="hover:text-neutral-800 transition-colors"
                >
                  {language === 'ko'
                    ? '소장 출품작 마스터피스'
                    : 'Acquisitions'}
                </Link>
              </li>
              <li>
                <Link
                  to="/viewing-room"
                  className="hover:text-neutral-800 transition-colors"
                >
                  {language === 'ko'
                    ? '프라이빗 3D 버추얼 룸'
                    : 'Scale Simulator'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Location info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-semibold text-neutral-800 text-[10px] tracking-widest uppercase">
              {language === 'ko' ? '대표 사무소' : 'Headquarters'}
            </h4>
            <p className="font-light text-neutral-400 text-[11px] leading-relaxed">
              {language === 'ko'
                ? '서울특별시 종로구 삼청로 124 (삼청동) 서울아트빌딩'
                : 'Seoul Art Building, 124 Samcheong-ro, Jongno-gu, Seoul, South Korea'}
              <br />
              T. +82 (0)2 730 0934 | F. +82 (0)2 730 0935
            </p>

            {/* Social Channels */}
            <div className="flex space-x-3 pt-1">
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
                title="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
                title="Facebook"
              >
                <Facebook size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright row */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-neutral-400 text-[10px] tracking-wider gap-4">
          <span>&copy; 2026 SEOUL ART GALLERY. ALL RIGHTS RESERVED.</span>
          <span className="font-light uppercase">
            {language === 'ko'
              ? '기획자 및 큐레이터 정보: 서울아트 클라이언트 릴레이션'
              : 'Curation Desk: Seoul Art Client Services'}
          </span>
        </div>
      </div>
    </footer>
  );
}
