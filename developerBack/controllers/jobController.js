import { db } from "../index.js";
import { students, jobs } from "../schema.js";
import { eq } from "drizzle-orm";

// ─── Get All Jobs ─────────────────────────────────────────────────────────────
export const getJobs = async (req, res) => {
  try {
    const list = await db.select().from(jobs);
    res.status(200).json({ success: true, jobs: list });
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Create Job ───────────────────────────────────────────────────────────────
export const createJob = async (req, res) => {
  const { title, company, location, salary, skills, experience, matchScore, hrContact, description } = req.body;
  if (!title || !company || !location || !salary || !experience || !hrContact || !description) {
    return res.status(400).json({ success: false, error: "All required fields must be provided" });
  }
  try {
    const [newJob] = await db.insert(jobs).values({
      title, company, location, salary,
      skills: skills || [],
      experience,
      matchScore: matchScore || 85,
      hrContact,
      description
    }).returning();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Update Job ───────────────────────────────────────────────────────────────
export const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, company, location, salary, skills, experience, matchScore, hrContact, description } = req.body;
  try {
    const updateObj = {};
    if (title !== undefined) updateObj.title = title;
    if (company !== undefined) updateObj.company = company;
    if (location !== undefined) updateObj.location = location;
    if (salary !== undefined) updateObj.salary = salary;
    if (skills !== undefined) updateObj.skills = skills;
    if (experience !== undefined) updateObj.experience = experience;
    if (matchScore !== undefined) updateObj.matchScore = matchScore;
    if (hrContact !== undefined) updateObj.hrContact = hrContact;
    if (description !== undefined) updateObj.description = description;

    const [updated] = await db.update(jobs).set(updateObj).where(eq(jobs.id, jobId)).returning();
    if (!updated) return res.status(404).json({ success: false, error: "Job not found" });
    res.status(200).json({ success: true, job: updated });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Delete Job ───────────────────────────────────────────────────────────────
export const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    await db.delete(jobs).where(eq(jobs.id, jobId));
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── Apply to Job ─────────────────────────────────────────────────────────────
export const applyToJob = async (req, res) => {
  const { jobId } = req.body;
  if (!jobId)
    return res.status(400).json({ success: false, error: "jobId is required" });

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });
    const studentId = student.id;

    let appliedList = student.appliedJobs || [];
    if (appliedList.includes(jobId))
      return res.status(400).json({ success: false, error: "Already applied for this position" });

    appliedList.push(jobId);
    const [updated] = await db.update(students).set({ appliedJobs: appliedList }).where(eq(students.id, studentId)).returning();
    res.status(200).json({ success: true, message: "Application submitted successfully!", student: updated });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
