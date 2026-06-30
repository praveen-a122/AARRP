import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export async function POST() {
  try {
    const refreshToken = cookies().get('refresh_token')?.value;

    if (refreshToken) {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      }).catch(() => {});
    }

    cookies().delete('refresh_token');

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout proxy route error:', error);
    cookies().delete('refresh_token');
    return NextResponse.json({ success: true, message: 'Logged out locally.' });
  }
}
