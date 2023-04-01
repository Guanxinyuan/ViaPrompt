import { useEffect, useState } from 'react'
import ModeDropdown from '@/components/ModeDropdown'
import ModelDropdown from '@/components/ModelDropdown'
import PromptTextarea from '@/components/PromptTextarea';
import ExplanationTextarea from '@/components/ExplanationTextarea';
import TemplateTextarea from '@/components/TemplateTextarea';

export default function Card({ card }) {
    const [cardId, setCardId] = useState(card.cardId)
    const [mode, setMode] = useState(card.mode)
    const [model, setModel] = useState(card.model)
    const [optimizeActiveSection, setOptimizeActiveSection] = useState(card.timestamp ? 'optimized' : 'original')
    const [decomposeActiveSection, setDecomposeActiveSection] = useState(card.timestamp ? 'analysis' : 'original')
    const [lockInput, setLockInput] = useState(card.timestamp ? true : false)

    useEffect(() => { }, [mode, model])

    return (
        <div className='prompt-card'>
            <div className='prompt-card-header'>
                <ModeDropdown className="col-span-1" width={'w-24'} height={"default"} options={["Optimize", "Decompose", "Template"]} defaultValue={mode} paramSetter={setMode} lockInput={lockInput} />
                <ModelDropdown className="col-span-2" width={'w-2/3'} options={["ChatGPT", "GPT-4", "GPT-3", "Midjourney V4", "Stable Diffusion", "Dalle", "Lexica"]} defaultValue={model} paramSetter={setModel} lockInput={lockInput} />
            </div>
            {
                mode === 'Optimize' && <div className='prompt-card-body'>
                    <ul className='prompt-card-body-header'>
                        <li className={`prompt-card-body-header-section text-left ${optimizeActiveSection === 'original' ? 'text-blue-500 font-bold' : ''}`}
                            onClick={() => setOptimizeActiveSection('original')}>Original prompt</li>
                        <li className={`prompt-card-body-header-section text-center ${optimizeActiveSection === 'optimized' ? 'text-blue-500 font-bold' : ''}`}
                            onClick={() => setOptimizeActiveSection('optimized')}>Optimized prompt</li>
                        <li className={`prompt-card-body-header-section text-right ${optimizeActiveSection === 'explanation' ? 'text-blue-500 font-bold' : ''}`}
                            onClick={() => setOptimizeActiveSection('explanation')}>Explanation</li>
                    </ul>

                    <PromptTextarea className={`${optimizeActiveSection !== 'original' ? 'hidden' : ''}`} contentText={card.originalPrompt} lockInput={lockInput} mode={mode} cardId={cardId} />
                    <PromptTextarea className={`${optimizeActiveSection !== 'optimized' ? 'hidden' : ''}`} contentText={card.optimizedPrompt} lockInput={lockInput} mode={mode} cardId={cardId} />
                    <ExplanationTextarea className={`${optimizeActiveSection !== 'explanation' ? 'hidden' : ''}`} contentDict={card.explanation} lockInput={lockInput} mode={mode} cardId={cardId} />
                </div>
            }
            {
                mode === 'Decompose' && <div className='prompt-card-body'>
                    <ul className='prompt-card-body-header grid-cols-2'>
                        <li className={`prompt-card-body-header-section text-center ${decomposeActiveSection === 'original' ? 'text-blue-500 font-bold' : ''}`}
                            onClick={() => setDecomposeActiveSection('original')}>Original prompt</li>
                        <li className={`prompt-card-body-header-section text-center ${decomposeActiveSection === 'analysis' ? 'text-blue-500 font-bold' : ''}`}
                            onClick={() => setDecomposeActiveSection('analysis')}>Prompt analysis</li>
                    </ul>

                    <PromptTextarea className={`${decomposeActiveSection !== 'original' ? 'hidden' : ''}`} contentText={card.originalPrompt} lockInput={lockInput} mode={mode} cardId={cardId} />
                    <ExplanationTextarea className={`${decomposeActiveSection !== 'analysis' ? 'hidden' : ''}`} contentDict={card.explanation} lockInput={lockInput} mode={mode} cardId={cardId} />
                </div>
            }
            {
                mode === 'Template' && <div className='prompt-card-body'>
                    <ul className='prompt-card-body-header grid-cols-1'>
                        <li className={`prompt-card-body-header-section text-center text-blue-500 font-bold}`}
                            onClick={() => setDecomposeActiveSection('original')}>Prompt/Template</li>
                    </ul>

                    <TemplateTextarea contentText={card.templatePrompt} type="input" lockInput={lockInput} mode={mode} cardId={cardId} />
                </div>
            }

        </div>
    )
}
