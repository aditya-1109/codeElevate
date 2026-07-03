import { db } from "../index.js";
import { students, users } from "../schema.js";
import { eq } from "drizzle-orm";

// Get Student Profile
export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [studentWithUser] = await db
      .select({
        student: students,
        user: users
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.userId, userId))
      .limit(1);

    if (!studentWithUser) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    const student = {
      ...studentWithUser.student,
      name: studentWithUser.user.name,
      email: studentWithUser.user.email,
      referralCode: studentWithUser.user.referralCode,
      createdAt: studentWithUser.user.createdAt
    };

    res.status(200).json({ success: true, student });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Student Profile Details
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { title, bio, phone, github, avatar, skills } = req.body;

  try {
    const [existingStudent] = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
    if (!existingStudent) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    // Build update object dynamically
    const updateObj = {};
    if (title !== undefined) updateObj.title = title;
    if (bio !== undefined) updateObj.bio = bio;
    if (phone !== undefined) updateObj.phone = phone;
    if (github !== undefined) updateObj.github = github;
    if (avatar !== undefined) updateObj.avatar = avatar;
    if (skills !== undefined) updateObj.skills = skills;

    // Recalculate portfolio completion score based on filled elements
    let progress = 60; // Base completion
    if (github || existingStudent.github) progress += 10;
    if (phone || existingStudent.phone) progress += 5;
    if (updateObj.skills || existingStudent.skills) progress += 5;
    if (existingStudent.isHrVerified === 1) {
      progress = 100;
    } else {
      progress = Math.min(progress, 95);
    }
    updateObj.verifiedProgress = progress;

    const [updatedStudent] = await db.update(students)
      .set(updateObj)
      .where(eq(students.userId, userId))
      .returning();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Student Resume Document Link
export const updateResume = async (req, res) => {
  const { resumeUrl } = req.body;

  if (!resumeUrl) {
    return res.status(400).json({ success: false, error: "Resume URL is required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }
    const studentId = student.id;

    const [updatedStudent] = await db.update(students)
      .set({ resumeUrl })
      .where(eq(students.id, studentId))
      .returning();

    if (!updatedStudent) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Update resume error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
