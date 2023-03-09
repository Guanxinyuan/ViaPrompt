// This api route is used to query the sibling images
import { pool } from '@/pages/api/db'

export default async (req, res) => {
    const prompt = decodeURIComponent(req.query.prompt)
    console.log(prompt)

    try {
        const { rows } = await pool.query(`
            SELECT content_id, prompt, gc_url, timestamp, model, type, gc_width, gc_height
            FROM midjourney
            WHERE prompt = '${prompt}';`)
        res.status(200).json({ data: rows });
    } catch (ex) {
        console.error('error occurs', ex.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
}

