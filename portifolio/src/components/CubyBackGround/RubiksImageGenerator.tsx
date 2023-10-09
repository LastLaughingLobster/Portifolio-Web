import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import './RubiksImageGenerator.css'

interface RubiksImageGeneratorProps {
    imagePath: string;
    cubeSize?: number;
    stickerBorder?: number;
    width?: number;
    height?: number;
}

const RubiksImageGenerator: React.FC<RubiksImageGeneratorProps> = ({
    imagePath,
    cubeSize = 21,
    stickerBorder = 0.35,
    width = 800,
    height = 800
}) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    let imageToDraw: p5.Image = new p5.Image();

    useEffect(() => {
        const STICKER_SIZE = cubeSize / 3;
        const RUBIKS_COLORS: number[][] = [
            [255, 0, 0],
            [0, 255, 0],
            [0, 0, 255],
            [255, 255, 0],
            [255, 255, 255],
            [255, 165, 0]
        ];

        const MASK_COLORS: number[][] = [
            [195, 68, 67],
            [1, 173, 75],
            [49, 85, 164],
            [255, 255, 0],
            [255, 254, 242],
            [255, 181, 18]
        ];

        const DRAW_STATES = {
            INIT: 'init',
            WAITING: 'waiting',
            COMPLETED: 'completed'
        };
        
        let drawState = DRAW_STATES.INIT;

        let currentSeed = 0;

        const sketch = (p: p5) => {
            let xOffsetPercentage = 0.50; // 10% from the left
            let yOffsetPercentage = 0.10; // 20% from the top

            p.preload = () => {
                loadImageAndSetup(imagePath)
            }

            p.setup = () => {
                if (imageToDraw) {
                    console.log(imageToDraw.width, imageToDraw.height);
                    p.createCanvas(imageToDraw.width, imageToDraw.height);
                    p.background(255, 254, 242);

                }
            }

            p.draw = () => {
                if (drawState == DRAW_STATES.INIT){
                    console.log("Init??", drawState);
                    drawRandom(25, currentSeed, false);
                }

                if (drawState == DRAW_STATES.COMPLETED){
                    drawState = DRAW_STATES.WAITING;
                    console.log("Stting state to waiting", drawState);
                    setTimeout(() => {
                        drawState = DRAW_STATES.INIT;
                        console.log("Stting state to INIT", drawState);
                        currentSeed = getRandomIntInRange(1,719);
                    }, 5000);
                }
            };

            function getRandomIntInRange(min: number, max:number): number {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            

            function to2D(i: number, width: number): { x: number, y: number } {
                return {
                    x: i % width,
                    y: Math.floor(i / width)
                };
            }

            function getPermutation(number: number): number[] {
                // This function derives a permutation based on a number (0-719)
            
                let permutation = [];
                let items = [0, 1, 2, 3, 4, 5];
            
                while (number > 0 || items.length > 0) {
                    let factorial = factorialFor(items.length - 1);
                    let position = Math.floor(number / factorial);
                    number %= factorial;
            
                    permutation.push(items[position]);
                    items.splice(position, 1);
                }
            
                return permutation;
            }
            
            function factorialFor(n: number): number {
                let result = 1;
                for (let i = 1; i <= n; i++) {
                    result *= i;
                }
                return result;
            }

            function maskFunction(index: number, permutationNumber: number): number {
                const permutation = getPermutation(permutationNumber);
                return permutation[index];
            }            
            

            let renderedPixels: boolean[][] = [];
            let unrenderedPixels: { x: number, y: number }[] = [];


            function loadImageAndSetup(path: string) {
                imageToDraw = p.loadImage(path, () => {
                    // Initialize the renderedPixels array once the image is loaded
                    renderedPixels = Array(imageToDraw.width).fill(false).map(() => Array(imageToDraw.height).fill(false));
                    for (let x = 0; x < Math.ceil(imageToDraw.width / STICKER_SIZE); x++) {
                        for (let y = 0; y <  Math.ceil(imageToDraw.height / STICKER_SIZE); y++) {
                            unrenderedPixels.push({ x, y });
                        }
                    }
                });
            }

            function resetRederedLogic(){
                renderedPixels = [];
                unrenderedPixels = [];
                renderedPixels = Array(imageToDraw.width).fill(false).map(() => Array(imageToDraw.height).fill(false));
                    for (let x = 0; x < Math.ceil(imageToDraw.width / STICKER_SIZE); x++) {
                        for (let y = 0; y <  Math.ceil(imageToDraw.height / STICKER_SIZE); y++) {
                            unrenderedPixels.push({ x, y });
                        }
                    }
            }

            let currentRow = 0;
            let currentCol = 0;

            function drawImage(xOffset: number, yOffset: number, useOldBehavior: boolean = true) {
                if (!imageToDraw) return;

                imageToDraw.loadPixels();

                const totalStickersX = Math.ceil(imageToDraw.width / STICKER_SIZE);
                const totalStickersY = Math.ceil(imageToDraw.height / STICKER_SIZE);

                // Convert sticker offset to pixel offset
                const pixelOffsetX = xOffset * STICKER_SIZE;
                const pixelOffsetY = yOffset * STICKER_SIZE;

                const pixelsToDraw = 120; // Adjusted to draw 3 rows at a time

                for (let n = 0; n < pixelsToDraw; n++) {
                    if (currentRow >= totalStickersY) {
                        break; // Entire image is rendered
                    }

                    const xPos = Math.round(currentCol * STICKER_SIZE) + pixelOffsetX;
                    const yPos = Math.round(currentRow * STICKER_SIZE) + pixelOffsetY;

                    if (!renderedPixels[currentCol][currentRow]) {
                        const avgColor = getAverageColorForChunk(currentCol * STICKER_SIZE, currentRow * STICKER_SIZE, STICKER_SIZE);
                        const closestColor = findClosestColor(avgColor);

                        p.fill(closestColor);
                        p.strokeWeight(stickerBorder);
                        p.rect(xPos, yPos, STICKER_SIZE, STICKER_SIZE);

                        renderedPixels[currentCol][currentRow] = true;
                    }

                    currentCol++;
                    if (currentCol >= totalStickersX) {
                        currentCol = 0;
                        currentRow += 1; // Increment by 3 to move to the next set of rows
                    }
                }

                // Check if all pixels are rendered
                if (currentRow >= totalStickersY) {
                    if (useOldBehavior) {
                        p.noLoop();
                    } else {
                        drawState = DRAW_STATES.COMPLETED;
                    }
                }
            }

            function drawRandom(stickersPerFrame : number, randomSeed: number = 3, useOldBehavior: boolean = true) {
                if (!imageToDraw || unrenderedPixels.length === 0) return;
            
                imageToDraw.loadPixels();
            
                for (let i = 0; i < stickersPerFrame; i++) {
                    if (unrenderedPixels.length === 0) break;  // All pixels have been rendered
            
                    const randomIndex = Math.floor(Math.random() * unrenderedPixels.length);
                    const { x: randomX, y: randomY } = unrenderedPixels[randomIndex];
            
                    const avgColor = getAverageColorForChunk(randomX * STICKER_SIZE, randomY * STICKER_SIZE, STICKER_SIZE);
                    const closestColor = MASK_COLORS[maskFunction(findClosestColorIndex(avgColor), randomSeed)];
            
                    p.fill(closestColor);
                    p.strokeWeight(stickerBorder);
                    p.rect(randomX * STICKER_SIZE, randomY * STICKER_SIZE, STICKER_SIZE, STICKER_SIZE);
            
                    renderedPixels[randomX][randomY] = true;
                    unrenderedPixels.splice(randomIndex, 1);  // Remove this pixel from the unrenderedPixels list
                }
            
                // Check if all stickers are rendered
                if (unrenderedPixels.length === 0) {
                    if (useOldBehavior) {
                        p.noLoop();
                    } else {
                        console.log("Here on DRAW RANDOM");
                        resetRederedLogic()
                        drawState = DRAW_STATES.COMPLETED;
                    }
                }
            }
            

            function getAverageColorForChunk(x: number, y: number, size: number): number[] {
                let totalR = 0, totalG = 0, totalB = 0;
                let count = 0;

                for (let i = x; i < x + size && i < imageToDraw.width; i++) {
                    for (let j = y; j < y + size && j < imageToDraw.height; j++) {
                        let loc = (i + j * imageToDraw.width) * 4;
                        totalR += imageToDraw.pixels[loc];
                        totalG += imageToDraw.pixels[loc + 1];
                        totalB += imageToDraw.pixels[loc + 2];
                        count++;
                    }
                }

                return [totalR / count, totalG / count, totalB / count];
            }

            function findClosestColor(color: number[]): number[] {
                if (!color || color.includes(NaN)) {
                    return [255, 255, 255];
                }

                let minDist = Infinity;
                let closestColor = RUBIKS_COLORS[4];

                for (let i = 0; i < RUBIKS_COLORS.length; i++) {
                    let d = distSq(color, RUBIKS_COLORS[i]);
                    if (d < minDist) {
                        minDist = d;
                        closestColor = i == 4 ? [255, 254, 242] : RUBIKS_COLORS[i];
                    }
                }

                return closestColor;
            }

            function findClosestColorIndex(color: number[]): number {
                if (!color || color.includes(NaN)) {
                    return 4; // Index for white color in RUBIKS_COLORS
                }
            
                let minDist = Infinity;
                let closestColorIndex = 4;
            
                for (let i = 0; i < RUBIKS_COLORS.length; i++) {
                    let d = distSq(color, RUBIKS_COLORS[i]);
                    if (d < minDist) {
                        minDist = d;
                        closestColorIndex = i;
                    }
                }
            
                return closestColorIndex;
            }
            

            function distSq(a: number[], b: number[]): number {
                return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
            }


        }

        const p5Instance = new p5(sketch, canvasRef.current as unknown as HTMLElement);
        return () => p5Instance.remove();
    }, [imagePath, cubeSize, stickerBorder, width, height]);

    return (
        <div
            className="rubiks-canvas-container"
            ref={canvasRef}
            style={imageToDraw ? { width: `${imageToDraw.width}px`, height: `${imageToDraw.height}px` } : {}}
        ></div>
    );

}

export default RubiksImageGenerator;
