import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { deleteDocument } from '@/lib/documentProcessor';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify ownership
    const document = await Document.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await deleteDocument(params.id);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
