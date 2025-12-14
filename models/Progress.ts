
import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
    day: number;
    date: Date;
    score: number;
    transcript: string;
    topic: string;
    videoPath?: string;
}

const ProgressSchema: Schema = new Schema({
    day: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    score: { type: Number, required: true },
    transcript: { type: String, required: true },
    topic: { type: String, required: true },
    videoPath: { type: String }, // Relative URL to the stored video
});

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
