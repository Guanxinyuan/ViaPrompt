// Import the OpenAI SDK
// const openai = require("openai");
// openai.apiKey = process.env.OPENAI_API_KEY;

import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
    runtime: "edge",
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            // const { prompt, max_tokens, model } = req.body;
            const { prompt, max_tokens, model } = JSON.parse(await req.text());
            console.log('in testPrompts: prompt', prompt, 'max_tokens', max_tokens, 'model', model)

            // Call OpenAI API
            const startTime = Date.now();
            let response = 'answer'
            switch (model) {
                case "chat": response = await fetchChat(prompt, max_tokens); break;
                case "completion": response = await fetchCompletion(prompt, max_tokens); break;
            }
            const executionTime = Date.now() - startTime;

            // Replace with dummy data for demonstration purposes
            // const response = { choices: [{ text: "Sample response" }] };

            // Return the result and execution time
            console.log('in testPrompts: response', response, 'executionTime', executionTime)
            return NextResponse.json({
                success: true,
                data: {
                    answer: typeof response == 'string' ? response : response.choices[0].text,
                    executionTime: executionTime,
                }
            });
        } catch (error) {
            console.error("Error in /api/test/testPrompts", error.stack);
            return NextResponse.json({ success: false, error: error.message });
        }
    } else {
        return NextResponse.json({ success: false, error: "Method not allowed" });
    }
}


const fetchChat = async (prompt, max_tokens) => {
    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: prompt },
        ],
        max_tokens: parseInt(max_tokens),
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
        },
        body: JSON.stringify(payload),
    })

    const json = await response.json()
    return json.choices[0].message.content
}


const fetchCompletion = async (prompt, max_tokens) => {
    const payload = {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: parseInt(max_tokens)
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_APIKEY,
        },
        body: JSON.stringify(payload),
    })

    const json = await response.json()
    return json.choices[0].text

    // const response = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: prompt,
    //     max_tokens: parseInt(max_tokens),
    //     n: 1,
    //     temperature: 0.5,
    // });
    // console.log(response)
    // const idea = response.data.choices[0].text;
    // return idea;
}
