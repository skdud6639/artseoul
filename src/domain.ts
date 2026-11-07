export interface RentalArtwork {
  id: string;
  slug: string;
  title: string;
  artistId: string;
  year: number;
  medium: string;
  widthCm: number;
  heightCm: number;
  depthCm?: number;
  image: string;
  category: 'painting' | 'sculpture' | 'monochrome';
  description: string;
  rentalMonthly: number | null;
  availability: 'confirm' | 'available' | 'rented';
  spaces: string[];
  sample: boolean;
}

export interface RentalArtist {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  sample: boolean;
}
