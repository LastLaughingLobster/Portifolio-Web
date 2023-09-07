import p5Types from "p5";
import { UPP, DWN, RGT, LFT, FRT, BCK, colors } from './constants';

export class Face {
    normal: p5Types.Vector;
    c: p5Types.Color;
    p5: p5Types;

    constructor(p5: p5Types, normal: p5Types.Vector, c: p5Types.Color) {
      this.p5 = p5;
      this.normal = normal;
      this.c = c;
    }
  
    turnZ(angle: number): void {
      let newX = this.normal.x * Math.cos(angle) - this.normal.y * Math.sin(angle);
      let newY = this.normal.x * Math.sin(angle) + this.normal.y * Math.cos(angle);
      this.normal.set(Math.round(newX), Math.round(newY), Math.round(this.normal.z));
    }
  
    turnY(angle: number): void {
      let newX = this.normal.x * Math.cos(angle) - this.normal.z * Math.sin(angle);
      let newZ = this.normal.x * Math.sin(angle) + this.normal.z * Math.cos(angle);
      this.normal.set(Math.round(newX), Math.round(this.normal.y), Math.round(newZ));
    }
  
    turnX(angle: number): void {
      let newY = this.normal.y * Math.cos(angle) - this.normal.z * Math.sin(angle);
      let newZ = this.normal.y * Math.sin(angle) + this.normal.z * Math.cos(angle);
      this.normal.set(Math.round(this.normal.x), Math.round(newY), Math.round(newZ));
    }
  
    show(): void {
      this.p5.push();
      this.p5.fill(this.c);
      this.p5.noStroke();
      this.p5.rectMode(this.p5.CENTER);
      this.p5.translate(0.5 * this.normal.x, 0.5 * this.normal.y, 0.5 * this.normal.z);
      if (Math.abs(this.normal.x) > 0) {
        this.p5.rotateY(this.p5.HALF_PI);
      } else if (Math.abs(this.normal.y) > 0) {
        this.p5.rotateX(this.p5.HALF_PI);
      }
      this.p5.square(0, 0, 1);
      this.p5.pop();
    }
}
