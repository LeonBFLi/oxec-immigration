'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function PRCard() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.prcard);
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

  // Image URLs for PR Card sections - using related images from existing library
  // Section 1: PR Card and documents
  const prcardImage1 = '/images/prcard-overview-1772273396713-opt.webp';
  // Section 2: Risk assessment - using professional team image
  const prcardImage2 = '/images/prcard-challenges-1772273413033-opt.webp';
  // Section 3: Solutions - using document submission office image
  const prcardImage3 = '/images/prcard-urgent-boarding-1772273405184-opt.webp';
  // CTA background - same as /businessclass and /familyclass
  const ctaBackgroundImage = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/WZnaCRpbTuyKXGGm.jpg';
  // Section 5: Trust and expertise - using professional team image
  const trustImage = '/images/reconsideration-team-opt.jpg';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar - Same as Home */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          {/* Logo */}
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          {/* Desktop Menu */}
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

      <div className="flex-1">
        {/* Section 1: Overview */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: '48px' }}>
                  {isEnglish ? "PR Card Renewal: Maintaining Your Permanent Resident Status" : "枫叶卡续签：保持您的永居身份"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isEnglish 
                    ? "As a Canadian Permanent Resident (PR), holding a valid PR card is your essential credential for entering and exiting Canada and maintaining your status. According to legal requirements, permanent residents typically need to accumulate 730 days of physical presence in Canada within the past five years. Timely and compliant card renewal is crucial to protecting your long-term living rights in Canada."
                    : "作为加拿大永久居民（PR），持有有效的枫叶卡是您出入国境及维持身份的必要凭证。根据法律要求，永久居民通常需在过去五年内在加拿大境内累计住满 730 天。准时且合规地完成续卡申请，是保障您在加拿大长期生活权益的关键一步。"}
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img src={prcardImage1} alt="PR Card" className="w-full h-auto shadow-lg object-cover" style={{ aspectRatio: "16/9", borderRadius: "0px" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Your Renewal May Face Risks */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src={prcardImage2} alt="Renewal Risks" className="w-full h-auto shadow-lg object-cover" style={{ aspectRatio: "16/9", borderRadius: "0px" }} />
              </div>
              <div>
                <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: '48px' }}>
                  {isEnglish ? "Why Your Renewal Application May Face Risks?" : "为什么您的续卡申请可能面临风险？"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {isEnglish
                    ? "In actual applications, many permanent residents face renewal obstacles due to the following unexpected situations:"
                    : "在实际申请中，许多永久居民常因以下突发状况导致续签受阻："}
                </p>
                <div className="space-y-4">
                  {isEnglish ? (
                    <>
                      <p className="text-lg text-muted-foreground">• Residence time calculation errors: Due to frequent border crossings, actual residence days may not accurately reach 730 days.</p>
                      <p className="text-lg text-muted-foreground">• Prolonged stay abroad: Due to family, health, or unexpected external factors, unable to return to Canada timely, resulting in insufficient residence time.</p>
                      <p className="text-lg text-muted-foreground">• Emergency in home country: Urgent domestic matters requiring immediate handling necessitate leaving, but the PR card is already expired or about to expire, facing the dilemma of being unable to return.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg text-muted-foreground">• 居住时间计算失误：因频繁出入境，导致实际居留天数未能精准达到 730 天。</p>
                      <p className="text-lg text-muted-foreground">• 因故滞留境外：由于家庭、健康或突发外部环境因素，未能及时返回加拿大，导致居留时长不足。</p>
                      <p className="text-lg text-muted-foreground">• 原籍国紧急状况：国内发生必须亲自处理的紧急事务需要立即离境，但此时枫叶卡已过期或即将到期，面临困境。</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Humanitarian Exemption and Urgent Processing */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: '48px' }}>
                  {isEnglish ? "Humanitarian Exemption and Urgent Processing" : "人道豁免与加急办理"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {isEnglish
                    ? "For insufficient residence time or urgent travel needs, we provide two core solutions:"
                    : "针对居留时间不足或紧急离境的需求，我们提供两种核心应对方案："}
                </p>
                <div className="space-y-4">
                  {isEnglish ? (
                    <>
                      <p className="text-lg text-muted-foreground">• H&C Humanitarian Exemption Application: If you failed to meet the required residence time due to circumstances beyond your control, we can assist you in applying to Immigration, Refugees and Citizenship Canada (IRCC) for a waiver of residence requirements based on humanitarian and compassionate grounds.</p>
                      <p className="text-lg text-muted-foreground">• Urgent Processing: For customers with urgent travel needs (such as direct family members' critical illness, urgent business trips, etc.), we can apply for expedited processing channels to significantly reduce the approval cycle.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg text-muted-foreground">• H&C 人道理由豁免申请：若您因无法控制的特殊原因未能住满规定时间，我们可协助您通过人道主义和同情理由向移民局申请居留要求豁免。</p>
                      <p className="text-lg text-muted-foreground">• 加急续签处理：针对有紧急旅行需求（如直系亲属重病、商务紧急出差等）的客户，我们可以申请加急处理通道，显著缩短获批周期。</p>
                    </>
                  )}
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img src={prcardImage3} alt="Solutions" className="w-full h-auto shadow-lg object-cover" style={{ aspectRatio: "16/9", borderRadius: "0px" }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Background Image */}
        <section
          className="py-20 flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundImage: `url('${ctaBackgroundImage}')`,
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
              {isEnglish ? "Do you need PR card renewal services?" : "您是否需要办理枫叶卡续签？"}
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
                {isEnglish ? "Book a Consultation Now" : "立即预约咨询"}
              </Button>
            </a>
          </div>
        </section>

        {/* Section 5: Trust OXEC - Left Image Right Text */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img src={trustImage} alt="Professional Team" className="w-full h-auto shadow-lg object-cover" style={{ aspectRatio: "16/9", borderRadius: "0px" }} />
              </div>
              <div>
                <h2 className="text-foreground mb-6" style={{ fontFamily: '"Alibaba PuHuiTi", sans-serif', fontWeight: 900, fontSize: '48px' }}>
                  {isEnglish ? "Trust OXEC, Professional Guidance" : "信任傲赛，专业护航"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? "PR card renewal may seem like a simple process, but once it involves residence time defects, it can easily trigger immigration background investigations and even result in loss of status. OXEC has accumulated deep practical experience in handling various difficult renewal cases and humanitarian exemption applications. We are committed to providing professional legal guidance and strategic case management to safeguard your permanent resident status."
                    : "枫叶卡续签看似流程简单，但一旦涉及居留时间瑕疵，极易触发移民局的背景调查甚至导致身份丧失。傲赛（OXEC）在处理各类疑难续卡、人道豁免案件中积累了深厚的实战经验。我们致力于通过专业的法律指导和战略性的案件管理，为您的永久居民身份保驾护航。"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
