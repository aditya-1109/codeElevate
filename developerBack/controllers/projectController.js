import { db } from "../index.js";
import { students, liveProjects, practiceProjects } from "../schema.js";
import { eq } from "drizzle-orm";

// 1. Get All Live Projects (Client projects)
export const getLiveProjects = async (req, res) => {
  try {
    const list = await db.select().from(liveProjects);
    res.status(200).json({ success: true, liveProjects: list });
  } catch (err) {
    console.error("Get live projects error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Submit Code Link for Live Submodule
export const submitLiveSubmodule = async (req, res) => {
  const { submoduleId, gitLink } = req.body;

  if (!submoduleId || !gitLink) {
    return res.status(400).json({ success: false, error: "submoduleId and gitLink are required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }
    const studentId = student.id;

    // Update the liveProjects list of the student
    let studentLiveList = student.liveProjects || [];
    const existingIdx = studentLiveList.findIndex(item => item.id === submoduleId);

    if (existingIdx >= 0) {
      studentLiveList[existingIdx] = {
        ...studentLiveList[existingIdx],
        status: "Submitted",
        gitLink
      };
    } else {
      // Find the submodule details from the master live projects table to inherit info
      const allLive = await db.select().from(liveProjects);
      let foundSub = null;
      let parentProject = null;

      for (const proj of allLive) {
        const sub = proj.submodules.find(s => s.id === submoduleId);
        if (sub) {
          foundSub = sub;
          parentProject = proj;
          break;
        }
      }

      if (!foundSub) {
        return res.status(404).json({ success: false, error: "Submodule not found in client projects" });
      }

      studentLiveList.push({
        id: submoduleId,
        title: foundSub.title,
        projectTitle: parentProject.title,
        company: parentProject.company,
        points: foundSub.points,
        gitLink,
        status: "Submitted"
      });
    }

    // Save student list
    const [updatedStudent] = await db.update(students)
      .set({ liveProjects: studentLiveList })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({
      success: true,
      message: "Submodule code link submitted successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Submit live code error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Approve Submodule (adds XP points to student wallet)
export const approveLiveSubmodule = async (req, res) => {
  const { studentId: bodyStudentId, submoduleId } = req.body;

  if (!submoduleId) {
    return res.status(400).json({ success: false, error: "submoduleId is required" });
  }

  try {
    let studentId = bodyStudentId;
    if (req.user.role === "student") {
      const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }
      studentId = student.id;
    } else {
      if (!studentId) {
        return res.status(400).json({ success: false, error: "studentId is required for admin approval" });
      }
    }

    const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    let studentLiveList = student.liveProjects || [];
    const subIdx = studentLiveList.findIndex(item => item.id === submoduleId);
    
    let rewardPoints = 0;
    let title = "";

    if (subIdx >= 0) {
      if (studentLiveList[subIdx].status === "Completed") {
        return res.status(400).json({ success: false, error: "Submodule code has already been merged" });
      }
      rewardPoints = studentLiveList[subIdx].points || 0;
      studentLiveList[subIdx] = {
        ...studentLiveList[subIdx],
        status: "Completed"
      };
    } else {
      // Find submodule details from liveProjects master table
      const allLive = await db.select().from(liveProjects);
      let foundSub = null;
      let parentProject = null;

      for (const proj of allLive) {
        const sub = proj.submodules.find(s => s.id === submoduleId);
        if (sub) {
          foundSub = sub;
          parentProject = proj;
          break;
        }
      }

      if (!foundSub) {
        return res.status(404).json({ success: false, error: "Submodule details not found" });
      }

      rewardPoints = foundSub.points;
      title = foundSub.title;

      studentLiveList.push({
        id: submoduleId,
        title: foundSub.title,
        projectTitle: parentProject.title,
        company: parentProject.company,
        points: foundSub.points,
        gitLink: "https://github.com/codeelevate/client-bypass-merge",
        status: "Completed"
      });
    }

    // Increment walletPoints
    const newWalletPoints = (student.walletPoints || 0) + rewardPoints;

    const [updatedStudent] = await db.update(students)
      .set({ 
        liveProjects: studentLiveList,
        walletPoints: newWalletPoints
      })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({
      success: true,
      message: `Merged submodule successfully! Awarded +${rewardPoints} XP points.`,
      student: updatedStudent
    });
  } catch (err) {
    console.error("Approve live code error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Get All Practice Templates
export const getPracticeProjects = async (req, res) => {
  try {
    const list = await db.select().from(practiceProjects);
    res.status(200).json({ success: true, practiceProjects: list });
  } catch (err) {
    console.error("Get practice projects error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Request APK mobile link simulator
export const requestPracticeApk = async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ success: false, error: "projectId is required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }
    const studentId = student.id;

    let studentPracList = student.practiceProjects || [];
    const idx = studentPracList.findIndex(item => item.id === projectId);
    
    // Create static APK URL
    const generatedApk = `/apks/generated_${projectId}.apk`;

    if (idx >= 0) {
      studentPracList[idx] = {
        ...studentPracList[idx],
        apkLink: generatedApk
      };
    } else {
      // Find template details from master practice projects table
      const [pracProj] = await db.select().from(practiceProjects).where(eq(practiceProjects.id, projectId)).limit(1);
      if (!pracProj) {
        return res.status(404).json({ success: false, error: "Practice template not found" });
      }

      studentPracList.push({
        id: projectId,
        title: pracProj.title,
        status: "Available",
        apkLink: generatedApk,
        submittedGit: ""
      });
    }

    const [updatedStudent] = await db.update(students)
      .set({ practiceProjects: studentPracList })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({
      success: true,
      message: "APK Link generated successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Request apk error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. Submit Git Repo Link for Practice project
export const submitPracticeProject = async (req, res) => {
  const { projectId, submittedGit } = req.body;

  if (!projectId || !submittedGit) {
    return res.status(400).json({ success: false, error: "projectId and submittedGit are required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }
    const studentId = student.id;

    let studentPracList = student.practiceProjects || [];
    const idx = studentPracList.findIndex(item => item.id === projectId);

    if (idx >= 0) {
      studentPracList[idx] = {
        ...studentPracList[idx],
        status: "Submitted",
        submittedGit
      };
    } else {
      const [pracProj] = await db.select().from(practiceProjects).where(eq(practiceProjects.id, projectId)).limit(1);
      if (!pracProj) {
        return res.status(404).json({ success: false, error: "Practice template not found" });
      }

      studentPracList.push({
        id: projectId,
        title: pracProj.title,
        status: "Submitted",
        submittedGit
      });
    }

    const [updatedStudent] = await db.update(students)
      .set({ practiceProjects: studentPracList })
      .where(eq(students.id, studentId))
      .returning();

    res.status(200).json({
      success: true,
      message: "Practice repository submitted successfully",
      student: updatedStudent
    });
  } catch (err) {
    console.error("Submit practice project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Admin: Live Project CRUD ─────────────────────────────────────────────────

export const createLiveProject = async (req, res) => {
  const { title, company, description, submodules } = req.body;
  if (!title || !company || !description) {
    return res.status(400).json({ success: false, error: "title, company, and description are required" });
  }
  try {
    const [newProject] = await db.insert(liveProjects).values({
      title, company, description, submodules: submodules || []
    }).returning();
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Create live project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateLiveProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, company, description, submodules } = req.body;
  try {
    const updateObj = {};
    if (title !== undefined) updateObj.title = title;
    if (company !== undefined) updateObj.company = company;
    if (description !== undefined) updateObj.description = description;
    if (submodules !== undefined) updateObj.submodules = submodules;

    const [updated] = await db.update(liveProjects).set(updateObj).where(eq(liveProjects.id, projectId)).returning();
    if (!updated) return res.status(404).json({ success: false, error: "Live project not found" });
    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    console.error("Update live project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteLiveProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    await db.delete(liveProjects).where(eq(liveProjects.id, projectId));
    res.status(200).json({ success: true, message: "Live project deleted successfully" });
  } catch (err) {
    console.error("Delete live project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Admin: Practice Project CRUD ─────────────────────────────────────────────

export const createPracticeProject = async (req, res) => {
  const { title, description, difficulty, githubLink, apkLink } = req.body;
  if (!title || !description || !difficulty) {
    return res.status(400).json({ success: false, error: "title, description, and difficulty are required" });
  }
  try {
    const [newProject] = await db.insert(practiceProjects).values({
      title, description, difficulty, githubLink: githubLink || null, apkLink: apkLink || null
    }).returning();
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Create practice project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePracticeProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, difficulty, githubLink, apkLink } = req.body;
  try {
    const updateObj = {};
    if (title !== undefined) updateObj.title = title;
    if (description !== undefined) updateObj.description = description;
    if (difficulty !== undefined) updateObj.difficulty = difficulty;
    if (githubLink !== undefined) updateObj.githubLink = githubLink;
    if (apkLink !== undefined) updateObj.apkLink = apkLink;

    const [updated] = await db.update(practiceProjects).set(updateObj).where(eq(practiceProjects.id, projectId)).returning();
    if (!updated) return res.status(404).json({ success: false, error: "Practice project not found" });
    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    console.error("Update practice project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePracticeProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    await db.delete(practiceProjects).where(eq(practiceProjects.id, projectId));
    res.status(200).json({ success: true, message: "Practice project deleted successfully" });
  } catch (err) {
    console.error("Delete practice project error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
