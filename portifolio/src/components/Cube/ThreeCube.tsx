import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls } from '@react-three/drei';
import Cube from './Cube';
import { COLORS } from './../../consts/cube';
import * as THREE from 'three';
import { Axis, Direction, Layer, RotationState } from './../../types/CubeType';



const ThreeCube = () => {
    const [cubesMatrix, setCubesMatrix] = useState<React.ReactElement[]>([]);
    const [rotation, setRotation] = useState<RotationState>({
        axis: null,
        direction: 1,
        layer: null
    });
    
    const initialMousePosition = useRef(new THREE.Vector2());

    const cameraRef = useRef(new THREE.PerspectiveCamera());
    const meshRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);

    useEffect(() => {
        // Initialize cubesMatrix when component mounts
        const initCubes = generateCubes();
        setCubesMatrix(initCubes);
        
        // Potentially other initial setup code...
    
        return () => {
            // Cleanup code, if necessary...
        }
    }, []); // Empty dependency array means this will run only once when the component mounts
    
    useEffect(() => {
        // This will run every time the rotation changes
        rotateLayer();
    }, [rotation]);
    

    // Create a child component for the raycasting logic
    function RaycastHandler() {
        const { camera } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const mouse = useRef(new THREE.Vector2());

        raycaster.current.near = 0.1;
        raycaster.current.far = 10;


        const handleMouseDown = (event: MouseEvent) => {
            
            initialMousePosition.current.copy(mouse.current);

            const canvas = event.target as HTMLCanvasElement;  // Cast the event target to a canvas element
            const rect = canvas.getBoundingClientRect();
        
            // Convert the mouse position to normalized device coordinates
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
            // Ensure the camera's world matrix is updated with the latest position
            if (camera) {
                camera.updateMatrixWorld();
                raycaster.current.setFromCamera(mouse.current, camera);
            }
        
            // Get all the meshes from the meshRefs
            const meshes = meshRefs.current.map(ref => ref.current).filter(Boolean) as THREE.Mesh[];
            const intersects = raycaster.current.intersectObjects(meshes);
        
            if (intersects.length > 0) {
                const intersection = intersects[0];
                const clickedCubelet = intersection.object as THREE.Mesh;
                const clickedFaceMaterialIndex = intersection.face?.materialIndex;
        
                console.log("Clicked on: ", clickedCubelet.name);
        
                if (typeof clickedFaceMaterialIndex === 'number') {
                    //const materials = clickedCubelet.material as THREE.Material[];
                    //(materials[clickedFaceMaterialIndex] as THREE.MeshStandardMaterial).color.set('pink');
                    //materials[clickedFaceMaterialIndex].needsUpdate = true;
        
                    console.log("Clicked face material index: ", clickedFaceMaterialIndex);
                } else {
                    console.log("Face material index not found!");
                }
            } else {
                console.log("No intersection found!");
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

    const rotateLayer = () => {
        if (rotation.axis === 'X') {
            rotateOnXAxis(1, 1, 20);
        }
        if (rotation.axis === 'Y') {
            rotateOnYAxis(-1, 1, 90);
        }
        if (rotation.axis === 'Z') {
            rotateOnZAxis(-1, -1, 20);
        }
    };
    
    
    const rotateOnXAxis = (layer: number, direction : number, angle : number = Math.PI / 2) => {
        meshRefs.current.forEach((ref) => {
            const mesh = ref.current;
            if (mesh && mesh.position.x === layer) { //layer should determine wich x layer are we rotating. 
                
                // Step 2: Rotate around the X-axis
                const axis = new THREE.Vector3(layer, 0, 0); // Layer determines wich side of the X-axis we are working with
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad(angle * direction));
    
                // Check if the cube is not on the axis
                if (mesh.position.y !== 0 || mesh.position.z !== 0) {
                    // Calculate the distance between the cube's current position and the rotation axis
                    const radius = Math.sqrt(mesh.position.y * mesh.position.y + mesh.position.z * mesh.position.z);
    
                    // Get the current angle based on the cube's position.
                    let theta = Math.atan2(mesh.position.z, mesh.position.y);
    
                    // Increment the theta based on rotation direction.
                    theta += THREE.MathUtils.degToRad((angle * direction) * layer);
    
                    // Convert back to Cartesian coordinates.
                    mesh.position.y = radius * Math.cos(theta);
                    mesh.position.z = radius * Math.sin(theta);
                }
                
                console.log(mesh.position);
            }
        });
    }

    const rotateOnYAxis = (layer: number, direction: number, angle: number = Math.PI / 2) => {
        meshRefs.current.forEach((ref) => {
            const mesh = ref.current;
            if (mesh && mesh.position.y === layer) {
                
                // Rotate around the Y-axis
                const axis = new THREE.Vector3(0, layer, 0); 
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad(angle * direction));
        
                if (mesh.position.x !== 0 || mesh.position.z !== 0) {
                    const radius = Math.sqrt(mesh.position.x * mesh.position.x + mesh.position.z * mesh.position.z);
        
                    let theta = Math.atan2(mesh.position.z, mesh.position.x);
                    theta += THREE.MathUtils.degToRad((angle * direction) * -layer);
        
                    mesh.position.x = radius * Math.cos(theta);
                    mesh.position.z = radius * Math.sin(theta);
                }
            }
        });
    };
    
    const rotateOnZAxis = (layer: number, direction: number, angle: number = Math.PI / 2) => {
        meshRefs.current.forEach((ref) => {
            const mesh = ref.current;
            if (mesh && mesh.position.z === layer) {
                
                // Rotate around the Z-axis
                const axis = new THREE.Vector3(0, 0, layer);
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad(angle * direction));
        
                if (mesh.position.x !== 0 || mesh.position.y !== 0) {
                    const radius = Math.sqrt(mesh.position.x * mesh.position.x + mesh.position.y * mesh.position.y);
        
                    let theta = Math.atan2(mesh.position.y, mesh.position.x);
                    theta += THREE.MathUtils.degToRad((angle * direction) * layer);
        
                    mesh.position.x = radius * Math.cos(theta);
                    mesh.position.y = radius * Math.sin(theta);
                }
            }
        });
    };
    
    
    
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

                    if (!(x == 1 && y == 0 && z == 0) ) {
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
        <>
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
            <button onClick={() => setRotation({ axis: 'Z', direction: -1, layer: 1 })}>
                Rotate Right Layer Clockwise
            </button>
        </>
    );
    
};

export default ThreeCube;
