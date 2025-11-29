import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const category = pgTable(
  "category",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentId: integer("parent_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete("set null"),
  ],
);

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: "category_hierarchy",
  }),
  children: many(category, {
    relationName: "category_hierarchy",
  }),
}));

export const tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const tagRelations = relations(tag, ({ many }) => ({
  problems: many(problemToTag),
}));

export const aopsMetadata = pgTable("aops_metadata", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  topicId: integer("topic_id").notNull(),
  categoryId: integer("category_id").notNull(),
  source: text("source").notNull(),
  postNumber: integer("post_number").notNull(),
  postTime: integer("post_time").notNull(),
  postFormat: integer("post_format").notNull(),
  username: text("username").notNull(),
});

export const aopsMetadataRelations = relations(aopsMetadata, ({ one }) => ({
  problem: one(problem),
}));

export const attachment = pgTable("attachment", {
  id: serial("id").primaryKey(),
  latexId: integer("latex_id")
    .notNull()
    .references(() => latex.id),
  tikz: text("tikz"),
  svg: text("svg"),
  asy: text("asy"),
});

export const attachmentsRelations = relations(attachment, ({ one }) => ({
  latex: one(latex, {
    fields: [attachment.latexId],
    references: [latex.id],
  }),
}));

export const latex = pgTable("latex", {
  id: serial("id").primaryKey(),
  latex: text("latex").notNull(),
});

export const latexRelations = relations(latex, ({ many }) => ({
  attachments: many(attachment),
}));

export const problem = pgTable(
  "problem",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id),
    statementLatexId: integer("statement_latex_id")
      .notNull()
      .references(() => latex.id),
    hintLatexId: integer("hint_latex_id").references(() => latex.id),
    solutionLatexId: integer("solution_latex_id").references(() => latex.id),
    createdById: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    aopsMetadataId: integer("aops_metadata_id").references(
      () => aopsMetadata.id,
    ),
  },
  (problem) => [index("problem_created_by_idx").on(problem.createdById)],
);

export const problemRelations = relations(problem, ({ one, many }) => ({
  category: one(category, {
    fields: [problem.categoryId],
    references: [category.id],
  }),
  statement: one(latex, {
    fields: [problem.statementLatexId],
    references: [latex.id],
  }),
  hint: one(latex, {
    fields: [problem.hintLatexId],
    references: [latex.id],
  }),
  solution: one(latex, {
    fields: [problem.solutionLatexId],
    references: [latex.id],
  }),
  aopsMetadata: one(aopsMetadata, {
    fields: [problem.aopsMetadataId],
    references: [aopsMetadata.id],
  }),
  tags: many(problemToTag),
}));

export const problemToTag = pgTable("problem_to_tag", {
  id: serial("id").primaryKey(),
  problemId: varchar("problem_id", { length: 255 })
    .notNull()
    .references(() => problem.id),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tag.id),
});

export const problemTagRelations = relations(problemToTag, ({ one }) => ({
  problem: one(problem, {
    fields: [problemToTag.problemId],
    references: [problem.id],
  }),
  tag: one(tag, {
    fields: [problemToTag.tagId],
    references: [tag.id],
  }),
}));
