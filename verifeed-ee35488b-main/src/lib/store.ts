// localStorage-backed store for VariFeed prototype

export type Role = "user" | "publisher" | "expert";

export interface AppUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  expertise?: string;
  name?: string;
  banned?: boolean;
  acceptedTerms?: boolean;
  otpVerified?: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  category: string;
  publisherId: string;
  publisherName: string;
  timestamp: number;
  ratings: { expertId: string; score: number }[];
}

const USERS_KEY = "varifeed_users";
const NEWS_KEY = "varifeed_news";
const SESSION_KEY = "varifeed_session";

// --- Seed data ---
const SEED_USERS: AppUser[] = [
  { id: "pub1", email: "techreporter@news.com", username: "TechReporter", password: "pass123", role: "publisher", expertise: "Technology", acceptedTerms: true, otpVerified: true },
  { id: "pub2", email: "healthwatch@news.com", username: "HealthWatch", password: "pass123", role: "publisher", expertise: "Health", acceptedTerms: true, otpVerified: true },
  { id: "pub3", email: "politicsnow@news.com", username: "PoliticsNow", password: "pass123", role: "publisher", expertise: "Politics", acceptedTerms: true, otpVerified: true },
  { id: "pub4", email: "fakebot@news.com", username: "FakeBot", password: "pass123", role: "publisher", expertise: "Technology", acceptedTerms: true, otpVerified: true, banned: true },
  { id: "exp1", email: "drsmith@expert.com", username: "DrSmith", password: "pass123", role: "expert", expertise: "Health", name: "Dr. Sarah Smith", otpVerified: true },
  { id: "exp2", email: "profchen@expert.com", username: "ProfChen", password: "pass123", role: "expert", expertise: "Technology", name: "Prof. Wei Chen", otpVerified: true },
];

const SEED_NEWS: NewsPost[] = [
  { id: "n1", title: "AI Breakthrough: New Model Surpasses Human Performance", body: "Researchers at MIT have developed a groundbreaking AI model that demonstrates superhuman reasoning abilities across multiple benchmarks.", category: "Technology", publisherId: "pub1", publisherName: "TechReporter", timestamp: Date.now() - 3600000, ratings: [{ expertId: "exp2", score: 4 }] },
  { id: "n2", title: "Global Vaccine Distribution Reaches New Milestone", body: "The WHO announced today that over 80% of the global population has received at least one dose of the latest generation vaccines.", category: "Health", publisherId: "pub2", publisherName: "HealthWatch", timestamp: Date.now() - 7200000, ratings: [{ expertId: "exp1", score: 5 }] },
  { id: "n3", title: "Major Climate Accord Signed by 150 Nations", body: "World leaders have committed to aggressive carbon reduction targets in a historic agreement that experts say could change the course of climate change.", category: "Politics", publisherId: "pub3", publisherName: "PoliticsNow", timestamp: Date.now() - 10800000, ratings: [{ expertId: "exp2", score: 3 }] },
  { id: "n4", title: "Quantum Computing Makes Commercial Debut", body: "The first commercially available quantum computer has been launched, promising to revolutionize fields from drug discovery to financial modeling.", category: "Technology", publisherId: "pub1", publisherName: "TechReporter", timestamp: Date.now() - 14400000, ratings: [] },
  { id: "n5", title: "New Study Links Sleep Patterns to Longevity", body: "A comprehensive 20-year study reveals that consistent sleep schedules are strongly correlated with increased life expectancy.", category: "Health", publisherId: "pub2", publisherName: "HealthWatch", timestamp: Date.now() - 18000000, ratings: [{ expertId: "exp1", score: 4 }] },
  { id: "n6", title: "FAKE: Moon Landing Was Staged", body: "Sensational claims without evidence. This is an example of fake news content that would be flagged by experts.", category: "Technology", publisherId: "pub4", publisherName: "FakeBot", timestamp: Date.now() - 21600000, ratings: [{ expertId: "exp2", score: 1 }] },
  { id: "n7", title: "Election Reform Bill Passes Senate", body: "The landmark election reform legislation has cleared the Senate with bipartisan support, introducing new transparency requirements.", category: "Politics", publisherId: "pub3", publisherName: "PoliticsNow", timestamp: Date.now() - 25200000, ratings: [{ expertId: "exp2", score: 4 }] },
  { id: "n8", title: "Breakthrough in Renewable Energy Storage", body: "Scientists have developed a new battery technology that can store solar energy for up to 30 days, a major step toward grid-scale renewable energy.", category: "Technology", publisherId: "pub1", publisherName: "TechReporter", timestamp: Date.now() - 28800000, ratings: [{ expertId: "exp2", score: 5 }] },
];

function init<T>(key: string, seed: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

// --- CRUD helpers ---
export function getUsers(): AppUser[] { return init(USERS_KEY, SEED_USERS); }
export function saveUsers(users: AppUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function getNews(): NewsPost[] { return init(NEWS_KEY, SEED_NEWS); }
export function saveNews(news: NewsPost[]) { localStorage.setItem(NEWS_KEY, JSON.stringify(news)); }

export function getSession(): AppUser | null {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}
export function setSession(user: AppUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

// --- Auth helpers ---
export function registerUser(user: Omit<AppUser, "id" | "otpVerified" | "banned">): { user: AppUser; otp: string } {
  const users = getUsers();
  if (users.find(u => u.username === user.username || u.email === user.email)) {
    throw new Error("Username or email already exists");
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const newUser: AppUser = { ...user, id: crypto.randomUUID(), otpVerified: false, banned: false };
  users.push(newUser);
  saveUsers(users);
  return { user: newUser, otp };
}

export function verifyOtp(userId: string) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) { users[idx].otpVerified = true; saveUsers(users); return users[idx]; }
  throw new Error("User not found");
}

export function loginUser(identifier: string, password: string): AppUser {
  const users = getUsers();
  const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  if (!user.otpVerified) throw new Error("Please verify your OTP first");
  return user;
}

// --- Rating & ban logic ---
export function rateNews(newsId: string, expertId: string, score: number) {
  const news = getNews();
  const post = news.find(n => n.id === newsId);
  if (!post) throw new Error("Post not found");
  const existing = post.ratings.findIndex(r => r.expertId === expertId);
  if (existing >= 0) post.ratings[existing].score = score;
  else post.ratings.push({ expertId, score });
  saveNews(news);
  // Check publisher ban
  checkAndBanPublisher(post.publisherId);
}

export function getPublisherAvgRating(publisherId: string): number | null {
  const news = getNews();
  const pubNews = news.filter(n => n.publisherId === publisherId);
  const allRatings = pubNews.flatMap(n => n.ratings.map(r => r.score));
  if (allRatings.length === 0) return null;
  return allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
}

function checkAndBanPublisher(publisherId: string) {
  const avg = getPublisherAvgRating(publisherId);
  if (avg !== null && avg < 1.5) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === publisherId);
    if (idx >= 0) { users[idx].banned = true; saveUsers(users); }
  }
}

export function getAvgRating(post: NewsPost): number | null {
  if (post.ratings.length === 0) return null;
  return post.ratings.reduce((a, r) => a + r.score, 0) / post.ratings.length;
}
