import { useState, useEffect } from "react";
import { MessageSquare, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";

const AdminConversations = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, title, user_id, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(200);

      if (convs) {
        const userIds = [...new Set(convs.map((c) => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", userIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p])
        );

        // get message counts per conversation
        const { data: msgRows } = await supabase
          .from("messages")
          .select("conversation_id")
          .in("conversation_id", convs.map((c) => c.id));
        const countMap: Record<string, number> = {};
        (msgRows || []).forEach((m) => {
          countMap[m.conversation_id] = (countMap[m.conversation_id] || 0) + 1;
        });

        const enriched = convs.map((c) => ({
          ...c,
          userName: profileMap[c.user_id]?.name || profileMap[c.user_id]?.email || "Unknown",
          userEmail: profileMap[c.user_id]?.email || "",
          messageCount: countMap[c.id] || 0,
          updatedAgo: formatDistanceToNow(new Date(c.updated_at), { addSuffix: true }),
          createdDate: format(new Date(c.created_at), "MMM d, yyyy"),
        }));
        setConversations(enriched);
        setFiltered(enriched);
      }
      setLoading(false);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      conversations.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.userName?.toLowerCase().includes(q) ||
          c.userEmail?.toLowerCase().includes(q)
      )
    );
  }, [search, conversations]);

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Conversations</h1>
        <p className="text-muted-foreground mt-1">All chat sessions across the platform</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {loading ? "Loading…" : `${filtered.length} conversations`}
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations or users…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading conversations…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 pr-4 text-muted-foreground font-medium">Title / User</th>
                    <th className="text-center pb-3 pr-4 text-muted-foreground font-medium hidden sm:table-cell">Messages</th>
                    <th className="text-right pb-3 pr-4 text-muted-foreground font-medium hidden md:table-cell">Created</th>
                    <th className="text-right pb-3 text-muted-foreground font-medium">Last activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((conv) => (
                    <tr key={conv.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground truncate max-w-xs">
                          {conv.title || "Untitled conversation"}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-bold text-white">
                              {(conv.userName || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conv.userName}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-center font-medium text-foreground hidden sm:table-cell">
                        {conv.messageCount}
                      </td>
                      <td className="py-3 pr-4 text-right text-muted-foreground text-xs hidden md:table-cell whitespace-nowrap">
                        {conv.createdDate}
                      </td>
                      <td className="py-3 text-right text-muted-foreground text-xs whitespace-nowrap">
                        {conv.updatedAgo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConversations;
