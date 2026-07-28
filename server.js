import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import healthRouter from './src/routes/health.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/status', healthRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on our end' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚌 Somo backend running on port ${PORT}`)
})