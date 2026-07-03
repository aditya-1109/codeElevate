import { db } from "../index.js";
import { users, students } from "../schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (matchedUser) => {
  let token
  if (matchedUser.role === "student") {
    token = jwt.sign({
      email: matchedUser.email,
      id: matchedUser.id,
      role: matchedUser.role
    }, process.env.JWT_SECRET, { expiresIn: "7d" })
  } else {
    token = jwt.sign({
      email: matchedUser.email,
      id: matchedUser.id,
      role: matchedUser.role
    }, process.env.JWT_SECRET_ADMIN, { expiresIn: "7d" })
  }
  return token
}

// Register Student
export const register = async (req, res) => {
  const { name, email, password, role = "student" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Name, email and password are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    // Insert user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password, // Storing password simply (demo purpose)
      role
    }).returning();

    // Create student profile record
    const [newStudent] = await db.insert(students).values({
      userId: newUser.id,
      title: "Junior React Developer",
      bio: "Frontend developer trainee at CodeElevate.",
      walletPoints: 0,
      isHrVerified: 0,
      verifiedProgress: 20
    }).returning();


    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      student: newStudent
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Student (supports Email or Phone)
export const login = async (req, res) => {

  const { emailOrPhone, password } = req.body;

  console.log("emailOrPhone", emailOrPhone, password);

  if (!emailOrPhone) {
    return res.status(400).json({ success: false, error: "Email or phone number is required" });
  }

  try {
    let matchedUser = null;
    let studentProfile = null;

    if (emailOrPhone.includes("@")) {
      // 1. Email Sign In
      const [user] = await db.select().from(users).where(eq(users.email, emailOrPhone)).limit(1);
      if (!user) {
        return res.status(404).json({ success: false, error: "User with this email not found" });
      }

      // Check password (for google oauth bypass, we check if password is 'google_oauth' or matches password)
      if (password !== "google_oauth" && user.password !== password) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }

      matchedUser = user;

      // Fetch student details
      const [student] = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
      studentProfile = student;
    } else {
      // 2. Mobile / Phone Sign In
      // Clean phone representation if client passes leading "+91" or spaces
      const searchPhone = emailOrPhone.replace(/\s+/g, "");

      // Find student with phone matching suffix
      // Since student phone has "+91 98765 43210" or similar, we search where it includes phone
      const allStudents = await db.select().from(students);
      const student = allStudents.find(s => {
        if (!s.phone) return false;
        const cleanStudentPhone = s.phone.replace(/[\s+]/g, "");
        return cleanStudentPhone.endsWith(searchPhone) || searchPhone.endsWith(cleanStudentPhone);
      });

      if (!student) {
        return res.status(404).json({ success: false, error: "Student with this mobile number not found" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, student.userId)).limit(1);
      if (!user) {
        return res.status(404).json({ success: false, error: "User account associated with this phone not found" });
      }

      matchedUser = user;
      studentProfile = student;
    }

    const token = generateToken(matchedUser)

    // Return authenticated profile
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        referralCode: matchedUser.referralCode
      },
      student: studentProfile
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get current user details from authenticated token
export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let studentProfile = null;
    if (user.role === "student") {
      const [student] = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
      studentProfile = student || null;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode
      },
      student: studentProfile
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Forgot Password / Reset Password for students
export const forgotPassword = async (req, res) => {
  const { email, phone, newPassword, confirmPassword } = req.body;

  if (!email || !phone || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, error: "Passwords do not match" });
  }

  try {
    // 1. Find user by email (role must be student)
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "Incorrect email or mobile number" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ success: false, error: "Only student passwords can be reset via this form" });
    }

    // 2. Find corresponding student profile to check phone number
    const [student] = await db.select().from(students).where(eq(students.userId, user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    // Compare clean phone numbers
    const cleanInputPhone = phone.replace(/[\s+]/g, "");
    const cleanStudentPhone = (student.phone || "").replace(/[\s+]/g, "");

    const phoneMatches = cleanStudentPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanStudentPhone);
    if (!phoneMatches) {
      return res.status(400).json({ success: false, error: "Incorrect email or mobile number" });
    }

    // 3. Update the user password
    await db.update(users).set({ password: newPassword }).where(eq(users.id, user.id));

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

