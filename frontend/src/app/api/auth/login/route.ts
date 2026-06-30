import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { detail: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        detail: 'Authentication failed. Please check your credentials.',
      }));
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token || data.access_token;
    const user = data.user || { id: 'admin-id', username, role: 'admin' };

    // Set refresh token as secure HttpOnly cookie
    cookies().set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      access_token: accessToken,
      token_type: data.token_type || 'bearer',
      user,
    });
  } catch (error) {
    console.error('Login proxy route error:', error);
    return NextResponse.json(
      { detail: 'Internal server error during authentication proxying.' },
      { status: 500 }
    );
  }
}
