import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

interface SaveScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  choices: any;
  onSaved: () => void;
}

export const SaveScoreDialog = ({ open, onOpenChange, score, choices, onSaved }: SaveScoreDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to save your score",
        variant: "destructive"
      });
      return;
    }

    if (playerName.trim().length > 50) {
      toast({
        title: "Name Too Long",
        description: "Please use a name under 50 characters",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('leaderboard')
      .insert({
        player_name: playerName.trim(),
        leadership_score: score,
        choices: choices
      });

    setSaving(false);

    if (error) {
      console.error('Error saving score:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your score. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Score Saved! 🎉",
        description: `Your leadership score of ${score}% has been added to the leaderboard!`
      });
      onOpenChange(false);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-primary">
            <Trophy className="w-6 h-6" />
            Save Your Score
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter your name to join the global leaderboard and compare your vision with other leaders!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Your Name
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={50}
              className="border-border focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !saving) {
                  handleSave();
                }
              }}
            />
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Your Leadership Score</div>
              <div className="text-4xl font-bold text-primary animate-glow-pulse">
                {score}%
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={saving}
            >
              Skip
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary-glow shadow-glow"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save to Leaderboard"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
