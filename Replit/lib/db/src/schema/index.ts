import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const neighbourhoodsTable = pgTable("neighbourhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  memberCount: integer("member_count").notNull().default(0),
  initials: text("initials").notNull(),
});

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("open"),
  author: text("author").notNull(),
  authorInitials: text("author_initials").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  closesAt: timestamp("closes_at", { withTimezone: true }).notNull(),
  supportCount: integer("support_count").notNull().default(0),
  opposeCount: integer("oppose_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
});

export const householdsTable = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  neighbourhoodId: integer("neighbourhood_id").notNull(),
  memberCount: integer("member_count").notNull().default(0),
  participationCount: integer("participation_count").notNull().default(0),
});

export const proposalVotesTable = pgTable("proposal_votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  choice: text("choice").notNull(),
  voterKey: text("voter_key").notNull().default("demo-member"),
});

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  contribution: integer("contribution").notNull().default(0),
  status: text("status").notNull().default("active"),
  householdId: integer("household_id"),
});

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  actor: text("actor").notNull(),
  actorInitials: text("actor_initials").notNull(),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  accent: text("accent").notNull().default("teal"),
});

export const civicSignalsTable = pgTable("civic_signals", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  actor: text("actor").notNull(),
  actorInitials: text("actor_initials").notNull(),
  neighbourhoodId: integer("neighbourhood_id").notNull(),
  proposalId: integer("proposal_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNeighbourhoodSchema = createInsertSchema(neighbourhoodsTable).omit({ id: true });
export const insertProposalSchema = createInsertSchema(proposalsTable).omit({
  id: true,
  createdAt: true,
  supportCount: true,
  opposeCount: true,
  commentCount: true,
});
export const insertVoteSchema = createInsertSchema(proposalVotesTable).omit({ id: true });
export const insertMemberSchema = createInsertSchema(membersTable).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true });
export const insertHouseholdSchema = createInsertSchema(householdsTable).omit({
  id: true,
  memberCount: true,
  participationCount: true,
});
export const insertCivicSignalSchema = createInsertSchema(civicSignalsTable).omit({
  id: true,
  createdAt: true,
});

export type Neighbourhood = typeof neighbourhoodsTable.$inferSelect;
export type Proposal = typeof proposalsTable.$inferSelect;
export type ProposalVote = typeof proposalVotesTable.$inferSelect;
export type Household = typeof householdsTable.$inferSelect;
export type Member = typeof membersTable.$inferSelect;
export type Activity = typeof activitiesTable.$inferSelect;
export type CivicSignal = typeof civicSignalsTable.$inferSelect;
export type InsertNeighbourhood = z.infer<typeof insertNeighbourhoodSchema>;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;
export type InsertCivicSignal = z.infer<typeof insertCivicSignalSchema>;