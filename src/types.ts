export interface Artwork {
  id: string;
  title: string;
  titleEn: string;
  artist: string;
  artistEn: string;
  year: number;
  medium: string;
  mediumEn: string;
  dimensions: string;
  image: string;
  category: 'painting' | 'sculpture' | 'monochrome';
  description: string;
  descriptionEn: string;
  price: string;
  isInquireOnly: boolean;
}

export interface Artist {
  id: string;
  name: string;
  nameEn: string;
  birthYear: number;
  bio: string;
  bioEn: string;
  representedSince: number;
  education: string[];
  exhibitions: string[];
  image: string;
}

export interface Exhibition {
  id: string;
  title: string;
  titleEn: string;
  artist: string;
  artistEn: string;
  startDate: string;
  endDate: string;
  location: string;
  curatorNote: string;
  curatorNoteEn: string;
  heroImage: string;
}

export interface InquiryFormState {
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: 'email' | 'phone';
}
