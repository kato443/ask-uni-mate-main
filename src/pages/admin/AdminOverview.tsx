import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, MessageSquare, MessagesSquare, TrendingUp, Clock, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalConversations: 0,
    respondedMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: userCount },
        { count: msgCount },
        { count: convCount },
        { count: respondedCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("role", "user"),
        supabase.from("conversations").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("role", "user").eq("is_responded", true),
        supabase
          .from("messages")
          .select("id, content, created_at, is_responded, user_id")
          .eq("role", "user")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      setStats({
        totalUsers: userCount || 0,
        totalMessages: msgCount || 0,
        totalConversations: convCount || 0,
        respondedMessages: respondedCount || 0,
      });

      if (recent) {
        // get profiles for names
        const userIds = [...new Set(recent.map((m) => m.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", userIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p])
        );
        setRecentMessages(
          recent.map((m) => ({
            id: m.id,
            content: m.content,
            time: formatDistanceToNow(new Date(m.created_at), { addSuffix: true }),
            status: m.is_responded,
            user: profileMap[m.user_id]?.name || profileMap[m.user_id]?.email || "Unknown",
          }))
        );
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const responseRate =
    stats.totalMessages > 0
      ? Math.round((stats.respondedMessages / stats.totalMessages) * 100)
      : 100;

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      color: "from-violet-500 to-indigo-500",
      onClick: () => navigate("/admin/users"),
    },
    {
      icon: MessageSquare,
      label: "Total Messages",
      value: stats.totalMessages,
      color: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/admin/messages"),
    },
    {
      icon: MessagesSquare,
      label: "Conversations",
      value: stats.totalConversations,
      color: "from-emerald-500 to-teal-500",
      onClick: () => navigate("/admin/conversations"),
    },
    {
      icon: TrendingUp,
      label: "Response Rate",
      value: `${responseRate}%`,
      color: "from-amber-500 to-orange-500",
      onClick: undefined,
    },
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Platform-wide statistics and recent activity</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <Card
            key={i}
            className={`shadow-card overflow-hidden ${stat.onClick ? "card-hover cursor-pointer" : ""}`}
            onClick={stat.onClick}
          >
            <CardContent className="p-0">
              <div className={`h-1.5 w-full bg-gradient-to-r ${stat.color}`} />
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1 lg:mt-2">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Responded vs Unresponded */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Responded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display font-bold text-foreground">
              {loading ? "—" : stats.respondedMessages}
            </p>
            <p className="text-sm text-muted-foreground mt-1">messages have been answered</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Unresponded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display font-bold text-foreground">
              {loading ? "—" : stats.totalMessages - stats.respondedMessages}
            </p>
            <p className="text-sm text-muted-foreground mt-1">messages awaiting a response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : recentMessages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">{msg.user}</span> · {msg.time}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      msg.status
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {msg.status ? "Replied" : "Pending"}
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

export default AdminOverview;
