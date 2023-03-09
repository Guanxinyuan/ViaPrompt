import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-2KPiB8QFCOXogw6TS7cO4TMz",
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);

export default function CodeGenerator() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [outputShown, setOutputShown] = useState("");

    useEffect(() => {
        streamPrint(10)
    }, [outputText]);

    const streamPrint = (ms) => {
        let i = 0;
        setOutputShown("")
        const intervalId = setInterval(() => {
            if (i >= outputText.length) {
                clearInterval(intervalId);
            } else {
                setOutputShown((text) => text + outputText.charAt(i));
                i++;
            }
        }, ms);
        return () => clearInterval(intervalId);
    }


    const handleChange = (event) => {
        setInputText(event.target.value);
    };

    const handleClick = async () => {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: inputText,
            max_tokens: 1024,
            n: 1,
            temperature: 0.5,
        });
        console.log(response)

        const outputText = response.data.choices[0].text;
        console.log(outputText)
        setOutputText(outputText);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
            <div className="flex items-start w-full justify-center">

                <div className="w-1/4 bg-white p-8 rounded-lg flex flex-col items-center space-y-4">
                    <h1 className="text-2xl font-bold">Describe your need</h1>
                    <textarea
                        className="w-full h-80 p-4 border-2 border-black rounded-lg resize-none mb-4 overflow-hidden"
                        value={inputText}
                        onChange={handleChange}
                    />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold rounded-lg w-full p-2" onClick={handleClick}>Generate Code</button>
                </div>
                <div className="w-1/2 bg-white p-8 rounded-lg flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">Code for you</h1>
                    <textarea
                        className="w-full h-96 p-4 border-2 border-black rounded-lg resize-none mb-4 overflow-scroll"
                        value={outputShown.trimStart()}
                    />
                </div>
            </div>
        </div>
    );
}