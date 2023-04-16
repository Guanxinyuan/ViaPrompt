import { useEffect, useState } from "react"
import { parseAnswer } from "@/utils/parseAnswer"
import { dummyResponses } from "@/data/cards"

export default function testFunctions() {
    const [answer, setAnswer] = useState('')
    const [task, setTask] = useState('optimize')

    useEffect(() => {
        const parsedAnswer = parseAnswer(task, dummyResponses[task].choices[0].message.content)
        setAnswer(parsedAnswer)
    }, [])

    return (
        <div>
            {answer}
        </div>
    )
}