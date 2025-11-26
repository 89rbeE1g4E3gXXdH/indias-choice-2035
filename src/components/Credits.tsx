import { Sparkles, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
interface CreditsPerson {
  name: string;
  role: string;
  delay: number;
}
export const Credits = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  const team: CreditsPerson[] = [{
    name: "RIVAN",
    role: "⚡ CODER ⚡",
    delay: 0
  }, {
    name: "SAMANTH",
    role: "🎨 DESIGNER 🎨",
    delay: 200
  }, {
    name: "AARDRA",
    role: "🎨 DESIGNER 🎨",
    delay: 400
  }, {
    name: "VARSHINI",
    role: "🎨 DESIGNER 🎨",
    delay: 600
  }, {
    name: "VED",
    role: "👑 SUPERVISOR & PLANNER 👑",
    delay: 800
  }, {
    name: "AYAN",
    role: "🎨 DESIGNER 🎨",
    delay: 1000
  }];
  return <div className="relative py-16 overflow-hidden">
      {/* Epic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute animate-float" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}>
            <Star className="text-primary/30" size={8 + Math.random() * 12} fill="currentColor" />
          </div>)}
      </div>

      <div className="relative z-10 text-center">
        {/* Epic title */}
        <div className="mb-16 animate-scale-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sparkles className="w-12 h-12 text-primary animate-glow-pulse drop-shadow-[0_0_30px_rgba(255,138,0,1)]" />
            <h2 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,138,0,0.8)] animate-shimmer bg-[length:200%_100%]">
              CREATED BY
            </h2>
            <Sparkles className="w-12 h-12 text-primary animate-glow-pulse drop-shadow-[0_0_30px_rgba(255,138,0,1)]" />
          </div>
          <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-glow-pulse"></div>
        </div>

        {/* Team members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-12">
          {team.map((person, index) => <div key={person.name} className={`
                relative group
                transform transition-all duration-700
                ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
              `} style={{
          transitionDelay: `${person.delay}ms`
        }}>
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-glow-pulse"></div>
              
              {/* Card */}
              
            </div>)}
        </div>

        {/* Epic footer text */}
        <div className="animate-fade-in" style={{
        animationDelay: '1.2s'
      }}>
          <div className="text-2xl font-bold text-foreground mb-4 drop-shadow-[0_0_10px_rgba(255,138,0,0.5)]">
            🌟 THE ARCHITECTS OF TOMORROW 🌟
          </div>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">Together, they shaped the future of India 2047</div>
          
          {/* Animated underline */}
          <div className="mt-6 h-0.5 w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer bg-[length:200%_100%]"></div>
        </div>

        {/* Floating badges */}
        <div className="mt-12 flex justify-center gap-6 flex-wrap">
          <div className="px-6 py-3 bg-gradient-card border border-primary/40 rounded-full shadow-glow animate-bounce-in backdrop-blur-sm" style={{
          animationDelay: '1.4s'
        }}>
            <span className="text-primary font-bold drop-shadow-[0_0_10px_rgba(255,138,0,0.8)]">🏆 TEAM EXCELLENCE</span>
          </div>
          <div className="px-6 py-3 bg-gradient-card border border-accent/40 rounded-full shadow-glow animate-bounce-in backdrop-blur-sm" style={{
          animationDelay: '1.6s'
        }}>
            <span className="text-accent font-bold drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">💫 INNOVATION MASTERS</span>
          </div>
          <div className="px-6 py-3 bg-gradient-card border border-secondary/40 rounded-full shadow-glow animate-bounce-in backdrop-blur-sm" style={{
          animationDelay: '1.8s'
        }}>
            <span className="text-secondary font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">🚀 FUTURE BUILDERS</span>
          </div>
        </div>
      </div>
    </div>;
};