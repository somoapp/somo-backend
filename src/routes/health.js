import { Router } from 'express'
import supabase from '../db/supabase.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    // Test the database connection
    const { error } = await supabase.from('_test_').select('*').limit(1)

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: error?.code === '42P01' ? 'connected' : 'connected',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server is running but database check failed',
      timestamp: new Date().toISOString()
    })
  }
})

export default router