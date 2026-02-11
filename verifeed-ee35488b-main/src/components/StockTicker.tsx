import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
  symbol: string;
  price: number;
  change: number;
}

const INITIAL_STOCKS: Stock[] = [
  { symbol: "AAPL", price: 189.84, change: 1.23 },
  { symbol: "GOOGL", price: 141.56, change: -0.87 },
  { symbol: "MSFT", price: 378.91, change: 2.45 },
  { symbol: "AMZN", price: 178.25, change: -1.12 },
  { symbol: "TSLA", price: 248.42, change: 3.67 },
  { symbol: "NVDA", price: 495.22, change: 5.18 },
  { symbol: "META", price: 356.71, change: -0.34 },
  { symbol: "NIFTY", price: 22147.50, change: 87.30 },
  { symbol: "SENSEX", price: 72831.94, change: -124.50 },
  { symbol: "DOW", price: 38654.42, change: 156.78 },
];

const StockTicker = () => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);

  useEffect(() => {
    const id = setInterval(() => {
      setStocks(prev =>
        prev.map(s => {
          const delta = (Math.random() - 0.48) * s.price * 0.002;
          return { ...s, price: +(s.price + delta).toFixed(2), change: +delta.toFixed(2) };
        })
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const items = [...stocks, ...stocks]; // duplicate for seamless scroll

  return (
    <div className="bg-ticker text-ticker-foreground overflow-hidden border-b border-border">
      <div className="flex animate-ticker whitespace-nowrap py-1.5">
        {items.map((s, i) => (
          <span key={`${s.symbol}-${i}`} className="inline-flex items-center gap-1 px-4 text-xs font-mono">
            <span className="font-semibold">{s.symbol}</span>
            <span>${s.price.toLocaleString()}</span>
            {s.change >= 0 ? (
              <span className="text-success flex items-center gap-0.5">
                <TrendingUp size={10} />+{s.change.toFixed(2)}
              </span>
            ) : (
              <span className="text-destructive flex items-center gap-0.5">
                <TrendingDown size={10} />{s.change.toFixed(2)}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
