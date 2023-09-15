import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Cube from './Cube';
import { COLORS, STICKERS } from './../../consts/cube';
import * as THREE from 'three';
import { Axis, RotationState } from './../../types/CubeType';
import Line from './Line';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Console } from 'console';
import arrowLookUpRotations from './arrowLookUpRotations';

type ArrowObject = {
    mesh: THREE.Mesh;
    rotationCommand: string; // This can be a string representing the type of rotation like "U", "L", "F", etc.
};


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

    const rotationDuration = 0.5; //in seconds


    const moveStringRef = useRef<string>('');

    const arrowRefs = useRef<(THREE.Mesh | null)[]>([]);
    const [arrows, setArrows] = useState<JSX.Element[]>([]);

    const arrowRotationMap = useRef(new Map()).current;


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
        

        function generateArrowsForFace(normal: THREE.Vector3, selectedCubletPosition : THREE.Vector3): THREE.Mesh[] {
            
            function getRotationDirection(value : number) {
                return value > 0 ? "" : "'";
            }


            const arrowMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});  // Green color for arrows
            const arrowGeometry = new THREE.ConeGeometry(0.3, 0.3, 2);  // Cone shape for arrows
        
            console.log("Normal vector", normal, "Position", selectedCubletPosition);
        
            const arrows: THREE.Mesh[] = [];
            
            // The distance from the cube face where the arrow will be positioned. Adjust this value as needed.
            const offsetDistance = 0.6;
            const radialOffset = 0.5;
            const offsetVector = normal.clone().multiplyScalar(offsetDistance);
        
            // This will determine the position of arrows in front of the face based on the normal.
            const arrowPosition = selectedCubletPosition.clone().add(offsetVector);
        
            if (normal.equals(new THREE.Vector3(1, 0, 0)) || normal.equals(new THREE.Vector3(-1, 0, 0))) {
                // X-axis
                const direction = getRotationDirection(normal.x);

                //---------------------------------------------
                // Up
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[0].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + ( offsetDistance * normal.x),
                    selectedCubletPosition.y + radialOffset,
                    selectedCubletPosition.z
                ));
                // I want to add these parts to a function
                // Down
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[1].rotation.x = Math.PI;
                arrows[1].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + ( offsetDistance * normal.x),
                    selectedCubletPosition.y - radialOffset,
                    selectedCubletPosition.z
                ));
        
                // Front
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[2].rotation.y = Math.PI;
                arrows[2].rotation.x = Math.PI / 2;
                arrows[2].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + ( offsetDistance * normal.x),
                    selectedCubletPosition.y,
                    selectedCubletPosition.z + radialOffset
                ));
        
                // Back
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[3].rotation.y = Math.PI;
                arrows[3].rotation.x = -Math.PI / 2;
                arrows[3].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + ( offsetDistance * normal.x),
                    selectedCubletPosition.y,
                    selectedCubletPosition.z - radialOffset
                ));
                 
            } 
            else if (normal.equals(new THREE.Vector3(0, 1, 0)) || normal.equals(new THREE.Vector3(0, -1, 0))) {
                // Y-axis
                const direction = getRotationDirection(normal.y);


                // Left
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[0].rotation.z = Math.PI / 2;
                arrows[0].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x - radialOffset,
                    selectedCubletPosition.y + (offsetDistance * normal.y),
                    selectedCubletPosition.z
                ));
        
                // Right
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[1].rotation.z = -Math.PI / 2;
                arrows[1].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + radialOffset,
                    selectedCubletPosition.y + (offsetDistance * normal.y),
                    selectedCubletPosition.z
                ));
        
                // Front
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[2].rotation.y = Math.PI / 2;
                arrows[2].rotation.x = Math.PI / 2;
                arrows[2].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x,
                    selectedCubletPosition.y + (offsetDistance * normal.y),
                    selectedCubletPosition.z + radialOffset
                ));
        
                // Back
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[3].rotation.y = -Math.PI / 2;
                arrows[3].rotation.x = -Math.PI / 2;
                arrows[3].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x,
                    selectedCubletPosition.y + (offsetDistance * normal.y),
                    selectedCubletPosition.z - radialOffset
                ));
        
            }
            else if (normal.equals(new THREE.Vector3(0, 0, 1)) || normal.equals(new THREE.Vector3(0, 0, -1))) {
                const direction = getRotationDirection(normal.z);

                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[0].rotation.z = Math.PI / 2;
                arrows[0].rotation.x = Math.PI / 2;
                arrows[0].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x - radialOffset,
                    selectedCubletPosition.y,
                    selectedCubletPosition.z + (offsetDistance * normal.z)
                ));

                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[1].rotation.z = -Math.PI / 2;
                arrows[1].rotation.x = Math.PI / 2;
                arrows[1].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + radialOffset,
                    selectedCubletPosition.y,
                    selectedCubletPosition.z + (offsetDistance * normal.z)
                ));

                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[2].rotation.y = Math.PI / 2;
                arrows[2].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x,
                    selectedCubletPosition.y + radialOffset,
                    selectedCubletPosition.z + (offsetDistance * normal.z)
                ));

                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[3].rotation.z = -Math.PI;
                arrows[3].rotation.y = Math.PI / 2;
                arrows[3].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x,
                    selectedCubletPosition.y - radialOffset,
                    selectedCubletPosition.z + (offsetDistance * normal.z)
                ));

            }

            console.log(getPositionNormalKey(selectedCubletPosition, normal));
                    
            const key = getPositionNormalKey(selectedCubletPosition, normal);
            const rotations = arrowLookUpRotations.get(key);
            if (rotations){
                arrowRotationMap.set(arrows[0].position, rotations[0]);
                arrowRotationMap.set(arrows[1].position, rotations[1]);
                arrowRotationMap.set(arrows[2].position, rotations[2]);
                arrowRotationMap.set(arrows[3].position, rotations[3]);
            }

            console.log()
            
            return arrows;
        }

        const stringifyVector = (vector: THREE.Vector3) => {
            return `(${vector.x.toFixed(0)},${vector.y.toFixed(0)},${vector.z.toFixed(0)})`;
        };
        
        const getPositionNormalKey = (position: THREE.Vector3, normal: THREE.Vector3) => {
            return `${stringifyVector(position)}_${stringifyVector(normal)}`;
        };
        
        
        const clearArrows = () => {
            arrowRefs.current = [];  // Clear the references
            setArrows([]);  // Clear the arrow JSX elements
        };

        function snapNormal(vector: THREE.Vector3): THREE.Vector3 {
            const absX = Math.abs(vector.x);
            const absY = Math.abs(vector.y);
            const absZ = Math.abs(vector.z);

            if (absX > absY && absX > absZ) {
                return new THREE.Vector3(Math.sign(vector.x), 0, 0);
            } else if (absY > absX && absY > absZ) {
                return new THREE.Vector3(0, Math.sign(vector.y), 0);
            } else {
                return new THREE.Vector3(0, 0, Math.sign(vector.z));
            }
        }
        
        
        const handleMouseDown = (event: MouseEvent) => {
            if (isRotating){
                return;
            }
        
            const canvas = event.target as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
        
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
            if (camera) {
                camera.updateMatrixWorld();
                raycaster.current.setFromCamera(mouse.current, camera);
            }
        
            const arrowMeshes = arrowRefs.current.map(ref => ref).filter(Boolean) as THREE.Mesh[];
            const cubeletMeshes = meshRefs.current.map(ref => ref.current).filter(Boolean) as THREE.Mesh[];
        
            // First, check if any arrow was clicked
            const arrowIntersects = raycaster.current.intersectObjects(arrowMeshes);
            if (arrowIntersects.length > 0) {
                const clickedArrowPosition = arrowIntersects[0].object.position;
                const rotation = arrowRotationMap.get(clickedArrowPosition);
                if (rotation) {
                    // Perform the rotation or handle the rotation command as per your system's design
                    console.log(`Rotation: ${rotation}`);
                    clearArrows();
                    performMove(rotation);
                    return;  // Exit out of the function after processing the arrow click
                }
            }
        
            // If no arrow was clicked, then check for cubelets
            const cubeletIntersects = raycaster.current.intersectObjects(cubeletMeshes);
            if (cubeletIntersects.length > 0) {
                const intersection = cubeletIntersects[0];
                const clickedCubelet = intersection.object as THREE.Mesh;

                // Calculate face direction based on intersection point and cubelet position
                const faceDirection = new THREE.Vector3().subVectors(intersection.point, clickedCubelet.position);
                clickedFaceNormal.current = snapNormal(faceDirection);

        
                
                selectedCublet.current = clickedCubelet;
                initialMousePosition.current.copy(mouse.current);

                //For visual debbuging
                const clickedFaceMaterialIndex = intersection.face?.materialIndex;
                const materials = clickedCubelet.material as THREE.Material[];
                
                if (intersection.face && typeof clickedFaceMaterialIndex === 'number') {
                    //(materials[clickedFaceMaterialIndex] as THREE.MeshStandardMaterial).color.set('pink');
                    //materials[clickedFaceMaterialIndex].needsUpdate = true;
                }
        
                clearArrows();
        
                // Generate arrows based on the clicked face
                const newArrows = generateArrowsForFace(clickedFaceNormal.current, selectedCublet.current.position);
        
                // Position and add arrows to the scene
                newArrows.forEach(arrow => {
                    arrowRefs.current.push(arrow); 
                });
        
                const arrowElements: JSX.Element[] = newArrows.map((arrow, index) => (
                    <primitive 
                        key={index} 
                        object={arrow} 
                        position={arrow.position}  // Set arrow position same as clicked cubelet
                        ref={(ref: THREE.Mesh | null) => arrowRefs.current[index] = ref}
                    />
                ));
                
                setArrows(arrowElements);
        
                console.log("Face normal --> ", clickedFaceNormal.current);
                console.log("Cube", {
                    "X": clickedCubelet.position.x,
                    "Y": clickedCubelet.position.y,
                    "Z": clickedCubelet.position.z
                });
            }
        }
        
        

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
            window.addEventListener('mousedown', handleMouseDown);
            // window.addEventListener('mouseup', handleMouseUp);
            // window.addEventListener('mousemove', handleMouseMove);

            isRotatingRef.current = isRotating;
            rotationRef.current = rotation;

            return () => {
                window.removeEventListener('mousedown', handleMouseDown);
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
        const angle = doubleTurn ? Math.PI : Math.PI / 2; // Not used in your current code, but just a reference
    
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
            case 'M':
                setIsRotating(true);
                setRotation({ axis: 'X', layer: 0, direction });
                break;
            case 'E':
                setIsRotating(true);
                setRotation({ axis: 'Y', layer: 0, direction });
                break;
            case 'S':
                setIsRotating(true);
                setRotation({ axis: 'Z', layer: 0, direction });
                break;
            default:
                console.warn("Unknown move:", move);
                return;
        }
    }
    

    function getRandomMove() {
        const moves = ['U', 'D', 'R', 'L', 'F', 'B', 'M', 'E', 'S'];
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
            axis: 'X',
            direction: 1,
            layer: 0,
        });
    };

    const rotateLayerY = () => {
        setIsRotating(true);
        setRotation({
            axis: 'Y',
            direction: 1,
            layer: 0,
        });
    };

    const rotateLayerZ = () => {
        setIsRotating(true);
        setRotation({
            axis: 'Z',
            direction: 1,
            layer: 0,
        });
    };

    const rotateLayerXw = () => {
        setIsRotating(true);
        setRotation({
            axis: 'X',
            direction: 1,
            layer: 1,
        });
    };

    const rotateLayerYw = () => {
        setIsRotating(true);
        setRotation({
            axis: 'Y',
            direction: 1,
            layer: 1,
        });
    };

    const rotateLayerZw = () => {
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
                const axis = new THREE.Vector3(1, 0, 0); // Layer determines wich side of the X-axis we are working with
                const angleRad = 
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer)));

                // Check if the cube is not on the axis
                if ((mesh.position.y !== 0 || mesh.position.z !== 0) || !mesh.position.equals(new THREE.Vector3(0,0,0))) {
                    
                
                    // Calculate the distance between the cube's current position and the rotation axis
                    const radius = Math.sqrt(mesh.position.y * mesh.position.y + mesh.position.z * mesh.position.z);

                    // Get the current angle based on the cube's position.
                    let theta = Math.atan2(mesh.position.z, mesh.position.y);

                    // Increment the theta based on rotation direction.
                    
                    theta += THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer));
                    
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
                const axis = new THREE.Vector3(0, 1, 0);
                const angleRad = 
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer)));

                if ((mesh.position.x !== 0 || mesh.position.z !== 0) || !mesh.position.equals(new THREE.Vector3(0,0,0))) {
                    const radius = Math.sqrt(mesh.position.x * mesh.position.x + mesh.position.z * mesh.position.z);

                    let theta = Math.atan2(mesh.position.z, mesh.position.x);
                    theta += THREE.MathUtils.degToRad((angle * direction) * -(layer == 0 ? 1 : layer));

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
                const axis = new THREE.Vector3(0, 0, 1);
                const angleRad = 
                mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer)));

                if ((mesh.position.x !== 0 || mesh.position.y !== 0) || !mesh.position.equals(new THREE.Vector3(0,0,0))) {
                    const radius = Math.sqrt(mesh.position.x * mesh.position.x + mesh.position.y * mesh.position.y);

                    let theta = Math.atan2(mesh.position.y, mesh.position.x);
                    theta += THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer));

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
                {arrows}  {/* Render arrows here */}
            </Canvas>
            <button onClick={() => executeMoves(generateRandomMovesList(10))}>
                Scramble
            </button>
            <button onClick={() => executeMoves(invertMoveList(moveStringRef.current))}>
                Solve
            </button>
        </>
    );

};

export default ThreeCube;
