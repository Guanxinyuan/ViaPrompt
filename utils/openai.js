export const optimizePrompt = async (originalPrompt) => {
    console.log('optimizePrompt ' + originalPrompt);
}

export const decomposePrompt = async (originalPrompt) => {
    console.log('decomposePrompt ' + originalPrompt);
}

export const templatePrompt = async (originalPrompt) => {
    console.log('templatePrompt ' + originalPrompt);
}

export const operatePrompt = async (originalPrompt, mode) => {
    switch (mode) {
        case 'Optimize': return await optimizePrompt(originalPrompt); break;
        case 'Decompose': return await decomposePrompt(originalPrompt); break;
        case 'Template': return await templatePrompt(originalPrompt); break;
    }
}