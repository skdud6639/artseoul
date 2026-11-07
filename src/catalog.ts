import monochrome from './assets/images/artwork_abstract_monochrome_1783483732335.jpg';
import colorField from './assets/images/artwork_color_field_1783483743324.jpg';
import sculpture from './assets/images/artwork_modern_sculpture_1783483756512.jpg';
import figurative from './assets/images/artwork_figurative_abstract_1783483771111.jpg';
import type { RentalArtist, RentalArtwork } from './domain';

// Existing prototype content is retained as explicitly labeled examples.
// Prices, rental rights, artist credentials and availability require verification.
export const artists: RentalArtist[] = [
  {
    id: 'artist-01',
    slug: 'yunwoo-kim',
    name: '김윤우',
    nameEn: 'Yunwoo Kim',
    image: monochrome,
    description:
      '겹쳐진 선과 절제된 색으로 공간의 여백을 살피는 단색화 큐레이션 예시입니다. 작품의 표면과 주변의 빛이 만드는 관계를 함께 살펴보세요.',
    sample: true,
  },
  {
    id: 'artist-02',
    slug: 'hyejin-seo',
    name: '서혜진',
    nameEn: 'Hyejin Seo',
    image: colorField,
    description:
      '푸른색과 따뜻한 색면의 경계를 통해 공간에 색의 흐름을 더하는 큐레이션 예시입니다. 벽면 마감과 조명에 따라 달라지는 인상을 비교해 보세요.',
    sample: true,
  },
  {
    id: 'artist-03',
    slug: 'chanwook-park',
    name: '박찬욱',
    nameEn: 'Chanwook Park',
    image: sculpture,
    description:
      '서로 다른 물성과 입체적인 형태를 공간 안에서 살펴보는 조각 큐레이션 예시입니다. 작품 주변의 동선과 여러 방향에서 보이는 모습을 함께 고려합니다.',
    sample: true,
  },
  {
    id: 'artist-04',
    slug: 'seoyoung-lee',
    name: '이서영',
    nameEn: 'Seoyoung Lee',
    image: figurative,
    description:
      '인물의 실루엣과 깊은 녹색, 밝은 여백이 어우러지는 회화 큐레이션 예시입니다. 머무는 공간에 어울리는 색과 이야기를 함께 찾습니다.',
    sample: true,
  },
];

export const artworks: RentalArtwork[] = [
  {
    id: 'art-01',
    slug: 'waves-of-silence-26-11',
    title: '고요의 파동 26-11',
    artistId: 'artist-01',
    year: 2026,
    medium: '캔버스에 한지, 천연 안료 및 아크릴',
    widthCm: 130.3,
    heightCm: 162.2,
    image: monochrome,
    category: 'monochrome',
    description:
      '절제된 색과 반복되는 선이 만드는 고요한 리듬. 넓은 여백을 가진 오피스나 차분한 분위기의 라운지에 어울리는 방향을 탐색합니다.',
    rentalMonthly: null,
    availability: 'confirm',
    spaces: ['office', 'healthcare', 'hospitality'],
    sample: true,
  },
  {
    id: 'art-02',
    slug: 'layers-of-the-abyss-42',
    title: '심연의 층위 No. 42',
    artistId: 'artist-02',
    year: 2025,
    medium: '리넨에 아크릴 스프레이 및 유채',
    widthCm: 112.1,
    heightCm: 145.5,
    image: colorField,
    category: 'painting',
    description:
      '푸른색과 따뜻한 오커가 만나는 색면. 공간의 중심이 되는 한 벽에서 가구, 마감재, 빛과 어울리는 색의 관계를 살펴볼 수 있습니다.',
    rentalMonthly: null,
    availability: 'confirm',
    spaces: ['office', 'hospitality', 'retail'],
    sample: true,
  },
  {
    id: 'art-03',
    slug: 'dialogue-of-forms',
    title: '무제 (형태의 대화)',
    artistId: 'artist-03',
    year: 2024,
    medium: '청동, 천연 카라라 백대리석',
    widthCm: 45,
    depthCm: 30,
    heightCm: 110,
    image: sculpture,
    category: 'sculpture',
    description:
      '짙은 청동과 밝은 대리석의 대비를 가진 입체 형태. 로비나 라운지의 동선과 시선을 함께 고려하는 공간 제안의 출발점입니다.',
    rentalMonthly: null,
    availability: 'confirm',
    spaces: ['office', 'hospitality'],
    sample: true,
  },
  {
    id: 'art-04',
    slug: 'residual-image-of-memory-17',
    title: '기억의 잔상 No. 17',
    artistId: 'artist-04',
    year: 2025,
    medium: '캔버스에 혼합매체 및 겔미디움',
    widthCm: 97,
    heightCm: 130.3,
    image: figurative,
    category: 'painting',
    description:
      '질감이 느껴지는 표면 위로 인물의 실루엣이 머무는 장면. 녹색과 밝은 중간색이 공간의 소재와 만나는 조합을 제안합니다.',
    rentalMonthly: null,
    availability: 'confirm',
    spaces: ['healthcare', 'hospitality', 'retail'],
    sample: true,
  },
];
