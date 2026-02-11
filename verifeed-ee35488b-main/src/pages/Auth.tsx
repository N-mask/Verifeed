import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { registerUser, loginUser, setSession, verifyOtp, Role } from "@/lib/store";
import OTPDialog from "@/components/OTPDialog";
import { Newspaper, User, Megaphone, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EXPERTISE_OPTIONS = ["Technology", "Health", "Finance", "Politics", "Science", "Sports"];

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register state
  const [regRole, setRegRole] = useState<Role>("user");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regExpertise, setRegExpertise] = useState("");
  const [regTerms, setRegTerms] = useState(false);

  // OTP state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");

  const handleLogin = () => {
    try {
      const user = loginUser(loginId, loginPw);
      setSession(user);
      toast({ title: "Welcome back!", description: `Logged in as ${user.username}` });
      navigate("/feed");
    } catch (e: any) {
      toast({ title: "Login failed", description: e.message, variant: "destructive" });
    }
  };

  const handleRegister = () => {
    // Validation
    if (!regEmail || !regUsername || !regPassword) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6 || !/^[a-zA-Z0-9]+$/.test(regPassword)) {
      toast({ title: "Invalid password", description: "Min 6 characters, alphanumeric only.", variant: "destructive" });
      return;
    }
    if (regRole === "publisher" && !regTerms) {
      toast({ title: "Terms required", description: "Publishers must accept the terms.", variant: "destructive" });
      return;
    }
    if ((regRole === "publisher" || regRole === "expert") && !regExpertise) {
      toast({ title: "Expertise required", description: "Please select your expertise field.", variant: "destructive" });
      return;
    }
    if (regRole === "expert" && !regName) {
      toast({ title: "Name required", description: "Experts must provide their full name.", variant: "destructive" });
      return;
    }

    try {
      const { user, otp } = registerUser({
        email: regEmail,
        username: regUsername,
        password: regPassword,
        role: regRole,
        expertise: regExpertise || undefined,
        name: regName || undefined,
        acceptedTerms: regTerms,
      });
      setPendingUserId(user.id);
      setOtpCode(otp);
      setOtpOpen(true);
      alert(`📱 Your OTP is: ${otp}`);
    } catch (e: any) {
      toast({ title: "Registration failed", description: e.message, variant: "destructive" });
    }
  };

  const handleOtpVerified = () => {
    const user = verifyOtp(pendingUserId);
    setSession(user);
    setOtpOpen(false);
    toast({ title: "Verified!", description: "Your account is now active." });
    navigate("/feed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Branding */}
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Newspaper className="text-accent" size={36} />
          <h1 className="text-4xl font-display font-bold tracking-tight">VeriFeed</h1>
        </div>
        <p className="text-muted-foreground text-sm font-sans">Expert-verified news you can trust</p>
      </div>

      <Card className="w-full max-w-md glass-card animate-scale-in">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your VeriFeed account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-id">Username or Email</Label>
                <Input id="login-id" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Enter username or email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-pw">Password</Label>
                <Input id="login-pw" type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)} placeholder="Enter password" />
              </div>
              <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground">Sign In</Button>

              <div className="relative my-2">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or</span>
              </div>

              <Button variant="outline" className="w-full" disabled>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </Button>
            </CardContent>
          </TabsContent>

          {/* REGISTER TAB */}
          <TabsContent value="register">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">Create Account</CardTitle>
              <CardDescription>Choose your role to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role selector */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { role: "user" as Role, icon: User, label: "User" },
                  { role: "publisher" as Role, icon: Megaphone, label: "Publisher" },
                  { role: "expert" as Role, icon: GraduationCap, label: "Expert" },
                ]).map(({ role, icon: Icon, label }) => (
                  <button
                    key={role}
                    onClick={() => setRegRole(role)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      regRole === role
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border hover:border-accent/40 text-muted-foreground"
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>

              {regRole === "expert" && (
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Dr. Jane Doe" />
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Choose a username" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Min 6 chars, alphanumeric" />
              </div>

              {(regRole === "publisher" || regRole === "expert") && (
                <div className="space-y-2">
                  <Label>Expertise</Label>
                  <Select value={regExpertise} onValueChange={setRegExpertise}>
                    <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                    <SelectContent>
                      {EXPERTISE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {regRole === "publisher" && (
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" checked={regTerms} onCheckedChange={(c) => setRegTerms(!!c)} />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                    I agree not to publish misleading or fake news. I understand my account may be banned if my content is rated poorly by experts.
                  </label>
                </div>
              )}

              <Button onClick={handleRegister} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Create Account
              </Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      <OTPDialog open={otpOpen} otp={otpCode} onVerify={handleOtpVerified} />
    </div>
  );
};

export default Auth;
