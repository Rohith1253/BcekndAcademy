import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to enforce single bookmark per user-lesson pair
bookmarkSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const Bookmark =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
