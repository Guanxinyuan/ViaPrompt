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

const parseExplain = (text) => {
    if (!isParsable(text)) {
        return text
    } else {
        const parsedJson = JSON.parse(text)
        // console.log(`in parseExplain, parsedJson: ${parsedJson}`)
        const parsedContentPairs = Object.keys(parsedJson).map((key) => {
            if (parsedJson[key] !== null) {
                const newKey = key.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
                const value = Array.isArray(parsedJson[key]) ? parsedJson[key].join(", ") : parsedJson[key];
                return [newKey, value];
            }
        })

        const newContentDict = {};
        for (let i = 0; i < parsedContentPairs.length; i++) {
            if (parsedContentPairs[i]) {
                newContentDict[parsedContentPairs[i][0]] = parsedContentPairs[i][1];
            }
        }
        const filteredContentDict = Object.fromEntries(
            Object.entries(newContentDict).filter(([key, value]) => {
                const emptyList = [null, undefined, '', 'N/A', "null", "undefined"]
                return emptyList.includes(value) ? null : value
            })
        )

        return renderToStaticMarkup(
            <div className="flex flex-col gap-1">
                {
                    Object.keys(filteredContentDict).map((key) => {
                        return (
                            <div key={key} className="flex mb-1 items-start gap-2">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-zinc-700 rounded-md">{key}</span>
                                <span className="flex-grow">{newContentDict[key]}</span>
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
        case 'explain':
            return parseExplain(text)
        case 'template':
            return parseTemplate(text)
    }
}
