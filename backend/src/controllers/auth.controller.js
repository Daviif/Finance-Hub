import bcrypt from 'bcrypt'
import { findUserByEmail } from '../repositories/auth.repository.js'

export async function loginController(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' })
    }

    // nunca retornar password_hash
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao realizar login' })
  }
}
