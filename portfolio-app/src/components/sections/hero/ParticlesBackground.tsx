import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three';
import * as THREE from 'three';

interface ParticlesProps {
  mousePosition: {
    x: number;
    y: number;
  };
  count?: number;
}

export const ParticlesBackground = ({ mousePosition, count = 350 }: ParticlesProps) => {
  const points = useRef<Points>(null!);
  const hover = useRef(false);
  
  // Gerar geometria das partículas
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    
    // Array para as posições
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    // Paleta de cores no tema do portfolio
    const colorPalette = [
      new THREE.Color('#00E5FF'),  // cyan
      new THREE.Color('#0CFF70'),  // green
      new THREE.Color('#BD00FF'),  // purple
      new THREE.Color('#E6EEF5'),  // white
      new THREE.Color('#00E5FF'),  // cyan novamente (aumenta probabilidade)
    ];
    
    // Posições aleatórias
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribuição em espaço 3D
      positions[i3] = (Math.random() - 0.5) * 10; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // Variação de tamanhos
      sizes[i] = Math.random() * 0.5 + 0.3;
      
      // Cores
      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = randomColor.r;
      colors[i3 + 1] = randomColor.g;
      colors[i3 + 2] = randomColor.b;
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    
    return geo;
  }, [count]);
  
  // Material das partículas
  const material = useMemo(() => {
    return new PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true
    });
  }, []);
  
  // Animação e interatividade
  useFrame(({ clock }) => {
    if (!points.current) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    // Movimento suave das partículas
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      
      // Animação suave em cada eixo
      positions[i3 + 1] += Math.sin((elapsedTime + i * 0.1) * 0.2) * 0.002;
      positions[i3] += Math.cos((elapsedTime + i * 0.1) * 0.2) * 0.002;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotação lenta seguindo o mouse
    points.current.rotation.x += mousePosition.y * 0.002;
    points.current.rotation.y += mousePosition.x * 0.002;
    
    // Efeito parallax sutil
    points.current.position.x += (mousePosition.x * 0.5 - points.current.position.x) * 0.05;
    points.current.position.y += (-mousePosition.y * 0.5 - points.current.position.y) * 0.05;
  });
  
  return (
    <points ref={points} geometry={geometry} material={material} />
  );
};