import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

const COUNTRIES = [
  { code: "US", name: "USA", flag: "🇺🇸", tz: "America/New_York" },
  { code: "GB", name: "UK", flag: "🇬🇧", tz: "Europe/London" },
  { code: "IN", name: "India", flag: "🇮🇳", tz: "Asia/Kolkata" },
  { code: "JP", name: "Japan", flag: "🇯🇵", tz: "Asia/Tokyo" },
  { code: "AU", name: "Australia", flag: "🇦🇺", tz: "Australia/Sydney" },
  { code: "DE", name: "Germany", flag: "🇩🇪", tz: "Europe/Berlin" },
  { code: "AE", name: "UAE", flag: "🇦🇪", tz: "Asia/Dubai" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", tz: "Asia/Singapore" },
];

const WorldClock = () => {
  const [selected, setSelected] = useState("US");
  const [time, setTime] = useState("");

  const country = COUNTRIES.find(c => c.code === selected)!;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: country.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [country.tz]);

  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className="text-navbar-foreground/70" />
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="h-7 w-auto min-w-[90px] border-navbar-foreground/20 bg-transparent text-navbar-foreground text-xs px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map(c => (
            <SelectItem key={c.code} value={c.code}>
              <span className="mr-1">{c.flag}</span> {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs font-mono text-navbar-foreground/90 tabular-nums">{time}</span>
    </div>
  );
};

export default WorldClock;
