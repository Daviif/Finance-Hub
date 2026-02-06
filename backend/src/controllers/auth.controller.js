import { findUserByEmail, updateUserPassword } from '../repositories/users.repository.js'
import { 
  createPasswordResetToken, 
  findValidResetToken, 
  markTokenAsUsed,
  invalidateAllUserTokens,
  getTokenInfo
} from '../repositories/password-reset.repository.js'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

// Configurar o transporte de email (usar variáveis de ambiente)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// --- FORGOT PASSWORD ---
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' })
    }

    const user = await findUserByEmail(email)

    // Por segurança, não revelamos se o email existe ou não
    if (!user) {
      return res.status(200).json({ 
        message: 'Se o email está registrado, você receberá um link de recuperação' 
      })
    }

    // Criar token de reset de senha
    const resetToken = await createPasswordResetToken(user.id, 1) // 1 hora de validade

    // Log para testes (remover em produção)
    console.log(`\n🔐 TOKEN DE RESET CRIADO`)
    console.log(`   Email: ${email}`)
    console.log(`   Token: ${resetToken.token}`)
    console.log(`   Expira em: ${resetToken.expires_at}`)
    console.log(`   URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}\n`)

    // Construir link de reset (ajustar a URL do frontend conforme necessário)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}`

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha - Finance Hub',
      html: `
        <h2>Olá ${user.username}!</h2>
        <p>Você solicitou uma recuperação de senha. Clique no link abaixo para resetar sua senha:</p>
        <p>
          <a href="${resetLink}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">
            Resetar Senha
          </a>
        </p>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${resetLink}</p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return res.status(200).json({ 
      message: 'Se o email está registrado, você receberá um link de recuperação' 
    })

  } catch (error) {
    console.error('Erro no forgot password:', error)
    return res.status(500).json({ message: 'Erro ao processar solicitação de recuperação' })
  }
}

// --- RESET PASSWORD ---
export async function resetPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nova senha são obrigatórios' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' })
    }

    // Verificar se o token é válido
    const resetToken = await findValidResetToken(token)

    if (!resetToken) {
      return res.status(401).json({ message: 'Token inválido ou expirado' })
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Atualizar senha do usuário
    await updateUserPassword(resetToken.user_id, passwordHash)

    // Marcar token como utilizado
    await markTokenAsUsed(resetToken.id)

    return res.status(200).json({ message: 'Senha alterada com sucesso!' })

  } catch (error) {
    console.error('Erro no reset password:', error)
    return res.status(500).json({ message: 'Erro ao resetar senha' })
  }
}

// --- VALIDAR TOKEN ---
export async function validateTokenController(req, res) {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Token é obrigatório', valid: false })
    }

    const resetToken = await findValidResetToken(token)

    if (!resetToken) {
      return res.status(200).json({ 
        message: 'Token inválido ou expirado', 
        valid: false 
      })
    }

    return res.status(200).json({ 
      message: 'Token válido',
      valid: true,
      expiresAt: resetToken.expires_at
    })

  } catch (error) {
    console.error('Erro ao validar token:', error)
    return res.status(500).json({ message: 'Erro ao validar token', valid: false })
  }
}

// --- REVOGAR TOKEN ---
export async function revokeTokenController(req, res) {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Token é obrigatório' })
    }

    const tokenInfo = await getTokenInfo(token)

    if (!tokenInfo) {
      return res.status(404).json({ message: 'Token não encontrado' })
    }

    // Invalidar o token
    await markTokenAsUsed(tokenInfo.id)

    return res.status(200).json({ message: 'Token revogado com sucesso' })

  } catch (error) {
    console.error('Erro ao revogar token:', error)
    return res.status(500).json({ message: 'Erro ao revogar token' })
  }
}
