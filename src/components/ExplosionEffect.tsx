import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

interface ExplosionEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export const ExplosionEffect = ({ x, y, onComplete }: ExplosionEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(25, 95%, 58%)',  // primary
      'hsl(25, 95%, 68%)',  // primary-glow
      'hsl(45, 100%, 60%)', // gold
      'hsl(250, 70%, 60%)', // accent
    ];

    const newParticles: Particle[] = [];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 80 + Math.random() * 50;
      
      newParticles.push({
        id: i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 800);

    return () => clearTimeout(timer);
  }, [x, y, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {/* Expanding ring */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 border-2 border-primary rounded-full animate-ring-expand opacity-60"></div>
      </div>

      {/* Flash effect */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-ping"></div>

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-explosion-particle"
          style={{
            '--tx': `${particle.x}px`,
            '--ty': `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${particle.color}`,
            left: '-4px',
            top: '-4px',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
