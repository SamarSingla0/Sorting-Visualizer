import { createContext, useState } from "react";

import { getRandomNumber, getDigit, mostDigits } from "../helpers/math";
import { awaitTimeout } from "../helpers/promises";

/**
 * SortingContext
 *  - Stores the current array, selected algorithm, delay (speed) and UI flags.
 *  - Exposes helpers for generating arrays and running the chosen sorting algorithm with animation.
 */
export const SortingContext = createContext();

// Human‑readable speed labels mapped to delay in milliseconds
const speedMap = {
    slow: 1000,
    normal: 500,
    fast: 250,
};

function SortingProvider({ children }) {
    /**
     * sortingState
     *  - array: list of items with a numeric value and a visual "state" (idle | selected).
     *  - delay: how long we wait between visual steps (driven by speedMap).
     *  - algorithm: key in algorithmMap that decides which sorting function runs.
     *  - sorted: marks whether the current array is completely sorted.
     *  - sorting: true while an algorithm is currently animating.
     */
    const [sortingState, setSortingState] = useState({
        array: [],
        delay: speedMap.slow,
        algorithm: "bubble_sort",
        sorted: false,
        sorting: false,
    });

    /**
     * changeBar
     *  - Convenience helper to update a single bar in the array by index.
     *  - Merges the provided payload into the existing bar object.
     */
    const changeBar = (index, payload) => {
        setSortingState((prev) => ({
            ...prev,
            array: prev.array.map((item, i) => (i === index ? { ...item, ...payload } : item)),
        }));
    };

    /**
     * generateSortingArray
     *  - Creates a new random array of 12 bars.
     *  - Resets "sorted" flag and optionally marks that we are in the middle of sorting.
     */
    const generateSortingArray = (sorting) => {
        const generatedArray = Array.from({ length: 12 }, () => {
            return {
                value: getRandomNumber(60, 1000),
                state: "idle",
            };
        });

        setSortingState((prev) => ({
            ...prev,
            array: generatedArray,
            sorted: false,
            sorting: sorting || false,
        }));
    };

    /**
     * bubbleSort
     *  - Standard bubble sort algorithm.
     *  - Repeatedly compares adjacent elements and swaps them if out of order.
     *  - Uses changeBar + awaitTimeout to animate comparisons and swaps.
     */
    const bubbleSort = async () => {
        const arr = sortingState.array.map((item) => item.value);

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                // Highlight the two bars we are currently comparing
                changeBar(j, { state: "selected" });
                changeBar(j + 1, { state: "selected" });
                await awaitTimeout(sortingState.delay);

                // If left value is greater than right, swap them
                if (arr[j] > arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    changeBar(j, { value: arr[j + 1] });
                    arr[j + 1] = temp;
                    changeBar(j + 1, { value: temp });
                    await awaitTimeout(sortingState.delay);
                }

                // Return both bars to their idle visual state
                changeBar(j, { state: "idle" });
                changeBar(j + 1, { state: "idle" });
            }
        }
    };

    /**
     * insertionSort
     *  - Builds a sorted portion of the array one element at a time.
     *  - Picks a "current" value and shifts bigger elements to the right to make space.
     */
    const insertionSort = async () => {
        const arr = sortingState.array.map((item) => item.value);

        for (let i = 1; i < arr.length; i++) {
            let current = arr[i];
            let j = i - 1;

            // Highlight the current value we are inserting into the sorted part
            changeBar(i, { value: current, state: "selected" });

            while (j > -1 && current < arr[j]) {
                // Shift element to the right
                arr[j + 1] = arr[j];
                changeBar(j + 1, { value: arr[j], state: "selected" });
                j--;
                await awaitTimeout(sortingState.delay);
                // Bar we just passed over goes back to idle
                changeBar(j + 2, { value: arr[j + 1], state: "idle" });
            }

            // Insert the current value at the correct position
            arr[j + 1] = current;
            changeBar(j + 1, { value: current, state: "idle" });
        }
    };

    /**
     * selectionSort
     *  - Repeatedly selects the smallest remaining element and places it at the front.
     */
    const selectionSort = async () => {
        const arr = sortingState.array.map((item) => item.value);

        for (let i = 0; i < arr.length; i++) {
            let min = i;
            changeBar(min, { state: "selected" });

            for (let j = i + 1; j < arr.length; j++) {
                changeBar(j, { state: "selected" });
                await awaitTimeout(sortingState.delay);

                if (arr[j] < arr[min]) {
                    changeBar(min, { state: "idle" });
                    min = j;
                    changeBar(min, { state: "selected" });
                } else {
                    changeBar(j, { state: "idle" });
                }
            }

            if (min !== i) {
                let temp = arr[i];
                arr[i] = arr[min];
                changeBar(i, { value: arr[min], state: "idle" });
                arr[min] = temp;
                changeBar(min, { value: temp, state: "idle" });
            } else {
                changeBar(i, { state: "idle" });
                changeBar(min, { state: "idle" });
            }
        }
    };

    /**
     * mergeSort
     *  - Divide‑and‑conquer algorithm that recursively splits the array and merges sorted halves.
     *  - We return the helper promise so startVisualizing can await until the full animation ends.
     */
    const mergeSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        return mergeSortHelper(arr);
    };

    // Recursively split array into halves, then merge them back in order
    async function mergeSortHelper(arr, start = 0, end = arr.length - 1) {
        if (start >= end) return;

        const middle = Math.floor((start + end) / 2);
        await mergeSortHelper(arr, start, middle);
        await mergeSortHelper(arr, middle + 1, end);
        await mergeSortMerger(arr, start, middle, end);
    }

    // Merge two sorted sub‑arrays [start..middle] and [middle+1..end] back into arr
    async function mergeSortMerger(arr, start, middle, end) {
        let left = arr.slice(start, middle + 1);
        let right = arr.slice(middle + 1, end + 1);

        let i = 0,
            j = 0,
            k = start;

        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                changeBar(k, { value: left[i], state: "selected" });
                arr[k++] = left[i++];
            } else {
                changeBar(k, { value: right[j], state: "selected" });
                arr[k++] = right[j++];
            }
            await awaitTimeout(sortingState.delay);
        }

        while (i < left.length) {
            changeBar(k, { value: left[i], state: "selected" });
            arr[k++] = left[i++];
            await awaitTimeout(sortingState.delay);
        }

        while (j < right.length) {
            changeBar(k, { value: right[j], state: "selected" });
            arr[k++] = right[j++];
            await awaitTimeout(sortingState.delay);
        }

        // Reset bar states back to idle for the merged segment
        for (let i = start; i <= end; i++) {
            changeBar(i, { value: arr[i], state: "idle" });
        }
    }

    /**
     * quickSort
     *  - Uses a pivot to partition the array into smaller and bigger elements, then recurses.
     *  - We again return the helper promise so the caller can await completion.
     */
    const quickSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        return quickSortHelper(arr);
    };

    const quickSortHelper = async (arr, start = 0, end = arr.length - 1) => {
        if (start >= end) {
            return;
        }

        const pivot = arr[Math.floor((start + end) / 2)];
        let i = start;
        let j = end;

        while (i <= j) {
            while (arr[i] < pivot) i++;
            while (arr[j] > pivot) j--;

            if (i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                changeBar(i, { value: arr[i], state: "selected" });
                changeBar(j, { value: arr[j], state: "selected" });

                await awaitTimeout(sortingState.delay);

                changeBar(i, { value: arr[i], state: "idle" });
                changeBar(j, { value: arr[j], state: "idle" });
                i++;
                j--;
            }
        }

        await quickSortHelper(arr, start, j);
        await quickSortHelper(arr, i, end);
    };

    /**
     * radixSort
     *  - Non‑comparative sort that groups numbers by digit buckets.
     *  - Good for illustrating a very different style of algorithm.
     */
    const radixSort = async () => {
        let arr = sortingState.array.map((item) => item.value);
        let maxDigitCount = mostDigits(arr);

        for (let k = 0; k < maxDigitCount; k++) {
            let digitBuckets = Array.from({ length: 10 }, () => []);
            for (let i = 0; i < arr.length; i++) {
                let digit = getDigit(arr[i], k);
                digitBuckets[digit].push(arr[i]);
            }

            arr = [].concat(...digitBuckets);

            for (let i = 0; i < arr.length; i++) {
                changeBar(i, { value: arr[i], state: "selected" });
                await awaitTimeout(sortingState.delay);
                changeBar(i, { value: arr[i], state: "idle" });
            }
        }
    };

    // Map of algorithm keys used by the UI to the corresponding implementation function
    const algorithmMap = {
        bubble_sort: bubbleSort,
        insertion_sort: insertionSort,
        selection_sort: selectionSort,
        merge_sort: mergeSort,
        quick_sort: quickSort,
        radix_sort: radixSort,
    };

    /**
     * startVisualizing
     *  - Sets the "sorting" flag, runs the selected algorithm, then marks the array as sorted.
     *  - Because each algorithm is async, we can await it to keep the UI state in sync with the animation.
     */
    const startVisualizing = async () => {
        setSortingState((prev) => ({
            ...prev,
            sorted: false,
            sorting: true,
        }));

        await algorithmMap[sortingState.algorithm]();

        setSortingState((prev) => ({
            ...prev,
            sorted: true,
            sorting: false,
        }));
    };

    /**
     * changeSortingSpeed
     *  - Updates the delay based on the selected label from the dropdown.
     */
    const changeSortingSpeed = (e) => {
        setSortingState((prev) => ({
            ...prev,
            delay: speedMap[e.target.value] || 500,
        }));
    };

    /**
     * changeAlgorithm
     *  - Sets the active algorithm key; the visualizer and table both react to this.
     */
    const changeAlgorithm = (algorithm) => {
        setSortingState((prev) => ({
            ...prev,
            algorithm,
        }));
    };

    return (
        <SortingContext.Provider
            value={{
                sortingState,
                generateSortingArray,
                startVisualizing,
                changeSortingSpeed,
                changeAlgorithm,
            }}
        >
            {children}
        </SortingContext.Provider>
    );
}

export default SortingProvider;
