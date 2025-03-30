import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '@/lib/stores/useGame';

export function Player() {
  const playerRef = useRef<THREE.Mesh>(null);
  const playerGroupRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  
  // Register player position with the game state
  const { setPlayerPosition } = useGame();
  
  // Get keyboard state
  const [, getKeyboardState] = useKeyboardControls();
  
  // Movement speed
  const SPEED = 5;
  
  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    // Get current keyboard state
    const { forward, backward, leftward, rightward, jump } = getKeyboardState();
    
    // Calculate movement direction
    direction.current.set(0, 0, 0);
    
    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (leftward) direction.current.x -= 1;
    if (rightward) direction.current.x += 1;
    
    // Normalize direction
    if (direction.current.length() > 0) {
      direction.current.normalize();
    }
    
    // Apply movement to velocity
    velocity.current.x = direction.current.x * SPEED * delta;
    velocity.current.z = direction.current.z * SPEED * delta;
    
    // Update position
    playerRef.current.position.x += velocity.current.x;
    playerRef.current.position.z += velocity.current.z;
    
    // Update the player position in the game state for star celebrations
    setPlayerPosition([
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z
    ]);
    
    // Rotate player to face direction of movement
    if (direction.current.length() > 0) {
      const targetRotation = Math.atan2(direction.current.x, direction.current.z);
      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        targetRotation,
        10 * delta
      );
    }
    
    // Update camera position to follow player
    const cameraTargetPosition = new THREE.Vector3(
      playerRef.current.position.x,
      playerRef.current.position.y + 5,
      playerRef.current.position.z + 10
    );
    
    state.camera.position.lerp(cameraTargetPosition, 5 * delta);
    state.camera.lookAt(playerRef.current.position);
  });
  
  return (
    <group>
      {/* Player model */}
      <mesh 
        ref={playerRef} 
        position={[0, 0.5, 0]} 
        castShadow
      >
        {/* Main body */}
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.9, 0.3]} />
            <meshStandardMaterial color="#3377dd" />
          </mesh>
          
          {/* Head */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#ffcc88" />
          </mesh>
        </group>
      </mesh>
    </group>
  );
}
