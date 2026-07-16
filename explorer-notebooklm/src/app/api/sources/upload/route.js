import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { processDocument } from '@/lib/documentProcessor';
import Source from '@/models/Source';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import connectDB from '@/lib/mongodb';


export async function POST(request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get('file');
    const notebookId = formData.get('notebookId');
    const userId = formData.get('userId'); // Get userId from formData

    await connectDB();

    if (!file || !notebookId) {
      return NextResponse.json(
        { error: 'File and notebookId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOCX, TXT, and MD files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileTypeMap = {
      'pdf': 'pdf',
      'docx': 'docx',
      'txt': 'txt',
      'md': 'md',
      'csv': 'csv',
    };
    const fileType = fileTypeMap[fileExtension];

    if (!fileType) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url: cloudinaryUrl, publicId } = await uploadToCloudinary(
      buffer,
      file.name
    );

    const source = await Source.create({
      notebookId, 
      userId,
      sourceType: fileType,
      cloudinaryUrl,
      cloudinaryPublicId: publicId,
      sourceTitle: file.name
    })

    return NextResponse.json({
      message: 'Document uploaded successfully',
      source,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload document error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}