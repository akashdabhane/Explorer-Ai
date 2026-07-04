import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notebook from '@/models/Notebook';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notebook = await Notebook.findOne({
      _id: params.id,
      userId: session.user.id,
    }).select('conversationHistory');

    if (!notebook) {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      conversationHistory: notebook.conversationHistory || [] 
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notebook = await Notebook.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: { conversationHistory: [] } },
      { new: true }
    );

    if (!notebook) {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Conversation cleared successfully' 
    });
  } catch (error) {
    console.error('Clear conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    );
  }
}
