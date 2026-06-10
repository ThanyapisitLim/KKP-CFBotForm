import { Schema, model, Document } from "mongoose";

export interface AdminUserDocument extends Document {
  username: string;
  passwordHash: string;
}

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  {
    collection: "admin_users",
    timestamps: true,
  }
);

export const AdminUser = model<AdminUserDocument>("AdminUser", AdminUserSchema);
