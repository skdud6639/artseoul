import { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface GalleryInfoProps {
  language: 'ko' | 'en';
}

export default function GalleryInfo({ language }: GalleryInfoProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section id="info" className="py-20 md:py-28 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-900 uppercase">
            {language === 'ko' ? '갤러리 안내' : 'Gallery Information'}
          </span>
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl font-light text-neutral-900 tracking-wide mb-16">
          {language === 'ko' ? '서울아트 방문 및 관람 안내' : 'Visit & Contact Information'}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Detailed text info (5 Columns) */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Hours & Schedule */}
            <div className="space-y-4">
              <h3 className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {language === 'ko' ? '관람 시간' : 'Opening Hours'}
              </h3>
              <div className="space-y-2 font-sans text-sm text-neutral-700 font-light leading-relaxed">
                <div className="flex justify-between border-b border-neutral-50 pb-2">
                  <span>{language === 'ko' ? '화요일 — 일요일' : 'Tuesday — Sunday'}</span>
                  <span className="font-medium text-neutral-900">10:00 AM — 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-neutral-50 pb-2 text-neutral-400">
                  <span>{language === 'ko' ? '매주 월요일' : 'Mondays'}</span>
                  <span className="font-medium uppercase">{language === 'ko' ? '휴관' : 'Closed'}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-50 pb-2 text-neutral-400">
                  <span>{language === 'ko' ? '공휴일' : 'National Holidays'}</span>
                  <span className="font-medium uppercase">{language === 'ko' ? '휴관' : 'Closed'}</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                * {language === 'ko' ? '일반 관람은 전석 무료로 진행되며 별도의 사전 예약이 필요 없습니다.' : 'General exhibitions are free admission and do not require prior reservation.'}
              </p>
            </div>

            {/* Location & Contact Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <h3 className="font-sans text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {language === 'ko' ? '갤러리 주소 및 연락처' : 'Address & Contact'}
              </h3>
              
              <div className="space-y-4 font-sans text-sm text-neutral-700 font-light">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {language === 'ko' ? '서울아트 갤러리' : 'Seoul Art Gallery'}
                    </p>
                    <p className="text-neutral-500 mt-1">
                      {language === 'ko' ? '서울특별시 종로구 삼청로 124 (삼청동)' : '124 Samcheong-ro, Jongno-gu, Seoul, Republic of Korea'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-500">{language === 'ko' ? '대표 번호' : 'Inquiries'}</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">+82 (0)2 730 0934</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-500">Email</p>
                    <p className="font-semibold text-neutral-900 mt-0.5">contact@seoulartgallery.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription (Private invitation list) */}
            <div className="p-6 bg-[#fcfcfc] border border-neutral-200/50 rounded-xs space-y-4">
              <h4 className="font-serif text-lg text-neutral-900 font-normal">
                {language === 'ko' ? '프라이빗 뉴스레터 구독' : 'Private Mailing List'}
              </h4>
              <p className="font-sans text-xs text-neutral-500 leading-relaxed font-light">
                {language === 'ko' 
                  ? '서울아트에서 개최하는 VIP 프리뷰 초청장, 신규 소장 출품작 리스트 및 특별 기획전 소식을 가장 먼저 받아보세요.' 
                  : 'Receive exclusive invitations to VIP private previews, newly acquired masterworks listings, and curator letters.'}
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={language === 'ko' ? '이메일 주소 입력' : 'Enter email address'}
                    className="flex-1 px-4 py-3 bg-white border border-neutral-200 text-xs focus:border-neutral-950 focus:outline-none rounded-sm"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-950 text-white font-sans text-[10px] font-bold tracking-widest uppercase px-5 py-3 hover:bg-neutral-800 transition-colors rounded-sm"
                  >
                    {language === 'ko' ? '구독' : 'Subscribe'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2.5 text-emerald-700 bg-emerald-50 px-4 py-3 border border-emerald-100 rounded-sm animate-fade-in">
                  <CheckCircle2 size={16} />
                  <span className="font-sans text-xs font-semibold">
                    {language === 'ko' ? '성공적으로 등록되었습니다. VIP 초청 메일을 발송해 드립니다.' : 'Subscribed! You are added to our VIP Guest list.'}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Architectural Map & Floor Plan (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Decorative Map Title */}
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                {language === 'ko' ? '갤러리 공간 구성 가이드' : 'Architectural Floor Plan'}
              </span>
              <span className="font-sans text-[9px] text-neutral-300 font-mono uppercase">Samcheong Headquarters</span>
            </div>

            {/* Floor plan blueprint - Pure elegant modern SVG */}
            <div className="bg-[#f9f9f9] border border-neutral-200/60 p-6 md:p-8 flex flex-col justify-center items-center shadow-xs">
              
              <svg viewBox="0 0 500 320" className="w-full max-w-[460px] text-neutral-800" fill="none">
                {/* Outer frame */}
                <rect x="10" y="10" width="480" height="300" rx="2" stroke="#d4d4d4" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Hall 1 (Currently exhibiting Waves of Silence) */}
                <g className="cursor-pointer group">
                  <rect x="30" y="30" width="200" height="150" fill="white" stroke="#111" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-neutral-50" />
                  <text x="130" y="95" className="font-serif text-sm font-light text-neutral-900" textAnchor="middle">
                    {language === 'ko' ? '기획전시실 1관' : 'Exhibition Hall 1'}
                  </text>
                  <text x="130" y="115" className="font-sans text-[9px] tracking-widest text-neutral-400 uppercase" textAnchor="middle">
                    {language === 'ko' ? '《고요의 파동》' : 'Waves of Silence'}
                  </text>
                  <circle cx="210" cy="50" r="4" fill="#111" className="animate-pulse" />
                </g>

                {/* Hall 2 (Selected Paintings) */}
                <g className="cursor-pointer group">
                  <rect x="250" y="30" width="220" height="110" fill="white" stroke="#e5e5e5" strokeWidth="1" className="transition-all duration-300 group-hover:stroke-neutral-800" />
                  <text x="360" y="80" className="font-serif text-xs font-light text-neutral-800" textAnchor="middle">
                    {language === 'ko' ? '기획전시실 2관' : 'Exhibition Hall 2'}
                  </text>
                  <text x="360" y="98" className="font-sans text-[8px] tracking-widest text-neutral-400 uppercase" textAnchor="middle">
                    {language === 'ko' ? '미학 소장 전시' : 'Permanent Collections'}
                  </text>
                </g>

                {/* Private Viewing Room (Collector Lounge) */}
                <g className="cursor-pointer group">
                  <rect x="250" y="160" width="220" height="110" fill="#1c1c1c" stroke="#1c1c1c" strokeWidth="1" className="transition-all duration-300 group-hover:bg-neutral-800" />
                  <text x="360" y="210" className="font-serif text-xs font-light text-white" textAnchor="middle">
                    {language === 'ko' ? '프라이빗 뷰잉룸 / VIP 라운지' : 'VIP Viewing Room'}
                  </text>
                  <text x="360" y="228" className="font-sans text-[8px] tracking-widest text-neutral-400 uppercase" textAnchor="middle">
                    {language === 'ko' ? '1:1 맞춤 컨설팅 세션' : 'Private Advisory'}
                  </text>
                </g>

                {/* Sculpture Garden / Courtyard */}
                <g className="cursor-pointer group">
                  <rect x="30" y="200" width="200" height="70" fill="white" stroke="#e5e5e5" strokeWidth="1" className="transition-all duration-300 group-hover:stroke-neutral-800" />
                  <text x="130" y="235" className="font-serif text-xs font-light text-neutral-800" textAnchor="middle">
                    {language === 'ko' ? '조각 야외 정원' : 'Outdoor Sculpture Garden'}
                  </text>
                  <text x="130" y="250" className="font-sans text-[8px] tracking-widest text-neutral-400 uppercase" textAnchor="middle">
                    {language === 'ko' ? '박찬욱 등 야외 상설전' : 'Sculptural Courtyard'}
                  </text>
                </g>

                {/* Architectural markers */}
                <line x1="30" y1="180" x2="230" y2="180" stroke="#f0f0f0" strokeWidth="1" />
                <line x1="230" y1="30" x2="230" y2="180" stroke="#f0f0f0" strokeWidth="1" />
              </svg>

              {/* Legend details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-6 border-t border-neutral-100 font-sans text-[10px] tracking-wider text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-white border border-neutral-900 block" />
                  <span>Hall 1 (Active)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-white border border-neutral-200 block" />
                  <span>Hall 2 (Permanent)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-neutral-900 block" />
                  <span>Private Lounge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border border-dashed border-neutral-300 block" />
                  <span>Sculpture Courtyard</span>
                </div>
              </div>

            </div>

            {/* Detail subtitle caption */}
            <p className="font-sans text-[10px] text-neutral-400 text-center leading-relaxed">
              {language === 'ko' 
                ? '서울아트 삼청 삼청로 본관은 지하 1층부터 지상 2층으로 구성된 한국의 전통 한옥과 현대 건축이 결합한 기하학적 예술 공간입니다.' 
                : 'Seoul Art Samcheong Headquarters blends clean-cut concrete structures with traditional Korean Hanok motifs.'}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
