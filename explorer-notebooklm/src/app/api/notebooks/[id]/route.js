import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notebook from '@/models/Notebook';
// import Document from '@/models/Document';
// import { deleteCollection } from '@/lib/chromaClient';


export async function GET(request, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { id: notebookId } = await params;

    await connectDB();

    const notebook = await Notebook.findOne({
      _id: notebookId,
      // userId: session.user.id,
    });

    if (!notebook) {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    return NextResponse.json({ notebook });
  } catch (error) {
    console.error('Get notebook error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notebook' },
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
    const { id: notebookId } = await params;

    const updates = await request.json();
    await connectDB();

    const notebook = await Notebook.findOneAndUpdate(
      { _id: notebookId /*, userId: session.user.id */ },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!notebook) {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Notebook updated successfully', notebook });
  } catch (error) {
    console.error('Update notebook error:', error);
    return NextResponse.json(
      { error: 'Failed to update notebook' },
      { status: 500 }
    );
  }
}


// unfinished route
export async function DELETE(request, { params }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const { id: notebookId } = await params;

    await connectDB();

    const notebook = await Notebook.findOne({
      _id: notebookId,
      // userId: session.user.id,
    });

    if (!notebook) {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    // Delete all documents in this notebook
    // const { deleteDocument } = await import('@/lib/documentProcessor');
    // const documents = await Document.find({ notebookId: notebookId });
    
    // for (const doc of documents) {
    //   await deleteDocument(doc._id.toString());
    // }

    // Delete Chroma collection
    // const collectionName = `notebook_${notebookId}`;
    // try {
    //   await deleteCollection(collectionName);
    // } catch (error) {
    //   console.warn('Chroma collection may not exist:', error.message);
    // }

    // Delete notebook
    await Notebook.findByIdAndDelete(notebookId);

    return NextResponse.json({ message: 'Notebook deleted successfully' });
  } catch (error) {
    console.error('Delete notebook error:', error);
    return NextResponse.json(
      { error: 'Failed to delete notebook' },
      { status: 500 }
    );
  }
}
