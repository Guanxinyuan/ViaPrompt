
import { useState, useRef } from "react";
import ContentEditable, { ContnetEditable } from "react-contenteditable";

const Card = ({ content }) => {
    // const [content, setContent] = useState(children);

    const textRef = useRef(content || '');
    const onChangeHandler = (e) => {
        const lastChild = e.target.lastChild;
        if (lastChild && lastChild.tagName === 'BR') {
            lastChild.remove();
        }

        if (e.target.value.trim() === "<br>" && e.target.value === "<br>") {
            console.log('e.target.value.trimmed()', e.target.value.trim())
            e.target.value = '';
        }
        textRef.current = e.target.value
    };

    return (
        <div className="relative bg-white rounded-md shadow-md overflow-hidden border border-black flex-grow overflow-y-auto p-4">
            <ContentEditable
                html={textRef.current}
                tagName="div"
                className={`prompt-card-body-content`}
                placeholder="Write your prompt here..."
                onChange={onChangeHandler}
            />
        </div>
    );
};

const MasonryLayout = () => {
    const [cards, setCards] = useState([
        { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce tincidunt orci ac gravida iaculis.' },
        { id: 3, text: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
        { id: 4, text: 'Aliquam pharetra, felis nec convallis lobortis, nisi orci viverra nulla, id pretium nulla libero at mauris.' },
        { id: 5, text: 'Morbi in tellus eget nisl consequat cursus eu ac nibh.' },
        { id: 6, text: 'Suspendisse potenti.' },
        { id: 7, text: 'Fusce euismod bibendum justo, at aliquam elit ullamcorper id.' },
        { id: 8, text: 'Sed sed laoreet quam, vel finibus ante.' },
        { id: 9, text: 'Nulla facilisi.' },
        { id: 10, text: 'Maecenas at dui vel felis lacinia malesuada.' },
        { id: 11, text: 'Donec fringilla, est ac malesuada bibendum, nulla massa mattis arcu, eget auctor velit velit vel justo.' },
        { id: 12, text: 'Nam vel urna eu augue finibus suscipit vel vel enim.' },
        { id: 13, text: 'Aenean eu lacinia sapien.' },
        { id: 14, text: 'Proin interdum, dui vel tristique hendrerit, lacus justo malesuada urna, quis malesuada turpis augue in sapien.' },
        { id: 15, text: 'Etiam eu purus malesuada, dictum tellus at, eleifend lorem.' },
    ]);

    const columns = [[], [], [], []];

    const addCardToColumn = (card, columnIndex) => {
        columns[columnIndex].push(card);
    };

    // divide cards into columns based on their height
    cards.forEach((card) => {
        const columnHeights = columns.map((col) =>
            col.reduce((totalHeight, currCard) => totalHeight + currCard.height, 0)
        );
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const cardHeight = Math.floor(Math.random() * 100) + 50; // generate random height between 50 and 150px
        addCardToColumn({ ...card, height: cardHeight }, shortestColumnIndex);
    });

    return (
        <div className="grid grid-cols-4 gap-4 text-black">
            {columns.map((column, i) => (
                <div key={i}>
                    {column.map((card) => (
                        <div className="flex flex-col border my-6">
                            <div className="h-8 flex items-center justify-between bg-gray-200 px-4 py-2">
                                <h2 className="text-lg font-bold">Card Title</h2>
                            </div>
                            {/* <div className="flex-grow overflow-y-auto p-4"> */}
                            <Card content={card.text} />
                            {/* </div> */}
                            <div className="h-8 bg-gray-200 px-4 py-2 flex justify-end">
                                <button className="text-red-600 font-bold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MasonryLayout;    