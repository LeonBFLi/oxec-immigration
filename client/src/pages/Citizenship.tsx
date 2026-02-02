import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Citizenship() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'space-around', marginLeft: '32px' }}>
            <Link href="/"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.home")}</span></Link>
            <Link href="/"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.services")}</span></Link>
            <Link href="/"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.success_cases")}</span></Link>
            <Link href="/"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.blog")}</span></Link>
            <Link href="/team"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.about")}</span></Link>
            <button className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">ENG</button>
            <Link href="/"><Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"><span>{t("nav.contact")}</span></Button></Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container">
            <h1 className="text-5xl font-bold text-foreground mb-6">公民入籍</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              为永久居民提供专业的加拿大公民入籍申请指导和全面支持。
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container max-w-3xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">服务概览</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  OXEC移民事务所为符合加拿大公民入籍条件的永久居民提供专业的申请指导和协助。我们的团队了解入籍流程的每一个环节，能够帮助您顺利成为加拿大公民。
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">主要服务项目</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-3">•</span>
                    <span>公民入籍资格评估</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-3">•</span>
                    <span>入籍申请文件准备</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-3">•</span>
                    <span>公民考试准备和指导</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary font-bold mr-3">•</span>
                    <span>入籍宣誓仪式协助</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link href="/booking">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                    <span>
                      预约咨询
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div><h3 className="font-bold mb-4">{t("footer.about")}</h3><p className="text-sm opacity-80">{t("footer.about_desc")}</p></div>
            <div><h3 className="font-bold mb-4">{t("footer.services")}</h3><ul className="text-sm space-y-2 opacity-80"><li><Link href="/"><span className="hover:opacity-100 cursor-pointer">服务列表</span></Link></li></ul></div>
            <div><h3 className="font-bold mb-4">{t("footer.resources")}</h3><ul className="text-sm space-y-2 opacity-80"><li><Link href="/"><span className="hover:opacity-100 cursor-pointer">首页</span></Link></li></ul></div>
            <div><h3 className="font-bold mb-4">{t("footer.contact")}</h3><p className="text-sm opacity-80">{t("footer.address")}</p></div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80"><p>&copy; 2024 OXEC Immigration Services Ltd. {t("footer.rights")}</p></div>
        </div>
      </footer>
    </div>
  );
}
