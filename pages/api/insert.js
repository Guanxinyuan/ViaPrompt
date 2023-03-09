// This api route is used to process the raw data & insert data into the database

import { pool } from '@/pages/api/db'
import { processMidjourneyData } from "@/utils/backend";

export default async (req, res) => {

    const filepath = req.query.filepath
    dataProcessed = await processMidjourneyData(filepath)

    const client = await pool.connect()
    try {
        // await dataProcessed.map(async (d) => {
        //     await client.query('INSERT INTO midjourney VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (content_id) DO NOTHING;', Object.values(d))
        // })
        res.status(200).json({ message: 'Data successfully inserted' })
        console.log('Insertion success')
    } catch (ex) {
        console.log('Failed to execute query ' + ex)
        res.status(500).json({ message: 'Failed to insert data ' + ex })
    } finally {
        client.release()
    }
}