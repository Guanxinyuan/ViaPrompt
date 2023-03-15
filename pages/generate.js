import { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import DocumentIcon from "@heroicons/react/24/outline/DocumentIcon";
import { LightBulbIcon } from "@heroicons/react/24/outline";
const configuration = new Configuration({
    organization: 'org-2KPiB8QFCOXogw6TS7cO4TMz',
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);
import OptionDropdown from "@/components/paramDropdowns/OptionDropdown";
import MeasureDropdown from "@/components/paramDropdowns/MeasureDropdown";
import SizeDropdown from "@/components/paramDropdowns/SizeDropdown";
import { makeParameterString } from "@/utils/frontend";

export default function PromptGenerator() {
    const promptRef = useRef();
    const [inputText, setInputText] = useState("");
    const [promptIdea, setPromptIdea] = useState("");
    const [promptIdeaTemp, setPromptIdeaTemp] = useState("");
    const [noWords, setNoWords] = useState("");

    const [version, setVersion] = useState('Version 4 (Default)');
    const [quality, setQuality] = useState(1);
    const [stylize, setStylize] = useState(100);
    const [stop, setStop] = useState(100);
    const [seed, setSeed] = useState('');
    const [chaos, setChaos] = useState(0);
    const [sizes, setSizes] = useState("Default (1024 x 1024)");
    const [paramString, setParamString] = useState("");

    const [inspireLoading, setInspireLoading] = useState(false);

    useEffect(() => {
        console.log(makeParameterString(version, quality, stylize, stop, seed, chaos, sizes))
        setParamString(makeParameterString(version, quality, stylize, stop, seed, chaos, sizes))
    }, [version, quality, stylize, stop, seed, chaos, sizes]);

    useEffect(() => {
        streamPrintPromptIdea(20)
    }, [promptIdeaTemp]);

    useEffect(() => {

    }, [promptIdea])

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
        setInspireLoading(true)
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
        setPromptIdeaTemp(idea.trim().replace(/\n/g, ' '));
        setInspireLoading(false)
    }

    const handleCopy = () => {
        document.execCommand("copy");
    }

    return (
        <div className="mt-10 min-h-screen w-4/5 container mx-auto flex flex-col items-center justify-center">
            <p className="w-full p-4 font-bold text-3xl mb-6">Midjourney Prompt Tool</p>
            <div className="flex flex-row items-center w-full justify-center">
                <div className="w-1/2 p-4 rounded-lg flex flex-col items-center space-y-2 relative">
                    <h1 className="text-sm font-bold mr-auto">Generate A Prompt Idea</h1>
                    <textarea
                        className={`w-full h-40 text-gray-800 p-4 rounded-lg resize-none mb-4 overflow-hidden`}
                        value={inputText}
                        placeholder={'Keywords of your idea...'}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button className={`bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold rounded-lg absolute bottom-6 right-6 px-3 py-2 flex flex-row gap-1 ${inspireLoading ? 'animate-pulse' : ''}`}
                        onClick={() => generatePromptIdea(1)}
                        disabled={inspireLoading}>{inspireLoading ? 'Inspiring...' : 'Inspire'}
                        <LightBulbIcon className="w-5 h-5 stroke-2 cursor-pointer" /></button>
                </div>
                <div className="w-1/2 p-4 rounded-lg flex flex-col items-center space-y-2" >
                    <h1 className="w-full text-sm font-bold mr-auto">... Or Input Your Idea</h1>
                    <textarea
                        className={`w-full h-40 p-4 text-gray-800 rounded-lg resize-none mb-4 overflow-hidden`}
                        value={promptIdea}
                        placeholder={'Detailed ready-to-go idea...'}
                        onChange={(e) => { setPromptIdea(e.target.value) }}
                    />
                </div>
            </div>
            <div className="w-full px-4 py-2 rounded-lg flex flex-row gap-4 items-center mb-4">
                <h1 className="w-1/2 text-sm text-left font-bold">Exclude certain terms or objects from your generation</h1>
                <textarea
                    className={`w-full h-10 px-4 py-2 text-gray-800 rounded-lg resize-none overflow-hidden`}
                    value={noWords}
                    placeholder={'Avoid these terms...(e.g. people, flowers, etc.)'}
                    onChange={(e) => { setNoWords(e.target.value) }}
                />
            </div>
            <div className="w-full p-4 rounded-lg flex flex-col items-center relative">
                <textarea
                    className="w-full h-32 p-4 border border-gray-500 text-gray-500 rounded-lg mb-4 overflow-auto"
                    ref={promptRef}
                    readOnly
                    placeholder={'Your final prompt here...'}
                    // value={`/imagine prompt: ${promptIdea.trim().replace(/\n/g, ' ')}:: --v 4`}
                    value={`/imagine prompt: ${promptIdea.trim().replace(/\n/g, ' ')} ${noWords.length > 0 ? `--no ${noWords.trim()}` : ''} ${paramString}`}
                ></textarea>
                <DocumentIcon
                    className="absolute bottom-10 right-6 w-6 h-6 text-gray-600 cursor-pointer"
                    onClick={handleCopy} />
            </div>

            <div className="w-full min-h-screen p-4 flex flex-col space-y-8">
                {/* <div className="flex flex-col space-y-2">
                    <p className="font-bold text-base">Artistic Settings</p>
                    <div className="grid grid-rows-2 grid-cols-5 gap-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Artist</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Styles</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Lighting</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Camera</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Color</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Material</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Dimensionality</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2">Resolution</button>
                    </div>
                </div> */}
                <div className="flex flex-col space-y-2">
                    <div className="grid grid-cols-2">
                        <p className="font-bold text-base">Midjourney Parameters</p>
                        {/* <p
                            className="text-sm text-right cursor-pointer"
                            onClick={resetParams}>Reset All</p> */}

                    </div>
                    <div className="grid grid-rows-2 grid-cols-5 gap-2">
                        {/* Can start from version 4 and niji */}
                        <OptionDropdown paramName={'Version'} paramAlias={'--v'} width={'default'} height={'h-28'} options={['Niji', 'Version 4 (Default)']} defaultValue={'Version 4 (Default)'} paramSetter={setVersion} />
                        {/* Quality is option list */}
                        <OptionDropdown paramName={'Quality'} width={'default'} height={'h-fit'} options={[0.25, 0.5, 1]} defaultValue={1} paramSetter={setQuality} />
                        {/* Stylize is better to be a measure bar */}
                        <MeasureDropdown paramName={'Stylize'} width={'w-96'} height={'h-32'} minValue={0} maxValue={1000} step={100} defaultValue={100} paramSetter={setStylize} />
                        {/* Stop is a measure bar*/}
                        <MeasureDropdown paramName={'Stop'} width={'w-96'} height={'h-32'} minValue={10} maxValue={100} step={10} defaultValue={100} paramSetter={setStop} />
                        {/* Seed can be an input or a measure bar */}
                        <MeasureDropdown paramName={'Seed'} width={'w-96'} height={'h-32'} minValue={0} maxValue={4294967295} defaultValue={null} paramSetter={setSeed} />
                        {/* Chaos can be a measure bar */}
                        <MeasureDropdown paramName={'Chaos'} width={'w-96'} height={'h-32'} minValue={0} maxValue={100} step={10} defaultValue={0} paramSetter={setChaos} />

                        <SizeDropdown paramName={'Sizes'} width={'w-hit'} height={'h-fit'} paramSetter={setSizes} />
                    </div>
                </div>
            </div>


            {/* <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white text-base rounded-lg p-2 px-6">Upload Inspiration Image</button>
            </div> */}

        </div>

    );
}