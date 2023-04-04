// POST pages/api/cards/create.js

import { pool } from '@/pages/api/db'
import { dummyCards } from '../../../data/cards';
import { generateSnowflake } from '@/utils/snowflake';
import { operatePrompt } from '@/utils/openai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req, res) {
    console.log('req.method', req.method);
    if (req.method === 'POST') {
        try {
            const card_id = generateSnowflake();
            console.log(card_id)
            const { originalPrompt, mode } = JSON.parse(req.body);
            console.log('in create originalPrompt', originalPrompt, 'mode', mode);

            // Operate ChatGPT API
            const apiResult = await operatePrompt(originalPrompt, mode);

            console.log('apiResult', apiResult, 'mode', mode);
            res.status(200).json({ data: apiResult });
            // res.status(201).json({ message: `Create card with ID ${card_id}` });
        } catch (ex) {
            console.error('error occurs', ex.stack);
            res.status(500).json({ message: '/api/cards/create Internal server error' });
        } finally {
            console.log('finally');
        }
    } else {
        res.status(405).end();
    }
}
