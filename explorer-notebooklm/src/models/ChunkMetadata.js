import mongoose from 'mongoose';

const ChunkMetadataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notebook',
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    chunkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
    },
    startCharIndex: {
      type: Number,
    },
    endCharIndex: {
      type: Number,
    },
    chromaCollectionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
ChunkMetadataSchema.index({ documentId: 1, chunkIndex: 1 });
ChunkMetadataSchema.index({ notebookId: 1, chromaCollectionId: 1 });

export default mongoose.models.ChunkMetadata || mongoose.model('ChunkMetadata', ChunkMetadataSchema);
