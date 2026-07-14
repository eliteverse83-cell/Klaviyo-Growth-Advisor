import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { generateConsultantReport } from './services/consultantReport.js'

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(express.json({ limit: '256kb' }))

app.post('/api/ai-recommendations', async (req, res) => {
  const { formData } = req.body ?? {}

  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return res.status(400).json({ error: 'Missing formData in request body.' })
  }

  try {
    const report = await generateConsultantReport(formData)
    res.json(report)
  } catch (error) {
    if (error.message?.includes('Could not resolve authentication method')) {
      console.error('Anthropic client misconfigured:', error.message)
      return res
        .status(503)
        .json({ error: 'AI recommendations are not configured on this server.' })
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Anthropic authentication error:', error.message)
      return res
        .status(503)
        .json({ error: 'AI recommendations are not configured on this server.' })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(429).json({ error: 'AI service is busy — please try again shortly.' })
    }
    // In the TypeScript/JS SDK, APIConnectionError is a subclass of APIError,
    // so it must be checked first or it would be swallowed by the next branch.
    if (error instanceof Anthropic.APIConnectionError) {
      console.error('Anthropic connection error:', error.message)
      return res.status(502).json({ error: 'Could not reach the AI service.' })
    }
    if (error instanceof Anthropic.APIError) {
      console.error('Anthropic API error:', error.status, error.message)
      return res.status(502).json({ error: 'AI service returned an error.' })
    }
    console.error('Unexpected error generating consultant report:', error)
    res.status(500).json({ error: 'Something went wrong generating recommendations.' })
  }
})

app.listen(PORT, () => {
  console.log(`GrowthPilot AI backend listening on http://localhost:${PORT}`)
})
