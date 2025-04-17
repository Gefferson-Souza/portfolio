import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

// Componente de partículas
const ParticleCloud = ({
  count = 2000,
  color = '#00E5FF',
  size = 0.015,
  speed = 0.2,
  spread = 3,
  interactionStrength = 0.5,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  
  // Gerar posições aleatórias para as partículas
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread * 2;
      const y = (Math.random() - 0.5) * spread * 2;
      const z = (Math.random() - 0.5) * spread * 2;
      
      // Velocidades iniciais aleatórias
      const vx = (Math.random() - 0.5) * 0.01;
      const vy = (Math.random() - 0.5) * 0.01;
      const vz = (Math.random() - 0.5) * 0.01;
      
      temp.push(x, y, z, vx, vy, vz);
    }
    return new Float32Array(temp);
  }, [count, spread]);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Converter a posição do mouse para o espaço da cena
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    
    // Atualizar todas as partículas
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i4 = i * 6; // Cada partícula tem 6 valores (x,y,z,vx,vy,vz)
      const ix = i4;
      const iy = i4 + 1;
      const iz = i4 + 2;
      const ivx = i4 + 3;
      const ivy = i4 + 4;
      const ivz = i4 + 5;
      
      // Distância da partícula ao mouse
      const dx = mouseX - positions[ix];
      const dy = mouseY - positions[iy];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.min(1000 / (dist * dist + 100), interactionStrength);
      
      // Influência do mouse nos movimentos (atração)
      if (dist < 1) {
        positions[ivx] += dx * influence * delta;
        positions[ivy] += dy * influence * delta;
      }
      
      // Aplicar movimento baseado na velocidade
      positions[ix] += positions[ivx] * speed;
      positions[iy] += positions[ivy] * speed;
      positions[iz] += positions[ivz] * speed;
      
      // Simular um campo de força que mantém as partículas dentro de um limite
      const limit = spread * 1.2;
      
      if (Math.abs(positions[ix]) > limit) {
        positions[ivx] *= -0.8;
      }
      
      if (Math.abs(positions[iy]) > limit) {
        positions[ivy] *= -0.8;
      }
      
      if (Math.abs(positions[iz]) > limit) {
        positions[ivz] *= -0.8;
      }
      
      // Atrito para reduzir a velocidade gradualmente
      positions[ivx] *= 0.99;
      positions[ivy] *= 0.99;
      positions[ivz] *= 0.99;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotação lenta do conjunto completo
    pointsRef.current.rotation.y += delta * 0.05;
  });
  
  return (
    <Points ref={pointsRef} limit={count}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={6}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
    </Points>
  );
};

// Componente principal de fundo com partículas
const ParticlesBackground: React.FC<{
  className?: string;
  density?: number;
  color?: string;
}> = ({ 
  className = '', 
  density = 1,
  color = '#00E5FF'
}) => {
  // Ajustar o número de partículas com base na densidade e tamanho da tela
  const particleCount = useMemo(() => {
    return Math.floor(1500 * density);
  }, [density]);
  
  return (
    <div className={`fixed inset-0 z-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <ParticleCloud 
          count={particleCount} 
          color={color}
          spread={5}
          speed={0.15}
        />
        <ParticleCloud 
          count={Math.floor(particleCount / 3)} 
          color="#0CFF70"
          spread={4}
          speed={0.1}
          size={0.02}
          interactionStrength={0.2}
        />
      </Canvas>
    </div>
  );
};

export default ParticlesBackground;