import { eq, desc, like, and, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import fs from "node:fs";
import path from "node:path";
import { 
  InsertUser, 
  users, 
  appointments, 
  InsertAppointment,
  blogPosts,
  InsertBlogPost,
  successCases,
  InsertSuccessCase,
  posts,
  InsertPost,
  Post
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

type FallbackPostRow = {
  id: string;
  title: string;
  slug?: string;
  type?: string;
  published?: string;
  createdAt?: string;
};

function loadFallbackPostsFromManus(): Post[] {
  try {
    const snapshotPath = path.resolve(process.cwd(), ".manus/db/db-query-1771032070184.json");
    if (!fs.existsSync(snapshotPath)) return [];

    const raw = JSON.parse(fs.readFileSync(snapshotPath, "utf-8"));
    const rows = Array.isArray(raw?.rows) ? (raw.rows as FallbackPostRow[]) : [];

    return rows.map((row) => {
      const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
      const published = row.published === "1";
      return {
        id: Number(row.id),
        title: row.title,
        subtitle: null,
        slug: row.slug || row.id,
        content: `# ${row.title}\n\n该文章已从本地备份恢复，完整内容稍后同步。`,
        excerpt: "该文章已从本地备份恢复。",
        type: (row.type as "blog" | "success-case") || "blog",
        category: null,
        tags: null,
        coverImage: null,
        published,
        publishedAt: published ? createdAt : null,
        authorId: 1,
        createdAt,
        updatedAt: createdAt,
        contentCategory: null,
        blogCategory: null,
        successCaseCategory: null,
        author: "OXEC Immigration",
      } as Post;
    });
  } catch (error) {
    console.warn("[Fallback Posts] Failed to load .manus snapshot:", error);
    return [];
  }
}

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

export async function deleteAppointment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(appointments).where(eq(appointments.id, id));
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

// Unified posts queries
export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const result = await db.insert(posts).values(data);
    // Get the inserted post to return complete object with id
    const insertedPost = await getPostBySlug(data.slug);
    if (!insertedPost) throw new Error("Failed to retrieve inserted post");
    return insertedPost;
  } catch (error: any) {
    // Handle unique constraint violation on slug
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('slug')) {
      console.warn(`[Database] Slug already exists: ${data.slug}, attempting to update existing record`);
      // Try to update the existing record instead
      const existing = await getPostBySlug(data.slug);
      if (existing) {
        return await updatePost(existing.id, data);
      }
    }
    throw error;
  }
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get the existing post to preserve required fields
  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found");
  
  // Filter out undefined values and validate required fields
  const cleanData: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    cleanData[key] = value;
  }
  
  // Ensure required fields are always present
  if (!cleanData.title) cleanData.title = existing.title;
  if (!cleanData.slug) cleanData.slug = existing.slug;
  if (!cleanData.content) cleanData.content = existing.content;
  if (!cleanData.type) cleanData.type = existing.type;
  if (!cleanData.authorId) cleanData.authorId = existing.authorId;
  if (cleanData.published === undefined) cleanData.published = existing.published;
  
  if (Object.keys(cleanData).length === 0) {
    throw new Error("No fields to update");
  }
  
  await db.update(posts).set(cleanData as Partial<InsertPost>).where(eq(posts.id, id));
  // Return the updated post
  const updated = await getPostById(id);
  if (!updated) throw new Error("Failed to retrieve updated post");
  return updated;
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(posts).where(eq(posts.id, id));
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) {
    const fallback = loadFallbackPostsFromManus();
    return fallback.find((post) => post.id === id) ?? null;
  }
  
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    const fallback = loadFallbackPostsFromManus();
    return fallback.find((post) => post.slug === slug) ?? null;
  }
  
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPosts(filters?: { type?: string; category?: string; blogCategory?: string; successCaseCategory?: string; contentCategory?: string; publishedOnly?: boolean; limit?: number; excludeId?: number }) {
  const db = await getDb();
  if (!db) {
    let fallback = loadFallbackPostsFromManus();
    if (filters?.publishedOnly) fallback = fallback.filter((post) => post.published);
    if (filters?.type) fallback = fallback.filter((post) => post.type === filters.type);
    if (filters?.excludeId) fallback = fallback.filter((post) => post.id !== filters.excludeId);
    fallback = fallback.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (filters?.limit) return fallback.slice(0, filters.limit);
    return fallback;
  }
  
  const conditions = [];
  
  if (filters?.publishedOnly) {
    conditions.push(eq(posts.published, true));
  }
  
  if (filters?.type) {
    conditions.push(eq(posts.type, filters.type as any));
  }
  
  if (filters?.category) {
    conditions.push(eq(posts.category, filters.category));
  }

  if (filters?.blogCategory) {
    conditions.push(eq(posts.blogCategory, filters.blogCategory as any));
  }

  if (filters?.successCaseCategory) {
    conditions.push(eq(posts.successCaseCategory, filters.successCaseCategory as any));
  }

  if (filters?.contentCategory) {
    conditions.push(eq(posts.contentCategory, filters.contentCategory as any));
  }

  if (filters?.excludeId) {
    conditions.push(ne(posts.id, filters.excludeId));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const baseQuery = db.select().from(posts)
    .where(whereClause)
    .orderBy(desc(posts.publishedAt || posts.createdAt));

  if (filters?.limit) {
    return await baseQuery.limit(filters.limit);
  }
  
  return await baseQuery;
}

export async function publishPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(posts).set({
    published: true,
    publishedAt: new Date(),
  }).where(eq(posts.id, id));
}

export async function unpublishPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(posts).set({
    published: false,
    publishedAt: null,
  }).where(eq(posts.id, id));
}

export async function getPostsByContentCategory(contentCategory: string, limit?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const query = db.select().from(posts)
    .where(and(
      eq(posts.published, true),
      eq(posts.contentCategory, contentCategory as any)
    ))
    .orderBy(desc(posts.publishedAt));
  
  if (limit) {
    query.limit(limit);
  }
  
  return await query;
}

export async function searchPosts(query: string, filters?: { type?: string; category?: string; blogCategory?: string; successCaseCategory?: string; contentCategory?: string }): Promise<Post[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [eq(posts.published, true)];
  
  if (query) {
    conditions.push(like(posts.title, `%${query}%`));
  }
  
  if (filters?.type) {
    conditions.push(eq(posts.type, filters.type as any));
  }

  if (filters?.blogCategory) {
    conditions.push(eq(posts.blogCategory, filters.blogCategory as any));
  }

  if (filters?.successCaseCategory) {
    conditions.push(eq(posts.successCaseCategory, filters.successCaseCategory as any));
  }

  if (filters?.contentCategory) {
    conditions.push(eq(posts.contentCategory, filters.contentCategory as any));
  }
  
  if (filters?.category) {
    conditions.push(eq(posts.category, filters.category));
  }
  
  return await db.select().from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt || posts.createdAt));
}
