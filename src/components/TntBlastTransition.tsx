import { useEffect, useState } from "react";

interface TntBlastTransitionProps {
  onComplete: () => void;
}

export const TntBlastTransition = ({ onComplete }: TntBlastTransitionProps) => {
  const [stage, setStage] = useState<'walking' | 'placing' | 'running' | 'explosion' | 'complete'>('walking');

  useEffect(() => {
    const timeline = [
      { stage: 'walking' as const, duration: 2000 },
      { stage: 'placing' as const, duration: 1500 },
      { stage: 'running' as const, duration: 1500 },
      { stage: 'explosion' as const, duration: 1500 },
      { stage: 'complete' as const, duration: 500 }
    ];

    let currentIndex = 0;

    const advanceStage = () => {
      if (currentIndex < timeline.length) {
        setStage(timeline[currentIndex].stage);
        currentIndex++;
        if (currentIndex < timeline.length) {
          setTimeout(advanceStage, timeline[currentIndex - 1].duration);
        } else {
          setTimeout(() => onComplete(), 500);
        }
      }
    };

    advanceStage();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-primary/5"></div>
        {stage === 'explosion' && (
          <>
            <div className="absolute inset-0 animate-pulse bg-destructive/20"></div>
            <div className="absolute inset-0 bg-gradient-radial from-destructive/40 via-primary/30 to-transparent animate-ping"></div>
          </>
        )}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Ground line */}
        <div className="absolute bottom-32 left-0 right-0 h-1 bg-border/50"></div>

        {/* Character walking/running */}
        {(stage === 'walking' || stage === 'running') && (
          <div 
            className={`absolute bottom-32 transition-all duration-1000 ${
              stage === 'walking' ? 'left-[-10%] animate-walk-in' : 'left-[50%] animate-run-away'
            }`}
            style={{
              fontSize: '4rem',
              transform: stage === 'running' ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            <div className={stage === 'walking' ? 'animate-bounce' : 'animate-bounce-fast'}>
              🚶
            </div>
          </div>
        )}

        {/* TNT being placed */}
        {(stage === 'placing' || stage === 'running' || stage === 'explosion' || stage === 'complete') && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <div className={`text-6xl ${stage === 'placing' ? 'animate-scale-in' : ''} ${stage === 'explosion' ? 'animate-ping' : ''}`}>
              {stage === 'explosion' || stage === 'complete' ? '💥' : '🧨'}
            </div>
            {stage === 'placing' && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
                ⬇️
              </div>
            )}
          </div>
        )}

        {/* Explosion effects */}
        {stage === 'explosion' && (
          <>
            <div className="absolute inset-0 animate-explosion-wave">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[200px] h-[200px] rounded-full bg-destructive/50 animate-ping"></div>
              </div>
            </div>
            <div className="absolute inset-0 animate-explosion-wave-2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[400px] h-[400px] rounded-full bg-primary/40 animate-ping"></div>
              </div>
            </div>
            <div className="absolute inset-0 animate-explosion-wave-3">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[600px] h-[600px] rounded-full bg-accent/30 animate-ping"></div>
              </div>
            </div>
            
            {/* Flying debris */}
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-1">🔥</div>
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-2">💨</div>
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-3">✨</div>
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-4">⚡</div>
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-5">💫</div>
            <div className="absolute top-1/2 left-1/2 text-4xl animate-fly-debris-6">🌟</div>
          </>
        )}

        {/* Text overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          {stage === 'walking' && (
            <h2 className="text-4xl md:text-6xl font-bold text-foreground animate-fade-in">
              Calculating Results...
            </h2>
          )}
          {stage === 'placing' && (
            <h2 className="text-4xl md:text-6xl font-bold text-primary animate-scale-in">
              Preparing Reveal...
            </h2>
          )}
          {stage === 'running' && (
            <h2 className="text-4xl md:text-6xl font-bold text-accent animate-fade-in">
              Get Ready! 🔥
            </h2>
          )}
          {stage === 'explosion' && (
            <h2 className="text-5xl md:text-7xl font-bold text-destructive animate-glow-pulse">
              💥 BOOM! 💥
            </h2>
          )}
        </div>

        {/* Countdown for explosion */}
        {stage === 'running' && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <div className="text-6xl font-bold text-destructive animate-countdown">
              3...
            </div>
          </div>
        )}
      </div>

      {/* Screen shake on explosion */}
      {stage === 'explosion' && (
        <div className="absolute inset-0 animate-screen-shake pointer-events-none"></div>
      )}
    </div>
  );
};
