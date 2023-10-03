// CubeProps.ts
export interface CubeProps {
    position: [number, number, number];
    materials?: THREE.Material[];  // Note the '?', making it optional
}
