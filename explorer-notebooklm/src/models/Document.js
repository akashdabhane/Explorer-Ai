import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
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
    fileName: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx', 'txt', 'md'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    errorMessage: {
      type: String,
    },
    totalPages: {
      type: Number,
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    processingMetadata: {
      extractedAt: Date,
      chunkedAt: Date,
      embeddedAt: Date,
      indexedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
DocumentSchema.index({ userId: 1, notebookId: 1 });
DocumentSchema.index({ notebookId: 1, status: 1 });
DocumentSchema.index({ cloudinaryPublicId: 1 });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
