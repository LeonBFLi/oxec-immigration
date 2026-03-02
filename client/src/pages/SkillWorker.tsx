import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { updateMetaTags, pageMetaTags } from '@/lib/meta-tags';

export default function SkillWorker() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.skillworker);
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

  const sidebarMenuItems = [
    { id: 'overview', label: isEnglish ? 'Overview' : '技术移民概览' },
    { id: 'ee', label: isEnglish ? 'Express Entry' : '联邦快速通道' },
    { id: 'bcpnp', label: isEnglish ? 'BC PNP' : 'BC省提名' },
    { id: 'lmia', label: isEnglish ? 'LMIA Work Permit' : 'LMIA工签' },
    { id: 'ict', label: isEnglish ? 'ICT Work Permit' : 'ICT工签' },
    { id: 'pgwp', label: isEnglish ? 'PGWP' : '毕业后工签' },
    { id: 'assessment', label: isEnglish ? 'Assessment' : '评估加分' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 75,
        behavior: 'smooth',
      });
    }
  };

  // Scroll spy: detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarMenuItems.map(item => item.id);
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663292376041/CeepOLbixyTTUyft.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Navigation Bar - Sticky */}
      <nav className="sticky top-0 z-40 bg-white border-b border-border shadow-sm" style={{ height: '55px' }}>
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
          <button className="md:hidden" onClick={() => {}}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex relative" style={{ minHeight: 'calc(100vh - 55px)' }}>
        {/* Left Sidebar Navigation - Dark Slate, Sticky */}
        <aside 
          className="hidden md:flex flex-col sticky"
          style={{
            width: '240px',
            top: '55px',
            backgroundColor: '#1E293B',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            height: 'fit-content',
            zIndex: 30,
            maxHeight: 'calc(100vh - 55px)',
            overflowY: 'auto',
          }}
        >
          {/* Sidebar Content */}
          <nav className="p-6 space-y-2">
            <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-wider opacity-70">
              {isEnglish ? 'Navigation' : '导航菜单'}
            </h3>
            
            {sidebarMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-3 transition-all duration-200 relative group text-white text-sm font-medium"
                style={{
                  backgroundColor: activeSection === item.id ? '#334155' : 'transparent',
                  color: activeSection === item.id ? '#FFFFFF' : '#CBD5E1',
                }}
              >
                {/* Blue indicator bar for active item */}
                {activeSection === item.id && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: '#0061FF' }}
                  />
                )}
                <span className="block ml-2">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Area - Flex 1 to expand */}
        <main className="flex-1 flex flex-col" style={{ marginRight: '20px' }}>
          {/* Content Wrapper with padding */}
          <div className="flex-1 py-12 px-4 md:px-8">
            {/* Single Frosted Glass Container - All Content Inside */}
            <div
              className="w-full mx-auto p-8 md:p-12 shadow-lg"
              style={{
                maxWidth: '1400px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Section 0: Overview */}
              <section id="overview" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'Skilled Immigration: The Golden Path to Canada'
                        : '技术移民：通往加拿大的黄金路径'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {isEnglish
                        ? 'Canada consistently welcomes global talent. Among major English-speaking immigration countries, Canada offers the most attractive policies and is the most reliable country for obtaining permanent residency (PR) through employment. Thanks to the federal-provincial shared immigration system, applicants can flexibly plan their immigration strategy through Federal Express Entry (EE) or provincial nomination programs (PNP).'
                        : '加拿大始终向全球技术人才敞开大门。在主要英语移民国家中，加拿大拥有最具吸引力的政策，是通过工作获得永居身份（PR）最稳妥的国家。得益于联邦与各省共管移民事务的体制，申请人可以通过联邦快速通道 (Express Entry) 或各省的省提名计划 (PNP) 灵活规划移民方案。'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/img-1-opt.jpg"
                      alt="Skilled Workers"
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 1: Express Entry */}
              <section id="ee" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="md:order-2">
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'Express Entry: Efficient and Transparent Choice'
                        : '联邦快速通道：高效透明的选择'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {isEnglish
                        ? '• Profile Creation: Calculate your CRS score based on age, education, language proficiency, and work experience.\n\n• Invitation to Apply (ITA): Wait for the federal immigration department to issue invitations based on category-specific cutoff scores.\n\n• Formal Application: After receiving an invitation, submit complete documentation. Processing typically completes within 6 months.'
                        : '• 入池 (Profile Creation)：根据年龄、学历、语言及工作经验计算 CRS 分数。\n\n• 抽签 (ITA)：等待联邦移民部根据各类别分数线发放邀请。\n\n• 正式申请：获得邀请后递交完整材料，通常在 6 个月内完成审理。'}
                    </p>
                  </div>
                  <div className="md:order-1" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/skillworker-express-entry-1772278274410-opt.webp"
                      alt="Express Entry"
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 2: BC PNP */}
              <section id="bcpnp" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'BC PNP: Ideal Choice for Experienced Professionals'
                        : 'BC 省省提名：成熟职场人的理想选择'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {isEnglish
                        ? 'BC PNP is particularly suitable for applicants with mature work experience in relevant industries who may no longer have age-based advantages in Express Entry scores. By securing a long-term offer from a BC employer, applicants can lock in provincial nomination points and ensure immigration success.'
                        : 'BC PNP 尤其适合在相关行业有成熟工作经验、但可能在年龄方面不再具备 EE 分数优势的申请人。通过获得 BC 省雇主的长期聘书，申请人可以锁定省提名加分，确保移民成功率。'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/lee-robinson-Yc9h5SJdEzI-unsplash-1772278138053-opt.webp"
                      alt="BC PNP"
                      className="w-full h-auto object-cover"
                      style={{ maxWidth: '100%', aspectRatio: '16/9' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: LMIA */}
              <section id="lmia" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="md:order-2">
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'LMIA: Foundation of Work Permits'
                        : 'LMIA 劳动力市场影响评估：工签的基石'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {isEnglish
                        ? '• Definition: LMIA is a document Canadian employers submit to the Department of Labor to prove they cannot find suitable local employees and need to hire foreign workers.\n\n• Wage Classification: Based on provincial median wages—high-wage positions typically receive longer work permit validity (usually 3 years), while low-wage positions face stricter ratio restrictions and shorter validity periods.'
                        : '• 定义：LMIA 是加拿大雇主向劳工部申请，证明无法在本地招到合适员工而需聘请外劳的文件。\n\n• 高低工资定义：介绍以省中位数工资为准的分类标准。高工资岗位通常获批更长的工签有效期（通常为 3 年），而低工资岗位则有更严格的比例限制和较短的有效期。'}
                    </p>
                  </div>
                  <div className="md:order-1" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/skillworker-lmia-1772278072219-opt.webp"
                      alt="LMIA"
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 4: ICT */}
              <section id="ict" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'ICT Work Permit: Fast Track for Global Executives'
                        : 'ICT 工签：跨国高管的快速通道'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {isEnglish
                        ? '• Advantage: The ICT category is exempt from LMIA, eliminating complex labor market testing.\n\n• Suitable Applicants: Ideal for senior managers or key technical personnel in multinational companies who are being transferred to work at Canadian branch offices.'
                        : '• 优势：ICT 类别可豁免 LMIA，无需复杂的劳工市场测试。\n\n• 适用人群：适用于在全球性公司中担任高级管理人员或核心技术人员，且计划被派往加拿大分公司工作的申请人。'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/img-2-opt.jpg"
                      alt="ICT"
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 5: PGWP */}
              <section id="pgwp" className="mb-12 pb-12 border-b border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="md:order-2">
                    <h2 
                      className="text-foreground mb-6"
                      style={{
                        fontFamily: '"Alibaba PuHuiTi", sans-serif',
                        fontSize: 'clamp(32px, 8vw, 48px)',
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {isEnglish
                        ? 'PGWP: International Students\' Stay in Canada'
                        : 'PGWP 毕业后工签：留学生的留加利器'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {isEnglish
                        ? '• Eligibility: Students who graduate from designated learning institutions (DLI) in Canada and meet course duration requirements.\n\n• Special Cases: If your study permit expires before applying for PGWP, you must immediately apply for status restoration or, under specific conditions, submit your application from outside Canada. OXEC provides professional remedial solutions for expired permits.'
                        : '• 申请资格：从加拿大指定院校（DLI）毕业并符合课程时长要求的学生。\n\n• 特殊情况：若毕业前学签已到期，但尚未申请 PGWP，需立即申请身份恢复（Restoration）或在特定条件下于境外递交。傲赛提供专业的过期补救方案。'}
                    </p>
                  </div>
                  <div className="md:order-1" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <img
                      src="/images/skillworker-pgwp-1772278078952-opt.webp"
                      alt="PGWP"
                      className="w-full h-auto"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </section>

              {/* Section 6: CTA Section - Assessment */}
              <section id="assessment" className="text-center">
                <h2 
                  className="text-foreground mb-6"
                  style={{
                    fontFamily: '"Alibaba PuHuiTi", sans-serif',
                    fontSize: 'clamp(32px, 8vw, 48px)',
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  {isEnglish
                    ? 'Assess Your Immigration Points'
                    : '评估您的移民加分'}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {isEnglish
                    ? 'Let our expert team help you plan your skilled immigration pathway and maximize your success rate.'
                    : '让我们的专家团队帮助您规划技术移民路径，最大化您的成功率。'}
                </p>
                <Link href="/booking">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                    {isEnglish ? 'Book Consultation Now' : '立即预约咨询'}
                  </Button>
                </Link>
              </section>
            </div>

            {/* Bottom spacing to prevent Footer overlap */}
            <div style={{ height: '60px' }} />
          </div>
        </main>
      </div>

      {/* Footer - Full Width, Direct Child of Body */}
      <Footer />
    </div>
  );
}
