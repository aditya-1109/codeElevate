import { db } from "../index.js";
import { users, students, registrationRequests } from "../schema.js";
import { eq, and } from "drizzle-orm";

const generateReferralCode = (name) => {
  const cleanName = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}${randomNum}`;
};

const getUniqueReferralCode = async (name) => {
  let code = generateReferralCode(name);
  let attempts = 0;
  while (attempts < 5) {
    const [existing] = await db.select().from(users).where(eq(users.referralCode, code)).limit(1);
    if (!existing) return code;
    code = generateReferralCode(name);
    attempts++;
  }
  return `${code}${Math.floor(10 + Math.random() * 90)}`;
};

// Validate referral code
export const validateReferral = async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).json({ success: false, error: "Referral code is required" });
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code.toUpperCase())).limit(1);
    if (!user) {
      return res.status(404).json({ success: false, error: "Invalid referral code" });
    }
    res.status(200).json({ success: true, name: user.name });
  } catch (err) {
    console.error("Validate referral error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create registration request
export const createRequest = async (req, res) => {
  const { name, email, password, phone, github, title, bio, referralCodeUsed, transactionId, amountPaid } = req.body;
  console.log(req.body, "ggrggg");
  if (!name || !email || !password || !transactionId || !amountPaid) {
    return res.status(400).json({ success: false, error: "Name, email, password, transaction ID and amount are required" });
  }

  try {
    // Check if user already registered in users table
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this email is already registered." });
    }

    // Check if request already pending
    const [existingReq] = await db.select().from(registrationRequests).where(
      and(eq(registrationRequests.email, email), eq(registrationRequests.status, "pending"))
    ).limit(1);
    if (existingReq) {
      return res.status(400).json({ success: false, error: "A pending registration request already exists for this email." });
    }

    // Validate referral code if provided
    let finalReferralCodeUsed = null;
    if (referralCodeUsed) {
      const [refUser] = await db.select().from(users).where(eq(users.referralCode, referralCodeUsed.toUpperCase())).limit(1);
      if (refUser) {
        finalReferralCodeUsed = referralCodeUsed.toUpperCase();
      } else {
        return res.status(400).json({ success: false, error: "The provided referral code is invalid." });
      }
    }

    // Insert request
    const [newRequest] = await db.insert(registrationRequests).values({
      name,
      email,
      password,
      phone: phone || null,
      github: github || null,
      title: title || null,
      bio: bio || null,
      referralCodeUsed: finalReferralCodeUsed,
      transactionId,
      amountPaid: Number(amountPaid)
    }).returning();

    res.status(201).json({
      success: true,
      message: "Registration request submitted successfully.",
      request: newRequest
    });
  } catch (err) {
    console.error("Create registration request error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get pending registration requests
export const getPendingRequests = async (req, res) => {
  try {
    const list = await db.select().from(registrationRequests).where(eq(registrationRequests.status, "pending"));
    res.status(200).json({ success: true, requests: list });
  } catch (err) {
    console.error("Get pending requests error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Approve registration request
export const approveRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const [request] = await db.select().from(registrationRequests).where(eq(registrationRequests.id, requestId)).limit(1);
    if (!request) {
      return res.status(404).json({ success: false, error: "Registration request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, error: `Request has already been ${request.status}` });
    }

    // Check if email already registered in the meantime
    const [existingUser] = await db.select().from(users).where(eq(users.email, request.email)).limit(1);
    if (existingUser) {
      await db.update(registrationRequests).set({ status: "rejected" }).where(eq(registrationRequests.id, requestId));
      return res.status(400).json({ success: false, error: "An account with this email is already registered. Request rejected." });
    }

    // Generate unique referral code for the new user
    const userReferralCode = await getUniqueReferralCode(request.name);

    // Insert user
    const [newUser] = await db.insert(users).values({
      name: request.name,
      email: request.email,
      password: request.password,
      role: "student",
      referralCode: userReferralCode
    }).returning();

    // Insert student profile
    const [newStudent] = await db.insert(students).values({
      userId: newUser.id,
      title: request.title || "Junior React Developer",
      bio: request.bio || "Frontend developer trainee at CodeElevate.",
      phone: request.phone || null,
      github: request.github || null,
      walletPoints: 0,
      isHrVerified: 0,
      verifiedProgress: 20
    }).returning();

    // If referral code used, credit reward points to the referrer
    if (request.referralCodeUsed) {
      const [referrerUser] = await db.select().from(users).where(eq(users.referralCode, request.referralCodeUsed)).limit(1);
      if (referrerUser) {
        const [referrerStudent] = await db.select().from(students).where(eq(students.userId, referrerUser.id)).limit(1);
        if (referrerStudent) {
          const currentPoints = referrerStudent.walletPoints || 0;
          await db.update(students)
            .set({ walletPoints: currentPoints + 100 })
            .where(eq(students.id, referrerStudent.id));
        }
      }
    }

    // Update request status to approved
    await db.update(registrationRequests)
      .set({ status: "approved" })
      .where(eq(registrationRequests.id, requestId));

    res.status(200).json({
      success: true,
      message: "Registration request approved successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        referralCode: newUser.referralCode
      }
    });
  } catch (err) {
    console.error("Approve request error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Reject registration request
export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const [request] = await db.select().from(registrationRequests).where(eq(registrationRequests.id, requestId)).limit(1);
    if (!request) {
      return res.status(404).json({ success: false, error: "Registration request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, error: `Request has already been ${request.status}` });
    }

    await db.update(registrationRequests)
      .set({ status: "rejected" })
      .where(eq(registrationRequests.id, requestId));

    res.status(200).json({ success: true, message: "Registration request rejected successfully." });
  } catch (err) {
    console.error("Reject request error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
