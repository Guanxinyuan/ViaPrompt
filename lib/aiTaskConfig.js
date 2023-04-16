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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: `You're a prompt engineer. You will help me decompose prompts to various categories for an ai art generator called Midjourney.

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
            
            Remember, all components should directly quote the given prompt.`,
                    userMessage: `Decompose the Midjourney prompt: {text}`,
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}}
                    Your task: Decompose the given user input into individual attributes for Midjourney, an image generation AI model. Extract and quote: main_object, medium (keywords), style (keywords), artists (keywords), lighting (keywords), colors (keywords), camera (keywords), perspective (keywords), scale (keywords). If absent, mark as N/A. Respond in JSON format without brackets. All attributes should directly quote the given user input`,
                },
                cleanResult: cleanTextToJson,
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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `"User input: {{text}}
                    Analyze the user input provided and extract unique, concise information for: task_description (main goal), desired_outcome (specific deliverables), key_steps (list), constraints, examples, relevant_terminology, additional_info. If absent, mark as N/A. Respond in JSON format, using brief quotes directly from the user input."`,
                },
                cleanResult: cleanTextToJson,
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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `"User input: {{text}}
                    Analyze the user input provided and extract unique, concise information for: task_description (main goal), desired_outcome (specific deliverables), key_steps (list), constraints, examples, relevant_terminology, additional_info. If absent, mark as N/A. Respond in JSON format, using brief quotes directly from the user input."`,
                },
                cleanResult: cleanTextToJson,
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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `"User input: {{text}}
                    Analyze the user input provided and extract unique, concise information for: task_description (main goal), desired_outcome (specific deliverables), key_steps (list), constraints, examples, relevant_terminology, additional_info. If absent, mark as N/A. Respond in JSON format, using brief quotes directly from the user input."`,
                },
                cleanResult: cleanTextToJson,
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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}}
                    Your task: Decompose the given user input into individual attributes for Midjourney, an image generation AI model. Extract and quote: main_object, medium (keywords), style (keywords), artists (keywords), lighting (keywords), colors (keywords), camera (keywords), perspective (keywords), scale (keywords). If absent, mark as N/A. Respond in JSON format without brackets. All attributes should directly quote the given user input`,
                },
                cleanResult: cleanTextToJson,
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
        analyze: {
            'chat': {
                generatePrompt: generateChatPrompt,
                promptInfo: {
                    systemMessage: 'System message for mode1-task1',
                    userMessage: 'User message for mode1-task1',
                },
                cleanResult: cleanTextToJson,
            },
            'completion': {
                generatePrompt: generateCompletionPrompt,
                promptInfo: {
                    prompt: `User input: {{text}}
                    Your task: Decompose the given user input into individual attributes for Midjourney, an image generation AI model. Extract and quote: main_object, medium (keywords), style (keywords), artists (keywords), lighting (keywords), colors (keywords), camera (keywords), perspective (keywords), scale (keywords). If absent, mark as N/A. Respond in JSON format without brackets. All attributes should directly quote the given user input`,
                },
                cleanResult: cleanTextToJson,
            }
        },
    },
};
