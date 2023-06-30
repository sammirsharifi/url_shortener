import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from './lib/token'

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
  }
}

let redirectToLogin = false
export async function middleware(req: NextRequest) {
  let token: string | undefined

  if (req.cookies.has('jwt')) {
    token = req.cookies.get('jwt')?.value
  } else if (req.headers.get('Authorization')?.startsWith('Bearer ')) {
    token = req.headers.get('Authorization')?.substring(7)
  }

  if (!token) {
    return getErrorResponse(
      401,
      'Unauthorized'
    )
  }

  const res = NextResponse.next()

  try {
    const { sub } = await verifyJWT<{ sub: string }>(token)
    res.headers.set('X-USER-ID', sub)
    ;(req as AuthenticatedRequest).user = { id: sub }
  } catch (error) {
    return getErrorResponse(401, 'Unauthorized')
  }

  const authUser = (req as AuthenticatedRequest).user

  if (!authUser) {
    return getErrorResponse(401, 'Unauthorized')
  }
  return res
}

export const config = {
  matcher: [
    '/api/((?!login|signup|verify-email|_next/static|_next/image|favicon.ico).*)',
  ]
}

function getErrorResponse(
  status: number = 500,
  message: string,
  errors: any = null
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? 'fail' : 'error',
      message,
      errors: errors || undefined
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
