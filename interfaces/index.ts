import { AxiosResponse } from 'axios'
import { NextApiRequest } from 'next'

export interface LoginRequest extends NextApiRequest {
  body: {
    username: string,
    password: string
  }
}

export interface User {
  username: string,
  password: string,
}

export interface ShortenRequest extends NextApiRequest {
  body: {
    url: string
  }
}

export interface ShortenResponseBody extends AxiosResponse {
  long_url: string,
  short_url: string
}
