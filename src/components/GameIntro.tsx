import { Button } from "@/components/ui/button";
import { MouseTracker } from "@/components/MouseTracker";
import heroImage from "@/assets/india-hero.jpg";
interface GameIntroProps {
  onStart: () => void;
}
export const GameIntro = ({
  onStart
}: GameIntroProps) => {
  return <div className="min-h-screen flex items-center justify-center bg-gradient-hero animate-fade-in overflow-hidden relative">
      <MouseTracker />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }}></div>
        
        {/* Floating emojis */}
        <div className="absolute top-10 left-1/4 text-4xl opacity-20 animate-float" style={{
        animationDelay: '0s'
      }}>🚀</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-20 animate-float" style={{
        animationDelay: '1s'
      }}>🤖</div>
        <div className="absolute bottom-20 left-1/3 text-4xl opacity-20 animate-float" style={{
        animationDelay: '2s'
      }}>🧬</div>
        <div className="absolute top-1/4 right-10 text-4xl opacity-20 animate-float" style={{
        animationDelay: '1.5s'
      }}>⚡</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl opacity-20 animate-float" style={{
        animationDelay: '2.5s'
      }}>🌟</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="mb-6 sm:mb-8 relative group">
          <img src={heroImage} alt="Future India 2035" className="w-full h-40 sm:h-64 object-cover rounded-2xl shadow-card mb-6 sm:mb-8 transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent rounded-2xl"></div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-primary bg-clip-text text-transparent animate-glow-pulse">
          BUILD THE FUTURE
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary drop-shadow-[0_0_30px_rgba(255,138,0,0.7)] animate-glow-pulse">INDIA 2047 🇮🇳</h2>
        
        <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">🧠 "Your Decisions. Your Vision. Your Future India."
||Motto</p>
        
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-card">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">⚙️ GAME STRUCTURE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-base sm:text-lg font-semibold text-primary">🔁 Total Rounds: 8</p>
            </div>
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-base sm:text-lg font-semibold text-accent">⏱ Timer: 15 seconds each</p>
            </div>
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-base sm:text-lg font-semibold text-secondary">🎯 Goal: Shape India's Future</p>
            </div>
          </div>
        </div>
        
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
          ⏳ You have 15 seconds per round to decide. Choose wisely.
        </p>
        
        <Button onClick={onStart} size="lg" className="text-lg sm:text-xl px-8 sm:px-12 py-5 sm:py-6 bg-primary hover:bg-primary-glow shadow-intense transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-slow hover:shadow-[0_0_100px_rgba(255,138,0,0.9)] touch-manipulation">
          🚀 Start Your Journey
        </Button>
        
        <div className="mt-6 sm:mt-8 text-sm text-muted-foreground">
          <p>🏆 Unlock achievements as you shape India's future</p>
        </div>
      </div>
    </div>;
};