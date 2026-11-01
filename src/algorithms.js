// Each algorithm runs to completion first and returns an array of "steps".
// The UI only replays these steps, so the logic here knows nothing about React.
//
// A step looks like:
// {
//   arr:     copy of the array at this moment
//   compare: indices being compared (highlighted)
//   swapped: true if this step is a swap
//   sorted:  indices already in their final position
//   range:   [low, high] still being searched (binary search only)
//   found:   index of the match, or -1
//   note:    short text describing what is happening
// }

function snap(arr, extra = {}) {
  return {
    arr: [...arr],
    compare: [],
    swapped: false,
    sorted: [],
    range: null,
    found: -1,
    note: "",
    ...extra,
  };
}

const allIndices = (arr) => arr.map((_, i) => i);

export function bubbleSort(input) {
  const a = [...input];
  const steps = [snap(a, { note: "Starting array" })];
  const sorted = [];

  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;

    for (let j = 0; j < a.length - 1 - i; j++) {
      steps.push(
        snap(a, {
          compare: [j, j + 1],
          sorted: [...sorted],
          note: `Compare ${a[j]} and ${a[j + 1]}`,
        })
      );

      if (a[j] > a[j + 1]) {
        const [x, y] = [a[j], a[j + 1]];
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        steps.push(
          snap(a, {
            compare: [j, j + 1],
            swapped: true,
            sorted: [...sorted],
            note: `${x} > ${y}, so swap them`,
          })
        );
      }
    }

    // the largest value of this pass has bubbled to the end
    sorted.push(a.length - 1 - i);

    // no swaps in a full pass means the array is already sorted
    if (!swapped) break;
  }

  steps.push(snap(a, { sorted: allIndices(a), note: "Sorted" }));
  return steps;
}

export function selectionSort(input) {
  const a = [...input];
  const steps = [snap(a, { note: "Starting array" })];
  const sorted = [];

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;

    for (let j = i + 1; j < a.length; j++) {
      steps.push(
        snap(a, {
          compare: [min, j],
          sorted: [...sorted],
          note: `Compare ${a[j]} with the current minimum ${a[min]}`,
        })
      );
      if (a[j] < a[min]) min = j;
    }

    if (min !== i) {
      const [x, y] = [a[i], a[min]];
      [a[i], a[min]] = [a[min], a[i]];
      steps.push(
        snap(a, {
          compare: [i, min],
          swapped: true,
          sorted: [...sorted],
          note: `Minimum is ${y}, swap it with ${x}`,
        })
      );
    }

    sorted.push(i);
  }

  steps.push(snap(a, { sorted: allIndices(a), note: "Sorted" }));
  return steps;
}

export function binarySearch(input, target) {
  // binary search needs a sorted array
  const a = [...input].sort((x, y) => x - y);
  const steps = [
    snap(a, {
      range: [0, a.length - 1],
      note: `Array is sorted. Searching for ${target}`,
    }),
  ];

  let low = 0;
  let high = a.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push(
      snap(a, {
        range: [low, high],
        compare: [mid],
        note: `low = ${low}, high = ${high}, mid = ${mid}. Check ${a[mid]}`,
      })
    );

    if (a[mid] === target) {
      steps.push(
        snap(a, {
          range: [low, high],
          found: mid,
          note: `Found ${target} at index ${mid}`,
        })
      );
      return steps;
    }

    if (a[mid] < target) {
      low = mid + 1;
      steps.push(
        snap(a, {
          range: [low, high],
          compare: [mid],
          note: `${a[mid]} < ${target}, so discard the left half`,
        })
      );
    } else {
      high = mid - 1;
      steps.push(
        snap(a, {
          range: [low, high],
          compare: [mid],
          note: `${a[mid]} > ${target}, so discard the right half`,
        })
      );
    }
  }

  steps.push(snap(a, { note: `${target} is not in the array` }));
  return steps;
}

export const algorithms = {
  bubble: {
    name: "Bubble Sort",
    run: bubbleSort,
    needsTarget: false,
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    idea: "Repeatedly compare neighbours and swap them if they are out of order. After each pass the largest remaining value settles at the end. Stops early if a pass makes no swaps.",
  },
  selection: {
    name: "Selection Sort",
    run: selectionSort,
    needsTarget: false,
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    idea: "Find the smallest value in the unsorted part and swap it into the next position. Always does the same number of comparisons, but at most n - 1 swaps.",
  },
  binary: {
    name: "Binary Search",
    run: binarySearch,
    needsTarget: true,
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    idea: "On a sorted array, check the middle element and discard the half that cannot contain the target. Each step halves the search range.",
  },
};