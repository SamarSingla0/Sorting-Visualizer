import React from "react";
import { getMergeSortAnimations } from "../sortingAlgorithms/sortingAlgorithms.js";
import { getBubbleSortAnimations } from "../sortingAlgorithms/BubbleSort.js";
import { getInsertionSortAnimations } from "../sortingAlgorithms/InsertionSort.js";
import { getSelectionSortAnimations } from "../sortingAlgorithms/SelectionSort.js";
import { getQuickSortAnimations } from "../sortingAlgorithms/QuickSort.js";
import { getHeapSortAnimations } from "../sortingAlgorithms/HeapSort.js"; // Correct import for HeapSort
import "./SortingVisulizer.css";

const ANIMATION_SPEED_MS = 2; 

const NUMBER_OF_ARRAY_BARS = 212;


const PRIMARY_COLOR = "turquoise";
const SECONDARY_COLOR = "red";

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
    };
    this.timeouts = [];
  }

  componentDidMount() {
    this.resetArray();
  }

  clearTimeouts() {
    this.timeouts.forEach((timeoutID) => clearTimeout(timeoutID));
    this.timeouts = [];
  }

  resetArray() {
    this.clearTimeouts();
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 550));
    }
    this.setState({ array }, () => {
      const arrayBars = document.getElementsByClassName("array-bar");
      for (let bar of arrayBars) {
        bar.style.backgroundColor = PRIMARY_COLOR;
      }
    });
  }

  mergeSort() {
    this.clearTimeouts();
    const animations = getMergeSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < animations.length; i++) {
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        this.timeouts.push(
          setTimeout(() => {
            arrayBars[barOneIdx].style.backgroundColor = color;
            arrayBars[barTwoIdx].style.backgroundColor = color;
          }, i * ANIMATION_SPEED_MS)
        );
      } else {
        this.timeouts.push(
          setTimeout(() => {
            const [barOneIdx, newHeight] = animations[i];
            arrayBars[barOneIdx].style.height = `${newHeight}px`;
          }, i * ANIMATION_SPEED_MS)
        );
      }
    }
  }

  quickSort() {
    this.clearTimeouts();
    const arrayBars = document.getElementsByClassName("array-bar");
    for (let bar of arrayBars) {
      bar.style.backgroundColor = PRIMARY_COLOR;
    }
    const animations = getQuickSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const step = animations[i];
      if (
        step.length === 2 &&
        typeof step[0] === "number" &&
        typeof step[1] === "number"
      ) {
        if (i % 4 === 0 || i % 4 === 1) {
          const [barOneIdx, barTwoIdx] = step;
          const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          this.timeouts.push(
            setTimeout(() => {
              if (arrayBars[barOneIdx] && arrayBars[barTwoIdx]) {
                arrayBars[barOneIdx].style.backgroundColor = color;
                arrayBars[barTwoIdx].style.backgroundColor = color;
              }
            }, i * ANIMATION_SPEED_MS)
          );
        } else {
          const [barIdx, newHeight] = step;
          this.timeouts.push(
            setTimeout(() => {
              if (arrayBars[barIdx]) {
                arrayBars[barIdx].style.height = `${newHeight}px`;
              }
            }, i * ANIMATION_SPEED_MS)
          );
        }
      }
    }
  }

  heapSort() {
    // make sure clearTimeouts clears previous timeouts and this.timeouts exists
    this.clearTimeouts();

    const animations = getHeapSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const step = animations[i];
      const delay = i * ANIMATION_SPEED_MS;

      if (step.type === "compare") {
        const [a, b] = step.indices;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a] && arrayBars[b]) {
              arrayBars[a].style.backgroundColor = SECONDARY_COLOR;
              arrayBars[b].style.backgroundColor = SECONDARY_COLOR;
            }
          }, delay)
        );
      } else if (step.type === "uncompare") {
        const [a, b] = step.indices;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a] && arrayBars[b]) {
              arrayBars[a].style.backgroundColor = PRIMARY_COLOR;
              arrayBars[b].style.backgroundColor = PRIMARY_COLOR;
            }
          }, delay)
        );
      } else if (step.type === "swap") {
        const [a, b] = step.indices;
        const [heightA, heightB] = step.heights;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a]) arrayBars[a].style.height = `${heightA}px`;
            if (arrayBars[b]) arrayBars[b].style.height = `${heightB}px`;
          }, delay)
        );
      }
    }
  }

  bubbleSort() {
    this.clearTimeouts();
    const animations = getBubbleSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < animations.length; i++) {
      if (i % 4 === 0 || i % 4 === 1) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        this.timeouts.push(
          setTimeout(() => {
            arrayBars[barOneIdx].style.backgroundColor = color;
            arrayBars[barTwoIdx].style.backgroundColor = color;
          }, i * 0.2)
        );
      } else {
        const [barIdx, newHeight] = animations[i];
        this.timeouts.push(
          setTimeout(() => {
            arrayBars[barIdx].style.height = `${newHeight}px`;
          }, i * 0.2)
        );
      }
    }
  }

  insertionSort() {
    this.clearTimeouts();
    const animations = getInsertionSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < animations.length; i++) {
      if (i % 4 === 0 || i % 4 === 1) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        this.timeouts.push(
          setTimeout(() => {
            arrayBars[barOneIdx].style.backgroundColor = color;
            arrayBars[barTwoIdx].style.backgroundColor = color;
          }, i * 0.2)
        );
      } else {
        const [barIdx, newHeight] = animations[i];
        this.timeouts.push(
          setTimeout(() => {
            arrayBars[barIdx].style.height = `${newHeight}px`;
          }, i * 0.2)
        );
      }
    }
  }

  selectionSort() {
    this.clearTimeouts();

    const animations = getSelectionSortAnimations(this.state.array);
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const step = animations[i];
      const delay = i * 0.2; // Change speed here (ms per step)

      if (step.type === "compare") {
        const [a, b] = step.indices;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a] && arrayBars[b]) {
              arrayBars[a].style.backgroundColor = SECONDARY_COLOR; // e.g. red
              arrayBars[b].style.backgroundColor = SECONDARY_COLOR;
            }
          }, delay)
        );
      }

      if (step.type === "uncompare") {
        const [a, b] = step.indices;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a] && arrayBars[b]) {
              arrayBars[a].style.backgroundColor = PRIMARY_COLOR; // e.g. turquoise
              arrayBars[b].style.backgroundColor = PRIMARY_COLOR;
            }
          }, delay)
        );
      }

      if (step.type === "swap") {
        const [a, b] = step.indices;
        const [heightA, heightB] = step.heights;
        this.timeouts.push(
          setTimeout(() => {
            if (arrayBars[a]) arrayBars[a].style.height = `${heightA}px`;
            if (arrayBars[b]) arrayBars[b].style.height = `${heightB}px`;
          }, delay)
        );
      }
    }
  }

  render() {
  const { array } = this.state;
  return (
    <div className="main-wrapper">
      <div className="title-bar">
        <h1>Sorting Visualizer</h1>
      </div>

      <div className="app-container">
        <div className="controls">
          <button onClick={() => this.resetArray()}>Generate New Array</button>
          <button onClick={() => this.mergeSort()}>Merge Sort</button>
          <button onClick={() => this.quickSort()}>Quick Sort</button>
          <button onClick={() => this.heapSort()}>Heap Sort</button>
          <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
          <button onClick={() => this.insertionSort()}>Insertion Sort</button>
          <button onClick={() => this.selectionSort()}>Selection Sort</button>
        </div>

        <div className="graph-container">
          <div className="array-container">
            {array.map((value, idx) => (
              <div
                key={idx}
                className="array-bar"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  height: `${value}px`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
