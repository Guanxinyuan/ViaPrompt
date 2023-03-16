// This api route is used to depict a prompt from user's input keywords
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-2KPiB8QFCOXogw6TS7cO4TMz",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {

    const { input, num_results } = req.query;
    console.log(input, num_results)

    console.log(configuration)

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Illustrate a view within 50 words using these words ${input}`,
            max_tokens: 500,
            n: num_results,
            temperature: 0.5,
        });
        console.log(response)
        const idea = response.data.choices[0].text;
        res.status(200).json({ data: idea });
    } catch (ex) {
        console.error('error occurs', ex.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// const axios = require('axios');

// const openaiApiKey = process.env.NEXT_OPENAI_APIKEY; // Replace with your OpenAI API key
// const prompt = 'Once upon a time...';

// export default async (req, res) => {

//     axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//         prompt: prompt,
//         max_tokens: 50,
//     }, {
//         headers: {
//             'Authorization': `Bearer ${openaiApiKey}`,
//             'Content-Type': 'application/json',
//         },
//     })
//         .then((response) => {
//             console.log(response.data.choices[0].text);
//         })
//         .catch((error) => {
//             console.error('Error:', error.stack);
//         });
// }