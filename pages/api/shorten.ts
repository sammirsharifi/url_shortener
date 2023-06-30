import dbConnect from '@/lib/mongo'
import URLHistory from '@/models/URLHistory'

import { ShortenRequest, ShortenResponseBody } from '@/interfaces'
import { NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

export default async function login(
	req: ShortenRequest,
	res: NextApiResponse
) {
	await dbConnect
	const { url } = req.body
	if (!process.env.SHORTENER_URL) {
		throw new Error('Shortener URL not available')
	}
	try {
		const shortenerResult = await axios.post(process.env.SHORTENER_URL, url, {
			headers: { apikey: process.env.API_KEY }
		})
		const data: ShortenResponseBody = shortenerResult?.data
		if (!data) {
			res.status(503).json({ error: 'got invalid response from service' })
			return
		}
		await URLHistory.create({
			username: req.headers['x-user-id'],
			longURL: shortenerResult.data.long_url,
			shortURL: shortenerResult.data.short_url,
		})
		res.json({
			...shortenerResult.data,
			hash: undefined,
		})
	} catch (e: AxiosError | any) {
		//@ts-ignore
		const { message } = e.response?.data || {}
		console.log(e.response?.status, message)
		if (e.response?.status && message) {
			res.status(e.response?.status).json({
				error: message
			})
		}
		return
	}
}
