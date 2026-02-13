import { useContext, useEffect } from "react";

import { SortingContext } from "../contexts/SortingContext";
import algorithmInfos from "../data/algorithmInfos";

// Helper list to avoid repeating the same button markup for each algorithm
const ALGORITHM_KEYS = ["bubble_sort", "insertion_sort", "selection_sort", "merge_sort", "quick_sort"];

function SortingChart() {
    // Access global sorting state and actions from the context provider
    const { sortingState, generateSortingArray, startVisualizing, changeSortingSpeed, changeAlgorithm } =
        useContext(SortingContext);

    // On first mount, generate an initial random array to visualize
    useEffect(() => {
        generateSortingArray();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentAlgorithmInfo = algorithmInfos[sortingState.algorithm];

    return (
        <div className="mt-4 mb-4 flex flex-col items-center">
            {/* Page title + logo */}
            <div className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">Interactive Sorting Visualizer</h1>
                <p className="text-sm md:text-base text-white/70">
                    Watch classic sorting algorithms re‑order the same array in real time.
                </p>
            </div>

            <img
                src="/logo.png"
                alt="Sorting Visualizer logo"
                className="max-w-lg mb-6 w-full drop-shadow-lg"
            />

            {/* Algorithm selection buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {ALGORITHM_KEYS.map((key) => {
                    const isActive = sortingState.algorithm === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => changeAlgorithm(key)}
                            disabled={sortingState.sorting}
                            className={`bg-carbon text-white px-5 py-2.5 rounded-3xl text-sm md:text-base shadow-sm ${
                                isActive ? "bg-turquoise-dark shadow-turquoise-dark/40" : "hover:bg-carbon-light"
                            } disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-150`}
                        >
                            {algorithmInfos[key].name}
                        </button>
                    );
                })}
            </div>

            <div className="max-w-3xl w-full space-y-6">
                {/* Card around the chart area for better visual separation */}
                <div className="rounded-2xl bg-carbon/70 backdrop-blur-sm border border-carbon-light shadow-xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3 text-xs md:text-sm text-white/70">
                        <span>
                            Array size: <span className="font-semibold text-white">{sortingState.array.length}</span>
                        </span>
                        <span>
                            Status:{" "}
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] md:text-xs ${
                                    sortingState.sorting
                                        ? "bg-yellow-600/40 text-yellow-100"
                                        : sortingState.sorted
                                        ? "bg-green-800/40 text-green-100"
                                        : "bg-slate-700 text-slate-100"
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        sortingState.sorting
                                            ? "bg-yellow-300"
                                            : sortingState.sorted
                                            ? "bg-green-300"
                                            : "bg-slate-300"
                                    }`}
                                />
                                {sortingState.sorting
                                    ? "Sorting..."
                                    : sortingState.sorted
                                    ? "Sorted"
                                    : "Ready"}
                            </span>
                        </span>
                    </div>

                    {/* Bars representing the current values in the array */}
                    <div className="mb-4 chart-container rounded-xl overflow-hidden">
                        <div className="base" />
                        {sortingState.array.map((bar, i) => (
                            <div key={i} className="bar-container">
                                <div
                                    className={`select-none bar bar-${bar.state}`}
                                    style={{ height: `${Math.floor((bar.value / 1000) * 100)}%` }}
                                >
                                    <p
                                        className={`pl-1.5 text-xs md:text-sm ${
                                            bar.state === "idle" ? "text-[#B1D2CF]" : "text-[#D8B7BE]"
                                        }`}
                                    >
                                        {bar.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls: start, regenerate array, and speed selector */}
                    <div className="flex flex-wrap items-center gap-4 max-w-3xl">
                        <button
                            type="button"
                            disabled={sortingState.sorting}
                            onClick={startVisualizing}
                            className="px-5 py-2.5 push-btn text-white-light text-sm md:text-base disabled:brightness-75 disabled:cursor-not-allowed"
                        >
                            {sortingState.sorting ? "Sorting..." : "Start Sorting"}
                        </button>

                        <button
                            type="button"
                            disabled={sortingState.sorting}
                            onClick={() => generateSortingArray()}
                            className="text-sm md:text-base text-white-light/90 hover:text-white-light disabled:brightness-75 disabled:cursor-not-allowed underline-offset-4 hover:underline"
                        >
                            New Random Array
                        </button>

                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-xs md:text-sm text-white/70">Speed</span>
                            <select
                                disabled={sortingState.sorting}
                                onChange={changeSortingSpeed}
                                defaultValue="slow"
                                className="bg-carbon px-2 py-1.5 rounded-md text-sm cursor-pointer outline-none focus:ring ring-turquoise-dark disabled:brightness-75 disabled:cursor-not-allowed"
                            >
                                <option value="slow">Slow</option>
                                <option value="normal">Normal</option>
                                <option value="fast">Fast</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Algorithm description and complexity table */}
                <div className="rounded-2xl bg-carbon/60 backdrop-blur-sm border border-carbon-light shadow-lg p-4 md:p-6">
                    <h2 className="font-bold text-2xl md:text-3xl mb-2">{currentAlgorithmInfo.name}</h2>
                    <p className="whitespace-pre-line mb-6 text-sm md:text-base text-white/80">
                        {currentAlgorithmInfo.description}
                    </p>
                    <div className="w-full h-0.5 bg-carbon-light mb-4" />

                    <p className="text-xs md:text-sm text-white/70 mb-2">
                        Compare the time and space complexity of each algorithm:
                    </p>

                    <div className="overflow-auto">
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-r border-carbon-light" rowSpan={2}>
                                        Algorithm
                                    </th>
                                    <th className="px-4 py-2 border-r border-carbon-light" colSpan={3}>
                                        Time Complexity
                                    </th>
                                    <th className="px-4 py-2">Space Complexity</th>
                                </tr>
                                <tr className="border-b border-carbon-light">
                                    <th className="px-4 pb-2">Best</th>
                                    <th className="px-4 pb-2">Average</th>
                                    <th className="px-4 pb-2 border-r border-carbon-light">Worst</th>
                                    <th className="px-4 pb-2">Worst</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(algorithmInfos).map((key, i) => {
                                    const algo = algorithmInfos[key];
                                    const isActiveRow = key === sortingState.algorithm;

                                    return (
                                        <tr
                                            key={key}
                                            className={`whitespace-nowrap transition-colors ${
                                                isActiveRow ? "bg-carbon-light/70" : "hover:bg-carbon-light/60"
                                            }`}
                                        >
                                            <td
                                                className={`px-4 py-1.5 ${
                                                    i === 0 ? "pt-2" : ""
                                                } border-r border-carbon-light font-medium`}
                                            >
                                                {algo.name}
                                            </td>
                                            <td className={`px-4 py-1.5 ${i === 0 ? "pt-2" : ""}`}>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-md bg-${algo.time_complexity.best[1]} text-white text-[11px] md:text-xs`}
                                                >
                                                    {algo.time_complexity.best[0]}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-1.5 ${i === 0 ? "pt-2" : ""}`}>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-md bg-${algo.time_complexity.average[1]} text-white text-[11px] md:text-xs`}
                                                >
                                                    {algo.time_complexity.average[0]}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-4 py-1.5 ${
                                                    i === 0 ? "pt-2" : ""
                                                } border-r border-carbon-light`}
                                            >
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-md bg-${algo.time_complexity.worst[1]} text-white text-[11px] md:text-xs`}
                                                >
                                                    {algo.time_complexity.worst[0]}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-1.5 ${i === 0 ? "pt-2" : ""}`}>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-md bg-${algo.space_complexity[1]} text-white text-[11px] md:text-xs`}
                                                >
                                                    {algo.space_complexity[0]}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SortingChart;
