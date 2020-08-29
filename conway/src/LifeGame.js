import React, { useState, useCallback, useEffect, useRef } from 'react';
import produce from 'immer';
import './LifeGame.css';

const ops = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const numRows = 25;
const numCols = 25;

const createGrid = () => {
  //   const arr = new Array(numCols);
  //   for (let i = 0; i < arr.length; i++) {
  //     arr[i] = new Array(numRows);
  //   }
  //   return arr;
  const arr = [];
  for (let i = 0; i < numCols; i++) {
    arr.push(Array.from(Array(numRows), () => 0));
  }
  return arr;
};

function Life() {
  const [grid, setGrid] = useState(createGrid());

  const [genNum, setGenNum] = useState(0);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(1000);
  const runRef = useRef(running);
  runRef.current = running;

  const runSim = useCallback(() => {
    if (!runRef.current) {
      return;
    }

    //producing grid with buffer

    setGrid((grid) => {
      return produce(grid, (gridCopy) => {
        //check neighbor cells
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            let neighbors = 0;
            ops.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              if (newI >= 0 && newI < numCols && newJ >= 0 && newJ < numRows) {
                neighbors += grid[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (grid[i][j] == 0 && neighbors == 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSim, 0);
  }, [time]);

  useEffect(() => {
    genNum == 0 && running == false ? setGenNum(0) : setGenNum(genNum + 1);
  }, [grid]);

  return (
    <>
      <h1>Conway's Game Of Life - Freddie Thompson</h1>
      <div className='rules'>
        <h3>Rules: </h3>
        <ol className='rules'>
          <li>Live cell with less than two neighbors dies</li>
          <li>Live cell with two or three neighbors lives</li>
          <li>Live sell with more than three neighbors dies</li>
          <li>Dead cell with three neighbors is born</li>
        </ol>
      </div>
      <div className='buttons'>
        <button
          onClick={() => {
            setRunning(!running);
            //if (!running) {
            runRef.current = true;
            runSim();
            //}
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={() => {
            setGrid(createGrid());
            setGenNum(0);
            setRunning(false);
            runRef.current = false;
          }}
        >
          Clear
        </button>

        <button
          onClick={() => {
            setTime(time - 100);
          }}
        >
          Faster
        </button>
        <button
          onClick={() => {
            setTime(time + 100);
          }}
        >
          Slower
        </button>

        <button
          onClick={() => {
            // const arr = new Array(numCols);
            // for (let i = 0; i < arr.length; i++) {
            //   arr[i] = new Array(numRows);
            // }

            // for (let j = 0; j < numCols; j++) {
            //   for (let k = 0; k < numRows; k++) {
            //     arr[j][k] = Math.round(Math.random());
            //   }
            // }
            const arr = [];
            for (let i = 0; i < numCols; i++) {
              arr.push(
                Array.from(Array(numRows), () => Math.round(Math.random()))
              );
            }
            setGrid(arr);
            setGenNum(0);
          }}
        >
          Random
        </button>
      </div>{' '}
      {/**end buttons div */}
      <h1>Current Generation: {genNum}</h1>
      <h2>Time Interval: {time}ms</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          justifyContent: 'center',
        }}
      >
        {grid.map((cols, i) =>
          cols.map((rows, j) => (
            <div
              disabled={running ? true : false}
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? 'red' : 'white',
                border: 'solid 1px  black',
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Life;
