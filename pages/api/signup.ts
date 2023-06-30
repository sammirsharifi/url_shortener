import argon from 'argon2'
import dbConnect from '@/lib/mongo'
import SignupAttempt from '@/models/SignupAttempt'
import User from '@/models/User'

import Mailgun from 'mailgun.js'
import formData from 'form-data'

const mailgun = new Mailgun(formData)

const {
  MAILGUN_USERNAME: mgUser,
  MAILGUN_KEY: mgKey,
  MAILGUN_DOMAIN: mgDomain
} = process.env

const mg = mailgun.client({
  username: mgUser as string,
  key: mgKey as string
})

import crypto from 'crypto'

import { NextApiResponse } from 'next'
import { LoginRequest } from '@/interfaces'

export default async function signup(
  req: LoginRequest,
  res: NextApiResponse
) {
  await dbConnect
  const { username, password } = req.body

  const [existingUser] = await User.find({ username })
  if (existingUser) {
    res.status(400).json({ error: 'User already exists!' })
    return
  }

  const [existingSignupAttempt] = await SignupAttempt.find({ username })
  if (existingSignupAttempt) {
    res.status(400).json({ error: 'Signup verification email already sent!' })
    return
  }

  const randomBytes = crypto.randomBytes(48)
  const randomToken = randomBytes.toString('hex')
  const signupId = await argon.hash(`${username}${password}${randomToken}`)

  try {
    const verificationMail = await mg.messages
      .create(mgDomain as string, {
        from: `Mailgun Sandbox <postmaster@${mgDomain}>`,
        to: [username],
        subject: "URL Shortener verification",
        text: 'Click on the following link to complete your signup, ' +
        'note that this link will expire in 1 hour' +
        `\n${process.env.HOST}/verify-email/${encodeURIComponent(signupId)}`,
      })
    if (verificationMail.status !== 200) {
      throw new Error(verificationMail.message)
    }

    try {
      await SignupAttempt.create({
        id: signupId,
        username,
        password,
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'Unknown error' })
      return
    }

    res.json({
      message: `Verification email sent to ${username}`
    })

  } catch (e: any) {
    console.log(e)
    res.status(e.status || 500).json({ error: e.message || 'Unknown error' })
  }
}
