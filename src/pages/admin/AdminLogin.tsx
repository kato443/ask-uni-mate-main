import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Verify admin status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", data.user.id)
      .single();

    if (!profile?.is_admin) {
      // Sign the user back out — they are not an admin
      await supabase.auth.signOut();
      setIsLoading(false);
      toast({
        title: "Access denied",
        description: "This account does not have admin privileges.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: "Welcome, Admin",
      description: "You have successfully signed in to the admin panel.",
    });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Dark admin branding panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between bg-sidebar p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-sidebar-foreground">Admin Panel</span>
        </div>

        <div>
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-sidebar-foreground mb-3">
            Restricted Access
          </h2>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            This portal is reserved for authorised UCU-BBUC administrators only. Unauthorised access
            attempts are logged.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/40">
          UCU-BBUC · Bishop Barham University College &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Right Side — Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Admin Panel</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin sign in</h1>
          <p className="text-muted-foreground mb-8">
            Enter your administrator credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bbuc.ac.ug"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verifying…" : "Sign in to Admin Panel"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an admin account?{" "}
              <Link to="/admin/signup" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Not an admin?{" "}
              <Link to="/login" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
                Go to student portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
