import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   // for normal string here, as we are using supabase
        ref: "User",
        // required: [true, "Please provide user_id"],
        // index: true
    },
    notebookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notebook1",
        required: [true, "Please provide notebook_id"],
        index: true
    },
    sourceFileUrl: {
        type: String,
        trim: true
    },
    sourceType: {
        type: String,
        enum: ['pdf', 'word', 'md', 'csv', 'text_file', 'website', 'youtube_link', 'github_repo'],
        required: true,
    },
    sourceTitle: {
        type: String,
        required: [true, "Please provide source title"],
        trim: true
    },
    sourceDescriptionByAi: {
        type: String,
        trim: true
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
    },
}, { timestamps: true })

export default mongoose.models.Source || mongoose.model('Source', SourceSchema);
