/**
 * Client for the local /api/ai-recommendations endpoint (server/index.js),
 * which asks Claude for a personalized, consultant-voiced report grounded in
 * the submitted audit answers.
 */
export async function fetchPersonalizedRecommendations(formData) {
  const response = await fetch('/api/ai-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formData }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed with status ${response.status}`)
  }

  return response.json()
}
