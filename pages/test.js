
import { useState, useRef, useEffect } from "react";
import TempCard from "@/components/TempCard";
import { v4 as uuidv4 } from 'uuid';

export default function MasonryLayout() {
    const [cards, setCards] = useState([
        { id: 0, answer: '', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 1, answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', mode: 'optimize', model: 'gpt-4', prompt: 'Prompt: Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, answer: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.', mode: 'explain', model: 'gpt-3', prompt: 'Prompt: Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.' },
        { id: 3, answer: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', mode: 'template', model: 'stable diffusion', prompt: 'Prompt: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
        {
            id: 4, answer: `Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris. 
        Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.`, mode: 'optimize', model: 'dalle', prompt: 'Prompt: Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.'
        },
        { id: 5, answer: 'Morbi in tellus eget nisl consequat cursus eu ac nibh.', mode: 'explain', model: 'lexica', prompt: 'Prompt: Morbi in tellus eget nisl consequat cursus eu ac nibh.' },
        { id: 6, answer: 'Suspendisse potenti.', mode: 'template', model: 'chatgpt', prompt: 'Prompt: Suspendisse potenti.' },
    ]);
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
        const columns = buildColumns(cards, 4);
        console.log('subArrays in useEffect', columns)
        setColumns(columns)
    }, [cards])

    return (
        // <div className="mansonry columns-3 gap-6 text-black min-h-screen my-8 mx-8 border">
        <div className="masonry min-h-screen gap-6 mx-10 py-10">
            {/* <Card id={uuidv4()} cardData={null} setLoading={setLoading} setCards={setCards} /> */}

            {columns.map((column, i) => (
                <div key={i} className="items-start space-y-6">
                    {column.filter((item) => item !== undefined).map((card) => (
                        <TempCard key={uuidv4()} cardData={card} setLoading={setLoading} setCards={setCards} />
                    ))}
                </div>
            ))}
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-200 opacity-75">
                    <p className="text-gray-600 font-bold">Submitting post...</p>
                </div>
            )}
        </div>
    );
};