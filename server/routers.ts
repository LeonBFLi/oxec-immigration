import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
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
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getPostBySlug,
  getPosts,
  searchPosts,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendAppointmentEmail } from "./_core/emailService";
import { calculateCRS as calculateCRSLogic } from "./crsCalculator";
import { getRealGoogleReviews } from "./googlePlacesAPI";
import { storagePut } from "./storage";
import { imagesRouter } from "./routers/images";
import { adminAuthRouter } from "./routers/admin-auth";



// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  images: imagesRouter,
  adminAuth: adminAuthRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    calculateBCPNP: publicProcedure
      .input(z.object({
        workExperience: z.enum(["5plus", "4to5", "3to4", "2to3", "1to2", "below1", "none"]),
        canadianExperience: z.boolean(),
        currentlyWorking: z.boolean(),
        education: z.enum(["phd", "masters", "postgrad", "bachelor", "associate", "diploma", "highschool"]),
        bcEducation: z.boolean(),
        canadaEducation: z.boolean(),
        designatedOccupation: z.boolean(),
        languageTest: z.enum(["ielts", "celpip", "pte"]),
        listening: z.number().min(0).max(100),
        reading: z.number().min(0).max(100),
        writing: z.number().min(0).max(100),
        speaking: z.number().min(0).max(100),
        frenchLanguage: z.boolean(),
        hourlyWage: z.number().min(0),
        region: z.enum(["tier1", "tier2", "tier3"]),
        regionWorkExperience: z.boolean(),
        regionEducation: z.boolean(),
      }))
      .query(({ input }) => {
        const breakdown: Record<string, any> = {
          相关工作经验: 0,
          学历背景: 0,
          语言能力: 0,
          经济因素: 0,
        };

        // 工作经验评分
        const expScores: Record<string, number> = {
          "5plus": 80,
          "4to5": 70,
          "3to4": 60,
          "2to3": 50,
          "1to2": 40,
          "below1": 20,
          "none": 0,
        };
        breakdown.相关工作经验 = expScores[input.workExperience];
        if (input.canadianExperience) breakdown.相关工作经验 += 15;

        // 教育背景评分
        const eduScores: Record<string, number> = {
          "phd": 100,
          "masters": 90,
          "postgrad": 80,
          "bachelor": 75,
          "associate": 60,
          "diploma": 50,
          "highschool": 30,
        };
        breakdown.学历背景 = eduScores[input.education];
        if (input.bcEducation || input.canadaEducation) breakdown.学历背景 += 15;

        // 语言能力评分
        const langScores: Record<string, number> = {
          "ielts": 0,
          "celpip": 0,
          "pte": 0,
        };
        const avgScore = (input.listening + input.reading + input.writing + input.speaking) / 4;
        breakdown.语言能力 = Math.min(100, avgScore * 10);
        if (input.frenchLanguage) breakdown.语言能力 += 15;

        // 经济因素评分
        const wageScore = Math.min(100, (input.hourlyWage / 50) * 100);
        breakdown.经济因素 = wageScore;

        const total = Object.values(breakdown).reduce((a: number, b: number) => a + b, 0) / 4;
        return {
          breakdown,
          totalScore: Math.round(total),
          recommendation:
            total >= 75
              ? "有竞争力，建议申请"
              : total >= 50
              ? "中等竞争力，可以尝试"
              : "竞争力较弱，建议提升",
        };
      }),
  }),

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
        const result = await createAppointment(input);
        await sendAppointmentEmail(input);
        return result;
      }),

    list: protectedProcedure.query(async () => {
      return await getAppointments();
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteAppointment(input.id);
      }),
  }),

  calculator: router({
    calculateCRS: publicProcedure
      .input(z.any())
      .query(async ({ input }) => {
        return await calculateCRSLogic(input as any);
      }),

    calculateBCPNP: publicProcedure
      .input(z.object({
        workExperience: z.enum(["5plus", "4to5", "3to4", "2to3", "1to2", "below1", "none"]),
        canadianExperience: z.boolean(),
        currentlyWorking: z.boolean(),
        education: z.enum(["phd", "masters", "postgrad", "bachelor", "associate", "diploma", "highschool"]),
        bcEducation: z.boolean(),
        canadaEducation: z.boolean(),
        designatedOccupation: z.boolean(),
        languageTest: z.enum(["ielts", "celpip", "pte"]),
        listening: z.number().min(0).max(100),
        reading: z.number().min(0).max(100),
        writing: z.number().min(0).max(100),
        speaking: z.number().min(0).max(100),
        frenchLanguage: z.boolean(),
        hourlyWage: z.number().min(0),
        region: z.enum(["tier1", "tier2", "tier3"]),
        regionWorkExperience: z.boolean(),
        regionEducation: z.boolean(),
      }))
      .query(({ input }) => {
        const breakdown: Record<string, any> = {
          相关工作经验: 0,
          学历背景: 0,
          语言能力: 0,
          经济因素: 0,
        };

        // 工作经验评分
        const expScores: Record<string, number> = {
          "5plus": 80,
          "4to5": 70,
          "3to4": 60,
          "2to3": 50,
          "1to2": 40,
          "below1": 20,
          "none": 0,
        };
        breakdown.相关工作经验 = expScores[input.workExperience];
        if (input.canadianExperience) breakdown.相关工作经验 += 15;

        // 教育背景评分
        const eduScores: Record<string, number> = {
          "phd": 100,
          "masters": 90,
          "postgrad": 80,
          "bachelor": 75,
          "associate": 60,
          "diploma": 50,
          "highschool": 30,
        };
        breakdown.学历背景 = eduScores[input.education];
        if (input.bcEducation || input.canadaEducation) breakdown.学历背景 += 15;

        // 语言能力评分
        const langScores: Record<string, number> = {
          "ielts": 0,
          "celpip": 0,
          "pte": 0,
        };
        const avgScore = (input.listening + input.reading + input.writing + input.speaking) / 4;
        breakdown.语言能力 = Math.min(100, avgScore * 10);
        if (input.frenchLanguage) breakdown.语言能力 += 15;

        // 经济因素评分
        const wageScore = Math.min(100, (input.hourlyWage / 50) * 100);
        breakdown.经济因素 = wageScore;

        const total = Object.values(breakdown).reduce((a: number, b: number) => a + b, 0) / 4;
        return {
          breakdown,
          totalScore: Math.round(total),
          recommendation:
            total >= 75
              ? "有竞争力，建议申请"
              : total >= 50
              ? "中等竞争力，可以尝试"
              : "竞争力较弱，建议提升",
        };
      }),
  }),

  reviews: router({
    list: publicProcedure.query(async () => {
      return await getRealGoogleReviews();
    }),
  }),

  posts: router({
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        type: z.enum(["blog", "success-case"]),
        blogCategory: z.enum(["policy-interpretation", "news", "immigration-life", "immigration-story", "immigration-project"]).optional(),
        contentCategory: z.enum(["investment-immigration", "family-reunion", "maple-leaf-renewal", "reconsideration", "temporary-resident", "skilled-worker", "citizenship", "other"]).optional(),
        tags: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createPost({
          ...input,
          published: input.published ?? false,
          publishedAt: input.publishedAt,
          authorId: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        blogCategory: z.enum(["policy-interpretation", "news", "immigration-life", "immigration-story", "immigration-project"]).optional(),
        contentCategory: z.enum(["investment-immigration", "family-reunion", "maple-leaf-renewal", "reconsideration", "temporary-resident", "skilled-worker", "citizenship", "other"]).optional(),
        tags: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { id, ...data } = input;
          const result = await updatePost(id, data);
          return result;
        } catch (error: any) {
          console.error("[Posts Update Error]", error);
          if (error.code === 'ER_DUP_ENTRY') {
            throw new TRPCError({
              code: "CONFLICT",
              message: `文章Slug已存在: ${input.slug}`,
            });
          }
          throw error;
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          return await deletePost(input.id);
        } catch (error) {
          console.error("[Posts Delete Error]", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "删除文章失败",
          });
        }
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await getPostById(input.id);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "文章不存在",
          });
        }
        return post;
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        // 尝试按slug查询，如果slug是数字，也尝试按ID查询
        let post = await getPostBySlug(input.slug);
        
        // 如果slug是数字，尝试按ID查询
        if (!post && /^\d+$/.test(input.slug)) {
          const id = parseInt(input.slug, 10);
          post = await getPostById(id);
        }
        
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "文章不存在",
          });
        }
        return post;
      }),

    list: publicProcedure
      .input(z.object({
        type: z.enum(["blog", "success-case"]).optional(),
        blogCategory: z.string().optional(),
        contentCategory: z.string().optional(),
        publishedOnly: z.boolean().default(true),
        limit: z.number().default(10),
      }).optional())
      .query(async ({ input }) => {
        return await getPosts({
          type: input?.type,
          blogCategory: input?.blogCategory,
          contentCategory: input?.contentCategory,
          publishedOnly: input?.publishedOnly ?? true,
          limit: input?.limit,
        });
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        type: z.enum(["blog", "success-case"]).optional(),
      }))
      .query(async ({ input }) => {
        return await searchPosts(input.query, {
          type: input.type,
        });
      }),

    upload: adminProcedure
      .input(z.object({
        file: z.string(),
        filename: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const base64Data = input.file.split(',')[1] || input.file;
          const buffer = Buffer.from(base64Data, 'base64');
          
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const ext = input.filename.split('.').pop() || 'jpg';
          const fileKey = `posts/${timestamp}-${randomStr}.${ext}`;
          
          const result = await storagePut(fileKey, buffer, `image/${ext}`);
          
          return {
            success: true,
            url: result.url,
            key: result.key,
          };
        } catch (error) {
          console.error('图片上传失败:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '图片上传失败',
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
