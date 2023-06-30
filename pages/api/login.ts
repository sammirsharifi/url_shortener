import { NextApiResponse } from 'next'
import dbConnect from '@/lib/mongo'
import User from '@/models/User'
import { LoginRequest } from '../../interfaces'
import argon from 'argon2'
import { signJWT } from '@/lib/token'
import { serialize } from 'cookie'

export default async function Login(req: LoginRequest, res: NextApiResponse) {
  await dbConnect
  const { username, password } = req.body
  const [user] = await User.find({ username })
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials!' })
    return
  }
  if (!(await argon.verify(user.password, password))) {
    res.status(401).json({ error: 'Invalid credentials!' })
  }
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

  const token = await signJWT({ sub: username }, { exp: `${JWT_EXPIRES_IN}m` })

  const tokenMaxAge = +(JWT_EXPIRES_IN as string) * 60
  res.setHeader(
    'Set-Cookie',
    serialize('jwt', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: tokenMaxAge
    })
  )
  res.status(204).end()
}
