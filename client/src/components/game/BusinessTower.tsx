import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { useProgress } from '@/lib/stores/useProgress';

interface BusinessTowerProps {
  level: number;
  position?: [number, number, number];
  scale?: number;
}

// Preload models
useGLTF.preload('/models/business_tower.glb');
useGLTF.preload('/models/money_pile.glb');
useGLTF.preload('/models/business_briefcase.glb');

export function BusinessTower({ level, position = [0, 0, 0], scale = 2.5 }: BusinessTowerProps) {
  const { completedLevels, unlockedLevels } = useProgress();
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Load the tower model
  const { scene: towerModel } = useGLTF('/models/business_tower.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Load the money pile model
  const { scene: moneyModel } = useGLTF('/models/money_pile.glb') as GLTF & {
    scene: THREE.Group
  };
  
  // Load the briefcase model
  const { scene: briefcaseModel } = useGLTF('/models/business_briefcase.glb') as GLTF & {
    scene: THREE.Group
  };

  useEffect(() => {
    if (towerModel && moneyModel && briefcaseModel) {
      setModelLoaded(true);
      console.log("Business tower model loaded successfully");
    }
  }, [towerModel, moneyModel, briefcaseModel]);

  // Animate the tower on hover
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Rotate slowly when hovered
      if (hovered) {
        groupRef.current.rotation.y += 0.01;
      }
    }
  });

  // Calculate the number of sections to display based on completed levels
  const getVisibleLevels = () => {
    return Math.min(5, unlockedLevels.length);
  };

  return (
    <group 
      ref={groupRef} 
      position={new THREE.Vector3(...position)}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {modelLoaded ? (
        <Suspense fallback={
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        }>
          {/* Business Tower */}
          <primitive 
            object={towerModel.clone()} 
            castShadow 
            receiveShadow 
          />
          
          {/* Money piles around the base for completed levels */}
          {completedLevels.length > 0 && (
            <>
              <group position={[2, 0, 2]}>
                <primitive 
                  object={moneyModel.clone()} 
                  scale={0.5} 
                  castShadow 
                  receiveShadow 
                />
              </group>
              
              {completedLevels.length > 2 && (
                <group position={[-2, 0, 2]}>
                  <primitive 
                    object={moneyModel.clone()} 
                    scale={0.7} 
                    castShadow 
                    receiveShadow 
                  />
                </group>
              )}
              
              {completedLevels.length > 3 && (
                <group position={[0, 0, -2]}>
                  <primitive 
                    object={moneyModel.clone()} 
                    scale={0.9} 
                    castShadow 
                    receiveShadow 
                  />
                </group>
              )}
            </>
          )}
          
          {/* Briefcase representing business deals */}
          {level > 2 && (
            <group position={[3, 0.5, -2]} rotation={[0, Math.PI / 4, 0]}>
              <primitive 
                object={briefcaseModel.clone()} 
                scale={1.2} 
                castShadow 
                receiveShadow 
              />
            </group>
          )}
        </Suspense>
      ) : (
        <mesh castShadow>
          <boxGeometry args={[1, 3, 1]} />
          <meshStandardMaterial color="#AAAAAA" />
        </mesh>
      )}
    </group>
  );
}