import { pgTable, uuid, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

// Users Table (Auth credentials & core roles)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // 'student' | 'recruiter' | 'admin'
  referralCode: text("referral_code").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students Table (Expanded portfolio details & metrics)
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("Junior React Developer / Student"),
  bio: text("bio").default("Frontend developer trainee at CodeElevate."),
  phone: text("phone"),
  github: text("github"),
  avatar: text("avatar"),
  sessions: jsonb("sessions").default([]), // upcoming and past booked session objects
  appliedJobs: jsonb("applied_jobs").default([]), // array of applied job IDs
  walletPoints: integer("wallet_points").default(0),
  resumeUrl: text("resume_url"),
  practiceProjects: jsonb("practice_projects").default([]), // submissions, apk requests, reviewer feedback details
  liveProjects: jsonb("live_projects").default([]), // submodules status tracker (In Progress, Submitted, Merged)
  skills: jsonb("skills").default([
    { name: "Frontend (React/HTML/CSS)", level: 70 },
    { name: "Backend (Node.js/Express)", level: 50 },
    { name: "UI/UX Design Accuracy", level: 75 },
    { name: "Problem Solving & Git", level: 60 },
    { name: "Timeliness & Commits", level: 60 }
  ]),
  isHrVerified: integer("is_hr_verified").default(0), // 0 for false, 1 for true
  verifiedProgress: integer("verified_progress").default(20),
});

// Jobs Table (Recruitment vacancies board)
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  skills: jsonb("skills").default([]), // array of tech stack tags
  experience: text("experience").notNull(),
  matchScore: integer("match_score").default(85),
  hrContact: jsonb("hr_contact").notNull(), // contact name, email, phone, whatsapp chat URLs
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live Projects Table (Client assignments & submodules)
export const liveProjects = pgTable("live_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  submodules: jsonb("submodules").default([]), // submodule details, pricing, branches, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice Projects Table (Code templates for exercises)
export const practiceProjects = pgTable("practice_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'Intermediate' | 'Advanced'
  githubLink: text("github_link").notNull(),
  apkLink: text("apk_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Available slots table
export const availableSlots = pgTable("available_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  meetingLink: text("meeting_link").default(""),
});

// Registration Requests Table
export const registrationRequests = pgTable("registration_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  github: text("github"),
  title: text("title"),
  bio: text("bio"),
  referralCodeUsed: text("referral_code_used"),
  paymentScreenshot: text("payment_screenshot"),
  transactionId: text("transaction_id").notNull(),
  amountPaid: integer("amount_paid").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

