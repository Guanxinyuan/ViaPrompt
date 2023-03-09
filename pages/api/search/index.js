// This api route is used to search prompt based on keywords
import { pool } from '@/pages/api/db'

export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:3000')

    const q = req.query.q
    console.log(q)

    try {
        const { rows } = await pool.query(`
        SELECT m1.content_id, m1.prompt, m1.timestamp, m1.gc_url, m1.gc_width, m1.gc_height, m1.model, m1.type
        FROM midjourney m1
        JOIN (
            SELECT prompt, MAX(timestamp) AS max_timestamp
            FROM midjourney
            WHERE prompt LIKE '%${q}%'
            GROUP BY prompt
            LIMIT 50
            ) m2
        ON m1.prompt = m2.prompt AND m1.timestamp = m2.max_timestamp
        ORDER BY m1.timestamp DESC;`)
        res.status(200).json({ data: rows });

    } catch (ex) {
        console.error('error occurs', ex.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
}
