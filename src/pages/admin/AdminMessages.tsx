import { useState, useEffect } from "react";
import { MessagesSquare, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

type FilterTab = "all" | "responded" | "unresponded";

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("id, content, created_at, is_responded, user_id, role")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(200);

      if (msgs) {
        const userIds = [...new Set(msgs.map((m) => m.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", userIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p])
        );
        const enriched = msgs.map((m) => ({
          ...m,
          userName: profileMap[m.user_id]?.name || profileMap[m.user_id]?.email || "Unknown",
          userEmail: profileMap[m.user_id]?.email || "",
          timeAgo: formatDistanceToNow(new Date(m.created_at), { addSuffix: true }),
        }));
        setMessages(enriched);
        setFiltered(enriched);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let list = messages;
    if (tab === "responded") list = list.filter((m) => m.is_responded);
    if (tab === "unresponded") list = list.filter((m) => !m.is_responded);
    if (q) {
      list = list.filter(
        (m) =>
          m.content?.toLowerCase().includes(q) ||
          m.userName?.toLowerCase().includes(q) ||
          m.userEmail?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, tab, messages]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "responded", label: "Responded" },
    { key: "unresponded", label: "Unresponded" },
  ];

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">All student messages across the platform</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <MessagesSquare className="w-5 h-5" />
              {loading ? "Loading…" : `${filtered.length} messages`}
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages or users…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-2">
            {tabs.map((t) => (
              <Button
                key={t.key}
                size="sm"
                variant={tab === t.key ? "default" : "outline"}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading messages…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessagesSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-2">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">{msg.userName}</span>
                      {msg.userEmail && msg.userName !== msg.userEmail && (
                        <span className="text-muted-foreground/70"> · {msg.userEmail}</span>
                      )}
                      {" · "}{msg.timeAgo}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      msg.is_responded
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {msg.is_responded ? "Replied" : "Pending"}
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

export default AdminMessages;
