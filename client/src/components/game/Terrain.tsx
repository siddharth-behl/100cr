import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface TerrainProps {
  environment: string;
}

export function Terrain({ environment }: TerrainProps) {
  // Load appropriate texture based on environment
  const getTexturePath = () => {
    switch (environment) {
      case 'startup':
        return '/textures/grass.png';
      case 'agency':
        return '/textures/asphalt.png';
      case 'ecommerce':
        return '/textures/wood.jpg';
      case 'corporate':
      case 'empire':
        return '/textures/sand.jpg';
      default:
        return '/textures/grass.png';
    }
  };

  const texture = useTexture(getTexturePath());
  
  // Configure texture
  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.anisotropy = 16;
  }, [texture]);

  // Configure environment-specific props
  const getTerrainProps = () => {
    switch (environment) {
      case 'startup':
        return {
          color: '#4a684a',
          scale: [20, 1, 20]
        };
      case 'agency':
        return {
          color: '#333333',
          scale: [20, 1, 20]
        };
      case 'ecommerce':
        return {
          color: '#665543',
          scale: [25, 1, 25]
        };
      case 'corporate':
        return {
          color: '#a38d70',
          scale: [30, 1, 30]
        };
      case 'empire':
        return {
          color: '#c8b08f',
          scale: [40, 1, 40]
        };
      default:
        return {
          color: '#4a684a',
          scale: [20, 1, 20]
        };
    }
  };

  const terrainProps = getTerrainProps();

  // Generate buildings based on environment
  const generateBuildings = () => {
    const buildings = [];
    const buildingCount = environment === 'startup' ? 5 : 
                          environment === 'agency' ? 10 : 
                          environment === 'ecommerce' ? 15 : 
                          environment === 'corporate' ? 20 : 25;
    
    // Pre-calculated random positions to avoid Math.random in render
    const positions = [
      [4, 0, 2], [-4, 0, -5], [7, 0, -3], [-6, 0, 6], [2, 0, -7],
      [-5, 0, -2], [6, 0, 4], [-3, 0, 8], [8, 0, -6], [-7, 0, 3],
      [3, 0, 9], [-8, 0, -4], [9, 0, 1], [-2, 0, -8], [1, 0, 6],
      [-9, 0, 5], [5, 0, -9], [-1, 0, 7], [10, 0, -1], [-10, 0, 2],
      [8, 0, 8], [-7, 0, -7], [6, 0, -5], [-5, 0, 4], [4, 0, -8]
    ];
    
    // Building shapes based on environment
    const getShape = (envType: string, index: number) => {
      if (envType === 'startup') {
        // Small office spaces
        return (
          <boxGeometry args={[1 + (index % 2) * 0.3, 1 + (index % 2), 1 + (index % 2) * 0.3]} />
        );
      } else if (envType === 'agency') {
        // Medium office buildings
        return (
          <boxGeometry args={[1.2 + (index % 3) * 0.3, 2 + (index % 3), 1.2 + (index % 3) * 0.3]} />
        );
      } else if (envType === 'ecommerce') {
        // Warehouses and distribution centers
        return index % 3 === 0 
          ? <boxGeometry args={[2.5, 1.5, 2.5]} /> // Large warehouses
          : <boxGeometry args={[1.5, 3 + (index % 4), 1.5]} /> // Mixed buildings
      } else if (envType === 'corporate') {
        // Corporate headquarters
        const isSkyscraper = index % 5 === 0;
        return isSkyscraper
          ? <boxGeometry args={[2, 8 + (index % 3), 2]} /> // Skyscrapers
          : <boxGeometry args={[1.8, 5 + (index % 4), 1.8]} /> // Office buildings
      } else { // empire
        // Massive complexes and luxury buildings
        const isLuxury = index % 4 === 0;
        return isLuxury
          ? <boxGeometry args={[3, 12 + (index % 5), 3]} /> // Luxury skyscrapers
          : <boxGeometry args={[2.5, 7 + (index % 8), 2.5]} /> // Corporate buildings
      }
    };
    
    // Color schemes based on environment
    const getColor = (envType: string, index: number) => {
      if (envType === 'startup') {
        return index % 3 === 0 ? '#557755' : '#668866'; // Green hues
      } else if (envType === 'agency') {
        return index % 4 === 0 ? '#555577' : (index % 4 === 1 ? '#6666aa' : '#4444aa'); // Blue hues
      } else if (envType === 'ecommerce') {
        return index % 4 === 0 ? '#775555' : (index % 4 === 1 ? '#996666' : '#884444'); // Red hues
      } else if (envType === 'corporate') {
        return index % 5 === 0 ? '#664466' : (index % 5 === 1 ? '#886688' : '#aa66aa'); // Purple hues
      } else { // empire
        return index % 6 === 0 ? '#886644' : (index % 6 === 1 ? '#aa8855' : (index % 6 === 2 ? '#bb9966' : '#ddaa77')); // Gold hues
      }
    };
    
    for (let i = 0; i < buildingCount && i < positions.length; i++) {
      // Calculate height based on geometry to properly position
      const geometry = getShape(environment, i);
      const height = environment === 'startup' ? 1 + (i % 2) : 
                     environment === 'agency' ? 2 + (i % 3) : 
                     environment === 'ecommerce' ? 3 + (i % 4) : 
                     environment === 'corporate' ? 5 + (i % 6) : 7 + (i % 8);
      
      const color = getColor(environment, i);
      
      // Add metalness and roughness for better appearance
      const metalness = environment === 'startup' ? 0.1 : 
                        environment === 'agency' ? 0.3 : 
                        environment === 'ecommerce' ? 0.4 : 
                        environment === 'corporate' ? 0.6 : 0.8;
                        
      const roughness = environment === 'startup' ? 0.9 : 
                        environment === 'agency' ? 0.7 : 
                        environment === 'ecommerce' ? 0.6 : 
                        environment === 'corporate' ? 0.4 : 0.2;
      
      buildings.push(
        <mesh
          key={`building-${i}`}
          position={[positions[i][0], height/2, positions[i][2]]}
          castShadow
          receiveShadow
        >
          {geometry}
          <meshStandardMaterial 
            color={color} 
            metalness={metalness}
            roughness={roughness}
          />
        </mesh>
      );
    }
    
    return buildings;
  };

  // Add sky (if texture is available)
  const addSky = () => {
    return (
      <mesh position={[0, 0, -15]} scale={[30, 15, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={useTexture('/textures/sky.png')} />
      </mesh>
    );
  };

  return (
    <group>
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        receiveShadow
      >
        <planeGeometry args={terrainProps.scale} />
        <meshStandardMaterial
          map={texture}
          color={terrainProps.color}
        />
      </mesh>
      
      {/* Buildings */}
      {generateBuildings()}
      
      {/* Sky backdrop */}
      {addSky()}
    </group>
  );
}
