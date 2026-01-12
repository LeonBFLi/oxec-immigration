import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@oxecimm.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("blog.create", () => {
  it("allows admin to create blog post", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const timestamp = Date.now();
    const blogData = {
      title: "New Immigration Policy 2026",
      slug: `new-immigration-policy-2026-${timestamp}`,
      excerpt: "Overview of the latest changes",
      content: "Detailed content about the new policy...",
      category: "Policy Updates",
      published: true,
    };

    const result = await caller.blog.create(blogData);

    expect(result).toEqual({ success: true });
  });

  it("prevents non-admin from creating blog post", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const blogData = {
      title: "Test Post",
      slug: "test-post",
      content: "Test content",
      published: false,
    };

    await expect(caller.blog.create(blogData)).rejects.toThrow("Admin access required");
  });
});

describe("successCases.create", () => {
  it("allows admin to create success case", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const caseData = {
      title: "Successful PR Application",
      caseType: "Permanent Residence",
      clientBackground: "Software engineer from India",
      solution: "Applied through Express Entry",
      outcome: "PR approved within 6 months",
      published: true,
    };

    const result = await caller.successCases.create(caseData);

    expect(result).toEqual({ success: true });
  });

  it("prevents non-admin from creating success case", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const caseData = {
      title: "Test Case",
      caseType: "PR",
      clientBackground: "Test",
      solution: "Test",
      outcome: "Test",
      published: false,
    };

    await expect(caller.successCases.create(caseData)).rejects.toThrow("Admin access required");
  });
});

describe("blog.list", () => {
  it("returns published posts for public query", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.blog.list({ publishedOnly: true });

    expect(Array.isArray(posts)).toBe(true);
  });
});

describe("successCases.list", () => {
  it("returns published cases for public query", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const cases = await caller.successCases.list({ publishedOnly: true });

    expect(Array.isArray(cases)).toBe(true);
  });
});
