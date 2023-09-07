import React, { useState } from 'react';
import * as THREE from 'three';
import { CubeProps } from './../../interfaces/CubeProps';

const Cube: React.FC<CubeProps & { forwardedRef: React.Ref<THREE.Mesh>, cubeName: string }> = ({ position, materials, forwardedRef, cubeName }) => {
    // State for cube's position and rotation
    const [cubePosition, setCubePosition] = useState<THREE.Vector3>(new THREE.Vector3(...position));
    const [rotationAngle, setRotationAngle] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0));

    return (
        <mesh ref={forwardedRef} position={cubePosition} rotation={rotationAngle} material={materials} name={cubeName}>  // Add the name prop here
            <boxGeometry args={[1, 1, 1]} />
        </mesh>
    );
};

export default Cube;
