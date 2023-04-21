import { cleanCurlyBraces, cleanTextToJson, combineDescAndAttrs } from "./aiTaskResultCleaners";

const generateChatPrompt = ({ systemMessage, userMessage }, userInput) => {
    const formattedUserMessage = userMessage.replace('{text}', userInput);
    return [
        { role: 'system', content: systemMessage },
        { role: 'user', content: formattedUserMessage },
    ];
};

const generateCompletionPrompt = ({ prompt }, userInput) => {
    const formattedPrompt = prompt.replace('{text}', userInput);
    return formattedPrompt;
};

export const aiTaskConfig = {
    midjourney: {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: `You're a prompt engineer. You will help me write a prompt for an AI art generator called Midjourney.

            I will give you short content ideas and your job is to elaborate these into one full, explicit, coherent, and artistic prompt.
            
            The prompt involves illustrating, describing and improving the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Here is a formula you could use:
            
            (main content description insert here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colors reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here)
            
            when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, concise and articulate language. 
            
            Your response should include a json key-value pair for the above attributes, and the final prompt. Make the prompt also an attribute of the json. Do not include word "midjourney" in the final prompt.`,
                    userMessage: `Generate a Midjourney prompt: {text}`,
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}} 
                    1. Create a concise illustration within 40 words using: {user_input} 
                    2. Enhance the illustration with additional details. 
                    3. Incorporate artistic attributes as discrete keywords: (artist names)(medium)(art styles: genres, and popular culture)(lighting)(color palettes). 
                    4. If the illustration is photograph-like, include camera specs. If it's a portrait, painting, or other visual art form, specify viewpoint, angles, or other relevant elements. 
                    5. Combine steps 1-4 into a single, precise paragraph within curly braces: {result} 
                    Return only the result from step 5: {result}`,
                },
                cleanResult: cleanCurlyBraces
            }
        },
    },
    chatgpt: {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User Input: {{text}}
                    Considering the user input provided, your job is to optimize the prompt for ChatGPT by: 
                    1. Focusing on the user input's unique problem or need. 
                    2. Anticipating important points not yet mentioned in the user input. 
                    3. Expanding, reframing, and optimizing the user input based on your understanding. 
                    Use the user input as your main reference, and return the optimized prompt without revealing steps 1-3. Always start your answer with "Here's your optimized instruction:"`,
                },
                cleanResult: ((text) => {
                    const removeString = "Here's your optimized instruction:";
                    const cleanedText = text.replace(removeString, "");
                    return cleanedText.trim();
                }),
            }
        },
    },
    'gpt-3': {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User Input: {{text}}
                    Considering the user input provided, your job is to optimize the prompt for ChatGPT by: 
                    1. Focusing on the user input's unique problem or need. 
                    2. Anticipating important points not yet mentioned in the user input. 
                    3. Expanding, reframing, and optimizing the user input based on your understanding. 
                    Use the user input as your main reference, and return the optimized prompt without revealing steps 1-3. Always start your answer with "Here's your optimized instruction:"`,
                },
                cleanResult: ((text) => {
                    const removeString = "Here's your optimized instruction:";
                    const cleanedText = text.replace(removeString, "");
                    return cleanedText.trim();
                }),
            }
        },
    },
    'gpt-4': {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User Input: {{text}}
                    Considering the user input provided, your job is to optimize the prompt for ChatGPT by: 
                    1. Focusing on the user input's unique problem or need. 
                    2. Anticipating important points not yet mentioned in the user input. 
                    3. Expanding, reframing, and optimizing the user input based on your understanding. 
                    Use the user input as your main reference, and return the optimized prompt without revealing steps 1-3. Always start your answer with "Here's your optimized instruction:"`,
                },
                cleanResult: ((text) => {
                    const removeString = "Here's your optimized instruction:";
                    const cleanedText = text.replace(removeString, "");
                    return cleanedText.trim();
                }),
            }
        },
    },
    dalle: {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}} 

                    Your tasks: 
                    1. Create an illustration within 40 words using: {user_input} 
                    2. Enhance the illustration with additional details. 
                    3. Merge steps 1-2 and form a "description" key:value pair. 
                    4. Integrate artistic attributes as keywords: (artist names)(medium)(art styles)(lighting)(color palettes), and relevant specs (camera or viewpoint/angles). Create a "attributes" key:value pair. 
                    5. Combine step 3 and 4 into a JSON object: {description, attributes} 
                    Return only the result from step 5: {description, attributes}`,
                },
                cleanResult: combineDescAndAttrs,
            }
        },
    },
    'stable-diffusion': {
        optimize: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanCurlyBraces,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}} 

                    Your tasks: 
                    1. Create an illustration within 40 words using: {user_input} 
                    2. Enhance the illustration with additional details. 
                    3. Merge steps 1-2 and form a "description" key:value pair. 
                    4. Integrate artistic attributes as keywords: (artist names)(medium)(art styles)(lighting)(color palettes), and relevant specs (camera or viewpoint/angles). Create a "attributes" key:value pair. 
                    5. Combine step 3 and 4 into a JSON object: {description, attributes} 
                    Return only the result from step 5: {description, attributes}`,
                },
                cleanResult: combineDescAndAttrs,
            }
        },
    },
};
