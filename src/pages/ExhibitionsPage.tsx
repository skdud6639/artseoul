import { useNavigate } from 'react-router-dom';
import { CURRENT_EXHIBITION } from '../data';
import ExhibitionHero from '../components/ExhibitionHero';

export default function ExhibitionsPage({
  language,
}: {
  language: 'ko' | 'en';
}) {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="sr-only">
        {language === 'ko' ? '현재 전시' : 'Exhibitions'}
      </h1>
      <ExhibitionHero
        exhibition={CURRENT_EXHIBITION}
        language={language}
        onExploreClick={() => {
          void navigate('/artworks');
        }}
      />
    </>
  );
}
