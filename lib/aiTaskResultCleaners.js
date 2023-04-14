const isParsable = (text) => {
    try {
        JSON.parse(text)
        return true
    } catch (e) {
        return false
    }
}

const extractJsonString = (text) => {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        return text.substring(jsonStart, jsonEnd + 1);
    }
    return '';
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

export const cleanJsonToHtml = (text) => {
    const jsonString = extractJsonString(text);
    if (!isParsable(jsonString)) {
        return text;
    }

    const parsedJson = JSON.parse(jsonString);

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

    return newContentDict;
};
