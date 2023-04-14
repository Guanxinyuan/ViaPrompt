import { useState } from "react";

const TestBoard = () => {
    const [prompt, setPrompt] = useState("");
    const [maxTokens, setMaxTokens] = useState("");
    const [model, setModel] = useState("");
    const [executionTime, setExecutionTime] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = async () => {
        const response = await fetch("/api/test/testPrompts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, max_tokens: maxTokens, model }),
        });

        const result = await response.json();
        setExecutionTime(result.data.executionTime);
        setAnswer(result.data.answer);
    };

    return (
        <div className="p-4 bg-gray-100 shadow-md rounded-md h-1/2 text-black">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Prompt"
            ></textarea>
            <textarea
                value={answer}
                readOnly
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Answer"
            ></textarea>
            <input
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                type="number"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Max Tokens"
            />
            <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                type="text"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                placeholder="Model"
            />
            <p className="mb-4 text-black">Execution Time: {executionTime}</p>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
                Submit
            </button>
        </div>
    );
};


const TestPrompt = () => {
    return (
        <div className="flex justify-between min-h-screen mx-10 pt-10 gap-10">
            <TestBoard />
            <TestBoard />
        </div>
    );
};

export default TestPrompt;
