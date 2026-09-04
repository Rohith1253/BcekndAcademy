import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "level_up"
  | "achievement_unlocked"
  | "streak_milestone"
  | "daily_goal_completed"
  | "course_completed"
  | "daily_challenge_completed";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "level_up",
        "achievement_unlocked",
        "streak_milestone",
        "daily_goal_completed",
        "course_completed",
        "daily_challenge_completed",
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);
