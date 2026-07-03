import { db } from "../index.js";
import { users, students, jobs, liveProjects, practiceProjects } from "../schema.js";
import { eq } from "drizzle-orm";



// ─── User Management ─────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const allStudents = await db
      .select({ student: students, user: users })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id));

    const result = allStudents.map(row => ({
      ...row.student,
      name: row.user?.name,
      email: row.user?.email,
      role: row.user?.role,
      referralCode: row.user?.referralCode,
      createdAt: row.user?.createdAt
    }));

    res.status(200).json({ success: true, users: result });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.delete(users).where(eq(users.id, userId));
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const toggleVerify = async (req, res) => {
  const { userId } = req.params;
  try {
    const [student] = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    const newVerified = student.isHrVerified === 1 ? 0 : 1;
    const newProgress = newVerified === 1 ? 100 : 75;

    const [updated] = await db.update(students)
      .set({ isHrVerified: newVerified, verifiedProgress: newProgress })
      .where(eq(students.userId, userId))
      .returning();

    res.status(200).json({ success: true, student: updated });
  } catch (err) {
    console.error("Toggle verify error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── All Sessions ─────────────────────────────────────────────────────────────

export const getAllSessions = async (req, res) => {
  console.log("helloo")
  try {
  const allStudents = await db
    .select({ student: students, user: users })
    .from(students)
    .leftJoin(users, eq(students.userId, users.id));

  console.log(allStudents);

  const sessionsList = [];
  for (const row of allStudents) {
    const sessList = row.student.sessions || [];
    for (const sess of sessList) {
      sessionsList.push({
        ...sess,
        studentId: row.student.id,
        studentName: row.user?.name || "Unknown",
        studentEmail: row.user?.email || ""
      });
    }
  }

  res.status(200).json({ success: true, sessions: sessionsList });
  } catch (err) {
    console.error("Get all sessions error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const completeSession = async (req, res) => {
  const { studentId, sessionId } = req.body;
  if (!studentId || !sessionId)
    return res.status(400).json({ success: false, error: "studentId and sessionId are required" });

  try {
    const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    const updatedSessions = (student.sessions || []).map(s =>
      s.id === sessionId ? { ...s, status: "Completed" } : s
    );

    const [updated] = await db.update(students)
      .set({ sessions: updatedSessions })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({ success: true, sessions: updated.sessions });
  } catch (err) {
    console.error("Complete session error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const auditPracticeProject = async (req, res) => {
  const { studentId, projectId, performance, reviewerFeedback } = req.body;

  if (!studentId || !projectId || !performance || !reviewerFeedback) {
    return res.status(400).json({ success: false, error: "studentId, projectId, performance and reviewerFeedback are required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    let studentPracList = student.practiceProjects || [];
    const idx = studentPracList.findIndex(item => item.id === projectId);

    if (idx >= 0) {
      studentPracList[idx] = {
        ...studentPracList[idx],
        status: "Graded",
        performance,
        reviewerFeedback
      };
    } else {
      // Find practice project title
      const [pracProj] = await db.select().from(practiceProjects).where(eq(practiceProjects.id, projectId)).limit(1);
      const title = pracProj ? pracProj.title : "Practice Project";
      studentPracList.push({
        id: projectId,
        title,
        status: "Graded",
        submittedGit: "",
        performance,
        reviewerFeedback
      });
    }

    const [updatedStudent] = await db.update(students)
      .set({ practiceProjects: studentPracList })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({
      success: true,
      message: "Practice project graded successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Audit practice project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// ─── Create User ─────────────────────────────────────────────────────────────
export const createUser = async (req, res) => {
  const { name, email, password, role = "student", title, bio, phone, github, walletPoints = 0, isHrVerified = 0 } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Name, email and password are required" });
  }

  try {
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password,
      role
    }).returning();

    let progress = 20;
    if (Number(isHrVerified) === 1) {
      progress = 100;
    } else {
      if (github) progress += 10;
      if (phone) progress += 5;
    }

    const [newStudent] = await db.insert(students).values({
      userId: newUser.id,
      title: title || "Junior React Developer",
      bio: bio || "Frontend developer trainee at CodeElevate.",
      phone: phone || null,
      github: github || null,
      walletPoints: Number(walletPoints) || 0,
      isHrVerified: Number(isHrVerified) || 0,
      verifiedProgress: progress
    }).returning();

    res.status(201).json({
      success: true,
      user: {
        ...newStudent,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Update User ─────────────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, role, title, bio, phone, github, walletPoints, isHrVerified } = req.body;

  try {
    const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (email && email !== existingUser.email) {
      const [emailCheck] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (emailCheck) {
        return res.status(400).json({ success: false, error: "Email already in use by another user" });
      }
    }

    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (email !== undefined) userUpdate.email = email;
    if (password !== undefined && password !== "") userUpdate.password = password;
    if (role !== undefined) userUpdate.role = role;

    let updatedUser = existingUser;
    if (Object.keys(userUpdate).length > 0) {
      const [resUser] = await db.update(users)
        .set(userUpdate)
        .where(eq(users.id, userId))
        .returning();
      updatedUser = resUser;
    }

    let [student] = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
    
    const studentUpdate = {};
    if (title !== undefined) studentUpdate.title = title;
    if (bio !== undefined) studentUpdate.bio = bio;
    if (phone !== undefined) studentUpdate.phone = phone;
    if (github !== undefined) studentUpdate.github = github;
    if (walletPoints !== undefined) studentUpdate.walletPoints = Number(walletPoints) || 0;
    if (isHrVerified !== undefined) studentUpdate.isHrVerified = Number(isHrVerified) || 0;

    if (isHrVerified !== undefined) {
      const hrVerifiedNum = Number(isHrVerified);
      if (hrVerifiedNum === 1) {
        studentUpdate.verifiedProgress = 100;
      } else if (student?.isHrVerified === 1 && hrVerifiedNum === 0) {
        let progress = 60;
        if (github || student?.github) progress += 10;
        if (phone || student?.phone) progress += 5;
        studentUpdate.verifiedProgress = progress;
      }
    }

    let updatedStudent = student;
    if (!student) {
      const progress = Number(isHrVerified) === 1 ? 100 : 20;
      const [resStudent] = await db.insert(students).values({
        userId,
        title: title || "Junior React Developer",
        bio: bio || "Frontend developer trainee at CodeElevate.",
        phone: phone || null,
        github: github || null,
        walletPoints: Number(walletPoints) || 0,
        isHrVerified: Number(isHrVerified) || 0,
        verifiedProgress: progress
      }).returning();
      updatedStudent = resStudent;
    } else if (Object.keys(studentUpdate).length > 0) {
      const [resStudent] = await db.update(students)
        .set(studentUpdate)
        .where(eq(students.userId, userId))
        .returning();
      updatedStudent = resStudent;
    }

    res.status(200).json({
      success: true,
      user: {
        ...updatedStudent,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


