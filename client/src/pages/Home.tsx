import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [location] = useLocation();

  const serviceItems = [
    { label: "投资移民", href: "/businessclass" },
    { label: "家庭团聚移民", href: "/familyclass" },
    { label: "枫叶卡续签与加急", href: "/prcard" },
    { label: "拒签与程序公证信", href: "/reconsideration" },
    { label: "留学与访问", href: "/temporary" },
    { label: "技术移民", href: "/skillworker" },
    { label: "公民入籍", href: "/citizenship" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          {/* Logo */}
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          {/* Desktop Menu - Single Unified Navigation Group */}
          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'space-around', marginLeft: '32px' }}>
            <Link href="/">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.home")}</span>
            </Link>
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="flex items-center text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {t("nav.services")}
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
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.success_cases")}</span>
            </Link>
            <Link href="/blog">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.blog")}</span>
            </Link>
            <Link href="/team">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.about")}</span>
            </Link>
            <button
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
            >
              {language === "en" ? "中文" : "ENG"}
            </button>
            <Link href="/booking">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>{t("nav.contact")}</span>
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
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {t("nav.home")}
                </span>
              </Link>
              <Link href="/services">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {t("nav.services")}
                </span>
              </Link>
              <Link href="/success-cases">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {t("nav.success_cases")}
                </span>
              </Link>
              <Link href="/blog">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {t("nav.blog")}
                </span>
              </Link>
              <Link href="/team">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {t("nav.about")}
                </span>
              </Link>
              <button
                onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2 w-full text-left"
              >
                {language === "en" ? "中文" : "ENG"}
              </button>
              <Link href="/booking">
                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                  <span>{t("nav.contact")}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Split Hero Section */}
      <section className="relative w-full min-h-screen flex" style={{height: '525px', marginBottom: '-213px'}}>
        {/* Left: Image - Full Height, No Padding */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1 h-64 lg:h-auto" style={{height: '525px'}}>
          <img
            src="/hero-canadian.jpg"
            alt="Canadian Immigration - Flag and Parliament"
            className="w-full h-full object-cover" style={{height: '525px'}}
          />
        </div>

        {/* Right: Content - Deep Blue Background */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex items-center justify-center p-8 lg:p-16" style={{ backgroundColor: "#335577", height: '525px' }}>
          <div className="space-y-6 w-full max-w-lg">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
              {t('hero.subtitle')}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: "阿里巴巴普惠体, Cormorant Garamond, serif", fontWeight: 700, color: "#ffffff" }}>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{t("hero.title_part1")}</span>
              <span className="block mt-2" style={{ color: "#ffffff" }}>
                {t("hero.title_part2")}
              </span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#ffffff" }}>
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/booking">
                <Button asChild size="lg" className="text-lg px-8 rounded-none" style={{ backgroundColor: "#ffffff", color: "#335577" }}>
                  <span>
                    {t("hero.book_consultation")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/success-cases">
                <Button asChild size="lg" className="text-lg px-8 rounded-none" style={{ backgroundColor: "transparent", color: "#ffffff", border: "2px solid #ffffff" }}>
                  <span>查看案例</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background" style={{ paddingTop: "50px", paddingBottom: "50px" }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{t("services.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("services.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Service 1: Investment Immigration */}
            <Link href="/businessclass">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{borderRadius: '0px'}}>
                <div className="relative h-40 overflow-hidden">
                  <img src="/service-1.jpg" alt="Investment Immigration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 text-center">{t("services.pr")}</h3>
                  <p className="text-muted-foreground text-sm text-center">{t("services.pr_desc")}</p>
                </div>
              </div>
            </Link>

            {/* Service 2: Family Reunification */}
            <Link href="/familyclass">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{borderRadius: '0px'}}>
                <div className="relative h-40 overflow-hidden">
                  <img src="/service-2.jpg" alt="Family Reunification" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 text-center">{t("services.visa")}</h3>
                  <p className="text-muted-foreground text-sm text-center">{t("services.visa_desc")}</p>
                </div>
              </div>
            </Link>

            {/* Service 3: PR Card Renewal */}
            <Link href="/prcard">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{borderRadius: '0px'}}>
                <div className="relative h-40 overflow-hidden">
                  <img src="/service-3.jpg" alt="PR Card Renewal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 text-center">{t("services.citizenship")}</h3>
                  <p className="text-muted-foreground text-sm text-center">{t("services.citizenship_desc")}</p>
                </div>
              </div>
            </Link>

            {/* Service 4: Refusal & Procedural Fairness */}
            <Link href="/reconsideration">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{borderRadius: '0px'}}>
                <div className="relative h-40 overflow-hidden">
                  <img src="/service-2.jpg" alt="Refusal & Procedural Fairness" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 text-center">{t("services.appeals")}</h3>
                  <p className="text-muted-foreground text-sm text-center">{t("services.appeals_desc")}</p>
                </div>
              </div>
            </Link>

            {/* Service 5: Study & Visitor Visa */}
            <Link href="/temporary">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2" style={{borderRadius: '0px'}}>
                <div className="relative h-40 overflow-hidden">
                  <img src="/service-3.jpg" alt="Study & Visitor Visa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 text-center">{t("services.investment")}</h3>
                  <p className="text-muted-foreground text-sm text-center">{t("services.investment_desc")}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12 flex flex-wrap gap-4 justify-center">
            <Link href="/calculator">
              <Button asChild size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent/10">
                <span style={{ backgroundColor: '#1f3d7f', borderRadius: "0px", color: "#ffffff", borderWidth: '0px' }}>
                  计算联邦快速通道得分
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
            <Link href="/bccalculator">
              <Button asChild size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent/10">
                <span style={{ backgroundColor: '#1f3d7f', borderRadius: "0px", color: "#ffffff", borderWidth: '0px' }}>
                  计算BC省提名得分
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Cases Preview */}
      <section className="py-20 bg-accent/5" style={{ paddingTop: "50px", paddingBottom: "50px" }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{t("success.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("success.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-lg border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{t("success.case_type")}</h3>
                    <p className="text-sm text-muted-foreground">{t("success.case_background")}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{t("success.case_outcome")}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/success-cases">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>
                  {t("success.view_all")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-background" style={{ paddingTop: "50px", paddingBottom: "50px" }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{t("blog.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("blog.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                <div className="p-6">
                  <p className="text-sm text-primary font-semibold mb-2">{t("blog.category")}</p>
                  <h3 className="text-xl font-bold text-foreground mb-2">{t("blog.article_title")}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{t("blog.article_excerpt")}</p>
                  <Link href="/blog">
                    <span className="text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer">
                      {t("blog.read_more")} →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>
                  {t("blog.view_all")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12" style={{ paddingTop: "50px", paddingBottom: "50px" }}>
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">{t("footer.about")}</h4>
              <p className="text-sm opacity-75">{t("footer.about_desc")}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.services")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("services.pr")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("services.visa")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("services.citizenship")}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.resources")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("nav.blog")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/success-cases">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("nav.success_cases")}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculator">
                    <span className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer">{t("hero.calculator")}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
              <p className="text-sm opacity-75">business@oxecimm.com</p>
              <p className="text-sm opacity-75 mt-2">{t("footer.address")}</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2026 OXEC Immigration Services Ltd. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
