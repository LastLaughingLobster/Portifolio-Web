import React, { useRef, useEffect, useState} from 'react';
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
    cubeSize = 24,
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
                drawImage(0,0);
            }

            function to2D(i: number, width: number): { x: number, y: number } {
                return {
                    x: i % width,
                    y: Math.floor(i / width)
                };
            }

            let renderedPixels: boolean[][] = [];

            function loadImageAndSetup(path: string) {
                imageToDraw = p.loadImage(path, () => {
                    // Initialize the renderedPixels array once the image is loaded
                    renderedPixels = Array(imageToDraw.width).fill(false).map(() => Array(imageToDraw.height).fill(false));
                    console.log(renderedPixels);
                });
            }

            let currentRow = 0;
            let currentCol = 0;

            function drawImage(xOffset: number, yOffset: number) {
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
                    p.noLoop(); // Stop drawing once the image is fully rendered
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
