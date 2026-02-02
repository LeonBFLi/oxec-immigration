import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function BCCalculator() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");

  const calculateScore = () => {
    let total = 0;
    if (education === "bachelor") total += 25;
    if (education === "master") total += 35;
    if (experience === "3-5") total += 20;
    if (experience === "5plus") total += 30;
    if (language === "clb7") total += 15;
    if (language === "clb9") total += 25;
    setScore(total);
  };

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
            <h1 className="text-5xl font-bold text-foreground mb-6">BC省提名计划（PNP）算分工具</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              评估您在BC省提名计划中的资格和得分。
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-20">
          <div className="container max-w-2xl">
            <div className="bg-background border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-8">BC PNP 得分计算器</h2>

              <div className="space-y-6">
                {/* Education */}
                <div>
                  <label className="block text-lg font-semibold text-foreground mb-3">学历水平</label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择学历</option>
                    <option value="bachelor">学士学位 (+25分)</option>
                    <option value="master">硕士学位 (+35分)</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-lg font-semibold text-foreground mb-3">工作经验</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择工作经验</option>
                    <option value="3-5">3-5年 (+20分)</option>
                    <option value="5plus">5年以上 (+30分)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-lg font-semibold text-foreground mb-3">英语水平</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">选择英语水平</option>
                    <option value="clb7">CLB 7 (+15分)</option>
                    <option value="clb9">CLB 9+ (+25分)</option>
                  </select>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateScore}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  计算得分
                </button>

                {/* Score Display */}
                {score > 0 && (
                  <div className="mt-8 p-6 bg-primary/10 border-l-4 border-primary rounded">
                    <p className="text-muted-foreground mb-2">您的预估得分</p>
                    <p className="text-5xl font-bold text-primary">{score}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground mb-4">
                  这是一个初步评估工具。实际得分可能因多种因素而异。
                </p>
                <Link href="/booking">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                    <span>
                      获取专业评估
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
