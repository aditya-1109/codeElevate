CREATE TABLE "available_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"time_slot" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"meeting_link" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"location" text NOT NULL,
	"salary" text NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"experience" text NOT NULL,
	"match_score" integer DEFAULT 85,
	"hr_contact" jsonb NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "live_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"description" text NOT NULL,
	"submodules" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "practice_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"github_link" text NOT NULL,
	"apk_link" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'Junior React Developer / Student',
	"bio" text DEFAULT 'Passionate frontend developer trainee at CodeElevate. Focused on creating beautiful, accessible, and performant web interfaces with React and Tailwind CSS.',
	"phone" text DEFAULT '+91 98765 43210',
	"github" text DEFAULT 'aditya-1109',
	"avatar" text DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
	"sessions" jsonb DEFAULT '[]'::jsonb,
	"applied_jobs" jsonb DEFAULT '[]'::jsonb,
	"wallet_points" integer DEFAULT 1250,
	"resume_url" text DEFAULT 'resume_aditya_developer.pdf',
	"practice_projects" jsonb DEFAULT '[]'::jsonb,
	"live_projects" jsonb DEFAULT '[]'::jsonb,
	"skills" jsonb DEFAULT '[{"name":"Frontend (React/HTML/CSS)","level":85},{"name":"Backend (Node.js/Express)","level":60},{"name":"UI/UX Design Accuracy","level":90},{"name":"Problem Solving & Git","level":75},{"name":"Timeliness & Commits","level":80}]'::jsonb,
	"is_hr_verified" integer DEFAULT 0,
	"verified_progress" integer DEFAULT 75
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;