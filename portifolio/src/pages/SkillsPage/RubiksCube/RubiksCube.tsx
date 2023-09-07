import React, { useEffect, useRef, useState } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import { Cubie } from './Cubie';
import { UPP, DWN, RGT, LFT, FRT, BCK, colors } from './constants';
import { keyPressed, applyMove } from './Controls'; // Import controls
import { Move } from './Move';

export const RubiksCube: React.FC = () => {

    let allMoves: Move[] = [];

    const dim = 3;
    let cube: Cubie[] = []; // Flattened cube array
    let cam: any; // Camera variable for p5
    let currentMove: Move; // Imported Move class
    let sequence: Move[] = [];
    let counter = 0;

    let rX = 0;
    let rY = 0;
    let pMouseX = 0;
    let pMouseY = 0;

    let canvasRef: Element;

    const mouseDragged = (p5: p5Types) => {
        if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
            const factor = 0.01;

            let dx = p5.mouseX - pMouseX;
            let dy = p5.mouseY - pMouseY;

            rY += dx * factor;
            rX += dy * factor;

            pMouseX = p5.mouseX;
            pMouseY = p5.mouseY;
        }
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {

        let width, height;

        canvasRef = canvasParentRef;

        if (canvasParentRef instanceof HTMLElement) {
            width = canvasParentRef.offsetWidth;
            height = canvasParentRef.offsetHeight;
        } else {
            width = 400;  // default size
            height = 400; // default size
        }

        console.log(width, height);

        // Set canvas size based on parent div's size
        p5.createCanvas(width, width, p5.WEBGL).parent(canvasParentRef);

        let index = 0;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    let matrix = p5.createVector(x, y, z);
                    cube[index] = new Cubie(p5, matrix, x, y, z);
                    index++;
                }
            }
        }

        allMoves = [
            new Move(cube ,0, 1, 0, 1), 
            new Move(cube ,0, 1, 0, -1), 
            new Move(cube ,0, -1, 0, 1), 
            new Move(cube ,0, -1, 0, -1), 
            new Move(cube ,1, 0, 0, 1), 
            new Move(cube ,1, 0, 0, -1), 
            new Move(cube ,-1, 0, 0, 1), 
            new Move(cube ,-1, 0, 0, -1), 
            new Move(cube ,0, 0, 1, 1), 
            new Move(cube ,0, 0, 1, -1), 
            new Move(cube ,0, 0, -1, 1), 
            new Move(cube ,0, 0, -1, -1) 
        ]

        console.log(cube)
    };

    const windowResized = (p5: p5Types) => {
        let width, height;

        if (canvasRef instanceof HTMLElement) {
            width = canvasRef.offsetWidth;
            height = canvasRef.offsetHeight;
        } else {
            width = 400;  // default size
            height = 400; // default size
        }

        p5.resizeCanvas(width, height);
    };



    const draw = (p5: p5Types) => {
        p5.background(51);

        p5.rotateX(rX);
        p5.rotateY(rY);

        /*p5.rotateX(-0.5);
        p5.rotateY(0.4);
        p5.rotateZ(0.1);

        currentMove.update();
        if (currentMove.isFinished()) {
            if (counter < sequence.length - 1) {
                counter++;
                currentMove = sequence[counter];
                currentMove.start();
            }
        }*/

        p5.scale(50);
        for (let i = 0; i < cube.length; i++) {
            p5.push();
            /*if (p5.abs(cube[i].z) > 0 && cube[i].z == currentMove.z) {
                p5.rotateZ(currentMove.angle);
            } else if (p5.abs(cube[i].x) > 0 && cube[i].x == currentMove.x) {
                p5.rotateX(currentMove.angle);
            } else if (p5.abs(cube[i].y) > 0 && cube[i].y ==currentMove.y) {
                p5.rotateY(-currentMove.angle);
            }*/   
            cube[i].show();
            p5.pop();
        }
    };

    useEffect(() => {
        // Bind the key pressed event to apply moves
        const handleKeyPress = (e: KeyboardEvent) => {
            keyPressed(e.key, cube);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [cube]);


    return <Sketch
        setup={setup}
        draw={draw}
        mouseDragged={(p5) => mouseDragged(p5)}
        windowResized={(p5) => windowResized(p5)} />;

};
