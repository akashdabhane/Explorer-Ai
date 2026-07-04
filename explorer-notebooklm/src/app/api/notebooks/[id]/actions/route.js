import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import ChunkMetadata from '@/models/ChunkMetadata';
import { constructSummarizePrompt, generateAnswer } from '@/lib/geminiClient';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await request.json();
    
    if (!['summary', 'studyGuide', 'faq', 'timeline'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all chunks for this notebook
    const chunks = await ChunkMetadata.find({
      notebookId: params.id,
      userId: session.user.id,
    })
      .sort({ documentId: 1, chunkIndex: 1 })
      .limit(100) // Limit to prevent token overflow
      .select('content');

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No documents found in this notebook' },
        { status: 404 }
      );
    }

    // Construct prompt
    const prompt = constructSummarizePrompt(chunks, type);

    // Generate result
    const result = await generateAnswer(prompt, [], 0.7);

    return NextResponse.json({ result, type });
  } catch (error) {
    console.error('Generate action error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate result' },
      { status: 500 }
    );
  }
}
