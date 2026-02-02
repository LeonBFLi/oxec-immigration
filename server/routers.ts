import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createAppointment,
  getAppointments,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  searchBlogPosts,
  createSuccessCase,
  updateSuccessCase,
  deleteSuccessCase,
  getSuccessCases,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendAppointmentEmail } from "./_core/emailService";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Appointment booking
  appointments: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        consultationSubject: z.string().min(1),
        consultationType: z.enum(["phone", "in-person"]),
        preferredDate: z.date().optional(),
        preferredTimeSlots: z.string().optional(),
        gender: z.string().optional(),
        maritalStatus: z.string().optional(),
        education: z.string().optional(),
        englishLevel: z.string().optional(),
        hasExamScore: z.boolean().optional(),
        workExperience: z.string().optional(),
        hasRefusal: z.boolean().optional(),
        refusalReason: z.string().optional(),
        hasCriminalRecord: z.boolean().optional(),
        criminalRecordDetails: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createAppointment(input);
        
        // Send email to Business@oxecimm.com
        await sendAppointmentEmail(input);
        
        // Notify owner
        await notifyOwner({
          title: "新预约申请 - " + input.name,
          content: `新预约申请来自 ${input.name} (${input.email})\n预约事项: ${input.consultationSubject}\n咨询方式: ${input.consultationType === 'phone' ? '电话咨询' : '线下咨询'}\n预约时间段: ${input.preferredTimeSlots || '未指定'}`,
        });
        
        return { success: true };
      }),
    
    list: adminProcedure.query(async () => {
      return await getAppointments();
    }),
  }),

  // Immigration calculator
  calculator: router({
    calculateCRS: publicProcedure
      .input(z.object({
        age: z.number().min(18).max(100),
        education: z.enum(["high-school", "one-year", "two-year", "bachelor", "master", "phd"]),
        canadianEducation: z.boolean(),
        workExperience: z.number().min(0).max(20),
        canadianWorkExperience: z.number().min(0).max(10),
        languageTest: z.enum(["ielts", "celpip", "tef", "tcf"]),
        listening: z.number().min(0).max(9),
        reading: z.number().min(0).max(9),
        writing: z.number().min(0).max(9),
        speaking: z.number().min(0).max(9),
        hasSpouse: z.boolean(),
        spouseEducation: z.enum(["none", "high-school", "bachelor", "master"]).optional(),
        spouseWorkExperience: z.number().min(0).max(10).optional(),
        spouseLanguageScore: z.number().min(0).max(9).optional(),
        hasJobOffer: z.boolean(),
        hasProvincialNomination: z.boolean(),
      }))
      .query(({ input }) => {
        // CRS calculation logic
        let crs = 0;

        // Age points (max 132)
        const agePoints = [0, 0, 99, 105, 110, 109, 108, 107, 106, 103, 100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 19, 18, 17, 16, 15];
        if (input.age < agePoints.length) {
          crs += agePoints[input.age];
        }

        // Education points (max 150)
        const educationPoints: Record<string, number> = {
          "high-school": 30,
          "one-year": 64,
          "two-year": 104,
          "bachelor": 120,
          "master": 128,
          "phd": 135,
        };
        crs += educationPoints[input.education] || 0;
        if (input.canadianEducation) crs += 15;

        // Work experience points (max 80)
        crs += Math.min(input.workExperience * 2, 80);
        if (input.canadianWorkExperience > 0) crs += Math.min(input.canadianWorkExperience * 2, 20);

        // Language points (max 136)
        const languagePoints = input.listening + input.reading + input.writing + input.speaking;
        crs += Math.min(languagePoints * 2, 136);

        // Spouse points
        if (input.hasSpouse && input.spouseEducation) {
          const spouseEducationPoints: Record<string, number> = {
            "none": 0,
            "high-school": 13,
            "bachelor": 25,
            "master": 32,
          };
          crs += spouseEducationPoints[input.spouseEducation] || 0;
          if (input.spouseWorkExperience) crs += Math.min(input.spouseWorkExperience, 15);
          if (input.spouseLanguageScore) crs += Math.min(input.spouseLanguageScore * 2, 20);
        }

        // Job offer and provincial nomination
        if (input.hasJobOffer) crs += 50;
        if (input.hasProvincialNomination) crs += 600;

        return { crs: Math.round(crs) };
      }),
  }),

  // Blog management
  blog: router({
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
        coverImage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createBlogPost({
          ...input,
          published: false,
          authorId: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        category: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateBlogPost(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogPost(input.id);
      }),

    list: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        const posts = await getBlogPosts();
        if (input?.publishedOnly) {
          return posts.filter(p => p.published);
        }
        return posts;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getBlogPostBySlug(input.slug);
      }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await searchBlogPosts(input.query);
      }),
  }),

  // Success cases management
  successCases: router({
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        caseType: z.string().min(1),
        clientBackground: z.string().min(1),
        challenge: z.string().optional(),
        solution: z.string().min(1),
        outcome: z.string().min(1),
        coverImage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createSuccessCase({
          ...input,
          published: false,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        caseType: z.string().min(1).optional(),
        clientBackground: z.string().min(1).optional(),
        challenge: z.string().optional(),
        solution: z.string().min(1).optional(),
        outcome: z.string().min(1).optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateSuccessCase(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteSuccessCase(input.id);
      }),

    list: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        const cases = await getSuccessCases();
        if (input?.publishedOnly) {
          return cases.filter(c => c.published);
        }
        return cases;
      }),
  }),
});

export type AppRouter = typeof appRouter;
