import { Router } from 'express'
import supabase from '../db/supabase.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    // Test by checking all 5 tables exist
    const tables = ['users', 'operators', 'buses', 'routes', 'bus_positions']
    const checks = await Promise.all(
      tables.map(table => supabase.from(table).select('*').limit(1))
    )

    const results = tables.reduce((acc, table, i) => {
      acc[table] = checks[i].error ? '❌ error' : '✅ connected'
      return acc
    }, {})

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: results
    })
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      message: err.message,
      timestamp: new Date().toISOString()
    })
  }
})

export default router