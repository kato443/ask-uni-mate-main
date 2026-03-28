import { useState, useEffect } from "react";
import { Users, Search, GraduationCap, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('delete_admin_user', { target_user_id: userId });
      if (error) throw error;
      
      setUsers(prev => prev.filter(u => u.user_id !== userId));
      setFiltered(prev => prev.filter(u => u.user_id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, email, student_id, department, program, year, created_at, is_admin")
        .order("created_at", { ascending: false });

      if (profiles) {
        // get message counts per user
        const { data: msgCounts } = await supabase
          .from("messages")
          .select("user_id")
          .eq("role", "user");

        const countMap: Record<string, number> = {};
        (msgCounts || []).forEach((m) => {
          countMap[m.user_id] = (countMap[m.user_id] || 0) + 1;
        });

        const enriched = profiles.map((p) => ({
          ...p,
          messageCount: countMap[p.user_id] || 0,
          joinedAgo: formatDistanceToNow(new Date(p.created_at), { addSuffix: true }),
        }));
        setUsers(enriched);
        setFiltered(enriched);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.student_id?.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">All registered students and users</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Users className="w-5 h-5" />
            {loading ? "Loading…" : `${filtered.length} users`}
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, ID…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading users…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 pr-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left pb-3 pr-4 text-muted-foreground font-medium hidden md:table-cell">Student ID</th>
                    <th className="text-left pb-3 pr-4 text-muted-foreground font-medium hidden lg:table-cell">Department</th>
                    <th className="text-left pb-3 pr-4 text-muted-foreground font-medium hidden lg:table-cell">Program / Year</th>
                    <th className="text-right pb-3 pr-4 text-muted-foreground font-medium">Messages</th>
                    <th className="text-right pb-3 text-muted-foreground font-medium hidden sm:table-cell">Joined</th>
                    <th className="text-right pb-3 pl-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user) => (
                    <tr key={user.user_id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-white">
                              {(user.name || user.email || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name || "—"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          {user.is_admin && (
                            <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell">
                        {user.student_id || "—"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell">
                        {user.department || "—"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          {user.program ? (
                            <>
                              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{user.program}</span>
                              {user.year && <span className="shrink-0">· Yr {user.year}</span>}
                            </>
                          ) : "—"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right font-medium text-foreground">
                        {user.messageCount}
                      </td>
                      <td className="py-3 text-right text-muted-foreground text-xs hidden sm:table-cell whitespace-nowrap">
                        {user.joinedAgo}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        {!user.is_admin && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user's account and remove their data from the portal.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteUser(user.user_id)}
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                  Delete account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
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

export default AdminUsers;
