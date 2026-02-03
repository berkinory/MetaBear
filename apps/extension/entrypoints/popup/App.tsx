import { useState } from "react";

import reactLogo from "@/assets/react.svg";
import wxtLogo from "@/assets/wxt.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex gap-4">
        <a href="https://wxt.dev" target="_blank">
          <img
            src={wxtLogo}
            className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#54bc4ae0]"
            alt="WXT logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-5xl font-bold mt-4">WXT + React</h1>
      <div className="p-8">
        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          className="px-5 py-2.5 rounded-lg bg-neutral-800 border border-transparent hover:border-indigo-500 font-medium transition-colors cursor-pointer"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="bg-neutral-800 px-1 rounded">src/App.tsx</code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-neutral-400">
        Click on the WXT and React logos to learn more
      </p>
    </div>
  );
}

export default App;
