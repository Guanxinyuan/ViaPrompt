import { useState, useEffect, useRef } from 'react'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import OptionDropdown from '@/components/paramDropdowns/OptionDropdown'
import MeasureDropdown from '@/components/paramDropdowns/MeasureDropdown'
import SizeDropdown from '@/components/paramDropdowns/SizeDropdown'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { makeParameterString } from '@/utils/frontend'

export default function Generator() {
    const promptRef = useRef()
    const [inputText, setInputText] = useState('')
    const [promptIdea, setPromptIdea] = useState('')
    const [promptIdeaTemp, setPromptIdeaTemp] = useState('')
    const [noWords, setNoWords] = useState('')

    const [version, setVersion] = useState('Version 4 (Default)')
    const [quality, setQuality] = useState(1)
    const [stylize, setStylize] = useState(100)
    const [stop, setStop] = useState(100)
    const [seed, setSeed] = useState('')
    const [chaos, setChaos] = useState(0)
    const [sizes, setSizes] = useState('Default (1024 x 1024)')
    const [paramString, setParamString] = useState('')

    const [inspireLoading, setInspireLoading] = useState(false)

    useEffect(() => {
        console.log(
            makeParameterString(version, quality, stylize, stop, seed, chaos, sizes),
        )
        setParamString(
            makeParameterString(version, quality, stylize, stop, seed, chaos, sizes),
        )
    }, [version, quality, stylize, stop, seed, chaos, sizes])

    useEffect(() => {
        streamPrintPromptIdea(15)
    }, [promptIdeaTemp])

    useEffect(() => { }, [promptIdea])

    const streamPrintPromptIdea = (ms) => {
        let i = -3
        setPromptIdea('')
        const intervalId = setInterval(() => {
            if (i >= promptIdeaTemp.length) {
                clearInterval(intervalId)
            } else {
                setPromptIdea((text) => text + promptIdeaTemp.charAt(i))
                i++
            }
        }, ms)
        return () => clearInterval(intervalId)
    }

    const generatePromptIdea = async (num_results) => {
        setInspireLoading(true)
        try {
            const response = await fetch(`/api/generate?input=${inputText}`)
            const result = await response.json()
            const idea = result.data
            console.log(idea)
            setPromptIdeaTemp(idea.trim().replace(/\n/g, ' '))
        } catch (ex) {
            alert('inspiration failed', ex)
        } finally {
            setInspireLoading(false)
        }
    }

    const handleCopy = () => {
        document.execCommand('copy')
    }

    return (
        <div className="mt-10 w-4/5 container mx-auto flex flex-col items-center justify-center">
            <p className="w-full p-4 font-bold text-3xl mb-6">
                Midjourney Prompt Tool
            </p>
            <div className="flex flex-row items-center w-full justify-center">
                <div className="input-container w-1/2 p-4 flex flex-col space-y-2">
                    <h1 className="input-title">Generate A Prompt Idea</h1>
                    <textarea
                        className="input-textarea w-full h-60 p-4 mb-4"
                        value={inputText}
                        placeholder={'Keywords of your idea...'}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button
                        className={`bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold rounded-lg absolute bottom-6 right-6 px-3 py-2 flex flex-row gap-1 ${inspireLoading ? 'animate-pulse' : ''
                            }`}
                        onClick={() => generatePromptIdea(1)}
                        disabled={inspireLoading}
                    >
                        {inspireLoading ? 'Inspiring...' : 'Inspire'}
                        <LightBulbIcon className="w-5 h-5 stroke-2 cursor-pointer" />
                    </button>
                </div>
                <div className="input-container w-1/2 p-4 flex flex-col space-y-2">
                    <h1 className="input-title">... Or Input Your Idea</h1>
                    <textarea
                        className="input-textarea w-full h-60 p-4 mb-4"
                        value={promptIdea}
                        placeholder={'Detailed ready-to-go idea...'}
                        onChange={(e) => {
                            setPromptIdea(e.target.value)
                        }}
                    />
                </div>
            </div>
            {/* <div className="w-full p-4 rounded-lg flex flex-col items-center relative">
                <textarea
                    className="output-textarea w-full h-32 p-4 mb-4"
                    ref={promptRef}
                    readOnly
                    placeholder={'Your final prompt here...'}
                    value={`/imagine prompt: ${promptIdea.trim().replace(/\n/g, ' ')} ${noWords.length > 0 ? `--no ${noWords.trim()}` : ''
                        } ${paramString}`}
                ></textarea>
                <DocumentIcon
                    className="absolute bottom-10 right-6 w-6 h-6 text-zinc-600 cursor-pointer"
                    onClick={handleCopy}
                />
            </div> */}
        </div>
    )
}
