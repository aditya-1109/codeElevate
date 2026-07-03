import { db } from "../index.js";
import { students, availableSlots } from "../schema.js";
import { eq, and } from "drizzle-orm";

// 1. Get Scheduled & Past Sessions for a Student
export const getSessions = async (req, res) => {
  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }

    res.status(200).json({ success: true, sessions: student.sessions || [] });
  } catch (err) {
    console.error("Get sessions error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Book a Mentoring / Audit Session
export const bookSession = async (req, res) => {
  const { type, date, timeSlot } = req.body;

  if (!type || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: "type, date and timeSlot are required" });
  }

  try {
    const [student] = await db.select().from(students).where(eq(students.userId, req.user.id)).limit(1);
    if (!student) {
      return res.status(404).json({ success: false, error: "Student profile not found" });
    }
    const studentId = student.id;

    // Fetch the slot first to get its meetingLink
    const [slot] = await db.select().from(availableSlots)
      .where(and(eq(availableSlots.date, date), eq(availableSlots.timeSlot, timeSlot)))
      .limit(1);

    const meetLink = slot && slot.meetingLink ? slot.meetingLink : "https://meet.google.com/mock-session-link";

    // Create session object
    const newSession = {
      id: `sess-${Date.now()}`,
      title: `${type} Guidance Session`,
      type,
      date,
      timeSlot,
      tutor: "CodeElevate Advisor",
      meetLink,
      status: "Scheduled"
    };

    let studentSessionsList = student.sessions || [];
    // Insert new session at the start of array
    studentSessionsList = [newSession, ...studentSessionsList];

    // Build update object
    const updateObj = { sessions: studentSessionsList };

    // If booking a Profile Management session, unlock HR verified badge and make progress 100%
    if (type === "Profile Management") {
      updateObj.isHrVerified = 1;
      updateObj.verifiedProgress = 100;
    }

    const [updatedStudent] = await db.update(students)
      .set(updateObj)
      .where(eq(students.id, studentId))
      .returning();

    // Consume (delete) the slot from available slots
    await db.delete(availableSlots)
      .where(and(eq(availableSlots.date, date), eq(availableSlots.timeSlot, timeSlot)));

    res.status(201).json({
      success: true,
      message: "Mentorship session booked successfully",
      sessions: updatedStudent.sessions,
      student: updatedStudent
    });
  } catch (err) {
    console.error("Book session error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Get Available Booking Slots
export const getAvailableSlots = async (req, res) => {
 
  try {
    const slots = await db.select().from(availableSlots);
    res.status(200).json({ success: true, slots });
  } catch (err) {
    console.error("Get available slots error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Create a New Available Slot (Admin)
export const createAvailableSlot = async (req, res) => {
  const { date, timeSlot, meetingLink } = req.body;
  console.log("slot create request", date, timeSlot, meetingLink);
  if (!date || !timeSlot) {
    return res.status(400).json({ success: false, error: "date and timeSlot are required" });
  }

  try {
    const [newSlot] = await db.insert(availableSlots).values({ date, timeSlot, meetingLink: meetingLink || "" }).returning();
    res.status(201).json({ success: true, slot: newSlot });
  } catch (err) {
    console.error("Create available slot error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Delete an Available Slot (Admin)
export const deleteAvailableSlot = async (req, res) => {
  const { slotId } = req.params;
  if (!slotId) {
    return res.status(400).json({ success: false, error: "slotId is required" });
  }

  try {
    await db.delete(availableSlots).where(eq(availableSlots.id, slotId));
    res.status(200).json({ success: true, message: "Available slot deleted successfully" });
  } catch (err) {
    console.error("Delete available slot error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
