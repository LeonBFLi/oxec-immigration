'use client';

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Footer } from "@/components/Footer";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function FamilyClass() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.familyclass);
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

  // Fetch success cases - only family-reunion category using contentCategory
  const { data: successCases = [] } = trpc.posts.list.useQuery({
    type: "success-case",
    contentCategory: "family-reunion",
    publishedOnly: true,
  });

  // Image URLs for family reunion sections
  const familyImage1 = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/oqyCwXSpqVZjOXit.jpg';
  const familyImage2 = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/sxLiylhjEbzOSvBQ.jpg';
  const familyImage3 = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/yQpDINPnXnfonPlF.jpg';
  // Use the same image as /businessclass for project application process
  const processImage = '/images/document-submission-office-1771755684424-opt.webp';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar - Same as Home */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          {/* Logo */}
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          {/* Desktop Menu - Single Unified Navigation Group */}
          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'space-around', marginLeft: '32px' }}>
            <Link href="/">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? "Home" : "首页"}</span>
            </Link>
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="flex items-center text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {isEnglish ? "Services" : "服务"}
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
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? "Success Cases" : "成功案例"}</span>
            </Link>
            <Link href="/blog">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? "Blog" : "博客"}</span>
            </Link>
            <Link href="/team">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{isEnglish ? "About" : "关于我们"}</span>
            </Link>
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
            >
              {isEnglish ? "中文" : "ENG"}
            </button>
            <Link href="/booking">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>{isEnglish ? "Book Now" : "预约咨询"}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="container py-4 space-y-3">
              <Link href="/">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">{isEnglish ? "Home" : "首页"}</span>
              </Link>
              <Link href="/success-cases">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">{isEnglish ? "Success Cases" : "成功案例"}</span>
              </Link>
              <Link href="/blog">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">{isEnglish ? "Blog" : "博客"}</span>
              </Link>
              <Link href="/team">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">{isEnglish ? "About" : "关于我们"}</span>
              </Link>
              <button
                onClick={() => setIsEnglish(!isEnglish)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2"
              >
                {isEnglish ? "中文" : "ENG"}
              </button>
              <Link href="/booking">
                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                  <span>{isEnglish ? "Book Now" : "预约咨询"}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Overview - Left Image Right Text */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>
                {isEnglish ? "Family Reunion Immigration: Bringing Love Together in Canada" : "与家人在加拿大团聚"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isEnglish 
                  ? "The Canadian government believes that family completeness is the foundation of social stability and prosperity. Based on deep humanitarian care, Canada's immigration system regards family reunification as one of its core objectives. Whether it's spouses, children, or parents, we are committed to providing professional legal services to shorten the distance and help your family start a new chapter of life together in the Maple Leaf nation."
                  : "加拿大政府深信，家庭的完整是社会稳定与繁荣的基石。基于深厚的人道主义关怀，加拿大移民体系将家庭团聚视为核心宗旨之一。无论是配偶、子女还是父母，我们致力于通过专业的法律服务，缩短时空距离，帮助您的家人在枫叶之国开启共同生活的新篇章。"
                }
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={familyImage1}
                alt="Family Reunion"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Who Can Sponsor - Left Image Right Text */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={familyImage2}
                alt="Sponsor"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div>
              <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>
                {isEnglish ? "Who Can Sponsor Family Members?" : "谁可以担保家庭成员？"}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-3">
                {isEnglish ? (
                  <>
                    <p>• Must be a Canadian citizen or permanent resident (PR).</p>
                    <p>• Must be at least 18 years old.</p>
                    <p>• Must be able to demonstrate sufficient financial capacity to support the sponsored person's basic living needs in Canada.</p>
                    <p>• Must sign a sponsorship agreement, committing to provide financial support for the sponsored person for a certain period.</p>
                  </>
                ) : (
                  <>
                    <p>• 必须是加拿大公民或永久居民（PR）。</p>
                    <p>• 年满 18 周岁。</p>
                    <p>• 能够证明有足够的经济能力负担受担保人在加拿大期间的基本生活需求。</p>
                    <p>• 签署担保协议，承诺在一定期限内为受担保人提供财务支持。</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Which Relatives Can Be Sponsored - Left Image Right Text */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>
                {isEnglish ? "Which Relatives Can Be Sponsored?" : "哪些亲属可以被担保？"}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-3">
                {isEnglish ? (
                  <>
                    <p>• Spouses and Partners: Including legal spouses, common-law partners, or conjugal partners.</p>
                    <p>• Dependent Children: Usually under 22 years old and unmarried.</p>
                    <p>• Parents and Grandparents: Through annual quotas or super visa programs.</p>
                    <p>• Other Relatives: In specific special circumstances (such as orphaned siblings) may apply.</p>
                  </>
                ) : (
                  <>
                    <p>• 配偶和伴侣：包括法律配偶、同居伴侣或非婚伴侣。</p>
                    <p>• 受抚养子女：通常在 22 岁以下且未婚。</p>
                    <p>• 父母和祖父母：通过年度配额抽签。</p>
                    <p>• 其他亲属：在特定特殊情况下（如孤儿兄弟姊妹）可申请。</p>
                  </>
                )}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={familyImage3}
                alt="Family Members"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
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
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            {isEnglish ? "Ready to Reunite Your Family in Canada?" : "准备与您的家人在加拿大团聚吗？"}
          </h2>
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
              {isEnglish ? "Book Now" : "立即预约咨询"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Section 4: Application Process - Left Image Right Text */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={processImage}
                alt="Document Submission Office"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div>
              <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>
                {isEnglish ? "Project Application Process" : "项目申请流程"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {isEnglish
                  ? "There are two main pathways: In-land sponsorship (for those already in Canada) and Out-land sponsorship (for those outside Canada). PR sponsors must remain in Canada throughout the application; citizen sponsors can apply from abroad but must declare plans to return to Canada."
                  : "存在两种主要途径：境内担保（针对已在加拿大的申请人）和境外担保（针对在加拿大以外的申请人）。在申请期间，PR担保人需要一直待在加拿大境内；公民担保人可以从境外递交但必须表明计划回加定居。"
                }
              </p>
              <ol className="space-y-3">
                {(isEnglish
                  ? [
                      "Qualifications Assessment and Consultation",
                      "Prepare Documentation and Relationship Proof",
                      "Verify Document Completeness",
                      "Submit Application",
                      "Security and Medical Checks",
                      "Obtain Permanent Resident Status",
                    ]
                  : [
                      "资质评估与方案咨询",
                      "准备文件与关系证明",
                      "检查材料完整性",
                      "递交申请",
                      "安全与医疗检查",
                      "获得永久居民身份",
                    ]
                ).map((step, index) => (
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

      {/* Success Cases Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: '48px' }}>
              {isEnglish ? "Family Reunion Success Cases" : "家庭团聚成功案例"}
            </h2>
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
