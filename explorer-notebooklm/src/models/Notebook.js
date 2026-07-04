import mongoose from 'mongoose';

const NotebookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a notebook title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#3b82f6', // blue-500
    },
    documentCount: {
      type: Number,
      default: 0,
    },
    conversationHistory: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        sources: [
          {
            documentId: mongoose.Schema.Types.ObjectId,
            fileName: String,
            pageNumber: Number,
            chunkId: String,
            relevanceScore: Number,
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NotebookSchema.index({ userId: 1, createdAt: -1 });
NotebookSchema.index({ userId: 1, title: 1 });

export default mongoose.models.Notebook || mongoose.model('Notebook', NotebookSchema);
