import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, setSession, getNews, rateNews, AppUser, NewsPost, getPublisherAvgRating, getUsers } from "@/lib/store";
import NewsCard from "@/components/NewsCard";
import WorldClock from "@/components/WorldClock";
import StockTicker from "@/components/StockTicker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Newspaper, LogOut, ShieldAlert, ShieldCheck, User, Megaphone, GraduationCap, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLE_ICONS = { user: User, publisher: Megaphone, expert: GraduationCap };
const CATEGORIES = ["All", "Technology", "Health", "Finance", "Politics", "Science", "Sports"];

const Feed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AppUser | null>(null);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate("/"); return; }
    setUser(session);
    setNews(getNews().sort((a, b) => b.timestamp - a.timestamp));
  }, [navigate]);

  const handleRate = (newsId: string, score: number) => {
    if (!user) return;
    rateNews(newsId, user.id, score);
    setNews(getNews().sort((a, b) => b.timestamp - a.timestamp));
    const freshUsers = getUsers();
    const freshUser = freshUsers.find(u => u.id === user.id);
    if (freshUser) setUser(freshUser);
    toast({ title: "Rated!", description: `You gave this article ${score} star${score > 1 ? "s" : ""}.` });
  };

  const handleLogout = () => {
    setSession(null);
    navigate("/");
  };

  if (!user) return null;

  const RoleIcon = ROLE_ICONS[user.role];
  const isBannedPublisher = user.role === "publisher" && user.banned;
  const pubAvg = user.role === "publisher" ? getPublisherAvgRating(user.id) : null;

  const filtered = news.filter(post => {
    const matchCat = category === "All" || post.category === category;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-navbar text-navbar-foreground shadow-md">
        <div className="container flex items-center justify-between h-14 max-w-5xl">
          <div className="flex items-center gap-3">
            <Newspaper size={24} />
            <span className="font-display font-bold text-lg tracking-tight">VeriFeed</span>
          </div>
          <div className="hidden md:block">
            <WorldClock />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <RoleIcon size={16} className="opacity-70" />
              <span className="text-sm font-medium">{user.username}</span>
              <Badge variant="outline" className="text-xs capitalize border-navbar-foreground/30 text-navbar-foreground">{user.role}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-navbar-foreground hover:bg-navbar-foreground/10">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Stock Ticker */}
      <StockTicker />

      {/* Publisher ban banner */}
      {isBannedPublisher && (
        <div className="bg-destructive/10 border-b border-destructive/20 py-3">
          <div className="container max-w-5xl flex items-center gap-2 text-destructive text-sm">
            <ShieldAlert size={18} />
            <span className="font-semibold">Your account has been banned.</span>
            <span>Your average rating fell below 1.5 stars. You can no longer publish news.</span>
          </div>
        </div>
      )}

      {/* Publisher stats */}
      {user.role === "publisher" && !isBannedPublisher && pubAvg !== null && (
        <div className="bg-success/5 border-b border-success/20 py-3">
          <div className="container max-w-5xl flex items-center gap-2 text-success text-sm">
            <ShieldCheck size={18} />
            <span>Your average credibility rating: <strong>{pubAvg.toFixed(1)}</strong> / 5.0</span>
          </div>
        </div>
      )}

      {/* Expert hint */}
      {user.role === "expert" && (
        <div className="bg-primary/5 border-b border-primary/20 py-3">
          <div className="container max-w-5xl flex items-center gap-2 text-primary text-sm">
            <GraduationCap size={18} />
            <span>As an expert, you can rate news articles to verify their credibility.</span>
          </div>
        </div>
      )}

      {/* Category Filter + Search */}
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-5xl py-3 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news by title or category..."
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <main className="container max-w-5xl py-6">
        <h2 className="font-display text-2xl font-bold mb-6">Latest News</h2>
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No articles found.</p>
          )}
          {filtered.map((post, i) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}>
              <NewsCard post={post} currentUser={user} onRate={handleRate} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
