import { Face } from './Face'; // Assuming the Face class is in Face.ts. Adjust the path accordingly.
import p5 from 'p5';

export class Cubie {
    matrix: any; // Type depends on the matrix library you're using.
    x: number;
    y: number;
    z: number;
    c: p5.Color; // Type for color when using p5.
    faces: Face[];
    p5: p5; // Reference to the p5 instance.

    constructor(p: p5, matrix: any, x: number, y: number, z: number) {
        this.p5 = p;
        this.matrix = matrix;
        this.x = x;
        this.y = y;
        this.z = z;
        this.c = this.p5.color(255); 

        this.faces = [];
        this.faces.push(new Face(this.p5, this.p5.createVector(0, 0, -1), this.p5.color(0, 0, 255)));
        this.faces.push(new Face(this.p5, this.p5.createVector(0, 0, 1), this.p5.color(0, 255, 0)));
        this.faces.push(new Face(this.p5, this.p5.createVector(0, 1, 0), this.p5.color(255, 255, 255)));
        this.faces.push(new Face(this.p5, this.p5.createVector(0, -1, 0), this.p5.color(255, 255, 0)));
        this.faces.push(new Face(this.p5, this.p5.createVector(1, 0, 0), this.p5.color(255, 150, 0)));
        this.faces.push(new Face(this.p5, this.p5.createVector(-1, 0, 0), this.p5.color(255, 0, 0)));
    }

    turnFacesZ(dir: number): void {
        for (let f of this.faces) {
            f.turnZ(dir * Math.PI / 2);
        }
    }

    turnFacesX(dir: number): void {
        for (let f of this.faces) {
            f.turnX(dir * Math.PI / 2);
        }
    }

    turnFacesY(dir: number): void {
        for (let f of this.faces) {
            f.turnY(dir * Math.PI / 2);
        }
    }


    update(x: number, y: number, z: number): void {
        this.matrix.reset();
        this.matrix.translate(x, y, z);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    show(): void{
        this.p5.noFill();
        this.p5.stroke(0);
        this.p5.strokeWeight(0.1);
        this.p5.push(); 
        //this.p5.applyMatrix(this.matrix); //This is a problem i need to understand what this does
        this.p5.box(1);
        for (let f of this.faces) {
          f.show();
        }
        this.p5.pop();
      }
}
