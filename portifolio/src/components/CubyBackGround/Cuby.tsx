import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import './Cube.css';

interface RubiksBackgroundProps {
    width?: number;
    height?: number;
}

// Global Constants
const CUBE_SIZE = 24;
const STICKER_SIZE = CUBE_SIZE / 3;
const CUBE_BORDER = 0.7;
const STICKER_BORDER = 0.35;
const RUBIKS_COLORS: number[][] = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [255, 255, 255],
    [255, 165, 0]
];

// ... (rest of the imports and component setup)

const CubyBackGround: React.FC<RubiksBackgroundProps> = ({ width = 800, height = 800 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let theShader: p5.Shader;
        let offscreenGraphics: p5.Graphics;

        let shouldDrawTheBackground = true;

        const sketch = (p: p5) => {
            let img: p5.Image;

            let xOffsetPercentage = 0.50; // 10% from the left
            let yOffsetPercentage = 0.10; // 20% from the top

            p.preload = () => {
                loadImageAndSetup(`${process.env.PUBLIC_URL}/images/Photos/me_white.png`)
            }


            p.setup = () => {
                p.createCanvas(width, height);
                drawBackground(shouldDrawTheBackground);
            }

            p.draw = () => {
                //drawBackground(shouldDrawTheBackground);

                const xOffsetStickers = Math.round((p.width * xOffsetPercentage) / STICKER_SIZE);
                const yOffsetStickers = Math.round((p.height * yOffsetPercentage) / STICKER_SIZE);

                drawImage(xOffsetStickers, yOffsetStickers);
            }

            p.windowResized = () => {
                shouldDrawTheBackground = true;


                // 1. Adjust the canvas size
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            
                // 3. Reset the image rendering (if necessary)
                currentRow = 0;
                currentCol = 0;
                renderedPixels = Array(imageToDraw.width).fill(false).map(() => Array(imageToDraw.height).fill(false));
            
                // Check if in mobile mode
                if (p.windowWidth <= 960) { // 768px is a common breakpoint for mobile devices
                    xOffsetPercentage = 0.10; // Adjust these values as needed for mobile layout
                    yOffsetPercentage = 0.20;
                } else {
                    xOffsetPercentage = 0.0; // Default values for larger screens
                    yOffsetPercentage = 0.00;
                }
            
                // Optionally, restart the drawing loop if it was stopped
                p.loop();
            }
            
            function to2D(i: number, width: number): { x: number, y: number } {
                return {
                    x: i % width,
                    y: Math.floor(i / width)
                };
            }

            function drawBackground(shouldRedraw: boolean) {
                if (!shouldRedraw) return;

                if (!offscreenGraphics) {
                    offscreenGraphics = p.createGraphics(window.innerWidth, window.innerHeight);
                }

                // Cover the entire webpage
                p.resizeCanvas(window.innerWidth, window.innerHeight);
                p.background(220);


                const totalStickers = Math.ceil(window.innerWidth / STICKER_SIZE) * Math.ceil(window.innerHeight / STICKER_SIZE);

                offscreenGraphics.background(220);

                for (let idx = 0; idx < totalStickers; idx++) {
                    const { x, y } = to2D(idx, Math.ceil(window.innerWidth / STICKER_SIZE));
                    const xPos = Math.round(x * STICKER_SIZE);
                    const yPos = Math.round(y * STICKER_SIZE);

                    offscreenGraphics.stroke(0);
                    offscreenGraphics.strokeWeight(STICKER_BORDER);
                    offscreenGraphics.fill(215, 215, 215); // Placeholder white color
                    offscreenGraphics.rect(xPos, yPos, STICKER_SIZE, STICKER_SIZE);
                }

                p.image(offscreenGraphics, 0, 0);
                
                shouldDrawTheBackground = false;
            }


            let imageToDraw: p5.Image;
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

                const pixelsToDraw = 50; // Adjusted to draw 3 rows at a time

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
                        p.strokeWeight(STICKER_BORDER);
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
                        closestColor = i == 4 ? [215, 215, 215] : RUBIKS_COLORS[i];
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
    }, [width, height]);

    return <div className='background-container' ref={canvasRef}></div>;
}

export default CubyBackGround;
