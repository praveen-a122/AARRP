import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export async function POST() {
  try {
    const refreshToken = cookies().get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: 'No refresh token cookie found.' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/admin/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    }).catch(async () => {
      // Fallback verification if /refresh endpoint is different
      return fetch(`${API_BASE_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
    });

    if (!backendResponse.ok) {
      cookies().delete('refresh_token');
      return NextResponse.json(
        { detail: 'Refresh session expired or invalid.' },
        { status: 401 }
      );
    }

    const data = await backendResponse.json();
    const newAccessToken = data.access_token || refreshToken;
    const user = data.user || data || { id: 'admin-id', username: 'admin', role: 'admin' };

    if (data.refresh_token) {
      cookies().set({
        name: 'refresh_token',
        value: data.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json({
      access_token: newAccessToken,
      token_type: 'bearer',
      user,
    });
  } catch (error) {
    console.error('Refresh proxy route error:', error);
    return NextResponse.json(
      { detail: 'Internal server error during token refresh.' },
      { status: 500 }
    );
  }
}
