// This api route is used to query the default gallery of data in HOME page
import { pool } from '@/pages/api/db'

export default async (req, res) => {
    const page = req.query.page || 1;
    console.log('page', page)

    const limit = 50;
    const offset = (page - 1) * limit;

    try {
        const { rows } = await pool.query(`
            SELECT m1.content_id, m1.prompt, m1.timestamp, m1.gc_url, m1.gc_width, m1.gc_height, m1.model, m1.type
            FROM midjourney m1
            JOIN (
                SELECT prompt, MAX(timestamp) AS max_timestamp
                FROM midjourney
                WHERE type = 'upscale'
                GROUP BY prompt
                LIMIT 50 OFFSET ${offset}
                ) m2
            ON m1.prompt = m2.prompt AND m1.timestamp = m2.max_timestamp
            ORDER BY m1.timestamp DESC
`)
        res.status(200).json({ data: rows });
    } catch (ex) {
        console.error('error occurs', ex.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
}

