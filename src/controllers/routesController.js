import supabase from '../db/supabase.js'

// GET /routes — returns all active routes (no stops, keep response small)
export const getAllRoutes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('id, name, active, created_at')
      .eq('active', true)
      .order('name', { ascending: true })

    if (error) throw error

    res.status(200).json({
      count: data.length,
      routes: data
    })
  } catch (err) {
    console.error('getAllRoutes error:', err.message)
    res.status(500).json({ error: 'Failed to fetch routes' })
  }
}

// GET /routes/:id — returns one route with full stop data
export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('routes')
      .select('*, operators(company_name)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Route not found' })
    }

    res.status(200).json({ route: data })
  } catch (err) {
    console.error('getRouteById error:', err.message)
    res.status(500).json({ error: 'Failed to fetch route' })
  }
}