import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { TrackballControls } from '@react-three/drei';
import Cube from './Cube';
import * as TWEEN from '@tweenjs/tween.js';
import { COLORS, STICKERS, WHOLE_FACE_STICKERS } from './../../consts/cube';
import * as THREE from 'three';
import { RotationState } from './../../types/CubeType';
import arrowLookUpRotations from './arrowLookUpRotations';


type CubeColors = "red" | "green" | "blue" | "yellow" | "white" | "orange" | "black";  // Add other cube colors as needed

type ColorMapping = {
    [key: string]: THREE.Vector3;
    red: THREE.Vector3;
    green: THREE.Vector3;
    blue: THREE.Vector3;
    orange: THREE.Vector3;
    yellow: THREE.Vector3;
    white: THREE.Vector3;
};

interface Props {
    focusColor?: CubeColors;
}

type PlaneRefWithColor = {
    ref: React.RefObject<THREE.Mesh>;
    color: string;
};
  

const ThreeCube = ({ focusColor }: Props) => {
    const [cubesMatrix, setCubesMatrix] = useState<React.ReactElement[]>([]);
    const [planesMatrix, setPlanesMatrix] = useState<React.ReactElement[]>([]);
    const [trackBallEnabled, setTrackBallEnabled] = useState(true);
    const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(5, 5, 10));
    const [rotation, setRotation] = useState<RotationState>({
        axis: null,
        direction: 1,
        layer: 0,
    });

    const initialMousePosition = useRef(new THREE.Vector2());

    const meshRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);
    const planeMeshRefs = useRef<PlaneRefWithColor[]>([]);


    const [isRotating, setIsRotating] = useState(false);

    const selectedCublet = useRef(new THREE.Mesh());
    const clickedFaceNormal = useRef(new THREE.Vector3());

    const [currentAngle, setCurrentAngle] = useState(0);

    const rotationDuration = 0.2; //in seconds
    const transitionDuration = 1000;
    const INITIAL_CAMERA_POSITION = new THREE.Vector3(3, 3, 4.5);


    const moveStringRef = useRef<string>('');

    const arrowRefs = useRef<(THREE.Mesh | null)[]>([]);
    const [arrows, setArrows] = useState<JSX.Element[]>([]);

    const arrowRotationMap = useRef(new Map()).current;

    const [shouldRotateCamera, setShouldRotateCamera] = useState(false);

    const prevFocusColor = useRef<CubeColors>("black");

    const colorToPositionMapping: ColorMapping = {
        'red': new THREE.Vector3(0, INITIAL_CAMERA_POSITION.length(), 0),
        'green': new THREE.Vector3(INITIAL_CAMERA_POSITION.length(), 0, 0),
        'blue': new THREE.Vector3(-INITIAL_CAMERA_POSITION.length(), 0, 0),
        'orange': new THREE.Vector3(0, -INITIAL_CAMERA_POSITION.length(), 0),
        'yellow': new THREE.Vector3(0, 0, -INITIAL_CAMERA_POSITION.length()),
        'white': new THREE.Vector3(0, 0, INITIAL_CAMERA_POSITION.length())
    }

    const [moveList, setMoveList ] = useState<string[]>([]);
    const [isFakeCubeSolved, setIsFakeCubeSolved] = useState(false);
    const [startedSolving, setStartedSolving] = useState(false);

    const [shouldRenderSpecialFace, setShouldRenderSpecialFace] = useState(false);

    const canvasRef = useRef(null);


    useEffect(() => {
        // Initialize cubesMatrix and planesMatrix when component mounts
        const initCubes = generateCubes();
        const initPlanes = generateInvisiblePlanes();  // Assuming generateInvisiblePlanes() returns an array of <mesh> JSX elements
        
        console.log(initPlanes);
        
        setCubesMatrix(initCubes);
        setPlanesMatrix(initPlanes);
        
        return () => {
           
        };
    }, []);
    
  
    const getLengthVector3 = (vector: THREE.Vector3): number => {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
    }

    // Create a child component for the raycasting logic
    function EventHandler() {
        const { camera, scene } = useThree();
        const [cameraInitialized, setCameraInitialized] = useState(false);
        const raycaster = useRef(new THREE.Raycaster());
        const mouse = useRef(new THREE.Vector2());

        const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);

        const speed = 0.02;  // Adjust this value as needed for faster/slower interpolation


        raycaster.current.near = 0.1;
        raycaster.current.far = 10;


        function generateArrowsForFace(normal: THREE.Vector3, selectedCubletPosition: THREE.Vector3): THREE.Mesh[] {

            const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff007f });  // Green color for arrows
            const arrowGeometry = new THREE.ConeGeometry(0.3, 0.5, 2);  // Cone shape for arrow

            const arrows: THREE.Mesh[] = [];

            // The distance from the cube face where the arrow will be positioned. Adjust this value as needed.
            const offsetDistance = 0.7;
            const radialOffset = 0.65;

            if (normal.equals(new THREE.Vector3(1, 0, 0)) || normal.equals(new THREE.Vector3(-1, 0, 0))) {
                // X-axis

                //---------------------------------------------
                // Up
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[0].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + (offsetDistance * normal.x),
                    selectedCubletPosition.y + radialOffset,
                    selectedCubletPosition.z
                ));
                // I want to add these parts to a function
                // Down
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[1].rotation.x = Math.PI;
                arrows[1].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + (offsetDistance * normal.x),
                    selectedCubletPosition.y - radialOffset,
                    selectedCubletPosition.z
                ));

                // Front
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[2].rotation.y = Math.PI;
                arrows[2].rotation.x = Math.PI / 2;
                arrows[2].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + (offsetDistance * normal.x),
                    selectedCubletPosition.y,
                    selectedCubletPosition.z + radialOffset
                ));

                // Back
                arrows.push(new THREE.Mesh(arrowGeometry, arrowMaterial));
                arrows[3].rotation.y = Math.PI;
                arrows[3].rotation.x = -Math.PI / 2;
                arrows[3].position.copy(new THREE.Vector3(
                    selectedCubletPosition.x + (offsetDistance * normal.x),
                    selectedCubletPosition.y,
                    selectedCubletPosition.z - radialOffset
                ));

            }
            else if (normal.equals(new THREE.Vector3(0, 1, 0)) || normal.equals(new THREE.Vector3(0, -1, 0))) {
                // Y-axis

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

            const key = getPositionNormalKey(selectedCubletPosition, normal);
            const rotations = arrowLookUpRotations.get(key);
            if (rotations) {
                arrowRotationMap.set(arrows[0].position, rotations[0]);
                arrowRotationMap.set(arrows[1].position, rotations[1]);
                arrowRotationMap.set(arrows[2].position, rotations[2]);
                arrowRotationMap.set(arrows[3].position, rotations[3]);
            }

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
            if (isRotating || shouldRotateCamera) return;
            if (!canvasRef.current || event.target !== canvasRef.current) return;
            

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
                    setPlaneOpacityToZero();
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
                return;
            }

            clearArrows();
        }

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


        const getAngleBetweenVectors = (pos1?: THREE.Vector3, pos2?: THREE.Vector3, pivot: THREE.Vector3 = new THREE.Vector3(0,0,0)): number | undefined => {
            // Check if any of the inputs are undefined
            if (!pos1 || !pos2) {
                return undefined;
            }
        
            // Create vectors from pivot to pos1 and pivot to pos2
            const vector1 = pos1.clone().sub(pivot);
            const vector2 = pos2.clone().sub(pivot);
        
            // Calculate the angle in radians between the two vectors
            const angleRad = vector1.angleTo(vector2);
        
            // Convert the angle from radians to degrees
            const angleDeg = angleRad * (180 / Math.PI);
        
            return angleDeg;
        }

        const isOppositeSide = (color1: CubeColors, color2: CubeColors): boolean => {
            // Define a mapping of opposite colors
            const oppositeColors: Record<CubeColors, CubeColors> = {
                "red": "orange",
                "orange": "red",
                "green": "blue",
                "blue": "green",
                "yellow": "white",
                "white": "yellow",
                "black": "black"  // Assuming black doesn't have an opposite side, or it's opposite to itself
            };
        
            // Check if the color2 is the opposite of color1 using the mapping
            return oppositeColors[color1] === color2;
        }

        function getRandomNonOppositeFace(color: CubeColors): CubeColors {
            const allColors: CubeColors[] = ["red", "green", "blue", "yellow", "white", "orange"];
            
            const possibleColors = allColors.filter(c => c !== color && !isOppositeSide(color, c));
            console.warn("Possible colors for", color, "-> " ,possibleColors);
            const randomIndex = Math.floor(Math.random() * possibleColors.length);
            return possibleColors[randomIndex];
        }
        

        const isRotatingRef = useRef(isRotating);
        const rotationRef = useRef(rotation);

        const groupRef = useRef(new TWEEN.Group());

        const tranlateCube = (focusColor : CubeColors ) => {
            //how do we wait here for fakecubeSolve to finish?

            const angleThreshhHold = 65.0;
            const animationDuration = 1000;
        
            if (camera) camera.updateMatrixWorld();
                        
            const start = colorToPositionMapping[prevFocusColor.current];
            const angle = getAngleBetweenVectors(start, camera.position);
            
            console.warn("Start:", start, 
                         "\nCamera:", camera.position, 
                         "\nAngle:", angle);
    
            const target = colorToPositionMapping[focusColor];
    
            let middlePoint: THREE.Vector3 | undefined = undefined;
            
            if (typeof angle === "number" && angle < angleThreshhHold && isOppositeSide(prevFocusColor.current, focusColor)){
                middlePoint = colorToPositionMapping[getRandomNonOppositeFace(focusColor)];
            }

            setTrackBallEnabled(false);
    
            let completedTweens = 0;
    
            const checkAllTweensCompleted = () => {
                completedTweens++;
                if (completedTweens === 2) {
                    setTrackBallEnabled(true);
                    setShouldRotateCamera(false);
                    setShouldRenderSpecialFace(true);
                    prevFocusColor.current = focusColor;
                    fakeCubeSolve(() => "");
                }
            };

    
            // Modify the tweening logic for camera.position
            if (middlePoint) {
                new TWEEN.Tween(camera.position, groupRef.current)
                    .to(middlePoint, animationDuration / 2)
                    .onUpdate(() => camera.lookAt(0, 0, 0))
                    .onComplete(() => {
                        new TWEEN.Tween(camera.position, groupRef.current)
                            .to(target, animationDuration / 2)
                            .onUpdate(() => camera.lookAt(0, 0, 0))
                            .onComplete(checkAllTweensCompleted)
                            .start();
                    })
                    .start();
            } else {
                new TWEEN.Tween(camera.position, groupRef.current)
                    .to(target, animationDuration)
                    .onUpdate(() => camera.lookAt(0, 0, 0))
                    .onComplete(checkAllTweensCompleted)
                    .start();
            }
    
            let targetUpVector = new THREE.Vector3(0, 1, 0);
            if (focusColor === "red") {
                targetUpVector = new THREE.Vector3(1, 0, 0);
            } else if (focusColor === "orange") {
                targetUpVector = new THREE.Vector3(-1, 0, 0);
            }
    
            new TWEEN.Tween(camera.up, groupRef.current)
                .to(targetUpVector, animationDuration)
                .onComplete(checkAllTweensCompleted)
                .start();
        }

        useEffect(() => {
            if (focusColor && prevFocusColor.current !== focusColor) {
                tranlateCube(focusColor);
            }
        }, [focusColor, groupRef, prevFocusColor]);


        useEffect(() => {
            if ( canvasRef.current){
                window.addEventListener('pointerdown', handleMouseDown);

                isRotatingRef.current = isRotating;
                rotationRef.current = rotation;

                return () => {
                    window.removeEventListener('pointerdown', handleMouseDown);

                };
            }
        }, [handleMouseDown, isRotating, rotation]);

        useFrame(() => {
            groupRef.current.update();

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

        moveList.push(move);
    }

    function fakeCubeSolve(callback: () => void) {
        const moveListString = moveList.join(' ');
        const invertedMoveList = invertMoveList(moveListString);
        executeMovesAndSetFace(invertedMoveList);
        setMoveList([]);
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

        console.log("Movelist", movesList.trim());
        moveStringRef.current = movesList.trim();
        return movesList.trim();
    }

    function invertMove(move: string) {
        move = move.trim(); 

        if (!move) return move;

        if (move.includes("'")) return move.replace("'", "");
    
        return move + "'"; 
    }


    function invertMoveList(moveListString: string) {
        // Split the move string into individual moves
        const moves = moveListString.split(' ');
        // Reverse the array of moves and invert the direction of each move
        const invertedMoves = moves.reverse().map(invertMove);

        return invertedMoves.join(' ');
    }

    function executeMoves(moves: string) {
        const moveList = moves.split(' ');
        let accumulatedDelay = 0;

        moveList.forEach(move => {
            setTimeout(() => {
                performMove(move);
            }, accumulatedDelay);

            accumulatedDelay += ((rotationDuration * 1000) + 100); // This will ensure that each move is delayed by an additional 3000ms
        });
    }

    function executeMovesAndSetFace(moves: string) {
        const moveList = moves.split(' ');
        let accumulatedDelay = 0;

        moveList.forEach(move => {
            setTimeout(() => {
                performMove(move);
            }, accumulatedDelay);

            accumulatedDelay += ((rotationDuration * 1000) + 100); // This will ensure that each move is delayed by an additional 3000ms
        });

        setTimeout(() => {
            if(focusColor)
                setPlaneOpacityToOneByColor(focusColor.toUpperCase());
        }, accumulatedDelay);
    }

    const rotateOnXAxis = (layer: number, direction: number, angle: number = Math.PI / 2) => {
        meshRefs.current.forEach((ref) => {
            const mesh = ref.current;
            if (mesh && mesh.position.x === layer) {
                const axis = new THREE.Vector3(1, 0, 0);
                const angleRad = mesh.rotateOnWorldAxis(axis, THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer)));

                if ((mesh.position.y !== 0 || mesh.position.z !== 0) || !mesh.position.equals(new THREE.Vector3(0, 0, 0))) {

                    const radius = Math.sqrt(mesh.position.y * mesh.position.y + mesh.position.z * mesh.position.z);

                    let theta = Math.atan2(mesh.position.z, mesh.position.y);

                    theta += THREE.MathUtils.degToRad((angle * direction) * (layer == 0 ? 1 : layer));

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

                if ((mesh.position.x !== 0 || mesh.position.z !== 0) || !mesh.position.equals(new THREE.Vector3(0, 0, 0))) {
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

                if ((mesh.position.x !== 0 || mesh.position.y !== 0) || !mesh.position.equals(new THREE.Vector3(0, 0, 0))) {
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
            metalness: 2.1
        };
    
        const stickers = [STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK, STICKERS.BLACK];
    
        if (x === 1) stickers[0] = STICKERS.LEFT;
        if (x === -1) stickers[1] = STICKERS.RIGHT;
        if (y === 1) stickers[2] = STICKERS.FRONT;
        if (y === -1) stickers[3] = STICKERS.BACK;
        if (z === 1) stickers[4] = STICKERS.UP;
        if (z === -1) stickers[5] = STICKERS.DOWN;

        const materials = stickers.map(sticker => new THREE.MeshPhysicalMaterial({
            map: new THREE.TextureLoader().load(sticker),
            ...baseProperties
        }));
    
        return materials;
    };

    const generateInvisiblePlanes = (): React.ReactElement[] => {
        const planes: React.ReactElement[] = [];
    
        const addPlane = (color: string, position: THREE.Vector3, rotation: THREE.Euler) => {
            const meshRef = React.createRef<THREE.Mesh>();
            planeMeshRefs.current.push({ ref: meshRef, color }); // storing ref along with color
            
            const geometry = new THREE.PlaneGeometry(3, 3);
            const material = new THREE.MeshPhysicalMaterial({
                map: new THREE.TextureLoader().load(WHOLE_FACE_STICKERS[color]),
                transparent: true,
                opacity: 0,
                roughness: 1.0,
                metalness: 2.1
            });
    
            planes.push(
                <mesh 
                    ref={meshRef} 
                    position={position} 
                    rotation={rotation} 
                    material={material} 
                    geometry={geometry} 
                    key={color} 
                />
            );
        };
    
        addPlane("GREEN", new THREE.Vector3(1.5001, 0, 0), new THREE.Euler(0, Math.PI / 2, 0));
        addPlane("BLUE", new THREE.Vector3(-1.5001, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));

        addPlane("ORANGE", new THREE.Vector3(0, -1.5001, 0), new THREE.Euler(Math.PI / 2, 0, Math.PI / 2));
        addPlane("RED", new THREE.Vector3(0, 1.5001, 0), new THREE.Euler(-Math.PI / 2, 0, -Math.PI / 2));

        addPlane("YELLOW", new THREE.Vector3(0, 0, -1.5001), new THREE.Euler(0, -Math.PI, 0));
        addPlane("WHITE", new THREE.Vector3(0, 0, 1.5001), new THREE.Euler(2* Math.PI, 0, 0));
    
        return planes;
    };
    
    
    const setPlaneOpacityToZero = () => {
        planeMeshRefs.current.forEach(({ ref }) => {  // Destructuring to get 'ref'
            const mesh = ref.current;
            if (mesh) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => {
                        mat.opacity = 0;
                        mat.needsUpdate = true;
                    });
                } else {
                    mesh.material.opacity = 0;
                    mesh.material.needsUpdate = true;  // Notify Three.js that the material has changed
                }
            }
        });
    };
    

    const setPlaneOpacityToOneByColor = (targetColor: string) => {
        planeMeshRefs.current.forEach(({ ref, color }) => {
          if (color !== targetColor) return;
      
          const mesh = ref.current;
          if (mesh) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => {
                mat.opacity = 1;
                mat.needsUpdate = true;
              });
            } else {
              mesh.material.opacity = 1;
              mesh.material.needsUpdate = true;
            }
          }
        });
      };      
      
    

    const generateCubes = () => {
        const out = [];
        // Step 1: Initial setup with old materials
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const materials = generateMaterials(x, y, z);  // Use the old function
                    const meshRef = React.createRef<THREE.Mesh>();
                    meshRefs.current.push(meshRef);
                    out.push(
                        <Cube
                            position={[x, y, z]}
                            materials={materials}
                            key={`${x}${y}${z}`}
                            forwardedRef={meshRef}
                            cubeName={`Cube-${x}-${y}-${z}`}
                        />
                    );
                }
            }
        }

        // add the invisible planes here create a function similar to generate Materials for this pupuse
    
        return out;
    };
    

    return (
        <>
            <Canvas ref={canvasRef} camera={{
                position: INITIAL_CAMERA_POSITION,
                near: 2.0,
                far: 10
            }}>
                <ambientLight intensity={1} />
                <TrackballControls
                    enabled={trackBallEnabled}
                    noPan={true}
                    noZoom={true}
                    rotateSpeed={1.2}
                />
                <EventHandler />
                {cubesMatrix}
                {planesMatrix}  {/* Render the planes */}
                {arrows}
            </Canvas>
        </>
    );
    

};

export default ThreeCube;
