import { useEffect, useMemo, useState } from "react";
import { algorithms } from "./algorithms";
import "./App.css";

const SIZE = 15;

// unique random numbers between 10 and 99
function randomArray(size) {
  const set = new Set();
  while (set.size < size) set.add(Math.floor(Math.random() * 90) + 10);
  return [...set];
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// decides the colour class of one bar for the current step
function barState(step, i) {
  if (step.found === i) return "found";
  if (step.compare.includes(i)) return step.swapped ? "swap" : "compare";
  if (step.sorted.includes(i)) return "sorted";
  if (step.range && (i < step.range[0] || i > step.range[1])) return "out";
  return "";
}

export default function App() {
  const [algoKey, setAlgoKey] = useState("bubble");
  const [array, setArray] = useState(() => randomArray(SIZE));
  const [target, setTarget] = useState(() => array[Math.floor(SIZE / 2)]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5); // 1 (slow) to 10 (fast)

  const algo = algorithms[algoKey];

  // run the algorithm once and record every step; re-run only when the inputs change
  const steps = useMemo(
    () => algo.run(array, target),
    [algo, array, target]
  );

  const step = steps[stepIndex];
  const finished = stepIndex >= steps.length - 1;
  const running = playing && !finished;
  const delay = 1050 - speed * 100; // ms between steps
  const maxValue = Math.max(...array);

  // replay: move to the next recorded step after a delay
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setStepIndex((i) => i + 1), delay);
    return () => clearTimeout(id);
  }, [running, stepIndex, delay]);

  function resetPlayback() {
    setPlaying(false);
    setStepIndex(0);
  }

  function changeAlgorithm(key) {
    setAlgoKey(key);
    resetPlayback();
  }

  function newArray() {
    const next = randomArray(SIZE);
    setArray(next);
    setTarget(pick(next));
    resetPlayback();
  }

  function changeTarget(value) {
    setTarget(Number(value));
    resetPlayback();
  }

  function togglePlay() {
    if (running) {
      setPlaying(false);
      return;
    }
    if (finished) setStepIndex(0); // replay from the start
    setPlaying(true);
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Algorithm Visualizer</h1>
        <div className="tabs">
          {Object.entries(algorithms).map(([key, a]) => (
            <button
              key={key}
              className={key === algoKey ? "tab active" : "tab"}
              onClick={() => changeAlgorithm(key)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </header>

      <section className="controls">
        <button className="primary" onClick={togglePlay}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={resetPlayback}>Reset</button>
        <button onClick={newArray}>New array</button>

        <label className="field">
          Speed
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>

        {algo.needsTarget && (
          <label className="field">
            Target
            <input
              type="number"
              value={target}
              onChange={(e) => changeTarget(e.target.value)}
            />
          </label>
        )}
      </section>

      <section className="stage">
        <div className="bars">
          {step.arr.map((value, i) => (
            <div className="bar-col" key={i}>
              <div
                className={`bar ${barState(step, i)}`}
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <span className="value">{value}</span>
            </div>
          ))}
        </div>
        <p className="note">{step.note}</p>
        <p className="counter">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </section>

      <section className="info">
        <h2>{algo.name}</h2>
        <p>{algo.idea}</p>
        <table>
          <thead>
            <tr>
              <th>Best</th>
              <th>Average</th>
              <th>Worst</th>
              <th>Space</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{algo.time.best}</td>
              <td>{algo.time.average}</td>
              <td>{algo.time.worst}</td>
              <td>{algo.space}</td>
            </tr>
          </tbody>
        </table>
        <ul className="legend">
          <li><span className="dot compare" /> comparing</li>
          <li><span className="dot swap" /> swapped</li>
          <li><span className="dot sorted" /> sorted</li>
          <li><span className="dot found" /> found</li>
        </ul>
      </section>
    </div>
  );
}
