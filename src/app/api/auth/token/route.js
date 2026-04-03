import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Endpoint to retrieve the current accessToken for SignalR Hub connectivity.
 * Returns only the token value to be used in the ?access_token= query parameter.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No active session' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
