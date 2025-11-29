CREATE TABLE "aops_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"source" text NOT NULL,
	"post_number" integer NOT NULL,
	"post_time" integer NOT NULL,
	"post_format" integer NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"latex_id" integer NOT NULL,
	"tikz" text,
	"svg" text,
	"asy" text
);
--> statement-breakpoint
CREATE TABLE "latex" (
	"id" serial PRIMARY KEY NOT NULL,
	"latex" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"statement_latex_id" integer NOT NULL,
	"hint_latex_id" integer,
	"solution_latex_id" integer,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"aops_metadata_id" integer
);
--> statement-breakpoint
CREATE TABLE "problem_to_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"problem_id" varchar(255) NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" RENAME TO "category";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_latex_id_latex_id_fk" FOREIGN KEY ("latex_id") REFERENCES "public"."latex"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_statement_latex_id_latex_id_fk" FOREIGN KEY ("statement_latex_id") REFERENCES "public"."latex"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_hint_latex_id_latex_id_fk" FOREIGN KEY ("hint_latex_id") REFERENCES "public"."latex"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_solution_latex_id_latex_id_fk" FOREIGN KEY ("solution_latex_id") REFERENCES "public"."latex"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem" ADD CONSTRAINT "problem_aops_metadata_id_aops_metadata_id_fk" FOREIGN KEY ("aops_metadata_id") REFERENCES "public"."aops_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_to_tag" ADD CONSTRAINT "problem_to_tag_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_to_tag" ADD CONSTRAINT "problem_to_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "problem_created_by_idx" ON "problem" USING btree ("created_by");--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;