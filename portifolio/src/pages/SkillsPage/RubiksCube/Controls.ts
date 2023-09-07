import { turnZ, turnX, turnY } from './Turns';
import { Move } from './Move';
import { Cubie } from './Cubie';

let currentMove: Move; 
let counter: number;
let cube: Cubie[]; // Assuming you have a cube of type Cubie array

export function keyPressed(key: string, cube: Cubie[]): void { // Passed cube as a parameter
    if (key === ' ') {
        currentMove.start();
        counter = 0;
    }
    applyMove(key, cube); // Passed cube as an argument
}

export function applyMove(move: string, cube: Cubie[]): void { // Passed cube as a parameter
    switch (move) {
        case 'f':
            turnZ(cube, 1, 1);
            break;
        case 'F':
            turnZ(cube, 1, -1);
            break;
        case 'b':
            turnZ(cube, -1, 1);
            break;
        case 'B':
            turnZ(cube, -1, -1);
            break;
        case 'u':
            turnY(cube, 1, 1);
            break;
        case 'U':
            turnY(cube, 1, -1);
            break;
        case 'd':
            turnY(cube, -1, 1);
            break;
        case 'D':
            turnY(cube, -1, -1);
            break;
        case 'l':
            turnX(cube, -1, 1);
            break;
        case 'L':
            turnX(cube, -1, -1);
            break;
        case 'r':
            turnX(cube, 1, 1);
            break;
        case 'R':
            turnX(cube, 1, -1);
            break;
    }
}
