import { Pool } from "pg";

// Localhost postgresql database
// export const pool = new Pool({
//   user: 'postgres',
//   password: 'gxy69344310',
//   host: 'localhost',
//   port: 5432,
//   database: 'test'
// })

// RDS postgresql database
// export const pool = new Pool({
//   user: 'postgres',
//   password: 'gxy69344310',
//   host: 'db-prompt-database.c74p8vljt3zw.us-east-2.rds.amazonaws.com',
//   port: 5432,
//   database: 'postgres',
//   query_timeout: 60000 // 60 seconds timeout
// })


// Supabase postgresql database
export const pool = new Pool({
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  host: process.env.SUPABASE_HOST,
  port: process.env.SUPABASE_PORT,
  database: process.env.SUPABASE_DATABASE,
})

