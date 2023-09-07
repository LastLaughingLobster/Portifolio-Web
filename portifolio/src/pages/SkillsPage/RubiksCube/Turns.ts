import { Cubie } from "./Cubie";

export function turnZ(cube: Cubie[], index: number, dir: number): void {
    for (let i = 0; i < cube.length; i++) {
        let qb = cube[i];
        if (qb.z === index) {
            let angle = dir * Math.PI / 2;
            let newX = qb.x * Math.cos(angle) - qb.y * Math.sin(angle);
            let newY = qb.x * Math.sin(angle) + qb.y * Math.cos(angle);

            qb.update(Math.round(newX), Math.round(newY), qb.z);
            qb.turnFacesZ(dir);
        }
    }
}

export function turnY(cube: Cubie[], index: number, dir: number): void {
    for (let i = 0; i < cube.length; i++) {
        let qb = cube[i];
        if (qb.y === index) {
            let angle = dir * Math.PI / 2;
            let newX = qb.x * Math.cos(angle) - qb.z * Math.sin(angle);
            let newZ = qb.x * Math.sin(angle) + qb.z * Math.cos(angle);

            qb.update(Math.round(newX), qb.y, Math.round(newZ));
            qb.turnFacesY(dir);
        }
    }
}

export function turnX(cube: Cubie[], index: number, dir: number): void {
    for (let i = 0; i < cube.length; i++) {
        let qb = cube[i];
        if (qb.x === index) {
            let angle = dir * Math.PI / 2;
            let newY = qb.y * Math.cos(angle) - qb.z * Math.sin(angle);
            let newZ = qb.y * Math.sin(angle) + qb.z * Math.cos(angle);

            qb.update(qb.x, Math.round(newY), Math.round(newZ));
            qb.turnFacesX(dir);
        }
    }
}
