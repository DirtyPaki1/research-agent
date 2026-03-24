import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'RAG endpoint working' });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'RAG endpoint ready' });
}
