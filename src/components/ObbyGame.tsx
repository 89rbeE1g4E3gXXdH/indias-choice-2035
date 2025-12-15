import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Mobile input context
interface MobileInputState {
  moveX: number;
  moveZ: number;
  jump: boolean;
}

const MobileInputContext = createContext<MobileInputState>({ moveX: 0, moveZ: 0, jump: false });

// Power-up types
type PowerUpType = 'speed' | 'jump' | 'shield' | 'magnet' | 'freeze';

interface ActivePower {
  type: PowerUpType;
  timeLeft: number;
}

interface PowerUpData {
  position: [number, number, number];
  type: PowerUpType;
  collected: boolean;
}

interface PlayerProps {
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
  onFall: () => void;
  onWin: () => void;
  onHit: () => void;
  gameActive: boolean;
  level: number;
  activePowers: ActivePower[];
  obstacles: ObstacleData[];
  timeFrozen: boolean;
}

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  moving?: { axis: 'x' | 'z'; range: number; speed: number };
  rotating?: boolean;
  disappearing?: boolean;
  timeFrozen?: boolean;
}

interface ObstacleProps {
  position: [number, number, number];
  type: 'spinner' | 'pusher' | 'spikes';
  timeFrozen?: boolean;
}

interface ObstacleData {
  position: [number, number, number];
  type: 'spinner' | 'pusher' | 'spikes';
}

interface PowerUpProps {
  position: [number, number, number];
  type: PowerUpType;
  onCollect: () => void;
  collected: boolean;
  playerPos: [number, number, number];
  magnetActive: boolean;
}

// Power-up colors and info
const POWER_UP_CONFIG: Record<PowerUpType, { color: string; emissive: string; icon: string; duration: number }> = {
  speed: { color: '#ffd700', emissive: '#ffa500', icon: '⚡', duration: 5 },
  jump: { color: '#00ff00', emissive: '#00cc00', icon: '🦘', duration: 5 },
  shield: { color: '#00bfff', emissive: '#0080ff', icon: '🛡️', duration: 4 },
  magnet: { color: '#9932cc', emissive: '#8b008b', icon: '🧲', duration: 6 },
  freeze: { color: '#ffffff', emissive: '#87ceeb', icon: '❄️', duration: 3 },
};

// Helper to get platform collision data - CLOSER PLATFORMS
const getPlatformData = (level: number): { position: [number, number, number]; size: [number, number, number] }[] => {
  const platforms: { position: [number, number, number]; size: [number, number, number] }[] = [];
  
  // Starting platform
  platforms.push({ position: [0, 0, 0], size: [4, 0.5, 4] });

  if (level === 1) {
    // Easy level - closer platforms (4-5 unit gaps instead of 6-8)
    platforms.push({ position: [0, 0, -4], size: [3, 0.5, 3] });
    platforms.push({ position: [2, 0, -8], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -12], size: [3, 0.5, 3] });
    platforms.push({ position: [-2, 0, -16], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -20], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -24], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -28], size: [5, 0.5, 5] });
  } else if (level === 2) {
    // Medium level - closer moving platforms
    platforms.push({ position: [0, 0, -4], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0.5, -9], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -14], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -19], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [0, 0, -24], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [0, 0, -29], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 1, -34], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -39], size: [5, 0.5, 5] });
  } else {
    // Hard level - closer but challenging
    platforms.push({ position: [0, 0, -4], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [0, 0.5, -9], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [-3, 0, -14], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -14], size: [2, 0.5, 2] });
    platforms.push({ position: [3, 0, -14], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 0, -19], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 1.5, -24], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 2.5, -30], size: [2, 0.5, 2] });
    platforms.push({ position: [0, 1.5, -36], size: [2.5, 0.5, 2.5] });
    platforms.push({ position: [0, 0, -42], size: [3, 0.5, 3] });
    platforms.push({ position: [0, 0, -48], size: [6, 0.5, 6] });
  }
  
  return platforms;
};

// Power-Up Component
const PowerUp = ({ position, type, onCollect, collected, playerPos, magnetActive }: PowerUpProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const config = POWER_UP_CONFIG[type];
  const currentPos = useRef<[number, number, number]>([...position]);
  
  useFrame((_, delta) => {
    if (!meshRef.current || collected) return;
    
    // Floating animation
    meshRef.current.rotation.y += delta * 2;
    meshRef.current.position.y = currentPos.current[1] + Math.sin(Date.now() * 0.003) * 0.2;
    
    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      glowRef.current.scale.set(scale, scale, scale);
    }
    
    // Magnet attraction
    if (magnetActive) {
      const dx = playerPos[0] - currentPos.current[0];
      const dy = playerPos[1] - currentPos.current[1];
      const dz = playerPos[2] - currentPos.current[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (dist < 8 && dist > 0.5) {
        const speed = 5 * delta;
        currentPos.current[0] += (dx / dist) * speed;
        currentPos.current[1] += (dy / dist) * speed;
        currentPos.current[2] += (dz / dist) * speed;
        meshRef.current.position.x = currentPos.current[0];
        meshRef.current.position.z = currentPos.current[2];
      }
    }
    
    // Collection check
    const dx = playerPos[0] - currentPos.current[0];
    const dy = playerPos[1] - currentPos.current[1];
    const dz = playerPos[2] - currentPos.current[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    if (dist < 1.2) {
      onCollect();
    }
  });
  
  if (collected) return null;
  
  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={config.emissive} transparent opacity={0.3} />
      </mesh>
      
      {/* Main orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={config.color} 
          emissive={config.emissive}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner glow */}
      <pointLight color={config.color} intensity={1} distance={3} />
    </group>
  );
};

// Player Ball Component with obstacle collision
const Player = ({ position, setPosition, onFall, onWin, onHit, gameActive, level, activePowers, obstacles, timeFrozen }: PlayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const isGrounded = useRef(true);
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  const invincibleTime = useRef(0);
  const mobileInput = useContext(MobileInputContext);
  const prevJump = useRef(false);

  // Check for active powers
  const hasSpeed = activePowers.some(p => p.type === 'speed');
  const hasJump = activePowers.some(p => p.type === 'jump');
  const hasShield = activePowers.some(p => p.type === 'shield');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.current.w = true;
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.a = true;
      if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.current.s = true;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.d = true;
      if (e.key === ' ') keys.current.space = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.current.w = false;
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.a = false;
      if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.current.s = false;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.d = false;
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

    // Update invincibility timer
    if (invincibleTime.current > 0) {
      invincibleTime.current -= delta;
    }

    const baseSpeed = 5;
    const moveSpeed = hasSpeed ? baseSpeed * 2 : baseSpeed;
    const baseJump = 8;
    const jumpForce = hasJump ? baseJump * 1.5 : baseJump;
    const gravity = 20;
    const maxFallSpeed = 15;
    const friction = 0.85;

    // Horizontal movement (keyboard + mobile)
    const keyMoveZ = keys.current.w ? -1 : keys.current.s ? 1 : 0;
    const keyMoveX = keys.current.a ? -1 : keys.current.d ? 1 : 0;
    const totalMoveZ = keyMoveZ + mobileInput.moveZ;
    const totalMoveX = keyMoveX + mobileInput.moveX;
    
    if (totalMoveZ !== 0) velocity.current.z = Math.max(-1, Math.min(1, totalMoveZ)) * moveSpeed;
    else velocity.current.z *= friction;

    if (totalMoveX !== 0) velocity.current.x = Math.max(-1, Math.min(1, totalMoveX)) * moveSpeed;
    else velocity.current.x *= friction;

    // Jump (only when grounded) - keyboard or mobile
    const wantsJump = keys.current.space || (mobileInput.jump && !prevJump.current);
    prevJump.current = mobileInput.jump;
    
    if (wantsJump && isGrounded.current) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
    }

    // Apply gravity
    if (!isGrounded.current) {
      velocity.current.y -= gravity * delta;
      velocity.current.y = Math.max(velocity.current.y, -maxFallSpeed);
    }

    // Calculate new position
    let newX = position[0] + velocity.current.x * delta;
    let newY = position[1] + velocity.current.y * delta;
    let newZ = position[2] + velocity.current.z * delta;

    // Platform collision
    const playerRadius = 0.5;
    const platforms = getPlatformData(level);
    let groundY = -100;
    
    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const [sx, sy, sz] = platform.size;
      
      if (
        newX >= px - sx / 2 - playerRadius &&
        newX <= px + sx / 2 + playerRadius &&
        newZ >= pz - sz / 2 - playerRadius &&
        newZ <= pz + sz / 2 + playerRadius
      ) {
        const platformTop = py + sy / 2;
        if (position[1] >= platformTop && newY <= platformTop + playerRadius) {
          groundY = Math.max(groundY, platformTop + playerRadius);
        }
      }
    }

    // Obstacle collision (only if not frozen and not invincible)
    if (!timeFrozen && invincibleTime.current <= 0) {
      for (const obstacle of obstacles) {
        const [ox, oy, oz] = obstacle.position;
        let hitRadius = 1.5;
        let pushForce = { x: 0, z: 0 };
        
        if (obstacle.type === 'spinner') {
          hitRadius = 3; // Spinner has long reach
          const dx = newX - ox;
          const dz = newZ - oz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const dy = Math.abs(newY - oy);
          
          if (dist < hitRadius && dy < 1) {
            if (hasShield) {
              // Shield absorbs hit
              invincibleTime.current = 0.5;
            } else {
              onHit();
              invincibleTime.current = 2;
            }
          }
        } else if (obstacle.type === 'pusher') {
          const dx = newX - ox;
          const dz = newZ - oz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const dy = Math.abs(newY - oy);
          
          if (dist < 2 && dy < 2) {
            // Push the player away
            pushForce.x = (dx / dist) * 10;
            pushForce.z = (dz / dist) * 10;
            velocity.current.x += pushForce.x;
            velocity.current.z += pushForce.z;
          }
        } else if (obstacle.type === 'spikes') {
          const dx = newX - ox;
          const dz = newZ - oz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const dy = newY - oy;
          
          if (dist < 1.5 && dy < 1.5 && dy > 0) {
            if (hasShield) {
              invincibleTime.current = 0.5;
            } else {
              onHit();
              invincibleTime.current = 2;
            }
          }
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

    // Win detection - adjusted for closer platforms
    const winZ = level === 1 ? -26 : level === 2 ? -37 : -46;
    if (newZ < winZ) {
      onWin();
    }

    // Update mesh
    meshRef.current.position.set(position[0], position[1], position[2]);
    meshRef.current.rotation.x += velocity.current.z * delta * 2;
    meshRef.current.rotation.z -= velocity.current.x * delta * 2;

    // Blink when invincible
    if (invincibleTime.current > 0) {
      meshRef.current.visible = Math.floor(invincibleTime.current * 10) % 2 === 0;
    } else {
      meshRef.current.visible = true;
    }

    // Shield visual
    if (shieldRef.current) {
      shieldRef.current.position.set(position[0], position[1], position[2]);
      shieldRef.current.rotation.y += delta * 2;
      shieldRef.current.visible = hasShield;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={hasSpeed ? '#ffff00' : '#ff6b6b'} 
          metalness={0.3} 
          roughness={0.4}
          emissive={hasSpeed ? '#ff8800' : '#000000'}
          emissiveIntensity={hasSpeed ? 0.3 : 0}
        />
      </mesh>
      
      {/* Shield bubble */}
      <mesh ref={shieldRef} position={position}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#00bfff" transparent opacity={0.3} wireframe />
      </mesh>
    </>
  );
};

// Platform Component with freeze support
const Platform = ({ position, size, color, moving, rotating, disappearing, timeFrozen }: PlatformProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(true);
  const initialPos = useRef(position);
  const time = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    if (!timeFrozen) {
      time.current += delta;
    }

    if (moving && !timeFrozen) {
      const offset = Math.sin(time.current * moving.speed) * moving.range;
      if (moving.axis === 'x') {
        meshRef.current.position.x = initialPos.current[0] + offset;
      } else {
        meshRef.current.position.z = initialPos.current[2] + offset;
      }
    }

    if (rotating && !timeFrozen) {
      meshRef.current.rotation.y += delta * 0.5;
    }

    if (disappearing && !timeFrozen) {
      const cycle = Math.floor(time.current * 0.5) % 2;
      setVisible(cycle === 0);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={position} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={timeFrozen ? '#87ceeb' : color} 
        metalness={0.2} 
        roughness={0.6}
        emissive={timeFrozen ? '#00bfff' : '#000000'}
        emissiveIntensity={timeFrozen ? 0.2 : 0}
      />
    </mesh>
  );
};

// Obstacle Component with freeze support
const Obstacle = ({ position, type, timeFrozen }: ObstacleProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    if (!timeFrozen) {
      time.current += delta;

      if (type === 'spinner') {
        meshRef.current.rotation.y += delta * 2;
      } else if (type === 'pusher') {
        meshRef.current.position.x = position[0] + Math.sin(time.current * 2) * 3;
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {type === 'spinner' && (
        <mesh castShadow>
          <boxGeometry args={[6, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={timeFrozen ? '#87ceeb' : '#e74c3c'} 
            metalness={0.5} 
            roughness={0.3}
            emissive={timeFrozen ? '#00bfff' : '#ff0000'}
            emissiveIntensity={timeFrozen ? 0.3 : 0.2}
          />
        </mesh>
      )}
      {type === 'pusher' && (
        <mesh castShadow>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial 
            color={timeFrozen ? '#87ceeb' : '#9b59b6'} 
            metalness={0.5} 
            roughness={0.3}
            emissive={timeFrozen ? '#00bfff' : '#9b59b6'}
            emissiveIntensity={timeFrozen ? 0.3 : 0.2}
          />
        </mesh>
      )}
      {type === 'spikes' && (
        <>
          {[-1, 0, 1].map((offset) => (
            <mesh key={offset} position={[offset * 0.8, 0.5, 0]} castShadow>
              <coneGeometry args={[0.3, 1, 8]} />
              <meshStandardMaterial 
                color={timeFrozen ? '#87ceeb' : '#c0392b'} 
                metalness={0.6} 
                roughness={0.2}
                emissive={timeFrozen ? '#00bfff' : '#ff0000'}
                emissiveIntensity={timeFrozen ? 0.3 : 0.3}
              />
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

// Level Generator with power-ups
const generateLevel = (level: number): { platforms: PlatformProps[]; obstacles: ObstacleData[]; powerUps: PowerUpData[] } => {
  const platforms: PlatformProps[] = [];
  const obstacles: ObstacleData[] = [];
  const powerUps: PowerUpData[] = [];

  // Starting platform
  platforms.push({ position: [0, 0, 0], size: [4, 0.5, 4], color: '#3498db' });

  if (level === 1) {
    // Easy level - closer platforms
    platforms.push({ position: [0, 0, -4], size: [3, 0.5, 3], color: '#2ecc71' });
    platforms.push({ position: [2, 0, -8], size: [3, 0.5, 3], color: '#e67e22' });
    platforms.push({ position: [0, 0, -12], size: [3, 0.5, 3], color: '#9b59b6' });
    platforms.push({ position: [-2, 0, -16], size: [3, 0.5, 3], color: '#1abc9c' });
    platforms.push({ position: [0, 0, -20], size: [3, 0.5, 3], color: '#e74c3c' });
    platforms.push({ position: [0, 0, -24], size: [3, 0.5, 3], color: '#f39c12' });
    platforms.push({ position: [0, 0, -28], size: [5, 0.5, 5], color: '#2ecc71' }); // End
    
    // Power-ups for easy level
    powerUps.push({ position: [0, 1, -8], type: 'speed', collected: false });
    powerUps.push({ position: [-2, 1, -16], type: 'jump', collected: false });
    
  } else if (level === 2) {
    // Medium level - moving platforms, closer
    platforms.push({ position: [0, 0, -4], size: [3, 0.5, 3], color: '#2ecc71', moving: { axis: 'x', range: 2, speed: 1 } });
    platforms.push({ position: [0, 0.5, -9], size: [3, 0.5, 3], color: '#e67e22' });
    obstacles.push({ position: [0, 1, -9], type: 'spinner' });
    platforms.push({ position: [0, 0, -14], size: [3, 0.5, 3], color: '#9b59b6', moving: { axis: 'x', range: 3, speed: 1.5 } });
    platforms.push({ position: [0, 0, -19], size: [2.5, 0.5, 2.5], color: '#1abc9c', disappearing: true });
    platforms.push({ position: [0, 0, -24], size: [2.5, 0.5, 2.5], color: '#1abc9c', disappearing: true });
    platforms.push({ position: [0, 0, -29], size: [3, 0.5, 3], color: '#e74c3c' });
    platforms.push({ position: [0, 1, -34], size: [3, 0.5, 3], color: '#f39c12' });
    platforms.push({ position: [0, 0, -39], size: [5, 0.5, 5], color: '#2ecc71' }); // End
    
    // Power-ups for medium level
    powerUps.push({ position: [0, 1, -4], type: 'speed', collected: false });
    powerUps.push({ position: [0, 1.5, -9], type: 'shield', collected: false });
    powerUps.push({ position: [0, 1, -29], type: 'jump', collected: false });
    
  } else {
    // Hard level - everything, closer
    platforms.push({ position: [0, 0, -4], size: [2.5, 0.5, 2.5], color: '#2ecc71', moving: { axis: 'x', range: 3, speed: 2 } });
    obstacles.push({ position: [2, 0.5, -4], type: 'pusher' });
    platforms.push({ position: [0, 0.5, -9], size: [2.5, 0.5, 2.5], color: '#e67e22', rotating: true });
    obstacles.push({ position: [0, 1, -9], type: 'spinner' });
    platforms.push({ position: [-3, 0, -14], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [0, 0, -14], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [3, 0, -14], size: [2, 0.5, 2], color: '#9b59b6', disappearing: true });
    platforms.push({ position: [0, 0, -19], size: [3, 0.5, 3], color: '#1abc9c' });
    obstacles.push({ position: [0, 0, -19], type: 'spikes' });
    platforms.push({ position: [0, 1.5, -24], size: [2, 0.5, 2], color: '#e74c3c', moving: { axis: 'z', range: 2, speed: 2 } });
    platforms.push({ position: [0, 2.5, -30], size: [2, 0.5, 2], color: '#f39c12', moving: { axis: 'x', range: 3, speed: 2.5 } });
    obstacles.push({ position: [0, 3, -30], type: 'spinner' });
    platforms.push({ position: [0, 1.5, -36], size: [2.5, 0.5, 2.5], color: '#3498db', rotating: true });
    platforms.push({ position: [0, 0, -42], size: [3, 0.5, 3], color: '#2ecc71' });
    platforms.push({ position: [0, 0, -48], size: [6, 0.5, 6], color: '#f1c40f' }); // End
    
    // Power-ups for hard level
    powerUps.push({ position: [0, 1, -4], type: 'speed', collected: false });
    powerUps.push({ position: [0, 1.5, -9], type: 'shield', collected: false });
    powerUps.push({ position: [0, 1, -19], type: 'freeze', collected: false });
    powerUps.push({ position: [0, 2.5, -24], type: 'jump', collected: false });
    powerUps.push({ position: [0, 1, -42], type: 'magnet', collected: false });
  }

  return { platforms, obstacles, powerUps };
};

// Roblox-style Orbit Camera Controller with touch support
const OrbitCamera = ({ target }: { target: [number, number, number] }) => {
  const { camera, gl } = useThree();
  const spherical = useRef(new THREE.Spherical(15, Math.PI / 3, 0));
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const touchId = useRef<number | null>(null);

  useEffect(() => {
    const domElement = gl.domElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 0) {
        isDragging.current = true;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      spherical.current.theta -= deltaX * 0.01;
      spherical.current.phi = Math.max(0.3, Math.min(Math.PI / 2, spherical.current.phi + deltaY * 0.01));
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleWheel = (e: WheelEvent) => {
      spherical.current.radius = Math.max(5, Math.min(30, spherical.current.radius + e.deltaY * 0.02));
    };
    
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Touch handlers for camera rotation (two-finger or single-finger on right side)
    const handleTouchStart = (e: TouchEvent) => {
      // Only handle touch if it's in the upper-right area (not overlapping joystick/jump)
      const touch = e.touches[0];
      const rect = domElement.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      
      // Allow camera drag if touch is in upper half or right half of screen
      if (touchX > rect.width * 0.3 && touch.clientY < rect.height * 0.6) {
        touchId.current = touch.identifier;
        isDragging.current = true;
        previousMouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || touchId.current === null) return;
      
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === touchId.current) {
          const deltaX = touch.clientX - previousMouse.current.x;
          const deltaY = touch.clientY - previousMouse.current.y;
          
          spherical.current.theta -= deltaX * 0.01;
          spherical.current.phi = Math.max(0.3, Math.min(Math.PI / 2, spherical.current.phi + deltaY * 0.01));
          
          previousMouse.current = { x: touch.clientX, y: touch.clientY };
          break;
        }
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId.current) {
          isDragging.current = false;
          touchId.current = null;
          break;
        }
      }
    };
    
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('wheel', handleWheel);
    domElement.addEventListener('contextmenu', handleContextMenu);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    domElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('contextmenu', handleContextMenu);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl]);

  useFrame(() => {
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);
    
    const offset = new THREE.Vector3();
    offset.setFromSpherical(spherical.current);
    
    const desiredPos = targetVec.clone().add(offset);
    camera.position.lerp(desiredPos, 0.1);
    camera.lookAt(targetVec);
  });

  return null;
};

// Virtual Joystick Component
const VirtualJoystick = ({ onMove }: { onMove: (x: number, z: number) => void }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const touchId = useRef<number | null>(null);
  const basePos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number, id: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    basePos.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    touchId.current = id;
    setActive(true);
    handleMove(clientX, clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!knobRef.current || !joystickRef.current) return;
    
    const maxDist = 40;
    let dx = clientX - basePos.current.x;
    let dy = clientY - basePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Normalize to -1 to 1
    const normX = dx / maxDist;
    const normZ = dy / maxDist;
    onMove(normX, normZ);
  };

  const handleEnd = () => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
    touchId.current = null;
    setActive(false);
    onMove(0, 0);
  };

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (touchId.current !== null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX < window.innerWidth * 0.4 && touch.clientY > window.innerHeight * 0.5) {
          handleStart(touch.clientX, touch.clientY, touch.identifier);
          break;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchId.current === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchId.current) {
          handleMove(e.touches[i].clientX, e.touches[i].clientY);
          break;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId.current) {
          handleEnd();
          break;
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={joystickRef}
      className="absolute bottom-8 left-8 w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center touch-none"
    >
      <div
        ref={knobRef}
        className={`w-14 h-14 rounded-full transition-colors ${
          active ? 'bg-white/60' : 'bg-white/40'
        } border-2 border-white/50 shadow-lg`}
        style={{ transition: active ? 'none' : 'transform 0.1s ease-out' }}
      />
    </div>
  );
};

// Jump Button Component
const JumpButton = ({ onJump, jumping }: { onJump: (pressed: boolean) => void; jumping: boolean }) => {
  return (
    <button
      className={`absolute bottom-8 right-8 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition-all touch-none select-none ${
        jumping
          ? 'bg-yellow-400/80 scale-90'
          : 'bg-white/30 hover:bg-white/40 active:bg-yellow-400/80 active:scale-90'
      } backdrop-blur-sm border-2 border-white/40 shadow-lg`}
      onTouchStart={(e) => {
        e.preventDefault();
        onJump(true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onJump(false);
      }}
      onMouseDown={() => onJump(true)}
      onMouseUp={() => onJump(false)}
      onMouseLeave={() => onJump(false)}
    >
      ⬆️
    </button>
  );
};

// Main Scene
const GameScene = ({
  level,
  onFall,
  onWin,
  onHit,
  gameActive,
  playerPos,
  setPlayerPos,
  activePowers,
  powerUps,
  onCollectPowerUp,
}: {
  level: number;
  onFall: () => void;
  onWin: () => void;
  onHit: () => void;
  gameActive: boolean;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  activePowers: ActivePower[];
  powerUps: PowerUpData[];
  onCollectPowerUp: (index: number) => void;
}) => {
  const { platforms, obstacles } = generateLevel(level);
  const timeFrozen = activePowers.some(p => p.type === 'freeze');
  const magnetActive = activePowers.some(p => p.type === 'magnet');

  return (
    <>
      <OrbitCamera target={playerPos} />
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
        onHit={onHit}
        gameActive={gameActive}
        level={level}
        activePowers={activePowers}
        obstacles={obstacles}
        timeFrozen={timeFrozen}
      />

      {platforms.map((platform, i) => (
        <Platform key={`platform-${i}`} {...platform} timeFrozen={timeFrozen} />
      ))}

      {obstacles.map((obstacle, i) => (
        <Obstacle key={`obstacle-${i}`} {...obstacle} timeFrozen={timeFrozen} />
      ))}

      {powerUps.map((powerUp, i) => (
        <PowerUp
          key={`powerup-${i}`}
          position={powerUp.position}
          type={powerUp.type}
          collected={powerUp.collected}
          playerPos={playerPos}
          magnetActive={magnetActive}
          onCollect={() => onCollectPowerUp(i)}
        />
      ))}

      <Checkpoint position={[0, 0, level === 1 ? -28 : level === 2 ? -39 : -48]} />

      {/* Floor visual (danger zone) */}
      <mesh position={[0, -15, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 150]} />
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
  const [activePowers, setActivePowers] = useState<ActivePower[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUpData[]>([]);
  
  // Mobile input state
  const [mobileInput, setMobileInput] = useState<MobileInputState>({ moveX: 0, moveZ: 0, jump: false });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize power-ups when starting a level
  useEffect(() => {
    if (gameState === 'playing') {
      const { powerUps: levelPowerUps } = generateLevel(level);
      setPowerUps(levelPowerUps);
    }
  }, [gameState, level]);

  // Update power-up timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime((t) => t + 1);
        setActivePowers((powers) => 
          powers
            .map(p => ({ ...p, timeLeft: p.timeLeft - 1 }))
            .filter(p => p.timeLeft > 0)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = (selectedLevel: number) => {
    setLevel(selectedLevel);
    setLives(3);
    setPlayerPos([0, 0.5, 0]);
    setTime(0);
    setActivePowers([]);
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

  const handleHit = useCallback(() => {
    setLives((l) => {
      if (l <= 1) {
        setGameState('lost');
        return 0;
      }
      return l - 1;
    });
  }, []);

  const handleWin = useCallback(() => {
    setGameState('won');
  }, []);

  const handleCollectPowerUp = useCallback((index: number) => {
    setPowerUps((pups) => {
      const newPups = [...pups];
      if (!newPups[index].collected) {
        newPups[index] = { ...newPups[index], collected: true };
        const type = newPups[index].type;
        const duration = POWER_UP_CONFIG[type].duration;
        
        setActivePowers((powers) => {
          // Remove existing power of same type and add new one
          const filtered = powers.filter(p => p.type !== type);
          return [...filtered, { type, timeLeft: duration }];
        });
      }
      return newPups;
    });
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
              <div className="flex gap-4 justify-center flex-wrap">
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

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-white mb-3">Controls:</h3>
              {isMobile ? (
                <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
                  <span>Left Joystick</span><span>Move</span>
                  <span>Right Button</span><span>Jump</span>
                  <span>Swipe Screen</span><span>Rotate Camera</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
                  <span>WASD / Arrows</span><span>Move</span>
                  <span>Space</span><span>Jump</span>
                  <span>Mouse Drag</span><span>Rotate Camera</span>
                  <span>Scroll</span><span>Zoom In/Out</span>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-white mt-4 mb-2">Power-Ups:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.entries(POWER_UP_CONFIG).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                    <span>{config.icon}</span>
                    <span className="text-xs text-white/80 capitalize">{type}</span>
                  </div>
                ))}
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
          <MobileInputContext.Provider value={mobileInput}>
            <Canvas shadows camera={{ position: [0, 10, 15], fov: 60 }}>
              <GameScene
                level={level}
                onFall={handleFall}
                onWin={handleWin}
                onHit={handleHit}
                gameActive={true}
                playerPos={playerPos}
                setPlayerPos={setPlayerPos}
                activePowers={activePowers}
                powerUps={powerUps}
                onCollectPowerUp={handleCollectPowerUp}
              />
            </Canvas>
          </MobileInputContext.Provider>

          {/* HUD */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 space-y-2 pointer-events-auto">
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
              
              {/* Active Power-Ups */}
              {activePowers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/20">
                  {activePowers.map((power, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-sm"
                      style={{ borderColor: POWER_UP_CONFIG[power.type].color, borderWidth: 1 }}
                    >
                      <span>{POWER_UP_CONFIG[power.type].icon}</span>
                      <span className="text-white">{power.timeLeft}s</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setGameState('menu')}
              className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-white hover:bg-black/70 transition-all pointer-events-auto"
            >
              ⏸️ Menu
            </button>
          </div>

          {/* Mobile Controls */}
          {isMobile && (
            <>
              <VirtualJoystick 
                onMove={(x, z) => setMobileInput(prev => ({ ...prev, moveX: x, moveZ: z }))} 
              />
              <JumpButton 
                onJump={(pressed) => setMobileInput(prev => ({ ...prev, jump: pressed }))}
                jumping={mobileInput.jump}
              />
            </>
          )}

          {/* Camera instructions - only show on desktop */}
          {!isMobile && (
            <div className="absolute bottom-4 left-4 text-white/50 text-sm pointer-events-none">
              Drag to rotate camera • Scroll to zoom
            </div>
          )}
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
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
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
            <div className="flex gap-4 justify-center mt-8 flex-wrap">
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
