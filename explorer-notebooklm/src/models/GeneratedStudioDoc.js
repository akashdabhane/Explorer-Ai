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
    generatedDocType: {
        type: string,
        enum: ['mind_map', 'audio_overview', 'video_overview', 'flash_card'],
        required: true,
    },
    generatedDocTitle: {
        type: string,
        required: [true, "Please provide generated document title"],
        trim: true
    }
}, { timestamps: true })

export default mongoose.models.GeneratedStudioDoc || mongoose.model('GeneratedStudioDoc', GeneratedStudioDocSchema);
