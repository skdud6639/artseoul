import { useEffect, useRef, useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Artwork } from '../types';
interface InquiryModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'ko' | 'en';
}
export default function InquiryModal({
  artwork,
  isOpen,
  onClose,
  language,
}: InquiryModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState(false);
  const ko = language === 'ko';
  useEffect(() => {
    if (isOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [isOpen]);
  const close = () => {
    setPreview(false);
    onClose();
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPreview(true);
  };
  return (
    <dialog
      ref={dialog}
      className="inquiry-dialog"
      aria-labelledby="inquiry-title"
      onClose={close}
    >
      <button
        className="dialog-close"
        onClick={close}
        aria-label={ko ? '닫기' : 'Close'}
      >
        <X />
      </button>
      {artwork && (
        <div className="inquiry-copy">
          <p className="eyebrow">ART SEOUL / INQUIRY</p>
          <h2 id="inquiry-title">{ko ? '작품 문의' : 'Artwork inquiry'}</h2>
          <div className="inquiry-artwork">
            <img
              src={artwork.image}
              alt={ko ? artwork.title : artwork.titleEn}
            />
            <p>
              {ko ? artwork.artist : artwork.artistEn}
              <br />
              <span className="muted">
                {ko ? artwork.title : artwork.titleEn}, {artwork.year}
              </span>
            </p>
          </div>
          <p className="inquiry-notice">
            {ko
              ? '현재 문의 폼은 미리보기입니다. 입력한 내용은 저장·전송되지 않습니다. 실제 문의는 전화로 부탁드립니다.'
              : 'This form is a preview. Your details are not saved or sent. Please call the gallery for actual inquiries.'}
          </p>
          <a className="text-link" href="tel:+8227300934">
            +82 (0)2 730 0934 ↗
          </a>
          {preview ? (
            <div className="inquiry-result" role="status">
              <h3>{ko ? '미리보기를 완료했습니다.' : 'Preview complete.'}</h3>
              <p>
                {ko
                  ? '문의가 접수된 것은 아닙니다. 실제 상담은 위 전화번호로 연락해 주세요.'
                  : 'No inquiry was submitted. Please use the phone number above to contact us.'}
              </p>
              <button className="text-link" onClick={() => setPreview(false)}>
                {ko ? '입력 화면으로' : 'Return to form'} ↗
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="inquiry-form">
              <label>
                {ko ? '이름' : 'Name'}
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                {ko ? '이메일' : 'Email'}
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                {ko ? '문의 내용' : 'Message'}
                <textarea name="message" rows={3} required />
              </label>
              <button type="submit" className="solid-button">
                {ko ? '문의 폼 미리보기' : 'Preview inquiry form'} ↗
              </button>
            </form>
          )}
        </div>
      )}
    </dialog>
  );
}
