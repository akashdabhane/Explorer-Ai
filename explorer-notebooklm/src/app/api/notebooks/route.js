import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notebook from '@/models/Notebook';

export async function GET(request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { userId } = await request.json();

    await connectDB();

    const notebooks = await Notebook.find({ userId })
      .sort({ createdAt: -1 });
      
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
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { notebookTitle, description, color, userId } = await request.json();

    if (!notebookTitle) {
      return NextResponse.json(
        { error: 'Notebook title is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const notebook = await Notebook.create({
      // userId: session.user.id,
      userId,
      notebookTitle,
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
