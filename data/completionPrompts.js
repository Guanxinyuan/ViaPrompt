export const getCompletionPrompt = ({ model, task, prompt }) => {
    const completionPrompts = {
        midjourney: {
            optimize: {
                systemPrompt: `Step 1: illustrate a picture within 40 words using: ${prompt}
                Step 2: Add more details into your illustration. 
                Step 3: Then, append some artistic attribute keywords to the view. You should reference these attributes: (in the style of artist names)(artistic medium)(art styles: genres, and popular culture )(lighting)(color styles, palettes)(cameras, specific lenses, shot types or positional elements) . 
                Step 4: Concat the results of step 1, 2, 3 into ONE single, concise, precise paragraph. Wrap the paragraph with curly braces 
                Step 5: Return only the result of step 4. Do not give any extra text or punctuation outside of the curly braces. Only return the result of step 4. Only return one result.`
            },
            explain: {
                systemPrompt: `You're a prompt engineer. You will help me decompose prompts to various categories for an ai art generator called Midjourney.

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
            }
        },
        test: {
            translate: {
                systemPrompt: "You're a English to French translater."
            },
        }
    }
    return completionPrompts[model][task].systemPrompt
}