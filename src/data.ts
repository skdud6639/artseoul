import artworkImage1 from './assets/images/artwork_abstract_monochrome_1783483732335.jpg';
import artworkImage2 from './assets/images/artwork_color_field_1783483743324.jpg';
import artworkImage3 from './assets/images/artwork_modern_sculpture_1783483756512.jpg';
import artworkImage4 from './assets/images/artwork_figurative_abstract_1783483771111.jpg';
import { Artwork, Artist, Exhibition } from './types';

export const CURRENT_EXHIBITION: Exhibition = {
  id: 'exh-01',
  title: '고요의 파동',
  titleEn: 'Waves of Silence',
  artist: '김윤우',
  artistEn: 'Yunwoo Kim',
  startDate: '2026. 07. 15',
  endDate: '2026. 08. 30',
  location: '서울아트 본관 (Samcheong, Seoul)',
  heroImage: '/assets/aistudio/________________________________1__60d88c58.png',
  curatorNote: `서울아트는 2026년 여름 기획전으로 한국 현대 단색화의 새로운 지평을 열어가고 있는 김윤우 작가의 개인전 《고요의 파동》을 개최합니다. 

이번 전시는 작가가 지난 수년간 탐구해 온 백색과 흑색의 단조로운 층위 속에 내포된 무한한 시각적 깊이와 정신성을 조명합니다. 김윤우의 캔버스는 단순한 물질적 표면을 넘어, 반복적인 붓질과 한지의 물성이 유기적으로 결합하여 생성해 낸 명상적 공간입니다. 

화면 위에 가늘게 뻗어 나가는 선과 여백의 조화는 보는 이로 하여금 내면의 깊은 침묵과 조우하게 하며, 현대 사회의 소음 속에서 잠시 멈추어 서는 정화의 시간을 선사할 것입니다. 서울아트의 정제된 공간 속에서 펼쳐지는 백색의 울림을 직접 경험해 보시기 바랍니다.`,
  curatorNoteEn: `Seoul Art is pleased to present "Waves of Silence," a solo exhibition by Yunwoo Kim, a pioneering voice in the next generation of Korean Dansaekhwa (monochrome painting).

This summer exhibition highlights the profound visual depth and spiritual resonance that Kim has spent years cultivating through minimal palettes and subtle layering. His canvases transcend mere physical surfaces, becoming meditative arenas where repetitive brushstrokes integrate organically with the natural texture of traditional Korean Hanji paper.

The dialogue between delicate lines and expansive negative space invites viewers to encounter their own inner stillness, offering a rare moment of clarity and contemplation amidst the noise of the contemporary world. We invite you to experience the transcendent resonance of silence within our newly curated spaces.`
};

export const ARTISTS: Artist[] = [
  {
    id: 'artist-01',
    name: '김윤우',
    nameEn: 'Yunwoo Kim',
    birthYear: 1974,
    bio: '김윤우(b. 1974)는 홍익대학교 회화과를 졸업하고 파리 국립미술학교에서 수학하였습니다. 전통 한지와 현대적 안료를 조화롭게 융합하여 한국 현대 단색화의 정신성을 이어가는 독보적인 작업을 선보입니다. 작가의 작업은 칠하고 닦아내기를 반복하는 수행적 과정을 거치며, 시간의 적층과 내면적 성찰을 화폭에 온전히 담아냅니다.',
    bioEn: 'Yunwoo Kim (b. 1974) received his BFA from Hongik University and studied at the École Nationale Supérieure des Beaux-Arts in Paris. Synthesizing traditional Korean Hanji paper with modern pigments, Kim continues the meditative legacy of Korean monochrome painting. His performative process of layering and erasure translates the accumulation of time and internal contemplation onto the canvas.',
    representedSince: 2018,
    education: [
      '파리 국립고등미술학교 회화 석사 (MFA, École des Beaux-Arts, Paris)',
      '홍익대학교 미술대학 회화과 학사 (BFA, Hongik University)'
    ],
    exhibitions: [
      '2026 개인전 《고요의 파동》, 서울아트, 서울',
      '2024 그룹전 《침묵의 깊이》, 퐁피두 센터, 파리',
      '2023 개인전 《시간의 결》, 도쿄 아트 포럼, 도쿄',
      '2022 그룹전 《단색화의 미래》, 국립현대미술관, 서울'
    ],
    image: artworkImage1
  },
  {
    id: 'artist-02',
    name: '서혜진',
    nameEn: 'Hyejin Seo',
    birthYear: 1981,
    bio: '서혜진(b. 1981)은 서울대학교와 런던 첼시 예술대학에서 수학하며 색채 가 주는 감각적 인지와 경계면에 대해 탐구해 왔습니다. 극도로 절제된 부드러운 그라데이션을 통해 캔버스 위에 고요하게 부유하는 빛과 대기의 층을 형성합니다. 작가의 색면 회화는 3차원의 깊이감과 평면성의 팽팽한 긴장감을 선사합니다.',
    bioEn: 'Hyejin Seo (b. 1981) studied at Seoul National University and Chelsea College of Arts in London, focusing on the sensory perception of color boundaries. Through extremely refined, seamless gradients, she constructs quiet, floating layers of light and atmosphere on canvas. Her color field paintings offer a delicate tension between three-dimensional depth and flat plane aesthetics.',
    representedSince: 2020,
    education: [
      '런던 첼시 예술대학 미술학 석사 (MFA, Chelsea College of Arts, London)',
      '서울대학교 미술대학 서양화과 학사 (BFA, Seoul National University)'
    ],
    exhibitions: [
      '2025 개인전 《심연의 온도》, 테이트 모던 프로젝트 스페이스, 런던',
      '2024 그룹전 《무한의 스펙트럼》, 서울아트, 서울',
      '2023 개인전 《대기의 틈》, 갤러리 페로탱, 뉴욕'
    ],
    image: artworkImage2
  },
  {
    id: 'artist-03',
    name: '박찬욱',
    nameEn: 'Chanwook Park',
    birthYear: 1978,
    bio: '박찬욱(b. 1978)은 청동, 대리석, 원목 등 자연의 원초적인 재료를 깎아내고 다듬어 최소한의 유기적 형태를 빚어내는 조각가입니다. 재료 고유의 무게감과 질감을 보존하면서 공간과 빛이 유기적으로 조우하는 구조를 설계합니다. 그의 조각은 고정된 물질이 아닌 주위 공간과 호흡하는 하나의 현상으로 존재합니다.',
    bioEn: 'Chanwook Park (b. 1978) is a sculptor who shapes pristine organic forms by carving raw, elemental materials such as bronze, marble, and hardwood. While preserving the inherent weight and texture of his materials, he designs structural dialogues between space, solid form, and light. His sculptures exist not merely as static objects, but as spatial phenomena.',
    representedSince: 2019,
    education: [
      '베를린 예술대학교 조소과 마이스터슐러 (Meisterschüler, UdK Berlin)',
      '경희대학교 미술대학 조소과 학사 (BFA, Kyung Hee University)'
    ],
    exhibitions: [
      '2025 그룹전 《한국의 미니멀 조각》, 스위스 바이엘러 미술관, 바젤',
      '2024 개인전 《조용한 중력》, 서울아트, 서울',
      '2022 그룹전 《공간의 호흡》, 가나아트센터, 서울'
    ],
    image: artworkImage3
  },
  {
    id: 'artist-04',
    name: '이서영',
    nameEn: 'Seoyoung Lee',
    birthYear: 1988,
    bio: '이서영(b. 1988)은 파편화된 인간의 형상과 기억의 잔상을 추상화하여 표현하는 신진 작가입니다. 거친 흙과 석고 질감의 마티에르(texture)를 캔버스 위에 올려놓고, 가벼운 파스텔 톤과 묵직한 에메랄드 그린의 콘트라스트를 활용하여 인간 영혼의 서정성을 서정적 입체감으로 빚어냅니다.',
    bioEn: 'Seoyoung Lee (b. 1988) is an emerging contemporary painter who abstracts fragmented human silhouettes and residual memories. Layering coarse, plaster-like textures onto the canvas and orchestrating tight color contrasts between pale creams and deep emerald greens, she visualizes the delicate poetry and psychological dimensions of the human soul.',
    representedSince: 2021,
    education: [
      '예일대학교 미술대학 회화과 석사 (MFA, Yale School of Art, New Haven)',
      '이화여자대학교 미술대학 회화과 학사 (BFA, Ewha Womans University)'
    ],
    exhibitions: [
      '2026 그룹전 《기억의 표면》, MoMA PS1, 뉴욕',
      '2025 개인전 《내면의 지리학》, 서울아트, 서울',
      '2024 그룹전 《젊은 예술가 10인》, 리움미술관, 서울'
    ],
    image: artworkImage4
  }
];

export const ARTWORKS: Artwork[] = [
  {
    id: 'art-01',
    title: '고요의 파동 26-11',
    titleEn: 'Waves of Silence 26-11',
    artist: '김윤우',
    artistEn: 'Yunwoo Kim',
    year: 2026,
    medium: '캔버스에 한지, 천연 안료 및 아크릴',
    mediumEn: 'Traditional Hanji paper, natural pigment, and acrylic on canvas',
    dimensions: '162.2 x 130.3 cm (100F)',
    image: artworkImage1,
    category: 'monochrome',
    description: '작가가 수개월간 캔버스에 한지를 배접하고 붓질을 수십 번 올리고 긁어내는 반복 행위를 통해 만들어낸 깊이 있는 검은 심연의 울림을 담아낸 대표작입니다.',
    descriptionEn: 'Created through a performative process of adhering traditional Hanji paper onto canvas, applying dozens of translucent dark pigment washes, and partially scraping them away over several months.',
    price: '₩32,000,000',
    isInquireOnly: true
  },
  {
    id: 'art-02',
    title: '심연의 층위 No. 42',
    titleEn: 'Layers of the Abyss No. 42',
    artist: '서혜진',
    artistEn: 'Hyejin Seo',
    year: 2025,
    medium: '리넨에 아크릴 스프레이 및 유채',
    mediumEn: 'Acrylic spray and oil on linen',
    dimensions: '145.5 x 112.1 cm (80F)',
    image: artworkImage2,
    category: 'painting',
    description: '푸른빛의 심연과 따뜻한 오커(황토색) 빛깔이 서로 스며들며 경계면에서 자아내는 독특한 시각적 분위기가 특징인 작품으로, 시간과 대기의 웅장함을 형상화했습니다.',
    descriptionEn: 'A pristine color field painting where deep Prussian blue and golden ochre seamlessly coalesce, exploring sensory boundaries and mimicking the ethereal atmosphere of dawn over deep water.',
    price: '₩18,000,000',
    isInquireOnly: false
  },
  {
    id: 'art-03',
    title: '무제 (형태의 대화)',
    titleEn: 'Untitled (Dialogue of Forms)',
    artist: '박찬욱',
    artistEn: 'Chanwook Park',
    year: 2024,
    medium: '청동, 천연 카라라 백대리석',
    mediumEn: 'Bronze and natural Carrara white marble',
    dimensions: '45 x 30 x 110 (h) cm',
    image: artworkImage3,
    category: 'sculpture',
    description: '서로 다른 질감의 청동과 이탈리아 카라라 대리석을 유기적 기하학 형태로 깎아내어 결합한 소장용 조각으로, 중력과 여백의 긴장감을 극대화한 구조미를 보여줍니다.',
    descriptionEn: 'A exquisite sculpture combining dark textured bronze with smooth white Carrara marble. The geometric yet organic forms create a dynamic play of light, shadow, gravity, and surrounding air.',
    price: 'Inquiry Only',
    isInquireOnly: true
  },
  {
    id: 'art-04',
    title: '기억의 잔상 No. 17',
    titleEn: 'Residual Image of Memory No. 17',
    artist: '이서영',
    artistEn: 'Seoyoung Lee',
    year: 2025,
    medium: '캔버스에 혼합매체 및 겔미디움',
    mediumEn: 'Mixed media and gel medium on canvas',
    dimensions: '130.3 x 97.0 cm (60F)',
    image: artworkImage4,
    category: 'painting',
    description: '거친 흙과 석고를 활용한 마티에르 위에 실루엣처럼 부유하는 한 인물의 내면적 사색을 은은하고 감각적인 색채 조합으로 그려낸 최신 화제작입니다.',
    descriptionEn: 'A compelling tactile painting on heavily built-up plaster texture, capturing a contemplative human shadow surrounded by emerald and neutral earth tones to evoke a poignant sense of introspection.',
    price: '₩14,000,000',
    isInquireOnly: false
  }
];
