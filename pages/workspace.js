import Card from '@/components/Card'
import { useEffect, useState } from 'react'
import PromptSearchBar from '@/components/PromptSearchBar'

export default function Workspace() {
    const [allCards, setAllCards] = useState([])
    const [cards, setCards] = useState([])
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        fetchCards()
    }, [])

    useEffect(() => { }, [cards])

    useEffect(() => {
        console.log(query + ' ' + filter)
        const conditionedCards = allCards
            .filter(card => card.timestamp && card.mode.includes(filter))
            .filter(card => query.length == 0 || card.originalPrompt.toLowerCase().includes(query.toLowerCase()) || card.optimizedPrompt?.toLowerCase()?.includes(query.toLowerCase()) || card.templatePrompt?.toLowerCase()?.includes(query.toLowerCase()))
        setCards(conditionedCards)
        console.log(conditionedCards)
    }, [query, filter])

    const fetchCards = async () => {
        const response = await fetch('/api/cards/getCards')
        const result = await response.json()
        const dummyCards = result.data
        setAllCards(dummyCards)
        setCards(dummyCards)
    }

    const emptyCards = {
        cardId: null,
        mode: 'Optimize',
        model: "Midjourney V4",
        originalPrompt: null,
        optimizedPrompt: null,
        explanation: null,
        templatePrompt: null,
        timestamp: null
    }

    return (
        <div className="max-w-screen min-h-screen py-10 mx-10 m-auto flex flex-col gap-4">
            <PromptSearchBar filterSetter={setFilter} querySetter={setQuery} />
            <div className="h-full gap-6 grid grid-cols-3">
                <Card card={emptyCards} />
                {
                    cards.map((card) => (
                        <Card key={card.cardId} card={card} />
                    ))
                }
            </div>
        </div>

    )
}

// import { useRouter } from 'next/router';
// import { useEffect } from 'react'
// export async function getStaticProps() {

//     // console.log(dummyCards)
//     // const router = useRouter();
//     // const { origin } = router;
//     // console.log(origin)
//     const response = await fetch(`/api/cards/getCards`, {
//         method: "GET"
//     })
//     console.log(response)
//     const result = await response.json()
//     const dummyCards = result.data
//     return {
//         props: {
//             cards: dummyCards
//         }
//     }
// }



