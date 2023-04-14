import { chatMessages } from '@/data/chatMessages'
import { getCompletionPrompt } from '@/data/completionPrompts'
import { parseAnswer } from '@/utils/parseAnswer'
import { aiTaskConfig } from '@/lib/aiTaskConfig'

const fetchOpenAI = async (url, payload) => {

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  return json;
};


const callChatAPI = async (messages, maxTokens) => {
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: 0.5,
    max_tokens: parseInt(maxTokens),
  };

  const url = 'https://api.openai.com/v1/chat/completions';
  const json = await fetchOpenAI(url, payload);

  return json.choices[0].message.content;
};

const callCompletionAPI = async (prompt, maxTokens) => {
  const payload = {
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.5,
    max_tokens: parseInt(maxTokens),
  };

  const url = 'https://api.openai.com/v1/completions';
  const json = await fetchOpenAI(url, payload);

  return json.choices[0].text;
};

const callAPI = async ({ prompt, maxTokens, type }) => {
  switch (type) {
    case 'chat': return await callChatAPI(prompt, maxTokens); // prompt refers to messages of chat model
    case 'completion': return await callCompletionAPI(prompt, maxTokens);
    default: throw new Error(`Invalid task type: ${task.type}`);
  }
};

export const executeMode = async ({ model, mode, userInput, maxTokens, type }) => {
  try {

    // Get the task information and prompt generation function
    const modeInfo = aiTaskConfig[model][mode][type];
    const generatePromptFunction = modeInfo.generatePrompt;
    const promptInfo = modeInfo.promptInfo;
    const cleanResultFunction = modeInfo.cleanResult;

    // Generate the prompt for the specific task, including the user input
    const formattedPrompt = generatePromptFunction(promptInfo, userInput);

    // Call the API and get the result
    const rawResult = await callAPI({ prompt: formattedPrompt, maxTokens, type });

    // Clean the result using the appropriate clean function
    const cleanedResult = cleanResultFunction(rawResult);

    return cleanedResult;
  } catch (error) {
    console.error('In executeMode: ', error);
    throw new Error('In executeMode: ', error);
  }
};


// export const operatePromptByChat = async (mode, model, prompt, maxTokens) => {

//   // If mode is template, return the prompt
//   if (mode === 'template') {
//     return prompt
//   }

//   // If mode is not template, call OpenAI API
//   const { systemMessage, userMessage } = chatMessages[model][mode];
//   const formattedUserMessage = `${userMessage}${prompt}`;
//   const messages = [
//     { role: 'system', content: systemMessage },
//     { role: 'user', content: formattedUserMessage },
//   ]

//   try {
//     const json = await fetchChat(messages, maxTokens);
//     return json;
//   } catch (error) {
//     console.error('In operatePromptByChat: ', error);
//     throw error;
//   }
// };


// export const operatePromptByCompletion = async ({ mode, model, prompt, maxTokens }) => {

//   // If mode is template, return the prompt
//   if (mode === 'template') {
//     return prompt
//   }

//   // If mode is not template, call OpenAI API
//   const props = { mode, model, prompt };
//   const formattedPrompt = getCompletionPrompt(props);

//   try {
//     const result = await fetchCompletion(formattedPrompt, maxTokens);
//     const answer = parseAnswer(result);
//     return answer;
//   } catch (error) {
//     console.error('In operatePromptByCompletion: ', error);
//     throw error;
//   }
// }