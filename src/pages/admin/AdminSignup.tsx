import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";


const AdminSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Step 1: Create auth account
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError && !signUpError.message.includes("already registered")) {
      setIsLoading(false);
      toast({ title: "Signup failed", description: signUpError.message, variant: "destructive" });
      return;
    }

    // Step 2: Sign in immediately to get a real authenticated session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setIsLoading(false);
      toast({
        title: "Sign in failed",
        description: "Account created but could not sign in. Please try logging in from the admin login page.",
        variant: "destructive",
      });
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      setIsLoading(false);
      toast({ title: "Error", description: "Could not identify user. Please try again.", variant: "destructive" });
      return;
    }

    // Step 3: Wait briefly for the trigger to create the profile row, then update it
    await new Promise((r) => setTimeout(r, 800));

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name, is_admin: true })
      .eq("user_id", userId);

    if (profileError) {
      setIsLoading(false);
      // Likely the migration hasn't been run yet
      const isMissingColumn = profileError.message.includes("is_admin") || profileError.message.includes("column");
      toast({
        title: isMissingColumn ? "Database not ready" : "Profile update failed",
        description: isMissingColumn
          ? "The is_admin column is missing. Please run the admin migration SQL in Supabase SQL Editor first."
          : profileError.message,
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return;
    }

    setIsLoading(false);
    // Sign out so they log in fresh via admin login
    await supabase.auth.signOut();
    toast({ title: "Admin account created!", description: "You can now sign in to the admin panel." });
    navigate("/admin/login");
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side — Branding panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between bg-sidebar p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-sidebar-foreground">Admin Panel</span>
        </div>

        <div>
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-8">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-sidebar-foreground mb-3">
            Admin Registration
          </h2>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            Create a new administrator account to manage the UCU-BBUC portal, monitor user activity, and maintain the knowledge base.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/40">
          UCU-BBUC · Bishop Barham University College &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Right Side — Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Admin Registration</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create admin account</h1>
          <p className="text-muted-foreground mb-8">
            Fill in your details to create an admin account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-muted-foreground font-normal">(min. 8 characters)</span></Label>
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

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create admin account"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Already have an admin account?{" "}
              <Link to="/admin/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
