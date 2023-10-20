import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Mesh, ShaderMaterial} from "three";
import * as THREE from 'three';
import './GridTillesBackground.css';

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

const Fragment = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh & { material: ShaderMaterial }>(null);

  const clock = new THREE.Clock();
  useFrame(() => {
    if (mesh.current && mesh.current.material) {
        mesh.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={4.0}>
      <planeGeometry args={[1, 1, 145, 145]} />
      <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={{
              time: { value: 0 } // Initial value
          }}
      />
    </mesh>
  );
};

const GridTillesBackground = () => {
  return (
    <div className="gridTillesBackground-container">
      <Canvas camera={{ position: [0.0, 0.0, 1.0] }}>
        <Fragment />
      </Canvas>
    </div>
  );
};




export default GridTillesBackground;
