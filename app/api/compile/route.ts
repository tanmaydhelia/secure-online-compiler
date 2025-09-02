import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { language, code, input } = await request.json();
    
    // Forward request to backend API server
    const response = await fetch('http://56.228.36.109:3001/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language, code, input }),
    });

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'CodeRunner API is running',
    timestamp: new Date().toISOString()
  });
}