// GET api/cards/getCards.js

import { dummyCards } from '../../../data/cards';

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Get all cards created by user
        try {
            // console.log(dummyCards)
            res.status(200).json({ data: dummyCards });
        } catch (ex) {
            console.error('error occurs', ex.stack);
            res.status(500).json({ message: '/api/cards/getCards Internal server error' });
        } finally {
            console.log('finally');
        }

    } else {
        res.status(405).end();
    }
}
