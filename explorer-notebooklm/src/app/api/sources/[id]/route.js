import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { deleteDocument } from '@/lib/documentProcessor';
import connectDB from '@/lib/mongodb';
import Source from "@/models/Source";


export async function DELETE(request, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { userId } = await request.json();
    const { id: sourceId } = await params;

    await connectDB();

    // Verify ownership
    const source = await Source.findOne({
      _id: sourceId,
      userId,
    });

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    await Source.findOneAndDelete({
      _id: sourceId,
      userId,
    });

    // await deleteDocument(params.id);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete source error:', error);
    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}


export async function GET(request, {params}) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { id: sourceId } = await params;

    await connectDB();

    // Verify ownership
    const notebookSources = await Source.findOne({
      _id: sourceId,
      // userId: session.user.id,
    });

    if (!notebookSources) {
      return NextResponse.json({ error: 'Sources not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      data: notebookSources,
      message: 'Sources fetch successfully' 
    });
  } catch (error) {
    console.error('Get sources error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}


export async function PATCH(request, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { id: sourceId } = await params;
    const { name, description, sourceType } = await request.json();

    await connectDB();

    // Verify ownership
    const source = await Source.findOne({
      _id: sourceId,
      // userId: session.user.id,
    });

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    source.name = name || source.name;
    source.description = description || source.description;
    source.sourceType = sourceType || source.sourceType;

    await source.save();

    return NextResponse.json({ message: 'Source updated successfully', source });
  } catch (error) {
    console.error('Update source error:', error);
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}