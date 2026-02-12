
import React, { useState } from 'react';
import { NewsPost, UserRole, User } from '../types';

interface NewsCardProps {
  post: NewsPost;
  currentUser: User | null;
  onRate: (newsId: string, rating: number) => void;
  isBanned: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ post, currentUser, onRate, isBanned }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const averageRating = post.ratings.length 
    ? (post.ratings.reduce((a, b) => a + b, 0) / post.ratings.length).toFixed(1)
    : "N/A";

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-6 relative overflow-hidden">
      {isBanned && (
        <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-1 rotate-45 translate-x-1/4 -translate-y-1/4 font-black text-xs z-10 shadow-lg animate-pulse">
          BANNED PUBLISHER
        </div>
      )}
      
      <div className="md:w-1/3 overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 md:h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
        />
      </div>

      <div className="md:w-2/3 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-blue-700 font-bold uppercase text-xs tracking-widest">{post.category}</span>
            <span className="text-gray-400 text-xs">{new Date(post.publishDate).toLocaleDateString()}</span>
          </div>
          <h3 className="text-2xl font-black mb-3 leading-tight group-hover:text-blue-800 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs uppercase">
              {post.publisherName.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold">{post.publisherName}</p>
              <div className="flex items-center gap-1">
                 <span className="text-[10px] text-gray-500 uppercase">Expert Rating:</span>
                 <span className="text-[10px] font-bold text-blue-700">{averageRating} ★</span>
                 {Number(averageRating) >= 4 && (
                   <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">VERIFIED</span>
                 )}
              </div>
            </div>
          </div>

          {currentUser?.role === UserRole.EXPERT && (
            <div className="flex flex-col items-end">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Expert Verification</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onRate(post.id, star)}
                    className={`text-xl transition-colors ${
                      (hoverRating || 0) >= star ? 'text-blue-600' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
