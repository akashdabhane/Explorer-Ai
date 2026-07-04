import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notebook from '@/models/Notebook';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notebooks = await Notebook.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('-conversationHistory');

    return NextResponse.json({ notebooks });
  } catch (error) {
    console.error('Get notebooks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notebooks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, color } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const notebook = await Notebook.create({
      userId: session.user.id,
      title,
      description: description || '',
      color: color || '#3b82f6',
    });

    return NextResponse.json({ notebook }, { status: 201 });
  } catch (error) {
    console.error('Create notebook error:', error);
    return NextResponse.json(
      { error: 'Failed to create notebook' },
      { status: 500 }
    );
  }
}
