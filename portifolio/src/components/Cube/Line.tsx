import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

type LineProps = {
    start: THREE.Vector3;
    end: THREE.Vector3;
};

const Line: React.FC<LineProps> = ({ start, end }) => {
    const { scene } = useThree();
    const ref = useRef<THREE.Line>();

    useEffect(() => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);

        return () => {
            scene.remove(line);
        };
    }, [start, end, scene]);

    return null;
};

export default Line;
