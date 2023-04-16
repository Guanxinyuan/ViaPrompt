import { renderToStaticMarkup } from 'react-dom/server';

const isParsable = (text) => {
    try {
        JSON.parse(text)
        return true
    } catch (e) {
        return false
    }
}

const cleanText = (text) => {
    const matches = text.match(/{/g);

    if (matches > 1) {
        return new Error('Optimize task format is incorrect.')
    }

    const regex = /{([^}]+)}/g;
    let result = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        result.push(match[1]);
    }

    return result.join(' ');
}

const parseOptimize = (text) => {
    const parsedAnswer = cleanText(text)
    return parsedAnswer
}

export const formatAnswer = (answer) => {
    if (!isParsable(answer)) {
        return answer
    } else {
        const parsedJson = JSON.parse(answer)
        if (typeof parsedJson === 'string') {
            return parsedJson
        }
        return renderToStaticMarkup(
            <div className="flex flex-col gap-1">
                {
                    Object.entries(parsedJson).map(([key, value]) => {
                        return (
                            <div key={key} className="flex mb-1 items-start gap-2">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-zinc-700 rounded-md">{key}</span>
                                <span className="flex-grow">{value}</span>
                            </div>
                        );
                    })

                }
            </div>
        )
    }
}

const parseTemplate = (text) => {
    return text
}

export const parseAnswer = (task, text) => {
    switch (task) {
        case 'optimize':
            return parseOptimize(text)
        // case 'explain':
        //     return parseExplain(text)
        case 'template':
            return parseTemplate(text)
    }
}
