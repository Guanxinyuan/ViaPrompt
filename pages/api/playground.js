import { pool } from '@/pages/api/db'

export default async (req, res) => {
    try {
        console.log('query is ', req.query.query)
        const { rows } = await pool.query(req.query.query)
        res.status(200).json({ data: rows })
    } catch (ex) {
        console.log('Failed to execute query ' + ex.stack)
    }
}