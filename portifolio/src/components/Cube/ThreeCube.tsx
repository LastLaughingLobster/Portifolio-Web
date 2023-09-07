import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls } from '@react-three/drei';
import Cube from './Cube';
import { COLORS } from './../../consts/cube';
import * as THREE from 'three';


const ThreeCube = () => {
    const [cubesMatrix, setCubesMatrix] = useState<React.ReactElement[]>([]);

    const cameraRef = useRef(new THREE.PerspectiveCamera());
    const meshRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);


    // Create a child component for the raycasting logic
    function RaycastHandler() {
        const { camera } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const mouse = useRef(new THREE.Vector2());

        const handleMouseDown = (event: MouseEvent) => {
            // 1. Update mouse position based on the event
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // 2. Adjusting is already done in the above step

            console.log(camera);

            // 3. Update the ray with the camera and mouse position
            raycaster.current.setFromCamera(mouse.current, camera);

            const intersects = raycaster.current.intersectObjects(
                meshRefs.current.map(ref => ref.current).filter(Boolean) as THREE.Mesh[]
            );

            if (intersects.length > 0) {
                const intersection = intersects[0];

                if (intersection.face) {
                    const intersectedMesh = intersection.object as THREE.Mesh;
                    const materials = intersectedMesh.material as THREE.MeshStandardMaterial[]; // <-- Specific type assertion
                    const faceIndex = intersection.face.materialIndex;

                    materials[faceIndex].color.set(0xFFC0CB); // Pink

                    console.log(`Clicked on ${intersectedMesh.name}`);
                    console.log(`Face Index: ${faceIndex}`);
                }


            } else {
                console.log("No intersection found");
            }
        };

        useEffect(() => {
            // Attach event listeners, etc.
            window.addEventListener('mousedown', handleMouseDown);

            return () => {
                window.removeEventListener('mousedown', handleMouseDown);
            }
        }, []);

        // No need to return anything from this component, it's just for side-effects
        return null;
    }


    useEffect(() => {
        // Initialize cubesMatrix or other side effects here
        const initCubes = generateCubes();
        setCubesMatrix(initCubes);

        // Any other side effect, like adding event listeners or setting up the camera can go here
    }, []); // 


    const generateMaterials = (x: number, y: number, z: number) => {
        const materials = [
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // RIGHT
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // LEFT
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // UP
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // DOWN
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // FRONT
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000) }), // BACK
        ];

        if (x === 1) materials[0].color.set(COLORS.RIGHT);
        if (x === -1) materials[1].color.set(COLORS.LEFT);
        if (y === 1) materials[2].color.set(COLORS.UP);
        if (y === -1) materials[3].color.set(COLORS.DOWN);
        if (z === 1) materials[4].color.set(COLORS.FRONT);
        if (z === -1) materials[5].color.set(COLORS.BACK);

        return materials;
    };

    const generateCubes = () => {
        const out = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {

                    if (!(x == 1 && y == 1 && z == 1)) {
                        //continue;
                    }

                    const materials = generateMaterials(x, y, z);

                    const meshRef = React.createRef<THREE.Mesh>();
                    meshRefs.current.push(meshRef);

                    out.push(
                        <Cube
                            position={[x, y, z]}
                            materials={materials}
                            key={`${x}${y}${z}`}
                            forwardedRef={meshRef}
                            cubeName={`Cube-${x}-${y}-${z}`}  // Add this line
                        />
                    );
                }
            }
        }
        return out;
    };

    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <PerspectiveCamera ref={cameraRef} position={[0, 0, 8]}>
                <CameraControls />
            </PerspectiveCamera>
            <RaycastHandler />
            {cubesMatrix}
            <primitive object={new THREE.AxesHelper(5)} />
        </Canvas>
    );
};

export default ThreeCube;
