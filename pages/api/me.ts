import User from '@/models/User'
import dbConnect from '@/lib/mongo'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.headers['x-user-id']

  if (!userId) {
    res.status(401)
  }

  try {
    await dbConnect
    const [user] = await User.find({ username: userId })
    if (!user) {
      res.status(401).end()
      return
    }
    res.json({ user: { ...user, password: undefined } })
  } catch (e: any) {
    console.log(e)
    res.status(e.status || 500).end()
  }
}
