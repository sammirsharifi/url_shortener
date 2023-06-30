import argon from 'argon2'
import dbConnect from '@/lib/mongo'
import SignupAttempt from '@/models/SignupAttempt'
import User from '@/models/User'

import { NextApiRequest, NextApiResponse } from 'next'

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect
  const { id } = req.body
  const [ongoingSignup] = await SignupAttempt.find({ id })
  if (!ongoingSignup) {
    res.status(400).json({ error: 'Invalid token' })
    return
  }

  const { username, password } = ongoingSignup

  const [existingUser] = await User.find({ username })
  if (existingUser) {
    res.status(400).json({ error: 'User already exists!' })
    return
  }

  const phash = await argon.hash(password)
  try {
    await User.create({ username, password: phash })
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e })
    return
  }
  console.log('user created', username)

  await SignupAttempt.deleteOne({ id })

  res.status(204).end()
}
