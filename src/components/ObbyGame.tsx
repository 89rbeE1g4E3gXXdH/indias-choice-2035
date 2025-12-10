import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerProps {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
  onFall: () => void;
  onWin: () => void;
  gameActive: boolean;
  level: number;
}

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  moving?: { axis: 'x' | 'z'; range: number; speed: number };
  rotating?: boolean;
  disappearing?: boolean;
}

interface ObstacleProps {
  position: [number, number, number];
  type: 'spinner' | 'pusher' | 'spikes';
}

// Helper to get platform collision data
const getPlatformData = (level: number): { position: [number, number, number]; size: [number, number, number] }[] => {
  const platforms: { position: [number, number, number]; size: [number, number, number] }[] = [];
  
  // Starting platform
  platforms.push({ position: [0, 0, 0], size: [4, 0.5, 4] });

  if (level === 1) {
    platforms.push({ position: [0, 0, -6], size: [3, 0.5, 3] });
    platforms.push({ position: [3, 0, -12], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -18], size: [3, 0.5, 3] });
    platforms.push({ position: [-3, 0, -24], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -30], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -36], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -42], size: [5, 0.5, 5] });
  } else if (level === 2) {
    platforms.push({ position: [0, 0, -6], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 1, -14], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -22], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -30], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -36], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -42], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 2, -50], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -58], size: [5, 0.5, 5] });
  } else {
    platforms.push({ position: [0, 0, -6], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 1, -14], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [-4, 0, -22], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -22], size: [2, 0.5, 2] });
    platforms.push({ position: [4, 0, -22], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -30], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 2, -38], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 4, -48], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 2, -58], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [0, 0, -68], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -78], size: [6, 0.5, 6] });
  }
  
  return platforms;
};

// Player Ball Component
const Player = ({ position, setPosition, onFall, onWin, gameActive, level }: PlayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const isGrounded = useRef(true);
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.current.w = true;
      if (e.key.toLowerCase() === 'a') keys.current.a = true;
      if (e.key.toLowerCase() === 's') keys.current.s = true;
      if (e.key.toLowerCase() === 'd') keys.current.d = true;
      if (e.key === ' ') keys.current.space = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w') keys.current.w = false;
      if (e.key.toLowerCase() === 'a') keys.current.a = false;
      if (e.key.toLowerCase() === 's') keys.current.s = false;
      if (e.key.toLowerCase() === 'd') keys.current.d = false;
      if (e.key === ' ') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !gameActive) return;

    const moveSpeed = 5;
    const jumpForce = 8;
    const gravity = 20;
    const maxFallSpeed = 15;
    const friction = 0.85;

    // Horizontal movement (direct velocity setting for snappy control)
    if (keys.current.w) velocity.current.z = -moveSpeed;
    else if (keys.current.s) velocity.current.z = moveSpeed;
    else velocity.current.z *= friction;

    if (keys.current.a) velocity.current.x = -moveSpeed;
    else if (keys.current.d) velocity.current.x = moveSpeed;
    else velocity.current.x *= friction;

    // Jump (only when grounded)
    if (keys.current.space && isGrounded.current) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
    }

    // Apply gravity
    if (!isGrounded.current) {
      velocity.current.y -= gravity * delta;
      velocity.current.y = Math.max(velocity.current.y, -maxFallSpeed);
    }

    // Calculate new position
    const newX = position[0] + velocity.current.x * delta;
    const newY = position[1] + velocity.current.y * delta;
    const newZ = position[2] + velocity.current.z * delta;

    // Platform collision - check if player is above a platform
    const playerRadius = 0.5;
    const platforms = getPlatformData(level);
    let groundY = -100; // Default to falling
    
    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const [sx, sy, sz] = platform.size;
      
      // Check if player is within platform bounds (x and z)
      if (
        newX >= px - sx / 2 - playerRadius &&
        newX <= px + sx / 2 + playerRadius &&
        newZ >= pz - sz / 2 - playerRadius &&
        newZ <= pz + sz / 2 + playerRadius
      ) {
        const platformTop = py + sy / 2;
        // Check if player is above or landing on platform
        if (position[1] >= platformTop && newY <= platformTop + playerRadius) {
          groundY = Math.max(groundY, platformTop + playerRadius);
        }
      }
    }

    // Apply ground collision
    if (newY <= groundY) {
      isGrounded.current = true;
      velocity.current.y = 0;
      setPosition([newX, groundY, newZ]);
    } else {
      isGrounded.current = false;
      setPosition([newX, newY, newZ]);
    }

    // Fall detection
    if (newY < -10) {
      onFall();
    }

    // Win detection
    const winZ = level === 1 ? -40 : level === 2 ? -60 : -80;
    if (newZ < winZ) {
      onWin();
    }

    // Update mesh
    meshRef.current.position.set(position[0], position[1], position[2]);
    meshRef.current.rotation.x += velocity.current.z * delta * 2;
    meshRef.current.rotation.z -= velocity.current.x * delta * 2;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#ff6b6b" metalness={0.3} roughness={0.4} />
    </mesh>
  );
};

// Platform Component
const Platform = ({ position, size, color, moving, rotating, disappearing }: PlatformProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(true);
  const initialPos = useRef(position);
  const time = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    if (moving) {
      const offset = Math.sin(time.current * moving.speed) * moving.range;
      if (moving.axis === 'x') {
        meshRef.current.position.x = initialPos.current[0] + offset;
      } else {
        meshRef.current.position.z = initialPos.current[2] + offset;
      }
    }

    if (rotating) {
      meshRef.current.rotation.y += delta * 0.5;
    }

    if (disappearing) {
      const cycle = Math.floor(time.current * 0.5) % 2;
      setVisible(cycle === 0);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
    </mesh>
  );
};

// Obstacle Component
const Obstacle = ({ position, type }: ObstacleProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    if (type === 'spinner') {
      meshRef.current.rotation.y += delta * 2;
    } else if (type === 'pusher') {
      meshRef.current.position.x = position[0] + Math.sin(time.current * 2) * 3;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {type === 'spinner' && (
        <mesh castShadow>
          <boxGeometry args={[6, 0.5, 0.5]} />
          <meshStandardMaterial color="#e74c3c" metalness={0.5} roughness={0.3} />
        </mesh>
      )}
      {type === 'pusher' && (
        <mesh castShadow>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial color="#9b59b6" metalness={0.5} roughness={0.3} />
        </mesh>
      )}
      {type === 'spikes' && (
        <>
          {[-1, 0, 1].map((offset) => (
            <mesh key={offset} position={[offset * 0.8, 0.5, 0]} castShadow>
              <coneGeometry args={[0.3, 1, 8]} />
              <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.2} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

// Checkpoint flag
const Checkpoint = ({ position }: { position: [number, number, number] }) => {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (flagRef.current) {
      flagRef.current.rotation.y += delta;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh ref={flagRef} position={[0.5, 2.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

// Level Generator
const generateLevel = (level: number) => {
  const platforms: PlatformProps[] = [];
  const obstacles: ObstacleProps[] = [];

  // Starting platform
  platforms.push({ position: [0, 0, 0], size: [4, 0.5, 4], color: '#3498db' });

  if (level === 1) {
    // Easy level - basic platforms
    platforms.push({ position: [0, 0, -6], size: [3, 0.5, 3], color: '#2ecc71' });
    platforms.push({ position: [3, 0, -12], size: [3, 0.5, 3], color: '#e67e22' });
    platforms.push({ position: [0, 0, -18], size: [3, 0.5, 3], color: '#9b59b6' });
    platforms.push({ position: [-3, 0, -24], size: [3, 0.5, 3], color: '#1abc9c' });
    platforms.push({ position: [0, 0, -30], size: [3, 0.5, 3], color: '#e74c3c' });
    platforms.push({ position: [0, 0, -36], size: [3, 0.5, 3], color: '#f39c12' });
    platforms.push({ position: [0, 0, -42], size: [5, 0.5, 5], color: '#2ecc71' }); // End
  } else if (level === 2) {
    // Medium level - moving platforms
    platforms.push({ position: [0, 0, -6], size: [3, 0.5, 3], color: '#2ecc71', moving: { axis: 'x', range: 3, speed: 1 } });
    platforms.push({ position: [0, 1, -14], size: [3, 0.5, 3], color: '#e67e22' });
    obstacles.push({ position: [0, 1.5, -14], type: 'spinner' });
    platforms.push({ position: [0, 0, -22], size: [3, 0.5, 3], color: '#9b59b6', moving: { axis: 'x', range: 4, speed: 1.5 } });
    platforms.push({ position: [0, 0, -30], size: [2, 0.5, 2], color: '#1abc9c', disappearing: true });
    platforms.push({ position: [0, 0, -36], size: [2, 0.5, 2], color: '#1abc9c', disappearing: true });
    platforms.push({ position: [0, 0, -42], size: [3, 0.5, 3], color: '#e74c3c' });
    platforms.push({ position: [0, 2, -50], size: [3, 0.5, 3], color: '#f39c12' });
    platforms.push({ position: [0, 0, -58], size: [5, 0.5, 5], color: '#2ecc71' }); // End
  } else {
    // Hard level - everything!
    platforms.push({ position: [0, 0, -6], size: [2, 0.5, 2], color: '#2ecc71', moving: { axis: 'x', range: 4, speed: 2 } });
    obstacles.push({ position: [3, 0.5, -6], type: 'pusher' });
    platforms.push({ position: [0, 1, -14], size: [2.5, 0.5, 2.5], color: '#e67e22', rotating: true });
    obstacles.push({ position: [0, 1.5, -14], type: 'spinner' });
    platforms.push({ position: [-4, 0, -22], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [0, 0, -22], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [4, 0, -22], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [0, 0, -30], size: [3, 0.5, 3], color: '#1abc9c' });
    obstacles.push({ position: [0, 0, -30], type: 'spikes' });
    platforms.push({ position: [0, 2, -38], size: [2, 0.5, 2], color: '#e74c3c', moving: { axis: 'z', range: 3, speed: 2 } });
    platforms.push({ position: [0, 4, -48], size: [2, 0.5, 2], color: '#f39c12', moving: { axis: 'x', range: 5, speed: 2.5 } });
    obstacles.push({ position: [0, 4.5, -48], type: 'spinner' });
    platforms.push({ position: [0, 2, -58], size: [2.5, 0.5, 2.5], color: '#3498db', rotating: true });
    platforms.push({ position: [0, 0, -68], size: [3, 0.5, 3], color: '#2ecc71' });
    platforms.push({ position: [0, 0, -78], size: [6, 0.5, 6], color: '#f1c40f' }); // End
  }

  return { platforms, obstacles };
};

// Camera Controller
const CameraController = ({ target }: { target: [number, number, number] }) => {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(
      new THREE.Vector3(target[0], target[1] + 8, target[2] + 12),
      0.05
    );
    camera.lookAt(target[0], target[1], target[2]);
  });

  return null;
};

// Main Scene
const GameScene = ({
  level,
  onFall,
  onWin,
  gameActive,
  playerPos,
  setPlayerPos,
}: {
  level: number;
  onFall: () => void;
  onWin: () => void;
  gameActive: boolean;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
}) => {
  const { platforms, obstacles } = generateLevel(level);

  return (
    <>
      <CameraController target={playerPos} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 10, -30]} intensity={0.5} color="#ff6b6b" />
      
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      <Player
        position={playerPos}
        setPosition={setPlayerPos}
        onFall={onFall}
        onWin={onWin}
        gameActive={gameActive}
        level={level}
      />

      {platforms.map((platform, i) => (
        <Platform key={`platform-${i}`} {...platform} />
      ))}

      {obstacles.map((obstacle, i) => (
        <Obstacle key={`obstacle-${i}`} {...obstacle} />
      ))}

      <Checkpoint position={[0, 0, level === 1 ? -42 : level === 2 ? -58 : -78]} />

      {/* Floor visual (danger zone) */}
      <mesh position={[0, -15, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 200]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
    </>
  );
};

// Main Game Component
interface ObbyGameProps {
  onExit: () => void;
}

export const ObbyGame = ({ onExit }: ObbyGameProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'lost'>('menu');
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0.5, 0]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = (selectedLevel: number) => {
    setLevel(selectedLevel);
    setLives(3);
    setPlayerPos([0, 0.5, 0]);
    setTime(0);
    setGameState('playing');
  };

  const handleFall = useCallback(() => {
    setLives((l) => {
      if (l <= 1) {
        setGameState('lost');
        return 0;
      }
      setPlayerPos([0, 0.5, 0]);
      return l - 1;
    });
  }, []);

  const handleWin = useCallback(() => {
    setGameState('won');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 z-50">
      {/* Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]">
              🏃 OBBY RUSH
            </h1>
            <p className="text-xl text-purple-200">Navigate through obstacles to reach the end!</p>
            
            <div className="space-y-4">
              <p className="text-lg text-white/80">Select Difficulty:</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => startGame(1)}
                  className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-500/30"
                >
                  🌱 Easy
                </button>
                <button
                  onClick={() => startGame(2)}
                  className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-yellow-500/30"
                >
                  ⚡ Medium
                </button>
                <button
                  onClick={() => startGame(3)}
                  className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-500/30"
                >
                  🔥 Hard
                </button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-3">Controls:</h3>
              <div className="grid grid-cols-2 gap-2 text-white/80">
                <span>W / ↑</span><span>Move Forward</span>
                <span>S / ↓</span><span>Move Backward</span>
                <span>A / ←</span><span>Move Left</span>
                <span>D / →</span><span>Move Right</span>
                <span>Space</span><span>Jump</span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
            >
              ← Back to Game
            </button>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      {gameState === 'playing' && (
        <>
          <Canvas shadows camera={{ position: [0, 10, 15], fov: 60 }}>
            <GameScene
              level={level}
              onFall={handleFall}
              onWin={handleWin}
              gameActive={true}
              playerPos={playerPos}
              setPlayerPos={setPlayerPos}
            />
          </Canvas>

          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">❤️</span>
                <span className="text-white font-bold text-xl">{lives}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-white font-bold text-xl">{formatTime(time)}</span>
              </div>
              <div className="text-purple-300 text-sm">
                Level {level} - {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
              </div>
            </div>

            <button
              onClick={() => setGameState('menu')}
              className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-black/70 transition-all"
            >
              ⏸️ Menu
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="absolute bottom-4 left-4 md:hidden">
            <div className="text-white/50 text-sm">Use WASD + Space to play</div>
          </div>
        </>
      )}

      {/* Win Screen */}
      {gameState === 'won' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <div className="text-center space-y-6 animate-scale-in">
            <div className="text-8xl">🏆</div>
            <h2 className="text-5xl font-bold text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]">
              LEVEL COMPLETE!
            </h2>
            <p className="text-2xl text-white">
              Time: {formatTime(time)} | Lives Left: {lives}
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => startGame(level)}
                className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                🔄 Replay
              </button>
              {level < 3 && (
                <button
                  onClick={() => startGame(level + 1)}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  ➡️ Next Level
                </button>
              )}
              <button
                onClick={() => setGameState('menu')}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                📋 Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lose Screen */}
      {gameState === 'lost' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <div className="text-center space-y-6 animate-scale-in">
            <div className="text-8xl">💀</div>
            <h2 className="text-5xl font-bold text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
              GAME OVER
            </h2>
            <p className="text-xl text-white/80">You ran out of lives!</p>
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => startGame(level)}
                className="px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                📋 Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObbyGame;
