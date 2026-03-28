import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminKnowledgeBase() {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ keywords: "", answer: "" });

  const fetchReplies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("auto_replies" as any)
      .select("*")
      .order("created_at", { ascending: false });
    
    // It's possible the table doesn't exist yet if the migration wasn't run
    if (error && error.code !== "PGRST116") {
      toast({ title: "Database Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setReplies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  const handleOpenDialog = (reply?: any) => {
    if (reply) {
      setEditingId(reply.id);
      setFormData({ keywords: reply.keywords.join(", "), answer: reply.answer });
    } else {
      setEditingId(null);
      setFormData({ keywords: "", answer: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const kws = formData.keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
    if (kws.length === 0 || !formData.answer.trim()) {
      toast({ title: "Validation Error", description: "Keywords and answer are required.", variant: "destructive" });
      return;
    }

    const payload = { keywords: kws, answer: formData.answer.trim() };

    if (editingId) {
      const { error } = await supabase.from("auto_replies" as any).update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Knowledge base entry updated." });
        setIsDialogOpen(false);
        fetchReplies();
      }
    } else {
      const { error } = await supabase.from("auto_replies" as any).insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Knowledge base entry added." });
        setIsDialogOpen(false);
        fetchReplies();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this specific entry?")) return;
    const { error } = await supabase.from("auto_replies" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Entry deleted." });
      fetchReplies();
    }
  };

  const filtered = replies.filter(r => 
    r.answer.toLowerCase().includes(search.toLowerCase()) || 
    r.keywords.some((k: string) => k.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pt-12 lg:pt-0 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage automated answers for the AI chat</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 border-b border-border">
          <CardTitle className="font-display text-xl flex items-center gap-2 text-foreground">
            <BookOpen className="w-5 h-5 text-primary" />
            {replies.length} Entries
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword or answer..."
              className="pl-9 bg-background focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                Loading knowledge base...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground text-lg mb-1">No FAQs found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {search ? "No entries match your search request." : "There are currently no automated answers in the database. Add one to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((reply) => (
                <div key={reply.id} className="p-5 sm:p-6 hover:bg-muted/30 transition-colors flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {reply.keywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleOpenDialog(reply)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(reply.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-primary/20">
                    {reply.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border shadow-2xl">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-border text-left">
            <DialogTitle className="font-display text-xl text-foreground">
              {editingId ? "Edit Auto Answer" : "Add Auto Answer"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Trigger Keywords</label>
              <Input 
                placeholder="e.g. admission, requirements, application" 
                value={formData.keywords}
                className="focus-visible:ring-primary/20"
                onChange={e => setFormData({...formData, keywords: e.target.value})}
              />
              <p className="text-[13px] text-muted-foreground pt-1 leading-snug">
                Provide comma-separated words. The bot will automatically fire this answer if <b className="text-foreground">all</b> these words exist in the student's question.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Automated Response</label>
              <Textarea 
                placeholder="Type the answer the bot will respond with..." 
                className="min-h-[160px] resize-y focus-visible:ring-primary/20"
                value={formData.answer}
                onChange={e => setFormData({...formData, answer: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 bg-muted/10 border-t border-border flex sm:justify-end gap-2">
            <Button variant="outline" className="sm:w-auto w-full" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button className="sm:w-auto w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
              {editingId ? "Save Changes" : "Create Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
