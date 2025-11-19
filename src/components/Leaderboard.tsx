import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MouseTracker } from "@/components/MouseTracker";

interface LeaderboardEntry {
  id: string;
  player_name: string;
  leadership_score: number;
  created_at: string;
}

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today'>('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    let query = supabase
      .from('leaderboard')
      .select('id, player_name, leadership_score, created_at')
      .order('leadership_score', { ascending: false })
      .limit(100);

    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query = query.gte('created_at', today.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
    } else {
      setEntries(data || []);
    }
    
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600 fill-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6 animate-fade-in relative overflow-hidden">
      <MouseTracker />
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent animate-glow-pulse">
            🏆 GLOBAL LEADERBOARD
          </h1>
          <p className="text-xl text-muted-foreground">
            Top Visionaries Shaping India's Future
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="transition-all duration-300 hover:scale-105"
          >
            <Trophy className="w-4 h-4 mr-2" />
            All Time
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            onClick={() => setFilter('today')}
            className="transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
        </div>

        {/* Leaderboard table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card mb-8">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-pulse">Loading leaderboard...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No entries yet. Be the first to shape India's future!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {entries.map((entry, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;
                
                return (
                  <div
                    key={entry.id}
                    className={`group p-4 flex items-center gap-4 transition-all duration-300 hover:bg-primary/5 ${
                      isTopThree ? 'bg-gradient-to-r from-primary/10 to-transparent' : ''
                    }`}
                  >
                    <div className="w-12 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${isTopThree ? 'text-primary' : 'text-foreground'} group-hover:text-primary transition-colors`}>
                        {entry.player_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isTopThree ? 'text-primary animate-glow-pulse' : 'text-foreground'}`}>
                        {entry.leadership_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">Leadership Score</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-primary hover:bg-primary-glow shadow-intense transition-all duration-300 hover:scale-105"
          >
            🎮 Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};
