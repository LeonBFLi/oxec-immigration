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
import { ArrowLeft, Calendar, Phone, User } from "lucide-react";

export default function Booking() {
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
      toast.success("Appointment booked successfully! We will contact you soon.");
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
      toast.error("Failed to book appointment: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.preferredDate) {
      toast.error("Please fill in all required fields");
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
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-lg opacity-90">
            Schedule a consultation with our experienced immigration consultants
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Details</CardTitle>
                <CardDescription>
                  Fill in your information and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
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
                      <Label htmlFor="email">Email Address *</Label>
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
                      <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label>Consultation Type *</Label>
                    <RadioGroup
                      value={formData.consultationType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, consultationType: value as "phone" | "in-person" })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="font-normal cursor-pointer">
                          Phone Consultation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person" className="font-normal cursor-pointer">
                          In-Person Consultation
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date & Time *</Label>
                    <Input
                      id="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
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
                    {createAppointment.isPending ? "Booking..." : "Book Consultation"}
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
                </CardTitle>
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
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  For urgent inquiries, you can also reach us directly:
                </p>
                <p className="font-semibold">business@oxecimm.com</p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <User className="mr-2 h-5 w-5" />
                  Before Your Consultation
                </CardTitle>
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
    </div>
  );
}
