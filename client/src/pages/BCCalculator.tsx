import { useEffect, useState } from "react";
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
import { Footer } from "@/components/Footer";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function BCCalculator() {
  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.bcCalculator);
  }, []);

  const [formData, setFormData] = useState({
    workExperience: "" as "5plus" | "4to5" | "3to4" | "2to3" | "1to2" | "below1" | "none" | "",
    canadianExperience: false,
    currentlyWorking: false,
    education: "" as "phd" | "masters" | "postgrad" | "bachelor" | "associate" | "diploma" | "highschool" | "",
    bcEducation: false,
    canadaEducation: false,
    designatedOccupation: false,
    languageTest: "" as "ielts" | "celpip" | "pte" | "",
    listening: undefined as number | undefined,
    reading: undefined as number | undefined,
    writing: undefined as number | undefined,
    speaking: undefined as number | undefined,
    frenchLanguage: false,
    hourlyWage: undefined as number | undefined,
    region: "" as "tier1" | "tier2" | "tier3" | "",
    regionWorkExperience: false,
    regionEducation: false,
  });

  const [result, setResult] = useState<any>(null);
  const utils = trpc.useUtils();
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    // 验证必填项
    if (!formData.listening || !formData.reading || !formData.writing || !formData.speaking || !formData.hourlyWage) {
      toast.error("表单不能为空");
      return;
    }
    
    setIsLoading(true);
    try {
      const data: any = { ...formData };
      if (!data.workExperience) data.workExperience = "none";
      if (!data.education) data.education = "highschool";
      if (!data.languageTest) data.languageTest = "ielts";
      if (!data.region) data.region = "tier1";
      const result = await (utils as any).calculator.calculateBCPNP.fetch(data);
      setResult(result);
    } catch (error: any) {
      toast.error("Calculation failed: " + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-4xl font-bold mb-4 flex items-center" style={{ fontFamily: "'Alibaba PuHuiTi', sans-serif", fontWeight: 900, fontSize: '48px' }}>
            <CalcIcon className="mr-3 h-10 w-10" style={{width: '48px', height: '48px'}} />
            BC省提名计划技术类算分工具
          </h1>
          <p className="text-lg opacity-90">
            最新BC PNP算分工具/评估入池分数/Skilled Worker Stream
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Human Capital Factors */}
            <Card>
              <CardHeader>
                <CardTitle>人力资源因素</CardTitle>
                <CardDescription>输入您的工作经验和学历信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workExperience">相关工作经验</Label>
                  <Select
                    value={formData.workExperience}
                    onValueChange={(value: any) => setFormData({ ...formData, workExperience: value })}
                  >
                    <SelectTrigger id="workExperience">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5plus">5年以上 / 20分</SelectItem>
                      <SelectItem value="4to5">4到5年 / 16分</SelectItem>
                      <SelectItem value="3to4">3到4年 / 12分</SelectItem>
                      <SelectItem value="2to3">2到3年 / 8分</SelectItem>
                      <SelectItem value="1to2">1到2年 / 4分</SelectItem>
                      <SelectItem value="below1">1年以下 / 1分</SelectItem>
                      <SelectItem value="none">无相关经验</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="canadianExperience"
                    checked={formData.canadianExperience}
                    onCheckedChange={(checked) => setFormData({ ...formData, canadianExperience: checked })}
                  />
                  <Label htmlFor="canadianExperience" className="font-normal cursor-pointer">
                    至少1年加拿大相关经验
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onCheckedChange={(checked) => setFormData({ ...formData, currentlyWorking: checked })}
                  />
                  <Label htmlFor="currentlyWorking" className="font-normal cursor-pointer">
                    目前在加拿大同岗位全职工作中
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">学历背景</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value: any) => setFormData({ ...formData, education: value })}
                  >
                    <SelectTrigger id="education">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phd">博士学位 / 27分</SelectItem>
                      <SelectItem value="masters">硕士学位 / 22分</SelectItem>
                      <SelectItem value="postgrad">研究生文凭或证书 / 15分</SelectItem>
                      <SelectItem value="bachelor">学士学位</SelectItem>
                      <SelectItem value="associate">副学士学位 / 5分</SelectItem>
                      <SelectItem value="diploma">大专文凭（非技工） / 5分</SelectItem>
                      <SelectItem value="highschool">高中及以下 / 0分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="bcEducation"
                    checked={formData.bcEducation}
                    onCheckedChange={(checked) => setFormData({ ...formData, bcEducation: checked })}
                  />
                  <Label htmlFor="bcEducation" className="font-normal cursor-pointer">
                    在 BC 省完成过高等教育
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="canadaEducation"
                    checked={formData.canadaEducation}
                    onCheckedChange={(checked) => setFormData({ ...formData, canadaEducation: checked })}
                  />
                  <Label htmlFor="canadaEducation" className="font-normal cursor-pointer">
                    在加拿大（BC省以外）完成过高等教育
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="designatedOccupation"
                    checked={formData.designatedOccupation}
                    onCheckedChange={(checked) => setFormData({ ...formData, designatedOccupation: checked })}
                  />
                  <Label htmlFor="designatedOccupation" className="font-normal cursor-pointer">
                    属于符合资质的指定职业
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Language Skills */}
            <Card>
              <CardHeader>
                <CardTitle>语言能力</CardTitle>
                <CardDescription>输入您的语言考试成绩</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="languageTest">语言考试类型</Label>
                  <Select
                    value={formData.languageTest}
                    onValueChange={(value: any) => setFormData({ ...formData, languageTest: value })}
                  >
                    <SelectTrigger id="languageTest">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="celpip">CELPIP</SelectItem>
                      <SelectItem value="pte">PTE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "listening", label: "听力" },
                    { key: "reading", label: "阅读" },
                    { key: "writing", label: "写作" },
                    { key: "speaking", label: "口语" }
                  ].map((skill) => (
                    <div key={skill.key} className="space-y-2">
                      <Label htmlFor={skill.key}>{skill.label}</Label>
                      <Input
                        id={skill.key}
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        placeholder=""
                        value={formData[skill.key as keyof typeof formData] as number || ""}
                        onChange={(e) => setFormData({ ...formData, [skill.key]: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="frenchLanguage"
                    checked={formData.frenchLanguage}
                    onCheckedChange={(checked) => setFormData({ ...formData, frenchLanguage: checked })}
                  />
                  <Label htmlFor="frenchLanguage" className="font-normal cursor-pointer">
                    我有法语 CLB 4 以上考试成绩
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Economic Factors */}
            <Card>
              <CardHeader>
                <CardTitle>经济因素</CardTitle>
                <CardDescription>输入您的时薪和工作地区信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyWage">时薪 (加元)</Label>
                  <Input
                    id="hourlyWage"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder=""
                    value={formData.hourlyWage || ""}
                    onChange={(e) => setFormData({ ...formData, hourlyWage: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                  <p className="text-xs text-muted-foreground">
                    70及以上为 55分 | 16-69 为 (时薪-15) 分 | 低于16为 0分
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">工作地区</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value: any) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tier1">一类地区（大温）</SelectItem>
                      <SelectItem value="tier2">二类地区（Squamish等） / 5分</SelectItem>
                      <SelectItem value="tier3">三类地区（其他） / 15分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="regionWorkExperience"
                    checked={formData.regionWorkExperience}
                    onCheckedChange={(checked) => setFormData({ ...formData, regionWorkExperience: checked })}
                  />
                  <Label htmlFor="regionWorkExperience" className="font-normal cursor-pointer">
                    过去5年内二/三类地区工作满一年
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="regionEducation"
                    checked={formData.regionEducation}
                    onCheckedChange={(checked) => setFormData({ ...formData, regionEducation: checked })}
                  />
                  <Label htmlFor="regionEducation" className="font-normal cursor-pointer">
                    过去3年内二/三类地区公立高校毕业
                  </Label>
                </div>

                <p className="text-xs text-muted-foreground">
                  地区经验/教育加分：满足任意一项即给 10分，若两项均满足，最高也只给 10分
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "计算中..." : "计算我的分数"}
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
                      您的 BC PNP 分数
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-accent" />
                      分数明细
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(result.breakdown).map(([key, value]) => {
                        const labelMap: Record<string, string> = {
                          "Work Experience": "工作经验得分",
                          "Canadian Experience": "加拿大经验得分",
                          "Currently Working in Canada": "加拿大工作得分",
                          "Education": "教育得分",
                          "BC Education": "BC省教育得分",
                          "Canada Education": "加拿大教育得分",
                          "Designated Occupation": "指定职业得分",
                          "Language Skills (CLB 6)": "语言能力得分",
                          "Language Skills (CLB 7)": "语言能力得分",
                          "Language Skills (CLB 8)": "语言能力得分",
                          "Language Skills (CLB 9)": "语言能力得分",
                          "Language Skills (CLB 10)": "语言能力得分",
                          "French Language": "法语得分",
                          "Hourly Wage": "岗位薪资得分",
                          "Region": "地区得分",
                          "Region Work/Education Experience": "地区经验得分",
                        };
                        const displayLabel = labelMap[key] || key;
                        return (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm">
                              {displayLabel}
                            </span>
                            <span className="font-semibold text-primary">{value as number}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-accent">下一步</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      准备好开始您的移民之旅了吗？与我们的专家预约咨询。
                    </p>
                    <Link href="/booking">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        预约咨询专业顾问
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>关于 BC PNP</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    卑诗省提名计划（BC PNP）技术工人类别允许拥有技术娴熟、市场紧缺工作机会的外国工人获得卑诗省永久居留权。该类别要求申请人获得一份永久性全职工作邀请（NOC 0、1、2 或 3 类），至少两年相关工作经验，并满足最低语言（CLB 4/5+）和收入要求。
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>最高分数：</span>
                      <span className="font-semibold">200+ 分</span>
                    </div>
                    <div className="flex justify-between">
                      <span>典型邀请分数：</span>
                      <span className="font-semibold">80-120 分</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
