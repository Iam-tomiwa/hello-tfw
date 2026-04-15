import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json()
    const isHer = passcode === process.env.HER_PASSCODE
    const isAdmin = passcode === process.env.ADMIN_PASSCODE

    if (isHer || isAdmin) {
      return NextResponse.json({ valid: true, role: isHer ? 'her' : 'admin' })
    }

    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
