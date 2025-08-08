import { NextRequest, NextResponse } from 'next/server';
import { geminiService, AnalysisRequest } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    
    if (!body.fileContent || !body.fileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await geminiService.analyzeData(body);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
