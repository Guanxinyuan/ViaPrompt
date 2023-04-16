// api/cards/update.js
import { pool } from '@/pages/api/db'

export default function handler(req, res) {

    console.log('req.method', req.method);
    if (req.method === 'PUT') {
        // Update an existing card
        try {
            const { cardId, editedPrompt, task } = JSON.parse(req.body);
            console.log('card_id', cardId, 'editedPrompt', editedPrompt, 'task', task);
            res.status(200).json({ message: `Update card with ID ${cardId}` });
        } catch (ex) {
            console.error('error occurs', ex.stack);
            res.status(500).json({ message: '/api/cards/update Internal server error' });
        } finally {
            console.log('finally');
        }
    } else {
        res.status(405).end();
    }
}
