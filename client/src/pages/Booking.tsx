import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Calendar, Phone, User, Globe, MapPin } from "lucide-react";
import { useRef } from "react";
import { MapView } from "@/components/Map";

export default function Booking() {
  const { t, language, setLanguage } = useLanguage();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "phone" as "phone" | "in-person",
    preferredDate: "",
    message: "",
  });

  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: () => {
      const successMessage = language === 'en' 
        ? 'Your appointment request has been received. Our professional consultants will contact you within 24 hours.'
        : '您的预约申请已收到，我们的专业顶问将在24小时内与您联系。';
      toast.success(successMessage);
      setFormData({
        name: "",
        email: "",
        phone: "",
        consultationType: "phone",
        preferredDate: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error("Failed to book appointment: " + error.message); // TODO: translate error message
    },
  });

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: 49.2208, lng: -122.9497 },
      title: "OXEC Immigration Services Ltd.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.preferredDate) {
      toast.error("Please fill in all required fields"); // TODO: translate error message
      return;
    }

    createAppointment.mutate({
      ...formData,
      preferredDate: new Date(formData.preferredDate),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="flex justify-between items-start mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Back to Home' : '返回首页'}
              </Button>
            </Link>
            <button
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md transition-colors text-primary-foreground font-medium" style={{borderRadius: '0px'}}
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? '中文' : 'ENG'}
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('booking.title')}</h1>
          <p className="text-lg opacity-90">
            {t('booking.subtitle')}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card style={{borderRadius: '0px'}}>
              <CardHeader>
                <CardTitle>{t('booking.title')}</CardTitle>
                <CardDescription>
                  本表单所采集的所有个人信息将严格遵循《加拿大移民顾问监管委员会职业操守条例》进行管理。我们承诺对您的所有资料严格保密，且仅用于评估您的移民资格。提交此表单并不构成正式的法律代理关系；正式代理关系仅在双方签署《专业服务协议》(Retainer Agreement) 后成立。我们在此确认，在处理您的咨询申请前已进行内部核查，确保不存在任何利益冲突。若后续发现潜在冲突，我们将立即向您披露并采取合规措施。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('booking.name')} *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('booking.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                      <div className="space-y-2">
                      <Label htmlFor="phone">{t('booking.phone')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('booking.type')} *</Label>
                    <RadioGroup
                      value={formData.consultationType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, consultationType: value as "phone" | "in-person" })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="font-normal cursor-pointer">
                          {t('booking.type_phone')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person" className="font-normal cursor-pointer">
                          {t('booking.type_inperson')}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">{t('booking.date')} & {t('booking.time')} *</Label>
                    <Input
                      id="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('booking.content')}</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your immigration goals and any specific questions you have..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? "Booking..." : t('booking.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  What to Expect
                </CardTitle> {/* TODO: translate */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Initial Consultation</h4>
                  <p className="text-sm text-muted-foreground">
                    A comprehensive 30-60 minute session to understand your immigration goals and assess your eligibility.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Expert Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Our consultants will evaluate your profile and recommend the best immigration pathway for you.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personalized Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive a tailored action plan with clear next steps and timeline expectations.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-accent" />
                  {t('footer.contact')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  For urgent inquiries, you can also reach us directly:
                </p> {/* TODO: translate */}
                <p className="font-semibold">{t('footer.email')}</p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <User className="mr-2 h-5 w-5" />
                  Before Your Consultation
                </CardTitle> {/* TODO: translate */}
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Prepare your passport and identification documents</li>
                  <li>• List your education and work experience details</li>
                  <li>• Note any previous visa applications or refusals</li>
                  <li>• Write down your specific immigration questions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <section className="w-full bg-gray-100 py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              {language === 'en' ? 'Visit Our Office' : '上门位置'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {language === 'en' 
              ? '4710 Kingsway, Metrotower 1, Burnaby, BC, V5H 4M2, Canada' 
              : '4710 Kingsway, Metrotower 1, Burnaby, BC, V5H 4M2, 加拿大'}
          </p>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <MapView
              initialCenter={{ lat: 49.2208, lng: -122.9497 }}
              initialZoom={15}
              onMapReady={handleMapReady}
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
