import { useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  position: "left" | "right";
}

const teamMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "李明",
    title: "RCIC 注册移民顾问 / 创始人",
    description: "拥有多年加拿大移民法律服务经验，专注于复杂的投资移民和上诉案件。李明顾问以其深厚的法律知识和丰富的实践经验，帮助数百个家庭成功实现加拿大梦想。",
    image: "/team-member-1.jpg",
    position: "left"
  },
  {
    id: "member-2",
    name: "王琳",
    title: "法律顾问",
    description: "精通家庭团聚与雇主担保类申请，以严谨的办案风格和极高的成功率深受客户信赖。王琳律师专注于处理复杂的家庭移民案件，确保每一个申请都得到最专业的指导。",
    image: "/team-member-2.jpg",
    position: "right"
  },
  {
    id: "member-3",
    name: "张涛",
    title: "留学与签证专家",
    description: "擅长处理各类疑难留学签证及访问签申请，为申请人提供量身定制的学习计划建议。张涛专家拥有丰富的国际教育背景，深刻理解学生的需求和挑战。",
    image: "/team-member-3.jpg",
    position: "left"
  },
  {
    id: "member-4",
    name: "陈慧",
    title: "运营与客户服务主管",
    description: "负责公司整体运营与客户沟通，确保每一个申请流程的高效透明。陈慧主管致力于为每一位客户提供卓越的服务体验和全程的专业支持。",
    image: "/team-member-4.jpg",
    position: "right"
  }
];

export default function Team() {
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const detailRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToMember = (memberId: string) => {
    const element = detailRefs.current[memberId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
            <Link href="/"><span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t("nav.about")}</span></Link>
            <button className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">ENG</button>
            <Link href="/"><Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"><span>{t("nav.contact")}</span></Button></Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-20">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: "阿里巴巴普惠体, Cormorant Garamond, serif" }}>
                我们的团队
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                由资深移民顾问、法律专家和服务团队组成，致力于为每一位客户提供专业、高效的移民服务。
              </p>
            </div>

            {/* Team Members Gallery Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => scrollToMember(member.id)}
                  className="cursor-pointer group text-center transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative mb-6 overflow-hidden rounded-lg shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:brightness-90 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </div>
              ))}
            </div>

            {/* Detailed Profiles Section */}
            <div className="space-y-32">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  ref={(el) => {
                    if (el) detailRefs.current[member.id] = el;
                  }}
                  className="scroll-mt-20"
                >
                  <div className={`grid md:grid-cols-2 gap-16 items-center ${member.position === "right" ? "md:flex-row-reverse" : ""}`}>
                    {/* Image */}
                    <div className={`${member.position === "right" ? "md:order-2" : ""}`}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full aspect-square md:aspect-auto md:h-96 object-cover"
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className={`${member.position === "right" ? "md:order-1" : ""} space-y-6`}>
                      <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">{member.name}</h2>
                        <p className="text-lg text-primary font-semibold">{member.title}</p>
                      </div>

                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {member.description}
                      </p>

                      <div className="pt-6">
                        <Link href="/booking">
                          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                            <span>
                              咨询此专家
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < teamMembers.length - 1 && (
                    <div className="mt-32 border-t border-border/30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              准备开始您的移民之旅？
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              联系我们的团队，获取专业的移民咨询和支持。
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>
                  预约咨询
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div><h3 className="font-bold mb-4">{t("footer.about")}</h3><p className="text-sm opacity-80">{t("footer.about_desc")}</p></div>
            <div><h3 className="font-bold mb-4">{t("footer.services")}</h3><ul className="text-sm space-y-2 opacity-80"><li><Link href="/businessclass"><span className="hover:opacity-100 cursor-pointer">投资移民</span></Link></li></ul></div>
            <div><h3 className="font-bold mb-4">{t("footer.resources")}</h3><ul className="text-sm space-y-2 opacity-80"><li><Link href="/"><span className="hover:opacity-100 cursor-pointer">首页</span></Link></li></ul></div>
            <div><h3 className="font-bold mb-4">{t("footer.contact")}</h3><p className="text-sm opacity-80">{t("footer.address")}</p></div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80"><p>&copy; 2024 OXEC Immigration Services Ltd. {t("footer.rights")}</p></div>
        </div>
      </footer>
    </div>
  );
}
