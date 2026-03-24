import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'Search endpoint working',
      query: body.query || 'no query provided'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process search' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  return NextResponse.json({ 
    message: 'Search endpoint ready',
    query: query || 'no query provided'
  });
}
