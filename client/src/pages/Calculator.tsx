import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, Calculator as CalcIcon, TrendingUp, Award } from "lucide-react";

export default function Calculator() {
  const [formData, setFormData] = useState({
    age: 30,
    education: "bachelor" as "high-school" | "one-year" | "two-year" | "bachelor" | "master" | "phd",
    canadianEducation: false,
    workExperience: 3,
    canadianWorkExperience: 0,
    languageTest: "ielts" as "ielts" | "celpip" | "tef" | "tcf",
    listening: 7,
    reading: 7,
    writing: 7,
    speaking: 7,
    hasSpouse: false,
    spouseEducation: "none" as "none" | "high-school" | "bachelor" | "master",
    spouseWorkExperience: 0,
    spouseLanguageScore: 0,
    hasJobOffer: false,
    hasProvincialNomination: false,
  });

  const [result, setResult] = useState<any>(null);

  const calculateCRS = trpc.calculator.calculateCRS.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      toast.error("Calculation failed: " + error.message);
    },
  });

  const handleCalculate = () => {
    calculateCRS.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-12">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <CalcIcon className="mr-3 h-10 w-10" />
            Immigration Points Calculator
          </h1>
          <p className="text-lg opacity-90">
            Calculate your Comprehensive Ranking System (CRS) score for Express Entry
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter your details to calculate your CRS score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select
                      value={formData.education}
                      onValueChange={(value: any) => setFormData({ ...formData, education: value })}
                    >
                      <SelectTrigger id="education">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="one-year">One-Year Post-Secondary</SelectItem>
                        <SelectItem value="two-year">Two-Year Post-Secondary</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="canadianEducation"
                    checked={formData.canadianEducation}
                    onCheckedChange={(checked) => setFormData({ ...formData, canadianEducation: checked })}
                  />
                  <Label htmlFor="canadianEducation" className="font-normal cursor-pointer">
                    I have Canadian education credentials
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Total Work Experience (years)</Label>
                    <Input
                      id="workExperience"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.workExperience}
                      onChange={(e) => setFormData({ ...formData, workExperience: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canadianWorkExperience">Canadian Work Experience (years)</Label>
                    <Input
                      id="canadianWorkExperience"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.canadianWorkExperience}
                      onChange={(e) => setFormData({ ...formData, canadianWorkExperience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Test Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="languageTest">Language Test Type</Label>
                  <Select
                    value={formData.languageTest}
                    onValueChange={(value: any) => setFormData({ ...formData, languageTest: value })}
                  >
                    <SelectTrigger id="languageTest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="celpip">CELPIP</SelectItem>
                      <SelectItem value="tef">TEF Canada</SelectItem>
                      <SelectItem value="tcf">TCF Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["listening", "reading", "writing", "speaking"].map((skill) => (
                    <div key={skill} className="space-y-2">
                      <Label htmlFor={skill} className="capitalize">{skill}</Label>
                      <Input
                        id={skill}
                        type="number"
                        min="0"
                        max="9"
                        step="0.5"
                        value={formData[skill as keyof typeof formData] as number}
                        onChange={(e) => setFormData({ ...formData, [skill]: parseFloat(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasSpouse"
                    checked={formData.hasSpouse}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasSpouse: checked })}
                  />
                  <Label htmlFor="hasSpouse" className="font-normal cursor-pointer">
                    I have a spouse/common-law partner
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasJobOffer"
                    checked={formData.hasJobOffer}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasJobOffer: checked })}
                  />
                  <Label htmlFor="hasJobOffer" className="font-normal cursor-pointer">
                    I have a valid job offer in Canada
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasProvincialNomination"
                    checked={formData.hasProvincialNomination}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasProvincialNomination: checked })}
                  />
                  <Label htmlFor="hasProvincialNomination" className="font-normal cursor-pointer">
                    I have a provincial nomination
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={calculateCRS.isPending}
            >
              {calculateCRS.isPending ? "Calculating..." : "Calculate My Score"}
            </Button>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card className="border-2 border-primary">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="flex items-center text-2xl">
                      <Award className="mr-2 h-6 w-6" />
                      Your CRS Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-4">
                        {result.totalScore}
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
                        {result.message}
                      </p>
                      <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        result.totalScore >= 470 ? "bg-green-100 text-green-700" :
                        result.totalScore >= 400 ? "bg-yellow-100 text-yellow-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {result.eligible ? "Eligible for Express Entry" : "Below Minimum Threshold"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-accent" />
                      Score Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(result.breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-semibold text-primary">{value as number}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-accent">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ready to start your immigration journey? Book a consultation with our experts.
                    </p>
                    <Link href="/booking">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Book Consultation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>About CRS Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Comprehensive Ranking System (CRS) is a points-based system used to assess and score 
                    your profile for Express Entry.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Maximum Score:</span>
                      <span className="font-semibold">1,200 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Typical Cutoff:</span>
                      <span className="font-semibold">470-500 points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
