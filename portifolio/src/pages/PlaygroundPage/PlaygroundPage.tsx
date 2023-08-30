import React, { useRef, useState, useEffect } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import './PlaygroundPage.css';

const Playground: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [isMouseHeld, setIsMouseHeld] = useState(false);

  const p5Ref = useRef<p5Types | null>(null);

  const [w, setW] = useState(20);
  const [columns, setColumns] = useState<number>(0);
  const [rows, setRows] = useState<number>(0);
  const board = useRef<number[][]>([]);
  const next = useRef<number[][]>([]);

  const yellow = "#FFBE00"
  const black = "#011526"
  const grey = "#D7D7D7"

  const liveCellColor = "#FFBE00" // Yellow
  const borderColor = black // black
  const deadCellCollor = grey
  const backgroundColor = grey

  let looperIncrement = 0;


  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5Ref.current = p5;

    p5.frameRate(60);

    const width = canvasRef.current?.offsetWidth || 1280;
    const height = (width * 9) / 16;

    const canvas = p5.createCanvas(width, height);
    canvas.parent(canvasParentRef);

    setColumns(Math.floor(width / w));
    setRows(Math.floor(height / w));

    init(p5);

    canvas.elt.oncontextmenu = () => false;
  };

  const draw = (p5: p5Types) => {
    p5.background(backgroundColor);

    if (looperIncrement % 6 == 0){
      if (!isPaused) generate(p5);
    }

    render(p5);

    looperIncrement++

    if (looperIncrement > 60){
      looperIncrement = 0;
    }

    if (isMouseHeld) {
      flipCellState(p5);
    }
  };

  const handleReset = () => {
    if (p5Ref.current) {
        init(p5Ref.current);
    }
  };

  const flipCellState = (p5: p5Types) => {
    const x = Math.floor(p5.mouseX / w);
    const y = Math.floor(p5.mouseY / w);
    if (x < columns && y < rows) {
        if (p5.mouseButton === p5.LEFT) {
            board.current[x][y] = 1; // activate cell
        } else if (p5.mouseButton === p5.RIGHT) {
            board.current[x][y] = 0; // deactivate cell
        }
    }
  };

  const mousePressed = (p5: p5Types) => {
    flipCellState(p5);
    setIsMouseHeld(true); // set mouse hold state to true
  };

  const mouseReleased = (p5: p5Types) => {
      setIsMouseHeld(false); // reset mouse hold state
  };
  

  const init = (p5: p5Types) => {
    const width = canvasRef.current?.offsetWidth || 1280;
    const height = (width * 9) / 16;
    const localColumns = Math.floor(width / w);
    const localRows = Math.floor(height / w);

    let tempBoard: number[][] = [...Array(localColumns)].map(() => Array(localRows).fill(0));
    let tempNext: number[][] = [...Array(localColumns)].map(() => Array(localRows).fill(0));

    for (let i = 0; i < localColumns; i++) {
      for (let j = 0; j < localRows; j++) {
        if (i === 0 || j === 0 || i === localColumns - 1 || j === localRows - 1) {
          tempBoard[i][j] = 0;
        } else {
          tempBoard[i][j] = Math.floor(p5.random(2));
        }
        tempNext[i][j] = 0;
      }
    }

    board.current = tempBoard;
    next.current = tempNext;
  };

  const generate = (p5: p5Types) => {
    // Check if board and next have been initialized
    if (!board.current.length || !next.current.length) return;

    let newBoard = board.current.map(row => row.slice());
    let newNext = next.current.map(row => row.slice());

    for (let x = 1; x < columns - 1; x++) {
      for (let y = 1; y < rows - 1; y++) {
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (board.current[x + i] && board.current[x + i][y + j] !== undefined) {
              neighbors += board.current[x + i][y + j];
            }
          }
        }

        neighbors -= board.current[x][y];
        if ((board.current[x][y] === 1) && (neighbors < 2)) newNext[x][y] = 0;           // Loneliness
        else if ((board.current[x][y] === 1) && (neighbors > 3)) newNext[x][y] = 0;           // Overpopulation
        else if ((board.current[x][y] === 0) && (neighbors === 3)) newNext[x][y] = 1;           // Reproduction
        else newNext[x][y] = board.current[x][y]; // Stasis
      }
    }

    board.current = newNext;
    next.current = newBoard;
  };

  const erase = () => {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        board.current[i][j] = 0;
      }
    }
  };
  
  const render = (p5: p5Types) => {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (board.current[i][j] === 1) {
          p5.fill(liveCellColor);
        } else {
          p5.fill(deadCellCollor);
        }
        p5.stroke(borderColor);
        p5.rect(i * w, j * w, w - 1, w - 1);
      }
    }
  };

  return (
    <div className="playground-container">
      <h2>🔨 This page is still under construction! 🔨</h2>
      <h3>In the mean time you can interact with this Conway's Game of Life Implementation 😄</h3>
      <div className="canvas-container" ref={canvasRef}>
        <Sketch setup={setup} draw={draw} mousePressed={mousePressed} mouseReleased={mouseReleased} />
      </div>
      <div className="control-buttons">
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause / Draw"}
        </button>
        <button onClick={erase}>Erase</button>
      </div>
    </div>
  );
};

export default Playground;
