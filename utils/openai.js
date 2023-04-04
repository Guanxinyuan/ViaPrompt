import { pool } from '@/pages/api/db'
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);


export const promptOptimizer = async (originalPrompt) => {
    console.log('originalPrompt ' + originalPrompt);

    const systemPrompt = `You're a prompt engineer. You will help me write a prompt for an AI art generator called Midjourney.

    I will give you short content ideas and your job is to elaborate these into one full, explicit, coherent, and artistic prompt.
    
    The prompt involves illustrating, describing and improving the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Here is a formula you could use:
    
    (main content description insert here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colors reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here)
    
    when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, concise and articulate language. 
    
    Your response should include a json key-value pair for the above attributes, and the final prompt. Make the prompt also an attribute of the json. Do not include word "midjourney" in the final prompt.`

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate a Midjourney prompt: ${originalPrompt}` }
        ],
    });
    return completion.data
}

export const promptDecomposer = async (originalPrompt) => {
    console.log('decomposePrompt ' + originalPrompt);
    const systemPrompt = `You're a prompt engineer. You will help me decompose prompts to various categories for an ai art generator called Midjourney.

    I will provide you with a Midjourney prompt and you will thoroughly, completely decompose it into the following attributes: 
    
    main_object: the main object of the prompt,
    medium (list of keywords): artistic medium and format,
    style (list of keywords): genres and popular culture,
    artists (list of keywords): artist names extracted from the style attribute,
    lighting (list of keywords): the lighting of the view,
    colors (list of keywords): color styles and palettes,
    camera (list of keywords): camera lenses,
    perspective (list of keywords): perspective, positional elements,
    scale (list of keywords): scale
    
    If an attribute is absent from the prompt, leave the value to be N/A. When giving the decomposed prompt, remove the brackets, and output with a json key: value pair.
    
    Remember, all components should directly quote the given prompt.`

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Decompose the Midjourney prompt: ${originalPrompt}` }
        ],
    });
    return completion.data
}

export const promptTemplater = async (originalPrompt) => {
    console.log('templatePrompt ' + originalPrompt);
    return originalPrompt
}

export const operatePrompt = async (originalPrompt, mode) => {
    switch (mode) {
        case 'Optimize': return await promptOptimizer(originalPrompt); break;
        case 'Decompose': return await promptDecomposer(originalPrompt); break;
        case 'Template': return await promptTemplater(originalPrompt); break;
    }
}