import { eq, desc, like, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  appointments, 
  InsertAppointment,
  blogPosts,
  InsertBlogPost,
  successCases,
  InsertSuccessCase
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Appointment queries
export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(appointments).values(data);
  return result;
}

export async function getAppointments() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
}

// Blog post queries
export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(data);
  return result;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogPosts(publishedOnly = false) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = publishedOnly ? eq(blogPosts.published, true) : undefined;
  return await db.select().from(blogPosts)
    .where(conditions)
    .orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function searchBlogPosts(query: string, category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [];
  conditions.push(eq(blogPosts.published, true));
  
  if (query) {
    conditions.push(like(blogPosts.title, `%${query}%`));
  }
  
  if (category) {
    conditions.push(eq(blogPosts.category, category));
  }
  
  return await db.select().from(blogPosts)
    .where(and(...conditions))
    .orderBy(desc(blogPosts.createdAt));
}

// Success case queries
export async function createSuccessCase(data: InsertSuccessCase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(successCases).values(data);
  return result;
}

export async function updateSuccessCase(id: number, data: Partial<InsertSuccessCase>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(successCases).set(data).where(eq(successCases.id, id));
}

export async function deleteSuccessCase(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(successCases).where(eq(successCases.id, id));
}

export async function getSuccessCases(publishedOnly = false) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = publishedOnly ? eq(successCases.published, true) : undefined;
  return await db.select().from(successCases)
    .where(conditions)
    .orderBy(desc(successCases.createdAt));
}
