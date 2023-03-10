import { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import { LightBulbIcon } from "@heroicons/react/24/outline";
const configuration = new Configuration({
    organization: 'org-2KPiB8QFCOXogw6TS7cO4TMz',
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);

export default function PromptGenerator() {
    const promptRef = useRef();
    const [inputText, setInputText] = useState("");
    const [promptIdea, setPromptIdea] = useState("");
    const [promptIdeaTemp, setPromptIdeaTemp] = useState("");

    useEffect(() => {
        // streamPrint(20)
        streamPrintPromptIdea(20)
    }, [promptIdeaTemp]);

    useEffect(() => { }, [promptIdea])

    const streamPrintPromptIdea = (ms) => {
        let i = -1;
        setPromptIdea("")
        const intervalId = setInterval(() => {
            if (i >= promptIdeaTemp.length) {
                clearInterval(intervalId);
            } else {
                setPromptIdea((text) => text + promptIdeaTemp.charAt(i));
                i++
            }
        }, ms);
        return () => clearInterval(intervalId);
    }

    const generatePromptIdea = async (num_results) => {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Illustrate a view within 50 words using these words ${inputText}`,
            max_tokens: 500,
            n: num_results,
            temperature: 0.5,
        });
        console.log(response)

        const idea = response.data.choices[0].text;
        console.log(idea)
        setPromptIdeaTemp(idea);
    }

    const handleCopy = () => {
        promptRef.current.select();
        document.execCommand("copy");
    }
    return (
        <div className="h-1/2 w-3/5 container mx-auto flex flex-col items-center justify-center ">
            <div className="flex flex-row items-center w-full justify-center">
                <div className="w-1/2 bg-white p-4 rounded-lg flex flex-col items-center space-y-4 relative">
                    <h1 className="text-lg font-bold mr-auto">Generate A Prompt Idea</h1>
                    <textarea
                        className={`w-full h-40 p-4 border border-gray-500 rounded-lg resize-none mb-4 overflow-hidden`}
                        value={inputText}
                        placeholder={'Keywords of your idea...'}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button className={`bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold rounded-lg p-2 absolute bottom-6 right-6 px-3 py-2 flex flex-row gap-1`}
                        onClick={() => generatePromptIdea(1)}>Inspire
                        <LightBulbIcon className="w-5 h-5 stroke-2 cursor-pointer" /></button>
                </div>
                <div className="w-1/2 bg-white p-4 rounded-lg flex flex-col items-center space-y-4">
                    <h1 className="text-lg font-bold mr-auto">... Or Input Your Idea</h1>
                    <textarea
                        className={`w-full h-40 p-4 border border-gray-500 rounded-lg resize-none mb-4 overflow-hidden`}
                        value={promptIdea.trim()}
                        placeholder={'Detailed ready-to-go idea...'}
                        onChange={(e) => { setPromptIdea(e.target.value) }}
                    />
                </div>
            </div>
            <div className="w-full bg-white p-4 rounded-lg flex flex-col items-center space-y-4 relative">
                <textarea
                    className="w-full h-48 p-4 border border-gray-500 text-gray-500 rounded-lg  mb-4 overflow-auto"
                    ref={promptRef}
                    readOnly
                    placeholder={'Your prompt here...'}
                    // value={`/imagine prompt: ${promptIdea.trim().replace(/\n/g, ' ')}:: --v 4`}
                    value={`${promptIdea.trim().replace(/\n/g, ' ')}`}
                ></textarea>
                <DocumentIcon
                    className="absolute bottom-10 right-6 w-6 h-6 text-gray-600 cursor-pointer"
                    onClick={handleCopy} />

                {/* <button
                    className="absolute bg-blue-500 hover:bg-blue-700 text-white text-base font-bold rounded-lg p-2 px-4 py-2 right-10 bottom-14"
                    onClick={handleCopy}>Copy Prompt</button> */}
            </div>

            {/* <div className="w-3/5 p-8 grid grid-rows-2 grid-cols-5 gap-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Lighting</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Styles</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Camera</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Artists</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Colors</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Materials</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Size</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Depth Of Field</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Quality</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Stylize</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Version</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Seed</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Chaos</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Clear All</button>
            </div>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2 px-6">Upload Inspiration Image</button>
            </div> */}

        </div>

    );
}