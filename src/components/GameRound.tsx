import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { ExplosionEffect } from "@/components/ExplosionEffect";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface Choice {
  icon: string;
  title: string;
  description: string;
  value: string;
}

interface Round {
  number: number;
  title: string;
  question: string;
  choices: Choice[];
}

interface GameRoundProps {
  round: Round;
  onChoice: (choice: string) => void;
}

export const GameRound = ({ round, onChoice }: GameRoundProps) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [explosion, setExplosion] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);
  const { playSelect, playCountdown, playExplosion } = useSoundEffects();
  const lastCountdownRef = useRef<number>(15);

  useEffect(() => {
    setTimeLeft(15);
    setSelectedChoice(null);
    setExplosion(null);
    setShake(false);
  }, [round]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onChoice(selectedChoice || "no_choice");
      return;
    }

    // Play countdown sound for last 5 seconds
    if (timeLeft <= 5 && timeLeft < lastCountdownRef.current) {
      playCountdown();
    }
    lastCountdownRef.current = timeLeft;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedChoice, onChoice, playCountdown]);

  const handleChoice = (choice: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedChoice(choice);
    playSelect();
    
    // Trigger explosion at click position
    const rect = event.currentTarget.getBoundingClientRect();
    setExplosion({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    
    // Play explosion sound slightly delayed
    setTimeout(() => playExplosion(), 100);
    
    // Screen shake effect
    setShake(true);
    setTimeout(() => setShake(false), 500);
    
    setTimeout(() => onChoice(choice), 500);
  };

  const progressValue = (timeLeft / 15) * 100;

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-hero p-4 sm:p-6 animate-fade-in relative overflow-hidden ${shake ? 'animate-screen-shake' : ''}`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Floating particles - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 text-2xl opacity-30 animate-float" style={{animationDelay: '0s'}}>✨</div>
        <div className="hidden sm:block absolute top-40 right-20 text-2xl opacity-30 animate-float" style={{animationDelay: '1s'}}>⚡</div>
        <div className="hidden sm:block absolute bottom-20 left-1/4 text-2xl opacity-30 animate-float" style={{animationDelay: '2s'}}>💫</div>
        <div className="hidden sm:block absolute top-60 right-1/3 text-2xl opacity-30 animate-float" style={{animationDelay: '1.5s'}}>🌟</div>
        <div className="hidden sm:block absolute bottom-40 right-10 text-2xl opacity-30 animate-float" style={{animationDelay: '2.5s'}}>✨</div>
        
        {/* Time pressure effect */}
        {timeLeft <= 5 && (
          <>
            <div className="absolute inset-0 bg-destructive/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-destructive to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-destructive to-transparent animate-pulse"></div>
          </>
        )}
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-primary animate-glow-pulse">
            🌟 ROUND {round.number}: {round.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground mb-4 px-2">{round.question}</p>
          
          <div className="max-w-md mx-auto px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base text-muted-foreground">Time Remaining:</span>
              <span className={`text-xl sm:text-2xl font-bold ${timeLeft <= 5 ? 'text-destructive animate-glow-pulse' : 'text-primary'}`}>
                ⏰ {timeLeft}s
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
            {timeLeft <= 5 && (
              <p className="text-destructive text-sm mt-2 animate-bounce font-bold">⚠️ HURRY! Time is running out!</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {round.choices.map((choice, index) => (
            <button
              key={index}
              onClick={(e) => handleChoice(choice.value, e)}
              disabled={selectedChoice !== null}
              className={`
                group relative p-4 sm:p-6 rounded-xl border-2 overflow-hidden
                bg-gradient-card backdrop-blur-sm
                transition-all duration-500 text-left
                hover:scale-105 sm:hover:scale-110 hover:shadow-intense hover:border-primary
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedChoice === choice.value ? 'border-primary scale-105 sm:scale-110 shadow-intense animate-glow-pulse' : 'border-border hover:border-primary/50'}
                animate-scale-in touch-manipulation
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Intense shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Glow overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Sparkle particles on hover - hidden on mobile for performance */}
              <div className="hidden sm:block absolute -top-2 -left-2 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-fly-debris-1 transition-opacity">✨</div>
              <div className="hidden sm:block absolute -top-2 -right-2 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-fly-debris-2 transition-opacity">💫</div>
              <div className="hidden sm:block absolute -bottom-2 -left-2 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-fly-debris-3 transition-opacity">⚡</div>
              <div className="hidden sm:block absolute -bottom-2 -right-2 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-fly-debris-4 transition-opacity">🌟</div>
              
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transform group-hover:scale-125 transition-transform duration-300 filter group-hover:drop-shadow-[0_0_15px_rgba(255,138,0,0.8)]">{choice.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors relative z-10 group-hover:drop-shadow-[0_0_10px_rgba(255,138,0,0.5)]">
                {choice.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground relative z-10">
                {choice.description}
              </p>
              
              {selectedChoice === choice.value && (
                <>
                  <div className="absolute inset-0 border-2 border-primary rounded-xl animate-glow-pulse shadow-intense"></div>
                  <div className="absolute inset-0 bg-primary/20 rounded-xl animate-pulse"></div>
                  <div className="absolute top-2 right-2 z-20">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary fill-current animate-bounce-in drop-shadow-[0_0_20px_rgba(255,138,0,1)]" />
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
        
        {/* Explosion effect */}
        {explosion && (
          <ExplosionEffect
            x={explosion.x}
            y={explosion.y}
            onComplete={() => setExplosion(null)}
          />
        )}
      </div>
    </div>
  );
};
