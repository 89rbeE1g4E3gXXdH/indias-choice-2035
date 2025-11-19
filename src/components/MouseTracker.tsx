import { useEffect, useState } from "react";

interface Trail {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const MouseTracker = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let trailId = 0;
    const emojis = ['✨', '💫', '⭐', '🌟', '💥', '⚡'];

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add trail particle occasionally
      if (Math.random() > 0.85) {
        const newTrail: Trail = {
          id: trailId++,
          x: e.clientX,
          y: e.clientY,
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        };
        
        setTrails(prev => [...prev, newTrail]);
        
        // Remove trail after animation
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== newTrail.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Glowing cursor follower */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-50 rounded-full bg-primary/30 blur-xl transition-all duration-75"
        style={{ 
          left: mousePos.x - 16, 
          top: mousePos.y - 16,
        }}
      />
      
      {/* Trail particles */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-40 text-2xl animate-fade-out"
          style={{
            left: trail.x - 12,
            top: trail.y - 12,
          }}
        >
          {trail.emoji}
        </div>
      ))}
    </>
  );
};
