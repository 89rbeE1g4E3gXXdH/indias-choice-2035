import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface AyanMiniGameProps {
  onExit: () => void;
}

const roasts = [
  "Nice try being the GOAT, Ayan!",
  "You're more like a baby goat!",
  "GOAT? More like GHOST... disappearing!",
  "Ayan thought he was special!",
  "Caught you slacking!",
  "Where's your crown now?",
  "Not so fast, 'GOAT'!",
  "Ayan.exe has stopped working!",
  "Legend says Ayan is still running!",
  "Even a turtle is faster!",
];

export const AyanMiniGame = ({ onExit }: AyanMiniGameProps) => {
  const [ayanPosition, setAyanPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [conquered, setConquered] = useState(false);
  const [currentRoast, setCurrentRoast] = useState("");
  const [showRoast, setShowRoast] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  const moveAyan = useCallback(() => {
    setAyanPosition({
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25,
    });
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (gameOver) return;
    
    // Add click effect
    const rect = e.currentTarget.getBoundingClientRect();
    const newEffect = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(ef => ef.id !== newEffect.id));
    }, 600);

    // Screen shake
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);

    // Show roast
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    setCurrentRoast(randomRoast);
    setShowRoast(true);
    setTimeout(() => setShowRoast(false), 1500);

    // Update combo
    setComboCount(prev => prev + 1);

    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= 5) {
        setConquered(true);
        setGameOver(true);
      }
      return newScore;
    });
    moveAyan();
  };

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const moveInterval = setInterval(() => {
      moveAyan();
      setComboCount(0);
    }, 1200);
    return () => clearInterval(moveInterval);
  }, [gameOver, moveAyan]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setConquered(false);
    setCurrentRoast("");
    setShowRoast(false);
    setComboCount(0);
    moveAyan();
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-hero animate-fade-in p-4 transition-all ${screenShake ? 'animate-pulse' : ''}`}>
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 animate-glow-pulse">
          Conquer Ayan
        </h1>
        <p className="text-muted-foreground mb-4">Click on Ayan 5 times to prove he is NOT the GOAT</p>
        
        {/* Score display with effects */}
        <div className="flex gap-8 justify-center text-xl">
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <span className="text-foreground">Score: </span>
            <span className={`text-primary font-bold ${score > 0 ? 'animate-pulse' : ''}`}>{score}/5</span>
          </div>
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <span className="text-foreground">Time: </span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-accent'}`}>{timeLeft}s</span>
          </div>
          {comboCount > 1 && (
            <div className="bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary animate-bounce">
              <span className="text-primary font-bold">x{comboCount} COMBO</span>
            </div>
          )}
        </div>
      </div>

      {/* Roast display */}
      {showRoast && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-intense text-lg font-bold animate-bounce">
            {currentRoast}
          </div>
        </div>
      )}

      {/* Game area */}
      <div 
        className={`relative w-full max-w-2xl h-80 bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl overflow-hidden shadow-card transition-transform ${screenShake ? 'scale-[1.02]' : ''}`}
      >
        {/* Click effects */}
        {clickEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{ left: effect.x, top: effect.y }}
          >
            <div className="w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 animate-ping" />
            <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70 animate-ping" style={{ animationDelay: '0.1s' }} />
          </div>
        ))}

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>

        {!gameOver && (
          <button
            onClick={handleClick}
            className="absolute transition-all duration-150 hover:scale-150 cursor-pointer select-none group"
            style={{
              left: `${ayanPosition.x}%`,
              top: `${ayanPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Ayan with darker skin tone */}
            <span className="text-6xl drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(255,138,0,0.8)] transition-all">
              👦🏾
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse -z-10" />
          </button>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            {conquered ? (
              <>
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  You Conquered Ayan
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-4 animate-pulse">
                  AYAN IS NOT THE GOATTTT
                </p>
                <p className="text-muted-foreground">He never was, he never will be</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-bold text-destructive mb-2">Ayan Escaped</h2>
                <p className="text-muted-foreground mb-2">You only caught him {score} times</p>
                <p className="text-sm text-muted-foreground">Maybe Ayan IS the GOAT after all... just kidding</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6 relative z-10">
        {gameOver && (
          <Button onClick={resetGame} className="bg-primary hover:bg-primary-glow shadow-intense hover:scale-105 transition-all">
            Play Again
          </Button>
        )}
        <Button onClick={onExit} variant="outline" className="hover:scale-105 transition-all">
          Exit
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground max-w-md text-center bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border relative z-10">
        <p className="font-semibold mb-2 text-foreground">How to Conquer Ayan:</p>
        <ul className="space-y-1">
          <li>1. Click on Ayan before he moves away</li>
          <li>2. Catch him 5 times to prove he is NOT the GOAT</li>
          <li>3. You have 15 seconds - be quick</li>
          <li>4. Build combos for extra satisfaction</li>
        </ul>
      </div>
    </div>
  );
};
