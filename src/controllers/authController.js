import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import supabase from '../db/supabase.js'

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password and role are required' })
    }

    // Validate role
    if (!['commuter', 'driver', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be commuter, driver or operator' })
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Save user to database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ name, email, phone, password: hashedPassword, role }])
      .select()
      .single()

    if (error) throw error

    // Generate token
    const token = generateToken(newUser)

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Something went wrong during registration' })
  }
}

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user)

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong during login' })
  }
}

// POST /auth/logout
export const logout = async (req, res) => {
  // JWT is stateless — logout is handled on the client by deleting the token
  res.status(200).json({ message: 'Logged out successfully' })
}