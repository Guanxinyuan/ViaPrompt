// api/cards/delete.js

import { pool } from '@/pages/api/db'

export default function handler(req, res) {
    if (req.method === 'DELETE') {
        // Delete a card
        try {
            const { cardId } = JSON.parse(req.body);
            res.status(200).json({ message: `Delete card with ID ${cardId}` });
        } catch (ex) {
            console.error('error occurs', ex.stack);
            res.status(500).json({ message: '/api/cards/delete Internal server error' });
        } finally {
            console.log('finally');
        }
    } else {
        res.status(405).end();
    }
}
