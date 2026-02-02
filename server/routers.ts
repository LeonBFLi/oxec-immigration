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
        consultationType: z.enum(["phone", "in-person"]),
        preferredDate: z.date(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createAppointment(input);
        
        // Send email to Business@oxecimm.com
        try {
          const emailContent = `New Appointment Request\nName: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nConsultation Type: ${input.consultationType}\nPreferred Date: ${input.preferredDate.toLocaleString()}\nMessage: ${input.message || 'N/A'}`;
          console.log('Email to be sent to Business@oxecimm.com:', emailContent);
        } catch (error) {
          console.error('Failed to send email:', error);
        }
        
        // Notify owner
        await notifyOwner({
          title: "New Appointment Booking",
          content: `New appointment from ${input.name} (${input.email})\nType: ${input.consultationType}\nPreferred Date: ${input.preferredDate.toLocaleString()}\nMessage: ${input.message || 'N/A'}`,
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
      .mutation(({ input }) => {
        let totalScore = 0;
        
        // Age points (max 110 for single, 100 with spouse)
        const agePoints = input.hasSpouse ? 
          (input.age >= 18 && input.age <= 29 ? 100 : input.age <= 35 ? 95 : input.age <= 39 ? 85 : 75) :
          (input.age >= 18 && input.age <= 29 ? 110 : input.age <= 35 ? 105 : input.age <= 39 ? 99 : 90);
        totalScore += agePoints;
        
        // Education points (max 150 for single, 140 with spouse)
        const eduMap = input.hasSpouse ? 
          { "high-school": 28, "one-year": 84, "two-year": 91, "bachelor": 112, "master": 126, "phd": 140 } :
          { "high-school": 30, "one-year": 90, "two-year": 98, "bachelor": 120, "master": 135, "phd": 150 };
        totalScore += eduMap[input.education];
        
        // Language points (max 136 for single, 128 with spouse)
        const avgLanguage = (input.listening + input.reading + input.writing + input.speaking) / 4;
        const langPoints = input.hasSpouse ?
          (avgLanguage >= 9 ? 128 : avgLanguage >= 8 ? 120 : avgLanguage >= 7 ? 110 : 90) :
          (avgLanguage >= 9 ? 136 : avgLanguage >= 8 ? 128 : avgLanguage >= 7 ? 116 : 96);
        totalScore += langPoints;
        
        // Work experience points (max 80 for single, 70 with spouse)
        const workPoints = input.hasSpouse ?
          (input.workExperience >= 5 ? 70 : input.workExperience >= 3 ? 63 : 35) :
          (input.workExperience >= 5 ? 80 : input.workExperience >= 3 ? 70 : 40);
        totalScore += workPoints;
        
        // Canadian work experience (max 80)
        const canWorkPoints = input.canadianWorkExperience >= 2 ? 80 : input.canadianWorkExperience >= 1 ? 40 : 0;
        totalScore += canWorkPoints;
        
        // Additional points
        if (input.hasJobOffer) totalScore += 50;
        if (input.hasProvincialNomination) totalScore += 600;
        if (input.canadianEducation) totalScore += 30;
        
        // Spouse points
        if (input.hasSpouse && input.spouseEducation && input.spouseEducation !== "none") {
          const spouseEduMap = { "high-school": 2, "bachelor": 6, "master": 10 };
          totalScore += spouseEduMap[input.spouseEducation] || 0;
        }
        
        return {
          totalScore,
          breakdown: {
            age: agePoints,
            education: eduMap[input.education],
            language: langPoints,
            workExperience: workPoints,
            canadianWorkExperience: canWorkPoints,
            jobOffer: input.hasJobOffer ? 50 : 0,
            provincialNomination: input.hasProvincialNomination ? 600 : 0,
          },
          eligible: totalScore >= 67,
          message: totalScore >= 470 ? "Excellent score! You have a strong chance." :
                   totalScore >= 400 ? "Good score! Consider improving language or work experience." :
                   totalScore >= 350 ? "Moderate score. Focus on improving key factors." :
                   "Consider gaining more experience or improving language scores.",
        };
      }),
  }),

  // Blog posts
  blog: router({
    list: publicProcedure
      .input(z.object({
        publishedOnly: z.boolean().default(true),
      }).optional())
      .query(async ({ input }) => {
        return await getBlogPosts(input?.publishedOnly ?? true);
      }),
    
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await getBlogPostBySlug(input);
      }),
    
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await searchBlogPosts(input.query || "", input.category);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await createBlogPost({
          ...input,
          authorId: ctx.user.id,
        });
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBlogPost(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await deleteBlogPost(input);
        return { success: true };
      }),
  }),

  // Success cases
  successCases: router({
    list: publicProcedure
      .input(z.object({
        publishedOnly: z.boolean().default(true),
      }).optional())
      .query(async ({ input }) => {
        return await getSuccessCases(input?.publishedOnly ?? true);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        caseType: z.string().min(1),
        clientBackground: z.string().min(1),
        challenge: z.string().optional(),
        solution: z.string().min(1),
        outcome: z.string().min(1),
        coverImage: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await createSuccessCase(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        caseType: z.string().optional(),
        clientBackground: z.string().optional(),
        challenge: z.string().optional(),
        solution: z.string().optional(),
        outcome: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateSuccessCase(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await deleteSuccessCase(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
