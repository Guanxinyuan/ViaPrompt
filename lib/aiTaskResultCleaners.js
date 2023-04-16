export const parseJsonFromText = (text) => {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        try {
            const parsedJson = JSON.parse(jsonString);
            return parsedJson;
        } catch (error) {
            throw new Error('Cannot parse a valid JSON string from text');
        }
    }
    throw new Error('Cannot extract a valid JSON string from text');
};

export const cleanCurlyBraces = (text) => {
    const matches = text.match(/{/g);

    if (matches > 1) {
        return ''
    }

    const regex = /{([^}]+)}/g;
    let result = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        result.push(match[1]);
    }

    return result.join(' ');
}

export const cleanTextToJson = (text) => {
    const parsedJson = parseJsonFromText(text);
    const newContentDict = Object.entries(parsedJson)
        .filter(([key, value]) => value !== null && !['', 'N/A', 'null', 'undefined'].includes(value))
        .reduce((acc, [key, value]) => {
            const newKey = key
                .split('_')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
            const newValue = Array.isArray(value) ? value.join(', ') : value;
            acc[newKey] = newValue;
            return acc;
        }, {});

    return JSON.stringify(newContentDict);
};


export const combineDescAndAttrs = (text) => {
    const jsonObj = parseJsonFromText(text)
    const { description, attributes } = jsonObj;

    if (!description || !attributes) {
        throw new Error('JSON object does not contain both "description" and "attributes" keys');
    }

    const descriptionTrimmed = description.trim();
    const attributesString = Object.values(attributes)
        .map((value) => value.trim())
        .join(', ');

    const result = `${descriptionTrimmed} ${attributesString}`;
    return result;
}