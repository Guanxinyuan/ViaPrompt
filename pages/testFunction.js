import { useEffect, useState } from "react"
import { parseAnswer } from "@/utils/parseAnswer"
import { dummyResponses } from "@/data/cards"

export default function testFunctions() {
    const [answer, setAnswer] = useState('')
    const [mode, setMode] = useState('optimize')

    useEffect(() => {
        const parsedAnswer = parseAnswer(mode, dummyResponses[mode].choices[0].message.content)
        setAnswer(parsedAnswer)
    }, [])

    return (
        <div>
            {answer}
        </div>
    )
}