
import React from 'react';

const Ticker: React.FC = () => {
  const news = [
    "BREAKING: Global carbon emissions drop by 15% in record year.",
    "JUST IN: New sustainable energy plant opens in Singapore.",
    "UPDATE: VariFeed reaches 1 million verified users worldwide.",
    "TECH: Breakthrough in quantum computing reported by major labs.",
    "POLITICS: Landmark trade agreement signed between 40 nations."
  ];

  return (
    <div className="bg-[#1A1A1A] text-white py-2 overflow-hidden flex items-center">
      <div className="bg-blue-700 px-4 py-0.5 text-xs font-black uppercase italic mr-4 z-10 shrink-0">Breaking News</div>
      <div className="flex whitespace-nowrap animate-ticker">
        {news.concat(news).map((item, idx) => (
          <span key={idx} className="mx-8 font-medium text-sm border-r border-gray-700 pr-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
