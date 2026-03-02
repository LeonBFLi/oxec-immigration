import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/OptimizedImage";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function Reconsideration() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [, navigate] = useLocation();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.reconsideration);
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

  // Fetch success cases - only reconsideration category using contentCategory
  const { data: successCases = [] } = trpc.posts.list.useQuery({
    type: "success-case",
    contentCategory: "reconsideration",
    publishedOnly: true,
  });

  const t = isEnglish ? {
    nav: {
      language: "中文",
    },
    title: "Visa Refusal and Procedural Fairness Letter",
    overview: {
      title: "Calmly Face Visa Refusal Risks",
      text: "Canada's entry application threshold ranks among the highest in the world. Every year, countless applicants face visa refusals due to various reasons, disrupting their work, family visits, or study plans. Facing refusal, there's no need to panic. OXEC specializes in handling various difficult and refused cases, with rich practical experience to help you turn crisis into opportunity through legal means.",
    },
    challenges: {
      title: "Why Was Your Application Refused?",
      text: "Visa refusals can occur for various reasons. Understanding the root cause is the first step toward resolution. Common reasons include:\n• Misrepresentation (Misrepresentation): Often due to memory errors or oversights, providing inaccurate information on visa refusal history, immigration history, or marital status.\n• Incomplete Documentation (Incomplete): Omitting key supporting documents due to operational errors, or submitting incorrect formats.\n• Criminal Inadmissibility (Inadmissible): Being deemed inadmissible due to criminal records outside Canada.",
    },
    pfLetter: {
      title: "Understanding the Procedural Fairness Letter",
      text: "A Procedural Fairness (PF) Letter is the immigration officer's final opportunity to give applicants a chance to respond before making a final refusal decision. When a visa officer has serious doubts about the authenticity of documents or the applicant's qualifications (such as suspecting misrepresentation), this letter is issued. This is the critical moment that determines the case's fate, requiring a precise legal response within the specified timeframe.",
    },
    solutions: {
      title: "OXEC's Professional Solutions",
      items: [
        {
          title: "Request for Reconsideration (Reconsideration)",
          description: "Supplement core evidence addressing the refusal reasons with logically rigorous legal defense."
        },
        {
          title: "Administrative Appeal",
          description: "On behalf of clients, file appeals to the Immigration Appeal Division when conditions permit."
        },
        {
          title: "PF Letter Deep Response",
          description: "Professional evidence organization and factual statements to seek withdrawal of doubts."
        },
        {
          title: "Criminal Rehabilitation",
          description: "Assist applicants with foreign criminal records to apply for Rehabilitation, permanently eliminating inadmissibility status."
        },
      ],
    },
    cta: "Schedule Urgent Consultation",
    successCases: "Visa Refusal Reconsideration Success Cases",
    readyText: "Need to Address Visa Refusal or Procedural Fairness Letter?",
  } : {
    nav: {
      language: "ENG",
    },
    title: "拒签和程序公正信",
    overview: {
      title: "冷静面对拒签风险",
      text: "加拿大的入境申请门槛位居世界前列，每年都有大量申请人因各种原因面临拒签，导致工作、探亲或学习计划中断。面对拒签，不必过度惊慌。傲赛（OXEC）专注于处理各类疑难及被拒案例，我们拥有丰富的实战经验，助您通过法律途径转危为安。",
    },
    challenges: {
      title: "为什么您的申请会被拒绝？",
      text: "拒签可能出于多种原因，了解根本原因是解决问题的第一步。常见原因包括：\n\n• 虚假陈述 (Misrepresentation)：常因记忆错误或疏忽，在拒签史、移民史或婚史等关键信息上提供不实说明。\n\n• 材料不完整 (Incomplete)：因操作失误遗漏关键证明文件，或提交了错误的格式。\n\n• 刑事不可入境 (Inadmissible)：因在加拿大境外留有犯罪记录，被判定为不可入境。",
    },
    pfLetter: {
      title: "程序公正信（Procedural Fairness Letter）",
      text: "PF Letter 是移民局在做出最终拒签决定前给予申请人的最后申辞机会。当签证官对材料真实性或申请人资格产生严重质疑（如怀疑虚假陈述）时会发出此信。这是决定案件生死的关键时刻，必须在规定时间内做出精准的法律回复。",
    },
    solutions: {
      title: "傲赛的专业解决方案",
      items: [
        {
          title: "要求重新考虑（Reconsideration）",
          description: "针对拒签理由补充核心证据，进行逻辑严密的法律辩护。"
        },
        {
          title: "行政申诉 (Appeal)",
          description: "在符合条件的情况下，代表客户向移民上诉委员会提出上诉。"
        },
        {
          title: "PF Letter 深度回复",
          description: "针对程序公正信进行专业的证据梳理与事实陈述，力求撤销质疑。"
        },
        {
          title: "刑事洗白 (Criminal Rehabilitation)",
          description: "协助有境外犯罪记录的申请人申请康复（Rehabilitation），永久消除不可入境状态。"
        },
      ],
    },
    cta: "预约紧急咨询",
    successCases: "拒签应对成功案例",
    readyText: "需要应对拒签或程序公正信吗？",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar */}
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
              <h2 className="section-title text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>{t.overview.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.overview.text}</p>
            </div>
            <div className="order-1 md:order-2">
              <OptimizedImage
                src="/images/colton-sturgeon-6KkYYqTEDwQ-1772276066720-opt.webp"
                alt="Calmly face visa refusal"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Challenges */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/reconsideration-refusal-1772275990300-opt.webp"
                alt="Why was your application refused"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div>
              <h2 className="section-title text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>{t.challenges.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{t.challenges.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: PF Letter */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="section-title text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900 }}>{t.pfLetter.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.pfLetter.text}</p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/images/reconsideration-pf-letter-1772276710376-opt.webp"
                alt="Procedural Fairness Letter"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-1 md:order-1">
              <img
                src="/images/reconsideration-team-opt.jpg"
                alt="Professional solutions"
                className="w-full h-auto shadow-lg object-cover"
                style={{ aspectRatio: "16/9", borderRadius: "0px" }}
              />
            </div>
            <div className="order-2 md:order-2">
              <h2 className="section-title text-foreground mb-8" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>{t.solutions.title}</h2>
              <div className="space-y-8">
                {t.solutions.items.map((item, index) => (
                  <div key={index} className="border-l-4 border-accent pl-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900 }}>需要应对拒签或程序公正信吗？</h2>
          <a href="/booking">
            <Button
              size="lg"
              className="font-bold text-lg px-8 py-6"
              title="预约紧急咨询"
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
            <h2 className="section-title text-foreground mb-4" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 48px)' }}>{t.successCases}</h2>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
