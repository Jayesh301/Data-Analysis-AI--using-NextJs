import { NextRequest, NextResponse } from 'next/server';
import { geminiService, QueryRequest } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json();
    
    if (!body.query || !body.analysisData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await geminiService.processQuery(body);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Query API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
