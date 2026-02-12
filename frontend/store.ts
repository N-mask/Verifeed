
import { User, NewsPost, UserRole } from './types';

const STORAGE_KEYS = {
  USERS: 'varifeed_users',
  NEWS: 'varifeed_news',
  CURRENT_USER: 'varifeed_current_user'
};

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const setStoredUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredNews = (): NewsPost[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NEWS);
  return data ? JSON.parse(data) : [
    {
      id: '1',
      title: 'Global Economic Shift: New Digital Currencies Gain Ground',
      content: 'Financial analysts suggest a major pivot in global trade as decentralized finance enters mainstream banking...',
      category: 'Finance',
      publisherId: 'pub1',
      publisherName: 'Global Times',
      publishDate: new Date().toISOString(),
      ratings: [4, 5, 4],
      imageUrl: 'https://picsum.photos/800/400?random=1'
    },
    {
      id: '2',
      title: 'Space Exploration: Mars Rover Discovers Underground Ice',
      content: 'NASA scientists have confirmed the presence of vast ice deposits beneath the surface of Mars...',
      category: 'Science',
      publisherId: 'pub2',
      publisherName: 'Science Daily',
      publishDate: new Date().toISOString(),
      ratings: [5, 5, 5],
      imageUrl: 'https://picsum.photos/800/400?random=2'
    }
  ];
};

export const setStoredNews = (news: NewsPost[]) => {
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUserStore = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const calculatePublisherRating = (publisherId: string): number => {
  const news = getStoredNews();
  const publisherNews = news.filter(n => n.publisherId === publisherId);
  const allRatings = publisherNews.flatMap(n => n.ratings);
  if (allRatings.length === 0) return 5.0; // Default rating for new publishers
  const sum = allRatings.reduce((a, b) => a + b, 0);
  return Number((sum / allRatings.length).toFixed(1));
};

export const checkBanStatus = (publisherId: string): boolean => {
  const rating = calculatePublisherRating(publisherId);
  return rating < 1.5;
};
