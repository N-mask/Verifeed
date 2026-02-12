
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, NewsPost } from './types';
import { 
  getCurrentUser, 
  setCurrentUserStore, 
  getStoredNews, 
  setStoredNews, 
  getStoredUsers, 
  setStoredUsers,
  calculatePublisherRating,
  checkBanStatus
} from './store';
import Button from './components/Button';
import Input from './components/Input';
import Ticker from './components/Ticker';
import NewsCard from './components/NewsCard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [isLoginView, setIsLoginView] = useState(true);
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.USER);
  const [news, setNews] = useState<NewsPost[]>(getStoredNews());
  const [showPostModal, setShowPostModal] = useState(false);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expertise, setExpertise] = useState('');

  // News Post State
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserStore(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setCurrentUserStore(user);
      alert(`Welcome back, ${user.username}!`);
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 alphanumeric characters.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    alert(`MOCK OTP: ${otp}\nPlease verify to continue.`);
    const userOtp = prompt("Enter OTP:");

    if (userOtp === otp.toString()) {
      const users = getStoredUsers();
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        password,
        role: authRole,
        expertise: (authRole === UserRole.EXPERT || authRole === UserRole.PUBLISHER) ? expertise : undefined,
        isBanned: false,
        averageRating: 5.0
      };
      
      setStoredUsers([...users, newUser]);
      setCurrentUser(newUser);
      setCurrentUserStore(newUser);
      alert("Registration successful!");
    } else {
      alert("Invalid OTP.");
    }
  };

  const handlePostNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (checkBanStatus(currentUser.id)) {
      alert("You are BANNED from posting due to low credibility ratings (< 1.5 stars).");
      return;
    }

    const newPost: NewsPost = {
      id: Date.now().toString(),
      title: postTitle,
      content: postContent,
      category: postCategory,
      publisherId: currentUser.id,
      publisherName: currentUser.username,
      publishDate: new Date().toISOString(),
      ratings: [],
      imageUrl: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`
    };

    const updatedNews = [newPost, ...news];
    setNews(updatedNews);
    setStoredNews(updatedNews);
    setShowPostModal(false);
    setPostTitle('');
    setPostCategory('');
    setPostContent('');
    alert("News posted successfully!");
  };

  const handleRateNews = (newsId: string, rating: number) => {
    const updatedNews = news.map(p => {
      if (p.id === newsId) {
        return { ...p, ratings: [...p.ratings, rating] };
      }
      return p;
    });
    setNews(updatedNews);
    setStoredNews(updatedNews);
  };

  const isPublisherBanned = currentUser?.role === UserRole.PUBLISHER && checkBanStatus(currentUser.id);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5F2EB] to-[#E5E2DB] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-md bg-white p-10 shadow-2xl relative z-10 border-t-8 border-[#1A1A1A]">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">VariFeed</h1>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">The Expert-Verified News Social Network</p>
          </div>

          <div className="flex mb-8 bg-gray-100 p-1 rounded-sm">
            <button 
              onClick={() => setIsLoginView(true)}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all ${isLoginView ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLoginView(false)}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition-all ${!isLoginView ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
            {!isLoginView && (
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-500">I am joining as a:</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(UserRole).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setAuthRole(role)}
                      className={`py-2 text-[10px] font-black uppercase border-2 transition-all ${authRole === role ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Input label="Email Address" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            {!isLoginView && <Input label="Username" type="text" required value={username} onChange={e => setUsername(e.target.value)} />}
            <Input label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            
            {!isLoginView && (authRole === UserRole.EXPERT || authRole === UserRole.PUBLISHER) && (
              <Input label="Area of Expertise" type="text" required value={expertise} onChange={e => setExpertise(e.target.value)} />
            )}

            {!isLoginView && authRole === UserRole.PUBLISHER && (
              <div className="flex items-start gap-2 mb-4">
                <input type="checkbox" required className="mt-1" />
                <label className="text-[10px] text-gray-500 uppercase font-medium">I accept the publisher code of conduct & verified rating system.</label>
              </div>
            )}

            <Button fullWidth type="submit" className="mt-4">
              {isLoginView ? 'Log In' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-[#1A1A1A] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-black italic tracking-tighter">VariFeed</h1>
            <div className="hidden md:flex gap-6">
              <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-blue-700">World</a>
              <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-blue-700">Politics</a>
              <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-blue-700">Tech</a>
              <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-blue-700">Science</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Logged in as</p>
              <p className="text-sm font-bold text-blue-700">{currentUser.username} <span className="text-[10px] text-gray-400">({currentUser.role})</span></p>
            </div>
            {currentUser.role === UserRole.PUBLISHER && (
              <Button 
                variant={isPublisherBanned ? 'danger' : 'primary'}
                className="text-xs py-1.5 px-4"
                disabled={isPublisherBanned}
                onClick={() => setShowPostModal(true)}
              >
                {isPublisherBanned ? 'BANNED' : 'Publish Story'}
              </Button>
            )}
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <Ticker />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="mb-12 border-b-4 border-double border-[#1A1A1A] pb-8 text-center">
          <h2 className="text-6xl font-black mb-4">Truth in the Digital Age.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium italic">
            "VariFeed is the first platform where the quality of news is determined by experts, not by algorithms."
          </p>
        </div>

        {/* Banner Warning if Banned */}
        {isPublisherBanned && (
          <div className="bg-red-50 border-2 border-red-600 p-6 mb-12 animate-pulse flex items-center gap-4">
            <div className="text-4xl text-red-600">⚠️</div>
            <div>
              <h3 className="text-xl font-black text-red-700 uppercase">Attention Publisher</h3>
              <p className="text-red-600 font-bold italic">Your credibility rating has fallen below 1.5 stars. You have been automatically restricted from publishing new content until further notice.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-12">
          {news.map((post) => (
            <NewsCard 
              key={post.id} 
              post={post} 
              currentUser={currentUser} 
              onRate={handleRateNews}
              isBanned={checkBanStatus(post.publisherId)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-[#1A1A1A] py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black italic mb-2">VariFeed</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">&copy; 2024 VariFeed International News Network</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-black uppercase hover:text-blue-700">Code of Ethics</a>
            <a href="#" className="text-xs font-black uppercase hover:text-blue-700">Fact Checking</a>
            <a href="#" className="text-xs font-black uppercase hover:text-blue-700">Contact</a>
          </div>
        </div>
      </footer>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-10 border-t-8 border-blue-700 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic">Publish News</h2>
              <button onClick={() => setShowPostModal(false)} className="text-2xl hover:text-red-500">&times;</button>
            </div>
            
            <form onSubmit={handlePostNews} className="space-y-6">
              <Input label="Headline" placeholder="Enter an impactful headline..." value={postTitle} onChange={e => setPostTitle(e.target.value)} required />
              <Input label="Category" placeholder="e.g. Science, Tech, Finance..." value={postCategory} onChange={e => setPostCategory(e.target.value)} required />
              
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-1 text-gray-700">Main Story Content</label>
                <textarea 
                  className="w-full bg-white border-2 border-gray-200 p-4 focus:outline-none focus:border-blue-700 h-48"
                  placeholder="Tell the truth..."
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowPostModal(false)}>Cancel</Button>
                <Button type="submit">Submit for Verification</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
