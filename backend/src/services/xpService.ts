import mongoose from "mongoose";
import { XPTransaction, XPSourceType } from "../models/XPTransaction";
import { User } from "../models/User";
import { LevelService, UserLevelInfo } from "./levelService";
import { NotificationService } from "./notificationService";

export interface AwardXPParams {
  userId: string | mongoose.Types.ObjectId;
  sourceType: XPSourceType;
  sourceId: string;
  xpAmount: number;
  metadata?: Record<string, any>;
}

export interface AwardXPResult {
  success: boolean;
  alreadyAwarded: boolean;
  xpEarned: number;
  totalXP: number;
  userLevelInfo: UserLevelInfo;
  isLevelUp: boolean;
  newLevel?: number;
  newTitle?: string;
}

export class XPService {
  /**
   * Centralized, atomic, and idempotent XP award engine.
   * Guarantees zero duplicate XP via database-level unique idempotencyKey.
   */
  static async awardXP(params: AwardXPParams): Promise<AwardXPResult> {
    const { userId, sourceType, sourceId, xpAmount, metadata = {} } = params;
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const idempotencyKey = `${userObjId.toString()}:${sourceType}:${sourceId}`;

    // 1. Check if transaction already exists
    const existingTx = await XPTransaction.findOne({ idempotencyKey }).lean();
    if (existingTx) {
      const user = await User.findById(userObjId).lean();
      const totalXP = user?.totalXP || 0;
      const levelInfo = LevelService.getLevelInfo(totalXP);
      return {
        success: true,
        alreadyAwarded: true,
        xpEarned: 0,
        totalXP,
        userLevelInfo: levelInfo,
        isLevelUp: false,
      };
    }

    if (xpAmount <= 0) {
      const user = await User.findById(userObjId).lean();
      const totalXP = user?.totalXP || 0;
      const levelInfo = LevelService.getLevelInfo(totalXP);
      return {
        success: true,
        alreadyAwarded: false,
        xpEarned: 0,
        totalXP,
        userLevelInfo: levelInfo,
        isLevelUp: false,
      };
    }

    try {
      // 2. Create transaction record (unique index prevents race condition)
      await XPTransaction.create({
        userId: userObjId,
        sourceType,
        sourceId,
        idempotencyKey,
        xpAmount,
        metadata,
      });

      // 3. Atomically update User totalXP
      const prevUser = await User.findById(userObjId).lean();
      const oldXP = prevUser?.totalXP || 0;

      const updatedUser = await User.findByIdAndUpdate(
        userObjId,
        { $inc: { totalXP: xpAmount } },
        { new: true }
      ).lean();

      const newXP = updatedUser?.totalXP || oldXP + xpAmount;
      const levelInfo = LevelService.getLevelInfo(newXP);
      const levelUpCheck = LevelService.checkLevelUp(oldXP, newXP);

      // 4. Update level in User document if changed
      if (levelUpCheck.isLevelUp) {
        await User.findByIdAndUpdate(userObjId, { currentLevel: levelUpCheck.newLevel });
        await NotificationService.createNotification({
          userId: userObjId,
          type: "level_up",
          title: `Level Up! Reached Level ${levelUpCheck.newLevel}`,
          message: `Congratulations! You earned the title of ${levelUpCheck.newTitle}.`,
          metadata: { newLevel: levelUpCheck.newLevel, newTitle: levelUpCheck.newTitle },
        });
      }

      return {
        success: true,
        alreadyAwarded: false,
        xpEarned: xpAmount,
        totalXP: newXP,
        userLevelInfo: levelInfo,
        isLevelUp: levelUpCheck.isLevelUp,
        newLevel: levelUpCheck.newLevel,
        newTitle: levelUpCheck.newTitle,
      };
    } catch (error: any) {
      // Handle MongoDB duplicate key error code 11000 (race condition protection)
      if (error.code === 11000) {
        const user = await User.findById(userObjId).lean();
        const totalXP = user?.totalXP || 0;
        const levelInfo = LevelService.getLevelInfo(totalXP);
        return {
          success: true,
          alreadyAwarded: true,
          xpEarned: 0,
          totalXP,
          userLevelInfo: levelInfo,
          isLevelUp: false,
        };
      }
      throw error;
    }
  }

  /**
   * Get XP transaction history for a user.
   */
  static async getUserHistory(userId: string | mongoose.Types.ObjectId, limit = 20) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    return await XPTransaction.find({ userId: userObjId }).sort({ createdAt: -1 }).limit(limit).lean();
  }
}


/**
 * Backward compatibility helpers for existing codebase.
 */
export function calculateLevelProgress(totalXP: number = 0) {
  return LevelService.getLevelInfo(totalXP);
}

export function addXP(currentXP: number, xpToAdd: number) {
  const newXP = currentXP + xpToAdd;
  const levelInfo = LevelService.getLevelInfo(newXP);
  return { newXP, newLevel: levelInfo.currentLevel, levelProgress: levelInfo };
}
