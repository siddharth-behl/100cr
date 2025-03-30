import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { useAudio } from "@/lib/stores/useAudio";
import gsap from "gsap";

interface StarCelebrationProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
  onComplete: () => void;
}

// Preload star model
useGLTF.preload('/models/star.glb');

export function StarCelebration({ 
  position, 
  targetPosition, 
  onComplete 
}: StarCelebrationProps) {
  const { scene: starModel } = useGLTF('/models/star.glb') as GLTF & {
    scene: THREE.Group
  };
  
  const { playSuccess } = useAudio();
  const starRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Set up initial position and scale
  useEffect(() => {
    if (starRef.current && !animationComplete) {
      // Set initial position above the player
      starRef.current.position.set(position[0], position[1] + 2, position[2]);
      starRef.current.scale.set(0.5, 0.5, 0.5);
      setModelLoaded(true);
      
      // Play success sound
      playSuccess();
      
      // Create vector for unproject calculations
      const vector = new THREE.Vector3(
        targetPosition[0],  // Already normalized (-1 to +1)
        targetPosition[1],  // Already normalized (-1 to +1)
        targetPosition[2]   // Z-depth in camera space
      );
      
      // Calculate 3D position 3 units in front of the camera
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(8, 6, 12); // Same as in ThreeScene
      
      // Create a target position 5 units in front of the camera in the direction of the vector
      vector.unproject(camera);
      vector.sub(camera.position).normalize();
      const distance = 5; // Distance from camera
      const finalPosition = new THREE.Vector3()
        .copy(camera.position)
        .add(vector.multiplyScalar(distance));
      
      // Create animation timeline
      const timeline = gsap.timeline({
        onComplete: () => {
          setAnimationComplete(true);
          onComplete();
        }
      });
      
      // First, make the star float up and slightly bounce
      timeline.to(starRef.current.position, {
        y: position[1] + 3,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Then animate to the target position in 3D space
      timeline.to(starRef.current.position, {
        x: finalPosition.x,
        y: finalPosition.y,
        z: finalPosition.z,
        duration: 1,
        ease: "power1.inOut"
      });
      
      // Scale down at the end
      timeline.to(starRef.current.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2");
    }
  }, [position, targetPosition, animationComplete, onComplete, playSuccess]);
  
  // Rotate the star while it's moving
  useFrame((_, delta) => {
    if (starRef.current && !animationComplete) {
      starRef.current.rotation.y += delta * 2;
    }
  });

  if (animationComplete) return null;
  
  return (
    <group ref={starRef}>
      {modelLoaded && (
        <primitive 
          object={starModel.clone()} 
          scale={[0.5, 0.5, 0.5]}
          castShadow 
        />
      )}
    </group>
  );
}