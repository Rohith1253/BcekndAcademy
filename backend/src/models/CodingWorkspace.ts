import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspaceFile {
  path: string;
  content: string;
  language: string;
}

export interface ICodingWorkspace extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  template: string;
  files: IWorkspaceFile[];
  activeFile: string;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceFileSchema = new Schema<IWorkspaceFile>(
  {
    path: { type: String, required: true },
    content: { type: String, default: "" },
    language: { type: String, default: "javascript" },
  },
  { _id: false }
);

const codingWorkspaceSchema = new Schema<ICodingWorkspace>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    template: {
      type: String,
      required: true,
      default: "custom",
    },
    files: {
      type: [workspaceFileSchema],
      default: [],
      validate: [
        (val: IWorkspaceFile[]) => val.length <= 50,
        "Cannot exceed 50 files per workspace",
      ],
    },
    activeFile: {
      type: String,
      default: "src/index.js",
    },
  },
  { timestamps: true }
);

codingWorkspaceSchema.index({ userId: 1, updatedAt: -1 });

export const CodingWorkspace =
  mongoose.models.CodingWorkspace ||
  mongoose.model<ICodingWorkspace>("CodingWorkspace", codingWorkspaceSchema);
