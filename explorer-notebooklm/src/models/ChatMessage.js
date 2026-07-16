import mongoose from "mongoose";

const GeneratedStudioDocSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   // for normal string here, as we are using supabase
        ref: "User",
        required: [true, "Please provide user_id"],
        index: true
    },
    notebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notebook1",
        required: [true, "Please provide notebook_id"],
        index: true
    },
    messageRole: {
        type: string,
        enum: ["user", "ai"],
        required: true
    },
    message: {
        type: string,
        trim: true,
        required: true
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
}, { timestamps: true })

export default mongoose.models.GeneratedStudioDoc || mongoose.model('GeneratedStudioDoc', GeneratedStudioDocSchema);
