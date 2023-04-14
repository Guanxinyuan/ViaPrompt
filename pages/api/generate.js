// This api route is used to depict a prompt from user's input keywords
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-2KPiB8QFCOXogw6TS7cO4TMz",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {

    const { input } = req.query;
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Illustrate a view within 50 words using these words ${input}`,
            max_tokens: 500,
            n: 1,
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