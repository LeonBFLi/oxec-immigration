import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Appointment bookings table
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  consultationSubject: varchar("consultationSubject", { length: 100 }).notNull(),
  consultationType: mysqlEnum("consultationType", ["phone", "in-person"]).notNull(),
  preferredDate: timestamp("preferredDate"),
  preferredTimeSlots: text("preferredTimeSlots"),
  gender: varchar("gender", { length: 20 }),
  maritalStatus: varchar("maritalStatus", { length: 20 }),
  education: varchar("education", { length: 50 }),
  englishLevel: varchar("englishLevel", { length: 20 }),
  hasExamScore: boolean("hasExamScore"),
  workExperience: varchar("workExperience", { length: 50 }),
  hasRefusal: boolean("hasRefusal"),
  refusalReason: text("refusalReason"),
  hasCriminalRecord: boolean("hasCriminalRecord"),
  criminalRecordDetails: text("criminalRecordDetails"),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Blog articles table
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 255 }),
  coverImage: varchar("coverImage", { length: 2048 }),
  published: boolean("published").default(false).notNull(),
  authorId: int("authorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Success cases table
 */
export const successCases = mysqlTable("successCases", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  caseType: varchar("caseType", { length: 100 }).notNull(),
  clientBackground: text("clientBackground").notNull(),
  challenge: text("challenge"),
  solution: text("solution").notNull(),
  outcome: text("outcome").notNull(),
  coverImage: varchar("coverImage", { length: 2048 }),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SuccessCase = typeof successCases.$inferSelect;
export type InsertSuccessCase = typeof successCases.$inferInsert;

/**
 * Unified posts table for both blog articles and success cases
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  type: mysqlEnum("type", ["blog", "success-case"]).notNull(),
  category: varchar("category", { length: 255 }),
  blogCategory: mysqlEnum("blogCategory", [
    "policy-interpretation",
    "news",
    "immigration-life",
    "immigration-story",
    "immigration-project"
  ]),
  successCaseCategory: mysqlEnum("successCaseCategory", [
    "investment-immigration",
    "skilled-worker",
    "family-reunion",
    "reconsideration",
    "temporary-visit"
  ]),
  contentCategory: mysqlEnum("contentCategory", [
    "investment-immigration",
    "family-reunion",
    "maple-leaf-renewal",
    "reconsideration",
    "temporary-resident",
    "skilled-worker",
    "citizenship",
    "other"
  ]),
  tags: text("tags"), // JSON array stored as string
  coverImage: varchar("coverImage", { length: 2048 }),
  author: varchar("author", { length: 255 }).default("OXEC Immigration").notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  authorId: int("authorId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Image library table for centralized image management
 */
export const imageLibrary = mysqlTable("imageLibrary", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  relativePath: varchar("relativePath", { length: 500 }).notNull().unique(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 50 }),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  uploadMethod: mysqlEnum("uploadMethod", ["manual", "migrated"]).default("manual").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImageLibrary = typeof imageLibrary.$inferSelect;
export type InsertImageLibrary = typeof imageLibrary.$inferInsert;

/**
 * Admin users table for /admin panel authentication
 */
export const admins = mysqlTable("admins", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin", "editor"]).default("editor").notNull(),
  mfaEnabled: boolean("mfaEnabled").default(false).notNull(),
  mfaMethod: mysqlEnum("mfaMethod", ["google_authenticator", "sms", "none"]).default("none").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  lastLogin: timestamp("lastLogin"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

/**
 * MFA configurations table for storing TOTP secrets and backup codes
 */
export const mfaConfigs = mysqlTable("mfaConfigs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull().unique(),
  totpSecret: varchar("totpSecret", { length: 255 }),
  backupCodes: text("backupCodes"), // JSON array of backup codes
  smsPhoneNumber: varchar("smsPhoneNumber", { length: 20 }),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MFAConfig = typeof mfaConfigs.$inferSelect;
export type InsertMFAConfig = typeof mfaConfigs.$inferInsert;

/**
 * Admin sessions table for session management
 */
export const adminSessions = mysqlTable("adminSessions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

/**
 * MFA verification attempts table for rate limiting
 */
export const mfaAttempts = mysqlTable("mfaAttempts", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  attemptType: mysqlEnum("attemptType", ["totp", "sms"]).notNull(),
  success: boolean("success").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MFAAttempt = typeof mfaAttempts.$inferSelect;
export type InsertMFAAttempt = typeof mfaAttempts.$inferInsert;
