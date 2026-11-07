import { useState, FormEvent } from 'react';
import { Artwork, InquiryFormState } from '../types';
import { X, Mail, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface InquiryModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'ko' | 'en';
}

export default function InquiryModal({ artwork, isOpen, onClose, language }: InquiryModalProps) {
  const [formState, setFormState] = useState<Partial<InquiryFormState>>({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email'
  });
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  if (!isOpen || !artwork) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Create an elegant randomized inquiry ID like SA-2026-X892A
    const randomId = `SA-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setInquiryId(randomId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormState({
      name: '',
      email: '',
      phone: '',
      message: '',
      preferredContact: 'email'
    });
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={handleReset}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative bg-[#fbfbfb] text-neutral-900 w-full max-w-2xl shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh] overflow-hidden rounded-sm animate-fade-in-up">
        
        {/* Header (Top Line) */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 bg-white">
          <div className="flex flex-col">
            <h3 className="font-serif text-lg tracking-wider text-neutral-900">
              {language === 'ko' ? '작품 소장 및 프라이빗 세션 문의' : 'Artwork Inquiry & Private Session'}
            </h3>
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-neutral-400 mt-0.5">
              Seoul Art Client Relations
            </span>
          </div>
          <button 
            onClick={handleReset}
            className="text-neutral-400 hover:text-neutral-900 p-1.5 hover:bg-neutral-50 transition-colors rounded-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content body */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {!submitted ? (
            <div className="space-y-8">
              
              {/* Selected Artwork Summary Card (Plaque design) */}
              <div className="flex flex-col sm:flex-row gap-6 bg-white p-5 border border-neutral-200/60 rounded-xs">
                <div className="w-20 h-24 sm:w-24 sm:h-32 bg-neutral-50 border border-neutral-100 flex-shrink-0">
                  <img 
                    src={artwork.image} 
                    alt={artwork.titleEn} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="font-sans text-[9px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                      {artwork.category} • Selected Masterpiece
                    </span>
                    <h4 className="font-serif text-xl text-neutral-900 mt-1 font-normal">
                      {language === 'ko' ? artwork.artist : artwork.artistEn}
                    </h4>
                    <p className="font-serif text-sm text-neutral-700 italic mt-0.5 font-light">
                      {language === 'ko' ? artwork.title : artwork.titleEn} ({artwork.year})
                    </p>
                    <p className="font-sans text-[11px] text-neutral-500 mt-1.5 font-light">
                      {language === 'ko' ? artwork.medium : artwork.mediumEn} • {artwork.dimensions}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="font-sans text-[10px] uppercase text-neutral-400 tracking-wider font-semibold">
                      {language === 'ko' ? '추정가 / 소장가' : 'Est. Price / Value'}
                    </span>
                    <span className="font-sans text-sm font-bold text-neutral-900">
                      {artwork.isInquireOnly ? (language === 'ko' ? '별도 문의 (Inquire Only)' : 'Inquire Only') : artwork.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inquiry form layout */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Two-Column Grid: Name, Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {language === 'ko' ? '고객 성함 *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name || ''}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:border-neutral-900 focus:outline-none transition-colors rounded-sm text-neutral-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {language === 'ko' ? '이메일 주소 *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email || ''}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="client@example.com"
                      className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:border-neutral-900 focus:outline-none transition-colors rounded-sm text-neutral-800"
                    />
                  </div>
                </div>

                {/* Phone contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {language === 'ko' ? '전화번호' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={formState.phone || ''}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:border-neutral-900 focus:outline-none transition-colors rounded-sm text-neutral-800"
                    />
                  </div>

                  {/* Preferred contact channel */}
                  <div className="space-y-1.5">
                    <label className="block font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {language === 'ko' ? '선호 연락 채널 *' : 'Preferred Contact *'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, preferredContact: 'email' })}
                        className={`py-3 text-xs font-semibold tracking-wider transition-all duration-300 rounded-sm flex items-center justify-center space-x-2 border ${
                          formState.preferredContact === 'email' 
                            ? 'bg-neutral-950 text-white border-neutral-950' 
                            : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                        }`}
                      >
                        <Mail size={12} />
                        <span>EMAIL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, preferredContact: 'phone' })}
                        className={`py-3 text-xs font-semibold tracking-wider transition-all duration-300 rounded-sm flex items-center justify-center space-x-2 border ${
                          formState.preferredContact === 'phone' 
                            ? 'bg-neutral-950 text-white border-neutral-950' 
                            : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                        }`}
                      >
                        <Phone size={12} />
                        <span>PHONE</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message / Curation comments */}
                <div className="space-y-1.5">
                  <label className="block font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    {language === 'ko' ? '문의 내용 및 요청 사항' : 'Your Message / Inquiry Detail'}
                  </label>
                  <textarea
                    rows={4}
                    value={formState.message || ''}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder={language === 'ko' 
                      ? '작품 소장 여부, 작품 가격, 또는 직접 갤러리 예약 관람 요청 내용을 입력해 주세요.' 
                      : 'Request pricing list, schedule an in-person private viewing appointment, or add notes on your collection.'}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 text-sm focus:border-neutral-900 focus:outline-none transition-colors rounded-sm text-neutral-800 resize-none"
                  />
                </div>

                {/* Disclaimer / Secure badge */}
                <div className="flex items-center space-x-2.5 text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                  <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>
                    {language === 'ko' 
                      ? '서울아트의 모든 작품 거래 정보 및 개인정보는 철저한 대외비로 보장됩니다.' 
                      : 'All collections data and client details are strictly guarded in absolute NDA/Confidentiality.'}
                  </span>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-neutral-950 text-white font-sans text-xs font-medium tracking-[0.25em] uppercase py-4 transition-all duration-300 hover:bg-neutral-800 active:scale-95 shadow-lg"
                  >
                    {language === 'ko' ? '프라이빗 문의 접수하기' : 'Submit Private Inquiry'}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            // Elegant Success State
            <div className="text-center py-12 px-4 space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-neutral-950 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={32} />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-neutral-900 font-light">
                  {language === 'ko' ? '감사합니다. 문의가 성공적으로 접수되었습니다.' : 'Inquiry Successfully Received'}
                </h4>
                <p className="font-sans text-xs text-neutral-400 uppercase tracking-widest">
                  {language === 'ko' ? '서울아트 프라이빗 세션 파트너' : 'Seoul Art Client Services Group'}
                </p>
              </div>

              <div className="max-w-md mx-auto bg-white p-5 border border-neutral-200/80 space-y-3 rounded-xs text-left">
                <div className="flex justify-between items-center text-[11px] font-sans text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2.5">
                  <span>Inquiry ID</span>
                  <span className="font-mono font-semibold text-neutral-900">{inquiryId}</span>
                </div>
                <div className="text-xs text-neutral-600 space-y-2 leading-relaxed font-light">
                  <p>
                    {language === 'ko' 
                      ? `귀하께서 문의하신 《${artwork.title}》 작품에 대한 상세 설명서와 소장가 책정 가이드가 기재된 프라이빗 포트폴리오를 작성 중입니다.` 
                      : `A private catalog and valuation report for "${artwork.titleEn}" are being prepared for you.`}
                  </p>
                  <p>
                    {language === 'ko' 
                      ? `입력하신 연락처(${formState.preferredContact === 'email' ? formState.email : formState.phone})로 24시간 이내에 갤러리 파트너가 직접 개별 연락을 드리겠습니다.` 
                      : `An art advisor will reach out to you within 24 hours via your preferred channel: ${formState.preferredContact?.toUpperCase()}.`}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleReset}
                  className="bg-neutral-950 text-white font-sans text-xs font-semibold tracking-widest uppercase px-8 py-3.5 hover:bg-neutral-800 transition-colors rounded-xs"
                >
                  {language === 'ko' ? '닫기' : 'Return to Gallery'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
