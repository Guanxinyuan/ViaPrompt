import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import PromptSearchBar from '@/components/PromptSearchBar'
import Card from '@/components/Card'
import { v4 as uuidv4 } from 'uuid';
import { useSession, useUser } from '@supabase/auth-helpers-react';
import { useCredits } from '@/context/CreditsContext';
import { useSubscription } from '@/context/SubscriptionContext';
import CreditUsageBar from '@/components/CreditsUsageBar';


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
    const [filteredCards, setFilteredCards] = useState([]);

    const { subscription } = useSubscription();
    const { credits, setCredits } = useCredits();

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
            setCards(data)
            setFilteredCards(data)
        } catch (error) {
            console.error('Error fetching cards:', error.message);
        }
    }, [user])


    const emptyCard = { id: 0, answer: '', task: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.', created_at: '' }

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

    const handleCreditsUpdate = (newCredits) => {
        setCredits(newCredits)
    }

    useEffect(() => {
        console.log('query: ', query)
        const filtered = cards.filter((card) => {
            return card.answer.toLowerCase().includes(query.toLowerCase());
        });
        setFilteredCards(filtered);
    }, [query, cards]);


    useEffect(() => {
        const columns = buildColumns([emptyCard, ...filteredCards], numColumns);
        setColumns(columns);
    }, [filteredCards, creating, numColumns]);

    return (
        <div className='min-h-screen relative'>
            {
                session &&
                <div className="max-w-screen py-10 mx-10 m-auto flex flex-col gap-6 items-center">
                    {
                        // check if user has/had a subscription
                        subscription?.subscription_id && credits &&
                        < div className='flex gap-4 w-3/5 items-center justify-center'>
                            <p className='min-w-max text-sm'>Free credits: </p>
                            <CreditUsageBar
                                creditsUsed={credits.totalFreeCredits - credits.freeCreditsBalance}
                                totalCredits={credits.totalFreeCredits}
                            />
                        </div>
                    }
                    <div className="flex items-center w-3/5">
                        <PromptSearchBar filterSetter={setFilter} querySetter={setQuery} columnsSetter={setNumColumns} />
                    </div>
                    <div className={`masonry min-h-screen gap-6 ${numColumns == 1 || !filteredCards.length ? "w-3/5" : numColumns == 2 || filteredCards.length == 1 ? "w-4/5" : 'w-full'}`}
                        style={{
                            '--num-columns': filteredCards.length >= numColumns ? numColumns : filteredCards.length + 1,
                        }}>
                        {columns.map((column, i) => (
                            <div key={i} className="items-start space-y-6">
                                {column.filter((item) => item !== undefined).map((card, j) => (
                                    <div>
                                        {
                                            creating && locateCreatingCard(i, j) ?
                                                // the creating card
                                                <Card key={uuidv4()} cardData={card} setCreating={setCreating} setCards={setCards} creating={creating} creatingText={'animate-pulse blur-text'} creatingBorder={'animate-pulse'} />
                                                :
                                                // the created card
                                                <Card key={uuidv4()} cardData={card} setCreating={setCreating} setCards={setCards} creating={creating} numColumns={numColumns} credits={credits} onCreditsUpdate={handleCreditsUpdate} />
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div >

    )
}