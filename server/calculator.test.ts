import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("calculator.calculateCRS", () => {
  it("calculates CRS score for a typical applicant", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const inputData = {
      age: 28,
      education: "bachelor" as const,
      canadianEducation: false,
      workExperience: 3,
      canadianWorkExperience: 0,
      languageTest: "ielts" as const,
      listening: 8,
      reading: 8,
      writing: 7,
      speaking: 8,
      hasSpouse: false,
      hasJobOffer: false,
      hasProvincialNomination: false,
    };

    const result = await caller.calculator.calculateCRS(inputData);

    expect(result).toHaveProperty("totalScore");
    expect(result).toHaveProperty("breakdown");
    expect(result).toHaveProperty("eligible");
    expect(result).toHaveProperty("message");
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.breakdown.age).toBeGreaterThan(0);
    expect(result.breakdown.education).toBeGreaterThan(0);
  });

  it("awards additional points for provincial nomination", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const inputData = {
      age: 30,
      education: "bachelor" as const,
      canadianEducation: false,
      workExperience: 3,
      canadianWorkExperience: 0,
      languageTest: "ielts" as const,
      listening: 7,
      reading: 7,
      writing: 7,
      speaking: 7,
      hasSpouse: false,
      hasJobOffer: false,
      hasProvincialNomination: true,
    };

    const result = await caller.calculator.calculateCRS(inputData);

    expect(result.breakdown.provincialNomination).toBe(600);
    expect(result.totalScore).toBeGreaterThanOrEqual(600);
  });

  it("awards points for job offer", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const inputData = {
      age: 30,
      education: "bachelor" as const,
      canadianEducation: false,
      workExperience: 3,
      canadianWorkExperience: 0,
      languageTest: "ielts" as const,
      listening: 7,
      reading: 7,
      writing: 7,
      speaking: 7,
      hasSpouse: false,
      hasJobOffer: true,
      hasProvincialNomination: false,
    };

    const result = await caller.calculator.calculateCRS(inputData);

    expect(result.breakdown.jobOffer).toBe(50);
  });

  it("calculates different scores for applicants with spouse", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const inputWithoutSpouse = {
      age: 30,
      education: "bachelor" as const,
      canadianEducation: false,
      workExperience: 3,
      canadianWorkExperience: 0,
      languageTest: "ielts" as const,
      listening: 7,
      reading: 7,
      writing: 7,
      speaking: 7,
      hasSpouse: false,
      hasJobOffer: false,
      hasProvincialNomination: false,
    };

    const inputWithSpouse = {
      ...inputWithoutSpouse,
      hasSpouse: true,
      spouseEducation: "bachelor" as const,
      spouseWorkExperience: 2,
      spouseLanguageScore: 7,
    };

    const resultWithoutSpouse = await caller.calculator.calculateCRS(inputWithoutSpouse);
    const resultWithSpouse = await caller.calculator.calculateCRS(inputWithSpouse);

    // Scores should be different when spouse is included
    expect(resultWithSpouse.totalScore).not.toBe(resultWithoutSpouse.totalScore);
  });
});
