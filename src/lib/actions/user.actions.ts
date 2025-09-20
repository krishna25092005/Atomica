"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { sendVerificationEmail, sendResetPasswordEmail } from "./email.actions";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists with this email",
        user: null
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = await User.create({
      ...user,
      password: hashedPassword,
      userBio: user.userBio || "",
    });

    // Send verification email
    let emailStatus: any = { success: false, message: "Email not sent" };
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-email?token=${newUser._id}`;
      const emailResult = await sendVerificationEmail(
        newUser.email,
        newUser.firstName || "User",
        verificationUrl,
      );
      
      if (emailResult && emailResult.success !== false) {
        // In development/testing mode, we want the user to have the token
        if (emailResult.developmentMode || emailResult.testingMode) {
          emailStatus = { 
            success: false, // Set to false so user gets token in URL
            message: "Development mode - check console for verification link",
            developmentMode: true 
          };
          console.log(`✅ User created: ${newUser.email}`);
          console.log(`🔗 Verification token: ${newUser._id}`);
        } else {
          emailStatus = { success: true, message: "Verification email sent" };
        }
      } else {
        emailStatus = { 
          success: false, 
          message: emailResult?.error || "Failed to send verification email" 
        };
      }
    } catch (emailError) {
      console.log("Email sending failed:", emailError);
      emailStatus = { success: false, message: "Email service unavailable" };
    }

    return {
      success: true,
      message: "User created successfully",
      user: JSON.parse(JSON.stringify(newUser)),
      emailStatus
    };
  } catch (error: any) {
    console.log("User creation error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during user registration",
      user: null
    };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function verifyEmail(token: string) {
  try {
    await connectToDatabase();

    // Validate token format (should be a valid MongoDB ObjectId)
    if (!token || token.length !== 24) {
      throw new Error("Invalid verification token format");
    }

    const user = await User.findById(token);
    if (!user) {
      throw new Error("Invalid token or user not found");
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: true,
        message: "Email is already verified",
        user: JSON.parse(JSON.stringify(user))
      };
    }

    user.isEmailVerified = true;
    await user.save();

    return {
      success: true,
      message: "Email verified successfully",
      user: JSON.parse(JSON.stringify(user))
    };
  } catch (error: any) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify email",
      user: null
    };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password?token=${user._id}`;
    await sendResetPasswordEmail(
      user.email,
      user.firstName || "User",
      resetUrl,
    );

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(token);
    if (!user) throw new Error("Invalid token or user not found");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ Id: userId });
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(Id: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    const updatedUser = await User.findOneAndUpdate({ _id: Id }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User update failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(Id: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ Id });
    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true },
    );

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
