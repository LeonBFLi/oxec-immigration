import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("appointments.create", () => {
  it("creates an appointment with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const appointmentData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-123-4567",
      consultationType: "phone" as const,
      preferredDate: new Date("2026-02-01T10:00:00Z"),
      message: "I need help with PR application",
    };

    const result = await caller.appointments.create(appointmentData);

    expect(result).toEqual({ success: true });
  });

  it("rejects appointment with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const appointmentData = {
      name: "John Doe",
      email: "invalid-email",
      phone: "+1-555-123-4567",
      consultationType: "phone" as const,
      preferredDate: new Date("2026-02-01T10:00:00Z"),
    };

    await expect(caller.appointments.create(appointmentData)).rejects.toThrow();
  });
});
