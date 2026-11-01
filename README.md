# Algorithm Visualizer

A React app that animates sorting and searching algorithms step by step, so you can watch exactly what the algorithm does at every comparison and swap.

**Live demo:** _add your Vercel link here_

![Screenshot](./screenshot.png)

## Algorithms

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |

Bubble sort's best case is O(n) because it stops early when a full pass makes no swaps.

## Features

- Bars highlight the elements being compared, swapped, sorted or found
- Start / Pause, Reset and New array buttons
- Speed slider that takes effect immediately, even mid-run
- A note under the bars explaining each step in words
- Step counter
- Editable target for binary search, including values that are not in the array
- Time and space complexity shown for the selected algorithm

## How it works

The algorithm logic and the animation are kept separate.

1. Each algorithm in `src/algorithms.js` runs to completion and returns an array of **steps**. A step is a snapshot of the array plus which indices are being compared, whether it was a swap, which indices are sorted, and a short note.
2. `App.jsx` computes the steps once with `useMemo`, so pressing Start or moving the slider never re-runs the algorithm.
3. Playback is a `useEffect` that waits for the chosen delay and then moves to the next step with `setStepIndex`. The cleanup function clears the timer when you pause, reset or change speed.
4. Each bar's colour is decided by one small function that maps the current step to a CSS class.

Because the algorithms are plain functions with no React code, adding a new one only needs a new function in `algorithms.js`.

## Tech stack

- React (Vite)
- Plain CSS

## Run locally

```bash
git clone https://github.com/nik-yet/dsa-visualizer.git
cd dsa-visualizer
npm install
npm run dev
```

Then open http://localhost:5173.

## Possible improvements

- More algorithms (insertion sort, merge sort, linear search)
- Array size slider and a manual "Next step" button
- Comparison and swap counters
- Custom input array

## Author

Niket Ojha: [GitHub](https://github.com/nik-yet) | [LinkedIn](https://linkedin.com/in/niketojha)