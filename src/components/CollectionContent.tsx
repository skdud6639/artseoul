import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { ARTWORKS } from '../data';
import { Artwork } from '../types';
import ArtworkGrid from './ArtworkGrid';
import InteractiveViewingRoom from './InteractiveViewingRoom';
import InquiryModal from './InquiryModal';

export default function CollectionContent({
  language,
  viewingRoom = false,
}: {
  language: 'ko' | 'en';
  viewingRoom?: boolean;
}) {
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [detailArtwork, setDetailArtwork] = useState<Artwork | null>(null);
  const handleInquireClick = (artwork: Artwork) => {
    setInquiryArtwork(artwork);
    setIsInquiryModalOpen(true);
  };
  return (
    <>
      {viewingRoom ? (
        <InteractiveViewingRoom
          artworks={ARTWORKS}
          language={language}
          onInquireClick={handleInquireClick}
        />
      ) : (
        <ArtworkGrid
          artworks={ARTWORKS}
          language={language}
          onArtworkClick={setDetailArtwork}
          onInquireClick={handleInquireClick}
        />
      )}
      <InquiryModal
        artwork={inquiryArtwork}
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        language={language}
      />
      {/* 10. Selected Artwork Details Modal (Pristine curator-level detail review) */}
      {detailArtwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop overlay */}
          <div
            onClick={() => setDetailArtwork(null)}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <div className="relative bg-white text-neutral-900 w-full max-w-4xl shadow-2xl border border-neutral-100 flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-sm animate-fade-in-up">
            {/* Close button inside modal */}
            <button
              onClick={() => setDetailArtwork(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 text-neutral-950 p-2 border border-neutral-100 hover:bg-neutral-100 transition-colors rounded-sm shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Left Column: Visual Area (Hangs painting with high-end border) */}
            <div className="md:w-1/2 bg-[#f4f4f4] p-8 flex items-center justify-center border-r border-neutral-100 overflow-hidden min-h-[300px]">
              <div className="relative shadow-xl max-h-[50vh] max-w-[90%] border border-neutral-200/50">
                <img
                  src={detailArtwork.image}
                  alt={detailArtwork.titleEn}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] w-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column: Detailed Curation Label */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                {/* Artist name & Year */}
                <div>
                  <p className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {language === 'ko'
                      ? '출품작 상세 보기'
                      : 'Acquisitions Catalogue'}
                  </p>
                  <h3 className="font-serif text-3xl text-neutral-900 font-light mt-1.5">
                    {language === 'ko'
                      ? detailArtwork.artist
                      : detailArtwork.artistEn}
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-400 font-light uppercase tracking-wider mt-0.5">
                    Represented Contemporary Master
                  </p>
                </div>

                {/* Title & Technical specifications */}
                <div className="border-t border-b border-neutral-100 py-5 space-y-2">
                  <h4 className="font-serif text-lg italic text-neutral-800">
                    {language === 'ko'
                      ? detailArtwork.title
                      : detailArtwork.titleEn}
                  </h4>

                  <div className="space-y-1.5 font-sans text-xs text-neutral-500 font-light leading-relaxed">
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '매체 및 기법:' : 'Medium:'}
                      </strong>{' '}
                      {language === 'ko'
                        ? detailArtwork.medium
                        : detailArtwork.mediumEn}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '크기 / 규격:' : 'Dimensions:'}
                      </strong>{' '}
                      {detailArtwork.dimensions}
                    </p>
                    <p>
                      <strong className="font-semibold text-neutral-700">
                        {language === 'ko' ? '제작 연도:' : 'Year of Creation:'}
                      </strong>{' '}
                      {detailArtwork.year}
                    </p>
                  </div>
                </div>

                {/* Curator commentary note */}
                <div className="space-y-2">
                  <h5 className="font-sans text-[10px] font-bold text-neutral-800 uppercase tracking-widest">
                    {language === 'ko'
                      ? '작품 평론 및 해설'
                      : 'Curatorial Commentary'}
                  </h5>
                  <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light whitespace-pre-line">
                    {language === 'ko'
                      ? detailArtwork.description
                      : detailArtwork.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="block font-sans text-[9px] text-neutral-400 uppercase tracking-widest">
                    {language === 'ko' ? '추정 소장가' : 'Estimated Value'}
                  </span>
                  <span className="font-sans text-base font-bold text-neutral-900">
                    {detailArtwork.isInquireOnly
                      ? language === 'ko'
                        ? '별도 가격 문의'
                        : 'Inquire Only'
                      : detailArtwork.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const artwork = detailArtwork;
                    setDetailArtwork(null);
                    handleInquireClick(artwork);
                  }}
                  className="bg-neutral-950 text-white font-sans text-xs font-semibold tracking-widest uppercase px-6 py-3.5 hover:bg-neutral-800 transition-colors rounded-sm flex items-center space-x-2"
                >
                  <Mail size={12} />
                  <span>{language === 'ko' ? '소장 문의' : 'Inquire'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
