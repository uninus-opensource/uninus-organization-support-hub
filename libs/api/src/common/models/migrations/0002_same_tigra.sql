ALTER TABLE "activities" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "applicant_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "applicant_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "department" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "department" ALTER COLUMN "faculty_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "department" ALTER COLUMN "faculty_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "faculty" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organization_level" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "faculty_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "faculty_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "department_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "department_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "organization_level_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "organization_level_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "proposal_status" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "proposal_staus_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "proposal_staus_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "activity_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "activity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "reviewer_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "reviewer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "proposal_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "proposal_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "userId" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "organization_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "faculty_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "faculty_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "department_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "user_affiliations" ALTER COLUMN "department_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role_id" SET DATA TYPE serial;