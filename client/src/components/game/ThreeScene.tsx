import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import { Terrain } from './Terrain';
import { Player } from './Player';
import { Lighting } from './Lighting';
import { BusinessTower } from './BusinessTower';
import { StarCelebration } from './StarCelebration';
import { useProgress } from '@/lib/stores/useProgress';
import { useGame } from '@/lib/stores/useGame';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface ThreeSceneProps {
  level: number;
}

// Define control keys for movement
const controls = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'leftward', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'rightward', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
];

export function ThreeScene({ level }: ThreeSceneProps) {
  // Get the star celebrations from the game state
  const { starCelebrations, playerPosition, completeCelebration } = useGame();
  
  // Determine environment based on level
  const getEnvironment = () => {
    switch (level) {
      case 1: // Rookie
        return 'startup';
      case 2: // Warrior
        return 'agency';
      case 3: // Tycoon
        return 'ecommerce';
      case 4: // Mogul
        return 'corporate';
      case 5: // Billionaire
        return 'empire';
      default:
        return 'startup';
    }
  };

  const environment = getEnvironment();

  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows
        camera={{
          position: [8, 6, 12],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: 'default'
        }}
      >
        <color attach="background" args={['#111111']} />
        
        {/* Lighting */}
        <Lighting environment={environment} />
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={20}
        />
        
        <Suspense fallback={null}>
          {/* Terrain */}
          <Terrain environment={environment} />
          
          {/* Business Tower */}
          <BusinessTower level={level} position={[0, 0, 0]} scale={2.5} />
          
          {/* Player */}
          <Player />
          
          {/* Star Celebrations */}
          {starCelebrations.map((celebration) => (
            <StarCelebration
              key={celebration.id}
              position={playerPosition as [number, number, number]}
              targetPosition={celebration.targetPosition as [number, number, number]}
              onComplete={() => completeCelebration(celebration.id)}
            />
          ))}
          
          {/* Stats removed as per user request */}
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
