import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import PromptSearchBar from '@/components/PromptSearchBar'
import Card from '@/components/Card'
import { v4 as uuidv4 } from 'uuid';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import Generator from '@/components/Generator';

export default function Workspace() {
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('')
    const [creating, setCreating] = useState(false);
    const [columns, setColumns] = useState([]);
    const [numColumns, setNumColumns] = useState(1);
    const user = useUser()
    const session = useSession();
    const router = useRouter();

    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (session) {
            fetchCards();
        } else {
            // router.push('/auth/login');
        }
    }, [session]);

    const fetchCards = useCallback(async () => {
        try {
            const response = await fetch(`/api/cards/getCards?user_id=${user.id}`);
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error)
            }
            const data = result.data
            console.log('cards in fetchCards: ', data)
            setCards(data.map((card) => {
                return { ...card, answer: card.answer }
            }))
        } catch (error) {
            console.error('Error fetching cards:', error.message);
        }
    }, [user])


    const emptyCard = { id: 0, answer: '', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.', created_at: '' }

    const buildColumns = (arr, n) => {
        let subArrays = [];
        for (let i = 0; i < arr.length; i += n) {
            subArrays.push(arr.slice(i, i + n));
        }
        return subArrays[0]?.map((_, colIndex) => subArrays.map(row => row[colIndex])) || [];
    };

    const locateCreatingCard = (i, j) => {
        if (numColumns > 1) {
            return i == 1 && j == 0;
        } else {
            return i == 0 && j == 1;
        }
    }


    useEffect(() => {
        const columns = buildColumns([emptyCard, ...cards], numColumns);
        setColumns(columns);
    }, [cards, creating, numColumns]);

    return (
        <div className='min-h-screen'>
            {
                session &&
                <div className="max-w-screen py-10 mx-10 m-auto flex flex-col gap-6 items-center">
                    <div className="flex items-center w-3/5">
                        <PromptSearchBar filterSetter={setFilter} querySetter={setQuery} columnsSetter={setNumColumns} />
                    </div>
                    <div className={`masonry min-h-screen gap-6 ${numColumns == 1 ? "w-3/5" : numColumns == 2 ? "w-4/5" : 'w-full'}`}
                        style={{
                            '--num-columns': numColumns,
                        }}>
                        {columns.map((column, i) => (
                            <div key={i} className="items-start space-y-6">
                                {column.filter((item) => item !== undefined).map((card, j) => (
                                    <div>
                                        {
                                            creating && locateCreatingCard(i, j) ?
                                                <Card key={uuidv4()} cardData={card} setCreating={setCreating} setCards={setCards} creating={creating} creatingText={'animate-pulse blur-text'} creatingBorder={'animate-pulse'} />
                                                :
                                                <Card key={uuidv4()} cardData={card} setCreating={setCreating} setCards={setCards} creating={creating} />
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>

    )
}