import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Inbox, Clock, TrendingUp, GraduationCap, BookOpen,
  Users, Building, MessagesSquare, User, Settings, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalMessages, setTotalMessages] = useState(0);
  const [storedCount, setStoredCount] = useState(0);
  const [unrespondedCount, setUnrespondedCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .single();
      if (profile?.name) setUserName(profile.name);

      const { count: total } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");

      const { count: responded } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user")
        .eq("is_responded", true);

      const { count: unresponded } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user")
        .eq("is_responded", false);

      setTotalMessages(total || 0);
      setStoredCount(responded || 0);
      setUnrespondedCount(unresponded || 0);

      const { data: recent } = await supabase
        .from("messages")
        .select("id, content, created_at, is_responded")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recent) {
        setRecentMessages(recent.map(m => ({
          id: m.id,
          preview: m.content,
          time: formatDistanceToNow(new Date(m.created_at), { addSuffix: true }),
          status: m.is_responded ? "responded" : "unresponded",
        })));
      }
    };

    fetchData();
  }, []);

  const responseRate = totalMessages > 0 ? Math.round((storedCount / totalMessages) * 100) : 100;

  const stats = [
    { icon: MessageSquare, label: "Total Messages", value: totalMessages.toString(), onClick: () => navigate("/dashboard/messages") },
    { icon: Inbox, label: "Responded", value: storedCount.toString(), onClick: () => navigate("/dashboard/messages") },
    { icon: Clock, label: "Unresponded", value: unrespondedCount.toString(), onClick: () => navigate("/dashboard/unresponded") },
    { icon: TrendingUp, label: "Response Rate", value: `${responseRate}%`, onClick: undefined },
  ];

  const quickLinks = [
    { icon: MessagesSquare, label: "Start Chat", description: "Ask the AI assistant", path: "/dashboard/chat", color: "gradient-primary" },
    { icon: Inbox, label: "Stored Messages", description: "View chat history", path: "/dashboard/messages", color: "gradient-accent" },
    { icon: MessageSquare, label: "Unresponded", description: `${unrespondedCount} pending`, path: "/dashboard/unresponded", color: "gradient-primary" },
    { icon: User, label: "My Profile", description: "View & edit profile", path: "/dashboard/profile", color: "gradient-accent" },
    { icon: GraduationCap, label: "Programs", description: "Explore our courses", path: "/dashboard/chat", color: "gradient-primary" },
    { icon: Settings, label: "Settings", description: "Account preferences", path: "/dashboard/settings", color: "gradient-accent" },
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {userName ? `Welcome, ${userName}` : "Welcome to UCU-BBUC"}
          </h1>
          <p className="text-muted-foreground mt-1">Your student information dashboard</p>
        </div>
        <Button onClick={() => navigate("/dashboard/chat")} className="hidden sm:flex gap-2">
          <MessagesSquare className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`shadow-card ${stat.onClick ? "card-hover cursor-pointer" : ""}`}
            onClick={stat.onClick}
          >
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1 lg:mt-2">{stat.value}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="shadow-card card-hover cursor-pointer group"
              onClick={() => navigate(link.path)}
            >
              <CardContent className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${link.color} flex items-center justify-center shrink-0`}>
                  <link.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm lg:text-base">{link.label}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-xl">Recent Messages</CardTitle>
          {recentMessages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/messages")}>
              View all
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
              <Button variant="outline" className="mt-3" onClick={() => navigate("/dashboard/chat")}>
                Start a conversation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate("/dashboard/messages")}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">{message.preview}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ml-3 ${
                    message.status === "unresponded"
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {message.status === "unresponded" ? "Pending" : "Replied"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
