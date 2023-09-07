import { Cubie } from './Cubie';
import { turnZ, turnX, turnY } from './Turns';
import { UPP, DWN, RGT, LFT, FRT, BCK, colors, speed } from './constants';

export class Move {
    angle: number;
    x: number;
    y: number;
    z: number;
    dir: number;
    animating: boolean;
    finished: boolean;
    cube: Cubie[]; // Reference to the Rubik's cube made up of Cubie instances.

    constructor(cube: Cubie[], x: number, y: number, z: number, dir: number) {
        this.cube = cube;
        this.angle = 0;
        this.x = x;
        this.y = y;
        this.z = z;
        this.dir = dir;
        this.animating = false;
        this.finished = false;
    }
  
    copy(): Move {
      return new Move(this.cube, this.x, this.y, this.z, this.dir);
    }
  
    reverse(): void {
      this.dir *= -1;
    }
  
    start(): void {
      this.animating = true;
      this.finished = false;
      this.angle = 0;
    }
  
    isFinished(): boolean {
      return this.finished;
    }
  
    update(): void {
        // Assuming 'speed' is globally available. If not, you'll have to define or import it accordingly.
        //Gotta check out where speed was defined
        
        if (this.animating) {
            this.angle += this.dir * speed;
            if (Math.abs(this.angle) > Math.PI / 2) {
                this.angle = 0;
                this.animating = false;
                this.finished = true;
                if (Math.abs(this.z) > 0) {
                    turnZ(this.cube, this.z, this.dir); // Provide the cube array
                } else if (Math.abs(this.x) > 0) {
                    turnX(this.cube, this.x, this.dir);
                } else if (Math.abs(this.y) > 0) {
                    turnY(this.cube, this.y, this.dir);
                }
            }
        }
    }
}
