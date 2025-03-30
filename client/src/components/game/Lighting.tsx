import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LightingProps {
  environment: string;
}

export function Lighting({ environment }: LightingProps) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Base configuration for lighting
  const lightConfig = {
    startup: {
      color: '#ffffee',
      intensity: 1.5,
      position: [5, 10, 7],
      secondaryColor: '#bbffdd',
      ambientIntensity: 0.4
    },
    agency: {
      color: '#ffffff',
      intensity: 2.0,
      position: [3, 12, 4],
      secondaryColor: '#aaddff',
      ambientIntensity: 0.5
    },
    ecommerce: {
      color: '#ffeecc',
      intensity: 1.8,
      position: [-4, 9, 5],
      secondaryColor: '#ffddbb',
      ambientIntensity: 0.45
    },
    corporate: {
      color: '#ffcc99',
      intensity: 1.6,
      position: [-6, 8, 3],
      secondaryColor: '#ffbbaa',
      ambientIntensity: 0.4
    },
    empire: {
      color: '#ffaa77',
      intensity: 1.7,
      position: [-7, 10, -3],
      secondaryColor: '#ffdd88',
      ambientIntensity: 0.5
    }
  };
  
  // Configure lighting based on environment
  useEffect(() => {
    if (!directionalLightRef.current) return;
    
    // Get config based on environment type
    const config = lightConfig[environment as keyof typeof lightConfig] || lightConfig.startup;
    
    // Apply main directional light settings
    directionalLightRef.current.color.set(config.color);
    directionalLightRef.current.intensity = config.intensity;
    directionalLightRef.current.position.set(
      config.position[0], 
      config.position[1], 
      config.position[2]
    );
    
    // Configure shadow properties
    directionalLightRef.current.shadow.mapSize.width = 2048;
    directionalLightRef.current.shadow.mapSize.height = 2048;
    directionalLightRef.current.shadow.camera.near = 0.5;
    directionalLightRef.current.shadow.camera.far = 500;
    directionalLightRef.current.shadow.camera.left = -15;
    directionalLightRef.current.shadow.camera.right = 15;
    directionalLightRef.current.shadow.camera.top = 15;
    directionalLightRef.current.shadow.camera.bottom = -15;
    
    // Configure secondary lights based on environment
    if (pointLightRef.current) {
      pointLightRef.current.color.set(config.secondaryColor);
      pointLightRef.current.intensity = config.intensity * 0.3;
      
      // Position point light opposite to directional light
      pointLightRef.current.position.set(
        -config.position[0] * 0.5,
        config.position[1] * 0.7,
        -config.position[2] * 0.5
      );
    }
    
    if (spotLightRef.current) {
      spotLightRef.current.color.set(config.secondaryColor);
      spotLightRef.current.intensity = config.intensity * 0.5;
      spotLightRef.current.position.set(0, 15, 0);
      spotLightRef.current.target.position.set(0, 0, 0);
      spotLightRef.current.angle = Math.PI / 6;
      spotLightRef.current.penumbra = 0.5;
      spotLightRef.current.decay = 1.5;
      
      // Configure spotlight shadow properties
      spotLightRef.current.shadow.mapSize.width = 1024;
      spotLightRef.current.shadow.mapSize.height = 1024;
      spotLightRef.current.shadow.camera.near = 1;
      spotLightRef.current.shadow.camera.far = 30;
    }
  }, [environment]);
  
  // Add subtle animation to lights
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Subtle movement for directional light
    if (directionalLightRef.current) {
      directionalLightRef.current.position.x += Math.sin(time * 0.2) * 0.01;
      directionalLightRef.current.position.z += Math.cos(time * 0.2) * 0.01;
    }
    
    // Pulse effect for point light
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 
        (lightConfig[environment as keyof typeof lightConfig]?.intensity || 1.5) * 
        0.3 * (1 + Math.sin(time * 0.5) * 0.2);
    }
  });
  
  // Get config for the current environment
  const config = lightConfig[environment as keyof typeof lightConfig] || lightConfig.startup;
  
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight 
        intensity={config.ambientIntensity} 
        color="#aabbff" 
      />
      
      {/* Main directional light (sun) with shadows */}
      <directionalLight
        ref={directionalLightRef}
        position={config.position}
        intensity={config.intensity}
        castShadow
      />
      
      {/* Point light for additional dimension */}
      <pointLight
        ref={pointLightRef}
        position={[-config.position[0] * 0.5, config.position[1] * 0.7, -config.position[2] * 0.5]}
        intensity={config.intensity * 0.3}
        color={config.secondaryColor}
        distance={30}
        decay={2}
      />
      
      {/* Spot light for dramatic highlighting */}
      <spotLight
        ref={spotLightRef}
        position={[0, 15, 0]}
        intensity={config.intensity * 0.5}
        angle={Math.PI / 6}
        penumbra={0.5}
        decay={1.5}
        color={config.secondaryColor}
        castShadow
      />
      
      {/* Hemisphere light for better environment lighting */}
      <hemisphereLight
        args={[
          environment === 'startup' ? '#c4e0ff' : 
          environment === 'agency' ? '#d4e4ff' : 
          environment === 'ecommerce' ? '#e4d4ff' : 
          environment === 'corporate' ? '#ffe4d4' : '#ffd4c4',
          '#404040',
          0.6
        ]}
      />
    </>
  );
}
