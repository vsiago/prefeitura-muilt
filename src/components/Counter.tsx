// src/components/Counter.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { increment, decrement, reset } from "@/redux/store/slices/counterSlice";

export default function Counter() {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-md shadow-md">
            <h2 className="text-2xl font-bold">Contador: {count}</h2>
            <div className="flex gap-2">
                <button onClick={() => dispatch(increment())} className="px-4 py-2 bg-green-500 text-white rounded-md">+</button>
                <button onClick={() => dispatch(decrement())} className="px-4 py-2 bg-red-500 text-white rounded-md">-</button>
                <button onClick={() => dispatch(reset())} className="px-4 py-2 bg-gray-500 text-white rounded-md">Reset</button>
            </div>
        </div>
    );
}
