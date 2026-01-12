import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  FileCheck, 
  Plane, 
  Users, 
  Scale, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone
} from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: FileCheck,
      title: "Apply for PR",
      description: "Expert guidance through the Permanent Residence application process with comprehensive documentation support.",
    },
    {
      icon: Plane,
      title: "Apply for Temporary Visa or Permit",
      description: "Streamlined assistance for work permits, study permits, and visitor visas with high success rates.",
    },
    {
      icon: Users,
      title: "Apply for Citizenship",
      description: "Complete citizenship application services ensuring all requirements are met efficiently.",
    },
    {
      icon: Scale,
      title: "Immigration Appeals",
      description: "Professional representation for immigration appeals and judicial reviews at all levels.",
    },
    {
      icon: TrendingUp,
      title: "Invest in Canada",
      description: "Strategic investment immigration programs tailored to entrepreneurs and investors.",
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
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <a className="text-foreground hover:text-primary transition-colors font-medium">Home</a>
              </Link>
              <Link href="/services">
                <a className="text-foreground hover:text-primary transition-colors font-medium">Services</a>
              </Link>
              <Link href="/success-cases">
                <a className="text-foreground hover:text-primary transition-colors font-medium">Success Cases</a>
              </Link>
              <Link href="/blog">
                <a className="text-foreground hover:text-primary transition-colors font-medium">Blog</a>
              </Link>
              <Link href="/about">
                <a className="text-foreground hover:text-primary transition-colors font-medium">About Us</a>
              </Link>
              <Link href="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Contact Us
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
                Professional Immigration Services
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Trusted Partner for
                <span className="text-primary block mt-2">Canadian Immigration</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                OXEC Immigration Services Ltd. provides comprehensive immigration consulting services with expert guidance, 
                personalized strategies, and a proven track record of success in helping clients achieve their Canadian dreams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/booking">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                    Book Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/success-cases">
                  <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8">
                    Success Cases
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
              Our Immigration Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive immigration solutions tailored to your unique needs and circumstances
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
              <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent/10">
                Try Our Immigration Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
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
                Why Choose OXEC Immigration?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                We combine deep expertise in Canadian immigration law with personalized service 
                to deliver exceptional results for our clients.
              </p>
              <div className="space-y-4">
                {[
                  "Expert immigration consultants with proven track record",
                  "Personalized strategies for each client's unique situation",
                  "Comprehensive support throughout the entire process",
                  "High success rate in complex immigration cases",
                  "Transparent communication and regular updates"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">Ready to Start Your Journey?</h3>
              <p className="mb-8 opacity-90">
                Book a consultation with our experienced immigration consultants today.
              </p>
              <Link href="/booking">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Schedule Consultation
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
              <h3 className="font-bold text-xl mb-4">OXEC Immigration Services Ltd.</h3>
              <p className="opacity-90">
                Your trusted partner for Canadian immigration success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/services"><a className="block opacity-90 hover:opacity-100 transition-opacity">Services</a></Link>
                <Link href="/calculator"><a className="block opacity-90 hover:opacity-100 transition-opacity">Immigration Calculator</a></Link>
                <Link href="/success-cases"><a className="block opacity-90 hover:opacity-100 transition-opacity">Success Cases</a></Link>
                <Link href="/blog"><a className="block opacity-90 hover:opacity-100 transition-opacity">Blog</a></Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span className="opacity-90">business@oxecimm.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-75">
            <p>&copy; 2026 OXEC Immigration Services Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
