import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { signInAsDemo } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleEnterDemo = async () => {
    setLoading(true);
    const { error } = await signInAsDemo();
    setLoading(false);

    if (error) {
      toast({
        title: "Could not start demo",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demo unlocked",
      description: "Exploring EstateFlow with local dummy data.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-strong rounded-2xl p-8 border border-white/10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">EstateFlow</span>
          </Link>
          <h1 className="text-2xl font-semibold mb-2">Try the live UI demo</h1>
          <p className="text-muted-foreground text-sm">
            No signup required. One click opens the full dashboard with local dummy data.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              Demo mode includes
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Leads kanban, properties, team &amp; reports</li>
              <li>Create / edit / delete persisted in localStorage</li>
              <li>Mock WhatsApp status — no backend needed</li>
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full gap-2 glow-emerald"
            onClick={handleEnterDemo}
            disabled={loading}
          >
            {loading ? "Opening…" : "Enter Demo Dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link to="/">Back to landing</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
