
export enum UserRole {
  USER = 'user',
  PUBLISHER = 'publisher',
  EXPERT = 'expert'
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  expertise?: string;
  isBanned?: boolean;
  averageRating?: number;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: string;
  publisherId: string;
  publisherName: string;
  publishDate: string;
  ratings: number[];
  imageUrl: string;
}

export interface RatingRecord {
  newsId: string;
  expertId: string;
  rating: number;
}
