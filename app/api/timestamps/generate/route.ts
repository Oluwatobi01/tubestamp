import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Placeholder endpoint to satisfy Next.js module requirements during build.
// TODO: Implement timestamp generation logic.
export async function POST() {
  return NextResponse.json(
    { error: 'Not implemented', message: 'timestamps/generate is not implemented yet' },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: 'timestamps/generate endpoint placeholder' },
    { status: 200 }
  );
}
