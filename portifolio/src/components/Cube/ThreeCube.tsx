import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Cube from './Cube';
import { COLORS, STICKERS } from './../../consts/cube';
import * as THREE from 'three';
import { Axis, RotationState } from './../../types/CubeType';
import Line from './Line';


const ThreeCube = () => {
    const [cubesMatrix, setCubesMatrix] = useState<React.ReactElement[]>([]);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [rotation, setRotation] = useState<RotationState>({
        axis: null,
        direction: 1,
        layer: 0,
    });

    const initialMousePosition = useRef(new THREE.Vector2());

    const cameraRef = useRef(new THREE.PerspectiveCamera());
    const meshRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);

    const [isRotating, setIsRotating] = useState(false);
    const [startedRotation, setStartedRotation] = useState(false);

    const selectedCublet = useRef(new THREE.Mesh());
    const pivot = useRef<THREE.Mesh | undefined>(undefined);
    const clickedFaceNormal = useRef(new THREE.Vector3());


    const [showRay, setShowRay] = useState(false);
    const [rayData, setRayData] = useState<{ origin: THREE.Vector3, direction: THREE.Vector3 } | null>(null);

    const [currentAngle, setCurrentAngle] = useState(0);

    const rotationDuration = 0.1; //in seconds


    const moveStringRef = useRef<string>('');

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
    }, [rotation]);

    // Create a child component for the raycasting logic
    function EventHandler() {
        const { camera, scene } = useThree();
        const raycaster = useRef(new THREE.Raycaster());
        const mouse = useRef(new THREE.Vector2());

        raycaster.current.near = 0.1;
        raycaster.current.far = 10;


        const handleMouseDown = (event: MouseEvent) => {

            if (isRotating){
                return
            }

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

                setCameraEnabled(false);  // Use the setter function here
                setIsRotating(true);
                const intersection = intersects[0];
                const clickedCubelet = intersection.object as THREE.Mesh;
                const clickedFaceMaterialIndex = intersection.face?.materialIndex;

                if (intersection.face && typeof clickedFaceMaterialIndex === 'number') {

                    //const materials = clickedCubelet.material as THREE.Material[];
                    //(materials[clickedFaceMaterialIndex] as THREE.MeshStandardMaterial).color.set('pink');
                    //materials[clickedFaceMaterialIndex].needsUpdate = true;

                    clickedFaceNormal.current.copy(intersection.face.normal);

                    selectedCublet.current = clickedCubelet;

                    initialMousePosition.current.copy(mouse.current);

                    console.log(clickedFaceNormal.current);
                    console.log("Cube", {
                        "X": clickedCubelet.position.x
                        , "Y": clickedCubelet.position.y,
                        "Z": clickedCubelet.position.z
                    });

                    // we also need to capture the mouse/pointer position here 

                }
            }
        };

        const handleMouseMove = (event: MouseEvent) => {

        };


        function findMeshByPosition(axis: 'x' | 'y' | 'z', value: number): THREE.Mesh | undefined {
            const foundRef = meshRefs.current.find((ref) => {
                const mesh = ref.current;
                if (!mesh) return false;

                switch (axis) {
                    case 'x':
                        return mesh.position.x === value && mesh.position.y === 0 && mesh.position.z === 0;
                    case 'y':
                        return mesh.position.y === value && mesh.position.x === 0 && mesh.position.z === 0;
                    case 'z':
                        return mesh.position.z === value && mesh.position.x === 0 && mesh.position.y === 0;
                    default:
                        return false;
                }
            });

            return foundRef?.current || undefined;
        }


        const handleMouseUp = () => {
            setCameraEnabled(true);  // Use the setter function here
            setStartedRotation(false);
        };

        const normalizeCube = () => {
            function roundToNearestWhole(num: number, epsilon: number = 1e-10): number {
                // If the difference between the number and its rounded value is small,
                // it means it's very close to an integer.
                if (Math.abs(num - Math.round(num)) < epsilon) {
                    return Math.round(num);
                }
                return num;
            }
            
            meshRefs.current.forEach((ref) => {
                const mesh = ref.current;
                
                if (mesh) { //layer should determine wich x layer are we rotating. 
                    mesh.position.x = roundToNearestWhole(mesh.position.x);
                    mesh.position.y = roundToNearestWhole(mesh.position.y);
                    mesh.position.z = roundToNearestWhole(mesh.position.z);
                    
                }
            });
        }


        const isRotatingRef = useRef(isRotating);
        const rotationRef = useRef(rotation);

        useEffect(() => {
            // window.addEventListener('mousedown', handleMouseDown);
            // window.addEventListener('mouseup', handleMouseUp);
            // window.addEventListener('mousemove', handleMouseMove);

            isRotatingRef.current = isRotating;
            rotationRef.current = rotation;

            return () => {
                // window.removeEventListener('mousedown', handleMouseDown);
                // window.removeEventListener('mouseup', handleMouseUp);
                // window.removeEventListener('mousemove', handleMouseMove);
            };
        }, [handleMouseDown, handleMouseUp, handleMouseMove, isRotating, rotation]); // <-- add them here

        useFrame(() => {

            if (isRotating) {
                const angle = 90; //Normal cube rotation
                let stepAngle = angle / (rotationDuration * 60)
                let endRotation = false;

                const nextAngle = currentAngle + stepAngle;
                if (nextAngle > angle) {
                    stepAngle = angle - currentAngle;
                    endRotation = true;
                    setCurrentAngle(0);
                }
                else {
                    setCurrentAngle(nextAngle);
                }

                if (rotation.axis == 'X') {
                    rotateOnXAxis(rotation.layer, rotation.direction, stepAngle);
                }

                if (rotation.axis == 'Y') {
                    rotateOnYAxis(rotation.layer, rotation.direction, stepAngle);
                }

                if (rotation.axis == 'Z') {
                    rotateOnZAxis(rotation.layer, rotation.direction, stepAngle);
                }

                if (endRotation) {
                    normalizeCube();
                    setIsRotating(false);
                }

            }
        });

    
        return null;
    }

    function performMove(move: string) {
        // Extract direction and whether it's a 180-degree move.
        const direction = move.includes("'") ? 1 : -1; // if prime, then counter-clockwise
        const doubleTurn = move.includes("2");
    
        // Angle (default 90 degrees, but 180 degrees for double turns)
        const angle = doubleTurn ? Math.PI : Math.PI / 2;
    
        // Determine which axis and layer to rotate based on the move.
        switch (move[0]) {
            case 'U':
                setIsRotating(true);
                setRotation({ axis: 'Y', layer: 1, direction });
                break;
            case 'D':
                setIsRotating(true);
                setRotation({ axis: 'Y', layer: -1, direction });
                break;
            case 'R':
                setIsRotating(true);
                setRotation({ axis: 'X', layer: 1, direction });
                break;
            case 'L':
                setIsRotating(true);
                setRotation({ axis: 'X', layer: -1, direction });
                break;
            case 'F':
                setIsRotating(true);
                setRotation({ axis: 'Z', layer: 1, direction });
                break;
            case 'B':
                setIsRotating(true);
                setRotation({ axis: 'Z', layer: -1, direction });
                break;
            default:
                console.warn("Unknown move:", move);
                return;
        }
    }

    function getRandomMove() {
        const moves = ['U', 'D', 'R', 'L', 'F', 'B'];
        const directions = ["", "'"]; // "" for clockwise, "'" for counter-clockwise
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
        return randomMove + randomDirection;
    }
    
    function generateRandomMovesList(length = 20) {
        let movesList = '';
    
        for (let i = 0; i < length; i++) {
            movesList += getRandomMove() + ' ';
        }
        
        console.log("Movelist",  movesList.trim());
        moveStringRef.current = movesList.trim();
        return movesList.trim();
    }

    function invertMove(move: string) {
        move = move.trim(); // Remove any leading or trailing whitespace
    
        // If the move is empty after trimming, return it as is
        if (!move) return move;
    
        // If the move has a "'", then it's counter-clockwise, so we remove the "'" to make it clockwise
        if (move.includes("'")) {
            return move.replace("'", "");
        } 
        // If the move is clockwise (no "'"), then we add a "'" to make it counter-clockwise
        else {
            return move + "'";
        }
    }
    
    
    function invertMoveList(moveListString : string) {
        console.log("inside invert",moveListString);
        // Split the move string into individual moves
        const moves = moveListString.split(' ');
        console.log("Moves",moves);
        // Reverse the array of moves and invert the direction of each move
        const invertedMoves = moves.reverse().map(invertMove);

        console.log(invertedMoves.join(' '));

        return invertedMoves.join(' ');
    }
    
    function executeMoves(moves: string) {
        const moveList = moves.split(' ');
        let accumulatedDelay = 0;
    
        moveList.forEach(move => {
            setTimeout(() => {
                console.log("Trying move:", move);
                performMove(move);
            }, accumulatedDelay);
    
            accumulatedDelay += ((rotationDuration * 1000) + 100); // This will ensure that each move is delayed by an additional 3000ms
        });
    }
    
    
    const rotateLayerX = () => {
        setIsRotating(true);
        setRotation({
            axis: 'Y',
            direction: 1,
            layer: 1,
        });
    };

    const rotateLayerY = () => {
        setIsRotating(true);
        setRotation({
            axis: 'X',
            direction: 1,
            layer: 1,
        });
    };

    const rotateLayerZ = () => {
        setIsRotating(true);
        setRotation({
            axis: 'Z',
            direction: 1,
            layer: 1,
        });
    };


    const rotateOnXAxis = (layer: number, direction: number, angle: number = Math.PI / 2) => {
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
        const baseProperties = {
            roughness: 1.0,
            metalness: 1.9
        };
    
        const stickers = [STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK];
    
        // Update the stickers based on the x, y, z position
        if (x === 1) stickers[0] = STICKERS.LEFT;
        if (x === -1) stickers[1] = STICKERS.RIGHT;
        if (y === 1) stickers[2] = STICKERS.FRONT;
        if (y === -1) stickers[3] = STICKERS.BACK;
        if (z === 1) stickers[4] = STICKERS.UP;
        if (z === -1) stickers[5] = STICKERS.DOWN;
    
        // Create materials using a for loop
        const materials = stickers.map(sticker => new THREE.MeshStandardMaterial({ 
            map: new THREE.TextureLoader().load(sticker), 
            ...baseProperties
        }));
    
        return materials;
    };
    

    const generateCubes = () => {
        const out = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {

                    if (!(x == 1 && y == 0 && z == 0)) {
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
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={10} />
                <PerspectiveCamera ref={cameraRef} position={[0, 0, 8]}>
                    <OrbitControls enabled={cameraEnabled} />
                </PerspectiveCamera>
                <EventHandler />
                {cubesMatrix}
            </Canvas>
            <button onClick={() => executeMoves(generateRandomMovesList(40))}>
                Scramble
            </button>
            <button onClick={() => executeMoves(invertMoveList(moveStringRef.current))}>
                Solve
            </button>
        </>
    );

};

export default ThreeCube;
