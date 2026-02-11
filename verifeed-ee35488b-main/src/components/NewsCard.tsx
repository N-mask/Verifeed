import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StarRating from "./StarRating";
import { NewsPost, getAvgRating, AppUser, getUsers } from "@/lib/store";
import { Clock, ShieldAlert, ShieldCheck } from "lucide-react";

interface NewsCardProps {
  post: NewsPost;
  currentUser: AppUser | null;
  onRate?: (newsId: string, score: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/10 text-blue-700 border-blue-200",
  Health: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Finance: "bg-amber-500/10 text-amber-700 border-amber-200",
  Politics: "bg-purple-500/10 text-purple-700 border-purple-200",
};

const NewsCard = ({ post, currentUser, onRate }: NewsCardProps) => {
  const avg = getAvgRating(post);
  const publisher = getUsers().find(u => u.id === post.publisherId);
  const isBanned = publisher?.banned;
  const isExpert = currentUser?.role === "expert";
  const timeAgo = getTimeAgo(post.timestamp);

  return (
    <Card className={`glass-card overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isBanned ? "opacity-60 border-banned/30" : ""}`}>
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className={CATEGORY_COLORS[post.category] || "bg-secondary text-secondary-foreground"}>
            {post.category}
          </Badge>
          {isBanned && (
            <Badge variant="destructive" className="flex items-center gap-1 text-xs">
              <ShieldAlert size={12} /> Banned Publisher
            </Badge>
          )}
          {!isBanned && avg !== null && avg >= 4 && (
            <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1 text-xs">
              <ShieldCheck size={12} /> Verified
            </Badge>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
          {post.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {post.body}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.publisherName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo}</span>
          </div>
          <StarRating
            rating={avg}
            interactive={isExpert && !isBanned}
            onRate={(score) => onRate?.(post.id, score)}
            size={16}
          />
        </div>
      </CardContent>
    </Card>
  );
};

function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default NewsCard;
