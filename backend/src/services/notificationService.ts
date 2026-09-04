import mongoose from "mongoose";
import { Notification, NotificationType } from "../models/Notification";

export class NotificationService {
  /**
   * Creates an in-app notification for a user.
   */
  static async createNotification(params: {
    userId: string | mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { userId, type, title, message, metadata } = params;
      const userObjId = new mongoose.Types.ObjectId(String(userId));

      return await Notification.create({
        userId: userObjId,
        type,
        title,
        message,
        metadata: metadata || {},
      });
    } catch (error: any) {
      console.error("Failed to create notification:", error);
      return null;
    }
  }

  /**
   * Gets user notifications with pagination & unread count.
   */
  static async getUserNotifications(userId: string | mongoose.Types.ObjectId, limit = 20) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId: userObjId }).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ userId: userObjId, isRead: false }),
    ]);

    return { notifications, unreadCount };
  }

  /**
   * Marks a specific notification as read.
   */
  static async markAsRead(userId: string | mongoose.Types.ObjectId, notificationId: string) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userObjId },
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Marks all notifications as read for a user.
   */
  static async markAllAsRead(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const result = await Notification.updateMany({ userId: userObjId, isRead: false }, { isRead: true });
    return { modifiedCount: result.modifiedCount };
  }
}
