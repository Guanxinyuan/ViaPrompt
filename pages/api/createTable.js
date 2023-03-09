// This api route is used to create the table in the database

import { pool } from '@/pages/api/db'

export default async (req, res) => {

    const createMidjourneyTableQuery = `
        CREATE TABLE IF NOT EXISTS midjourney (
            content_id TEXT PRIMARY KEY,
            prompt TEXT NOT NULL,
            type TEXT NOT NULL,
            id_mentioned TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            gc_size NUMERIC NOT NULL,
            gc_width NUMERIC NOT NULL,
            gc_height NUMERIC NOT NULL,
            gc_type TEXT NOT NULL,
            gc_url TEXT NOT NULL,
            model TEXT NOT NULL,
            channel_id TEXT NOT NULL
        )`

    const client = await pool.connect()
    try {
        await client.query(createMidjourneyTableQuery)
        res.status(200).json({ message: 'Table successfully created' });
    } catch (ex) {
        console.log('Failed to create table ' + ex)
    } finally {
        client.release()
    }
}