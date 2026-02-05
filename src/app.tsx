import "./index.css";

import { useState } from "react";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <main className="flex flex-col gap-4">
            <p className="text-black text-center">{count}</p>
            <button onClick={() => setCount(0)}>Reset</button>
            <button onClick={() => setCount((prev) => prev - 1)}>
                Decrement
            </button>
            <button onClick={() => setCount((prev) => prev + 1)}>
                Increment
            </button>
        </main>
    );
}
