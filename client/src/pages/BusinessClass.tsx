"use client";

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/OptimizedImage";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function BusinessClass() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [, navigate] = useLocation();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.businessclass);
  }, []);

  const serviceItems = [
    { label: "投资移民", href: "/businessclass" },
    { label: "家庭团聚移民", href: "/familyclass" },
    { label: "枫叶卡续签与加急", href: "/prcard" },
    { label: "拒签与程序公正信", href: "/reconsideration" },
    { label: "留学与访问", href: "/temporary" },
    { label: "技术移民", href: "/skillworker" },
    { label: "公民入籍", href: "/citizenship" },
  ];

  // Fetch success cases - only investment-immigration category using contentCategory
  const { data: successCases = [] } = trpc.posts.list.useQuery({
    type: "success-case",
    contentCategory: "investment-immigration",
    publishedOnly: true,
  });

  const content = {
    zh: {
      nav: {
        back: "返回主页",
        language: "ENG",
      },
      title: "投资移民",
      overview: {
        title: "投资移民：BC省企业家移民项目",
        text: "加拿大一向欢迎境外投资。作为加拿大经济最活跃的地区之一，温哥华所在的 BC 省拥有长期、稳定运行的省提名计划（BC PNP）企业家项目，旨在吸引能够促进当地经济增长的全球优秀商业人才。",
      },
      whoApplies: {
        title: "谁适合企业家移民项目？",
        text: "该项目主要针对拥有企业高级管理经验或企业实际控制人经验的申请人。如果您在商业领域建树颇丰，但在年龄或语言能力方面相对于传统的雇主担保项目不占优势，BC 企业家移民将是您的理想路径。",
      },
      categories: {
        title: "三大分支项目",
        items: [
          {
            name: "基础类",
            description: "面向个人企业家，主要审核申请人及配偶的家庭净资产和个人投资能力。资金门槛中等，要求个人出资并实际参与企业经营，投资地点可选择 BC 省内任意城市或社区。该类别采用 EOI 打分筛选机制，每份申请仅提名申请人本人及家庭成员。",
          },
          {
            name: "战略项目",
            description: "以海外企业作为申请主体，重点审核的是公司资产、企业规模和商业可行性，而非个人家庭资产。投资金额通常较高，适合已有成熟业务、计划在 BC 设立分支机构的企业。该类别不进入 EOI 打分池，且可一次性提名最多 5 名关键员工及其家庭成员。",
          },
          {
            name: "区域试点",
            description: "面向个人企业家，审核对象仍为个人及家庭资产，但资金和投资门槛明显低于基础类。项目必须落地于 BC 省指定的中小城市或社区，并取得当地推荐。采用简化的打分和社区审核结合方式，地域限制明确，但整体竞争压力相对较低，仅提名申请人本人及家庭成员。",
          },
        ],
      },
      process: {
        title: "项目申请流程",
        text: "整个申请大致分为两个阶段，一是项目初审和工签申请，二是登陆经营和最终报告。完整的流程如下：",
        steps: [
          "初步评估与咨询",
          "准备商业计划书与财务文件",
          "提交 EOI（意向书）或直接申请",
          "获得邀请（ITA）并递交工作签证申请",
          "工作签证获批后登陆经营企业",
          "提交最终报告并获得省提名",
          "申请永久居民身份",
        ],
      },
      cta: "立即预约咨询",
      successCases: "投资移民成功案例",
      readyText: "准备开启您的投资移民之旅了吗？",
    },
    en: {
      nav: {
        back: "Back to Home",
        language: "中文",
      },
      title: "Investment Immigration",
      overview: {
        title: "Investment Immigration: BC Entrepreneur Immigration Program",
        text: "Canada has always welcomed foreign investment. As one of Canada's most economically vibrant regions, British Columbia, home to Vancouver, operates a long-established and stable Provincial Nominee Program (BC PNP) Entrepreneur category, designed to attract globally talented business professionals who can promote local economic growth.",
      },
      whoApplies: {
        title: "Who Should Apply for the Entrepreneur Immigration Program?",
        text: "This program is primarily designed for applicants with senior management experience in enterprises or actual control experience. If you have achieved significant accomplishments in the business field but lack advantages in age or language proficiency compared to traditional employer-sponsored programs, BC Entrepreneur Immigration is your ideal pathway.",
      },
      categories: {
        title: "Three Program Categories",
        items: [
          {
            name: "Base Category",
            description: "Designed for individual entrepreneurs, primarily assessing the household net assets and personal investment capacity of applicants and spouses. The financial threshold is moderate, requiring personal investment and active participation in business operations. Investment location can be any city or community in BC. This category uses an EOI scoring mechanism, nominating only the applicant and family members.",
          },
          {
            name: "Strategic Projects",
            description: "Uses overseas enterprises as the application entity, focusing on company assets, enterprise scale, and business viability rather than personal household assets. Investment amounts are typically higher, suitable for established businesses planning to establish branch operations in BC. This category does not enter the EOI scoring pool and can nominate up to 5 key employees and their family members in a single application.",
          },
          {
            name: "Regional Pilot",
            description: "Designed for individual entrepreneurs, assessing personal and household assets, but with significantly lower financial and investment thresholds than the base category. Projects must be located in designated small and medium-sized cities or communities in BC and obtain local endorsement. Using simplified scoring and community review combined approach, with clear geographic restrictions but relatively lower overall competition, nominating only the applicant and family members.",
          },
        ],
      },
      process: {
        title: "Application Process",
        text: "The application process is divided into two main stages: initial project review and work visa application, followed by business operations and final reporting. The complete process is as follows:",
        steps: [
          "Initial Assessment and Consultation",
          "Prepare Business Plan and Financial Documents",
          "Submit EOI (Expression of Interest) or Direct Application",
          "Receive Invitation (ITA) and Submit Work Visa Application",
          "Establish Business Operations After Work Visa Approval",
          "Submit Final Report and Receive Provincial Nomination",
          "Apply for Permanent Residence",
        ],
      },
      cta: "Schedule Professional Consultation Now",
      successCases: "Investment Immigration Success Cases",
      readyText: "Ready to Start Your Investment Immigration Journey?",
    },
  };

  const t = isEnglish ? content.en : content.zh;

  // Add Google Font for Alibaba PuHuiTi Black
  const fontStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');
    .section-title {
      font-family: 'Noto Sans SC', sans-serif;
      font-weight: 900;
      font-size: 48px;
      letter-spacing: 0.5px;
    }
  `;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{fontStyle}</style>

      {/* Top Navigation Bar - Same as Home */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          {/* Logo */}
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'space-around', marginLeft: '32px' }}>
            <Link href="/">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? 'Home' : '首页'}</span>
            </Link>
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="flex items-center text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {isEnglish ? 'Services' : '服务'}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {servicesDropdownOpen && (
                <div
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-0 w-56 bg-white border border-border rounded-md shadow-lg z-50"
                >
                  {serviceItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer first:rounded-t-md last:rounded-b-md">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/success-cases">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? 'Success Cases' : '成功案例'}</span>
            </Link>
            <Link href="/blog">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? 'Blog' : '博客'}</span>
            </Link>
            <Link href="/team">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? 'About' : '关于我们'}</span>
            </Link>
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
            >
              {isEnglish ? '中文' : 'ENG'}
            </button>
            <Link href="/booking">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>{isEnglish ? 'Book Now' : '预约咨询'}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => navigate("/")}>
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Section 1: Overview */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="section-title text-foreground mb-6">{t.overview.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.overview.text}</p>
            </div>
            <div className="order-1 md:order-2">
              <OptimizedImage
                src="/images/aditya-chinchure-2-1772271722346-opt.webp"
                alt="Vancouver BC Skyline"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Who Applies */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/jhon-jim-5BIbTwXbTWk-unsplash-1772271864381-opt.webp"
                alt="Business Meeting"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div>
              <h2 className="section-title text-foreground mb-6">{t.whoApplies.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.whoApplies.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Categories */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="section-title text-foreground mb-8">{t.categories.title}</h2>
              <div className="space-y-8">
                {t.categories.items.map((item, index) => (
                  <div key={index} className="border-l-4 border-accent pl-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/img-1-opt.png"
                alt="BC Regions"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/document-submission-office-1771755684424-opt.webp"
                alt="Document Submission Office"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div>
              <h2 className="section-title text-foreground mb-6">{t.process.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t.process.text}</p>
              <ol className="space-y-3">
                {t.process.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-accent text-white font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section
        className="py-20 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/WZnaCRpbTuyKXGGm.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "400px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="container text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">{t.readyText}</h2>
          <a href="/booking">
            <Button
              size="lg"
              className="font-bold text-lg px-8 py-6"
              style={{
                borderRadius: '0px',
                borderWidth: '3px',
                borderColor: '#ffffff',
                color: '#ffffff',
                backgroundColor: '#388088'
              }}
            >
              {t.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Success Cases Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title text-foreground mb-4">{t.successCases}</h2>
            <p className="text-lg text-muted-foreground">
              {isEnglish ? "Real success stories from our clients" : "来自我们客户的真实成功故事"}
            </p>
          </div>

          {/* Success Cases Grid - Show max 3 cases or fewer if available */}
          {successCases.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {successCases.slice(0, 3).map((post) => (
              <a
                key={post.id}
                href={`/success-cases/${post.slug}`}
                className="bg-gray-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group flex flex-col"
                style={{ width: '450px', height: '360px' }}
              >
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex-shrink-0" style={{ height: '220px' }}>
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ borderRadius: "0px" }}
                    />
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>OXEC Immigration</span>
                    <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {isEnglish ? "No success cases available yet" : "暂无成功案例"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Use the same Footer component as Home */}
      <Footer />
    </div>
  );
}
