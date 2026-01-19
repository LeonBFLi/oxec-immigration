import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileCheck, 
  Plane, 
  Users, 
  Scale, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Mail,
  Globe
} from "lucide-react";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  const services = [
    {
      icon: FileCheck,
      title: t('services.pr'),
      description: t('services.pr_desc'),
    },
    {
      icon: Plane,
      title: t('services.visa'),
      description: t('services.visa_desc'),
    },
    {
      icon: Users,
      title: t('services.citizenship'),
      description: t('services.citizenship_desc'),
    },
    {
      icon: Scale,
      title: t('services.appeals'),
      description: t('services.appeals_desc'),
    },
    {
      icon: TrendingUp,
      title: t('services.invest'),
      description: t('services.invest_desc'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">O</span>
                </div>
                <span className="font-bold text-xl text-foreground">OXEC Immigration</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t('nav.home')}</span>
              </Link>
              <Link href="/services">
                <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t('nav.services')}</span>
              </Link>
              <Link href="/success-cases">
                <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t('nav.success_cases')}</span>
              </Link>
              <Link href="/blog">
                <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t('nav.blog')}</span>
              </Link>
              <Link href="/about">
                <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">{t('nav.about')}</span>
              </Link>
              <button
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {language === 'en' ? '中文' : 'EN'}
              </button>
              <Link href="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t('nav.contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-white to-primary/5 py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Professional Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
                <img 
                  src="/hero-professional.jpg" 
                  alt="Professional Immigration Consultant" 
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right: Hero Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                {t('hero.subtitle')}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('hero.title_part1')}
                <span className="text-primary block mt-2">{t('hero.title_part2')}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/booking">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                    <span>
                      {t('hero.book_consultation')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </Link>
                <Link href="/success-cases">
                  <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8">
                    <span>{t('hero.success_cases')}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/calculator">
              <Button asChild size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent/10">
                <span>
                  {t('services.calculator')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                {t('why.title')}
              </h2>
              <p className="text-lg mb-8 opacity-90">
                {t('why.description')}
              </p>
              <div className="space-y-4">
                {[
                  t('why.point1'),
                  t('why.point2'),
                  t('why.point3'),
                  t('why.point4'),
                  t('why.point5')
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">{t('why.cta_title')}</h3>
              <p className="mb-8 opacity-90">
                {t('why.cta_desc')}
              </p>
              <Link href="/booking">
                <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <span>{t('why.schedule')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">{t('footer.company')}</h3>
              <p className="opacity-90">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
              <div className="space-y-2">
                <Link href="/services"><span className="block opacity-90 hover:opacity-100 transition-opacity cursor-pointer">{t('nav.services')}</span></Link>
                <Link href="/calculator"><span className="block opacity-90 hover:opacity-100 transition-opacity cursor-pointer">{t('services.calculator')}</span></Link>
                <Link href="/success-cases"><span className="block opacity-90 hover:opacity-100 transition-opacity cursor-pointer">{t('nav.success_cases')}</span></Link>
                <Link href="/blog"><span className="block opacity-90 hover:opacity-100 transition-opacity cursor-pointer">{t('nav.blog')}</span></Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span className="opacity-90">{t('footer.email')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-75">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
