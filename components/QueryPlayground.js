import { useState, useEffect } from "react";

export default function QueryPlayground() {
    const [inputText, setInputText] = useState("");
    const [queryResults, setQueryResults] = useState({});

    useEffect(() => { }, [queryResults]);


    const handleChange = (event) => {
        setInputText(event.target.value);
    };

    const handleClick = async () => {
        if (inputText) {
            const response = await fetch(`/api/playground?query=${encodeURIComponent(inputText)}`)
            const results = await (await response.json()).data
            console.log('result is ', results)
            setQueryResults(results);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
            <div className="flex flex-col items-center w-full justify-center">

                <div className="w-2/3 p-3 bg-white rounded-lg flex flex-col items-center space-y-4 mb-4 relative">
                    <h1 className="text-2xl font-bold">Postgresql Playground</h1>
                    <textarea
                        className="w-full h-60 p-4 border-2 border-black rounded-lg resize-none mb-4 overflow-hidden"
                        value={inputText}
                        onChange={handleChange}
                    />
                    <button
                        className="absolute bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold rounded-lg right-6 bottom-6 px-6 py-1"
                        onClick={handleClick}>Run</button>
                </div>
                <div className="w-2/3 h-80 border-t border-gray-200 text-left overflow-x-auto overflow-y-auto">
                    {queryResults.length > 0 &&
                        <table className="table-auto text-sm">
                            <thead>
                                <tr>
                                    {Object.keys(queryResults[0]).map((field) => {
                                        return (
                                            <th className="px-4 py-2 w-1/4 font-bold">{field}</th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {queryResults.map((result) => {
                                    return (
                                        <tr>
                                            {Object.values(result).map((field) => {
                                                return (
                                                    <td className="whitespace-nowrap px-4 py-1 w-1/4">{field}</td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}