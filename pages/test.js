
import { useState, useRef, useEffect } from "react";
import TempCard from "@/components/TempCard";
import { v4 as uuidv4 } from 'uuid';
import { dummyResponses } from "@/data/cards";
import { parseAnswer } from "@/utils/parseAnswer";

export default function MasonryLayout() {
    const [cards, setCards] = useState([
        {
            id: 0,
            mode: 'optimize',
            model: 'gpt-4',
            prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            answer: parseAnswer('optimize', JSON.stringify({
                'content': 'A landscape of rolling hills and rocky outcroppings in the Scottish Highlands',
                'medium': 'oil painting',
                'style': 'inspired by the Romanticism movement, with a touch of impressionism',
                'lighting': 'the warm glow of the setting sun casting long shadows across the hills',
                'colors': ' rich earthy tones with pops of vibrant greens and purples',
                'composition': 'A wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth. The focal point is a small loch nestled among the hills, with a lone tree on its banks.',
                'prompt': 'Create an oil painting inspired by the Romanticism movement, with a touch of impressionism, depicting a landscape of rolling hills and rocky outcroppings in the Scottish Highlands at sunset. Use rich earthy tones with pops of vibrant greens and purples to emphasize the warm glow of the setting sun casting long shadows across the hills. The focal point of the painting should be a small loch nestled among the hills, with a lone tree on its banks. Take a wide shot from a high angle, using a telephoto lens to compress the hills and create a sense of depth.',
            })),
        },
        {
            id: 1,
            mode: 'explain',
            model: 'chatgpt',
            prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            answer: parseAnswer('explain', JSON.stringify({
                "main_object": "goddess-like figure",
                "medium": ["digital painting"],
                "style": ["surreal", "mystical"],
                "artists": ["N/A"],
                "lighting": ["stardust effect"],
                "colors": ["blues", "purples", "pinks"],
                "camera": ["wide-angle lens"],
                "perspective": ["center of the nebula", "arms outstretched"],
                "scale": ["N/A"]
            }))
        },
        {
            id: 2,
            mode: 'template',
            model: 'stable diffusion',
            prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            answer: parseAnswer('template', "This is a test prompt")
        }
        // { id: 0, answer: '', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        // { id: 1, answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        // { id: 2, answer: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.', mode: 'explain', model: 'gpt-3', prompt: 'Prompt: Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.' },
        // { id: 3, answer: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', mode: 'template', model: 'stable diffusion', prompt: 'Prompt: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
        // {
        //     id: 4, answer: `Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris. 
        // Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.`, mode: 'optimize', model: 'dalle', prompt: 'Prompt: Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.'
        // },
        // { id: 5, answer: 'Morbi in tellus eget nisl consequat cursus eu ac nibh.', mode: 'explain', model: 'lexica', prompt: 'Prompt: Morbi in tellus eget nisl consequat cursus eu ac nibh.' },
        // { id: 6, answer: 'Suspendisse potenti.', mode: 'template', model: 'chatgpt', prompt: 'Prompt: Suspendisse potenti.' },
    ]);
    const emptyCard = { id: 0, answer: '', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }

    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);

    const buildColumns = (arr, n) => {
        let subArrays = [];
        for (let i = 0; i < arr.length; i += n) {
            subArrays.push(arr.slice(i, i + n));
        }
        return subArrays[0].map((_, colIndex) => subArrays.map(row => row[colIndex]));
    }

    useEffect(() => {
        const columns = buildColumns([emptyCard, ...cards], 4);
        setColumns(columns)
    }, [cards, loading])

    return (
        <div className="masonry min-h-screen gap-6 mx-10 py-10">
            {columns.map((column, i) => (
                <div key={i} className="items-start space-y-6">
                    {column.filter((item) => item !== undefined).map((card, j) => (
                        <div>
                            {
                                loading && i == 1 && j == 0 ?
                                    <TempCard key={uuidv4()} cardData={card} setLoading={setLoading} setCards={setCards} loadingText={'animate-pulse blur-text'} loadingBorder={'animate-pulse'} />
                                    :
                                    <TempCard key={uuidv4()} cardData={card} setLoading={setLoading} setCards={setCards} />
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};