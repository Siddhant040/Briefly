CREATE TYPE "public"."access_type" AS ENUM('public', 'password');--> statement-breakpoint
CREATE TYPE "public"."share_type" AS ENUM('one_time', 'time_based');--> statement-breakpoint
CREATE TABLE "shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"share_type" "share_type" NOT NULL,
	"access_type" "access_type" NOT NULL,
	"password_hash" text,
	"view_count" integer DEFAULT 0 NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	CONSTRAINT "shares_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "shares" ADD CONSTRAINT "shares_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;