import dbConnect from '@/lib/mongo'
import URLHistory from '@/models/URLHistory'

import { ShortenRequest, ShortenResponseBody } from '@/interfaces'
import { NextApiResponse } from 'next'

export default async function login(
	req: ShortenRequest,
	res: NextApiResponse
) {
	await dbConnect
	const history = await URLHistory.find({ username: req.headers['x-user-id'] })
	res.json(history)
}
