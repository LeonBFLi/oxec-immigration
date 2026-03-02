import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { ArrowLeft, Calculator as CalcIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function FSWCalculator() {
  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.fswCalculator);
  }, []);

  const [formData, setFormData] = useState({
    // 第一语言
    primaryLanguage: "english" as "english" | "french",
    primaryLanguageTest: "" as "ielts" | "celpip" | "pte" | "tef" | "tcf" | "",
    primaryListening: undefined as number | undefined,
    primaryReading: undefined as number | undefined,
    primaryWriting: undefined as number | undefined,
    primarySpeaking: undefined as number | undefined,
    
    // 第二语言
    secondaryLanguage: "none" as "none" | "english" | "french",
    secondaryLanguageTest: "" as "ielts" | "celpip" | "pte" | "tef" | "tcf" | "",
    secondaryListening: undefined as number | undefined,
    secondaryReading: undefined as number | undefined,
    secondaryWriting: undefined as number | undefined,
    secondarySpeaking: undefined as number | undefined,
    
    // 教育背景
    education: "" as "phd" | "professional" | "postgrad" | "bachelor" | "diploma2" | "diploma1" | "highschool" | "below" | "",
    
    // 工作经验
    workExperience: "" as "6plus" | "4to5" | "2to3" | "1year" | "",
    
    // 年龄
    age: undefined as number | undefined,
    
    // 工作安排
    lmiaWork: false,
    lmiaExemptWork: false,
    lmiaOffer: false,
    lmiaCurrentWork: false,
    
    // 适应性
    spouseLanguage: false,
    canadaEducation: false,
    spouseCanadaEducation: false,
    canadaWork: false,
    lmiaEmployer: false,
    canadaRelative: false,
  });

  const [result, setResult] = useState<any>(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // CLB换算函数 - 从CLBTranslator复制的准确版本
  const convertToCLB = (
    listening: number,
    reading: number,
    writing: number,
    speaking: number,
    testType: string
  ): (number | string)[] => {
    let clbs: (number | string)[] = [];

    if (testType === "ielts") {
      const listeningCLB =
        listening >= 8.5
          ? 10
          : listening >= 8
            ? 9
            : listening >= 7.5
              ? 8
              : listening >= 6.5
                ? 7
                : listening >= 6
                  ? 7
                  : listening >= 5.5
                    ? 6
                    : listening >= 5
                      ? 5
                      : listening >= 4.5
                        ? 4
                        : "CLB 4以下";
      const readingCLB =
        reading >= 8
          ? 10
          : reading >= 7.5
            ? 9
            : reading >= 7
              ? 9
              : reading >= 6.5
                ? 8
                : reading >= 6
                  ? 7
                  : reading >= 5.5
                    ? 6
                    : reading >= 5
                      ? 5
                      : reading >= 4.5
                        ? 5
                        : reading >= 4
                          ? 4
                          : reading >= 3.5
                            ? 4
                            : "CLB 4以下";
      const writingCLB =
        writing >= 7.5
          ? 10
          : writing >= 7
            ? 9
            : writing >= 6.5
              ? 8
              : writing >= 6
                ? 7
                : writing >= 5.5
                  ? 6
                  : writing >= 5
                    ? 5
                    : writing >= 4.5
                      ? 4
                      : writing >= 4
                        ? 4
                        : "CLB 4以下";
      const speakingCLB =
        speaking >= 7.5
          ? 10
          : speaking >= 7
            ? 9
            : speaking >= 6.5
              ? 8
              : speaking >= 6
                ? 7
                : speaking >= 5.5
                  ? 6
                  : speaking >= 5
                    ? 5
                    : speaking >= 4.5
                      ? 4
                      : speaking >= 4
                        ? 4
                        : "CLB 4以下";
      clbs = [listeningCLB, readingCLB, writingCLB, speakingCLB];
    } else if (testType === "celpip") {
      const listeningCLB =
        listening >= 12
          ? 10
          : listening >= 11
            ? 10
            : listening >= 10
              ? 10
              : listening >= 9
                ? 9
                : listening >= 8
                  ? 8
                  : listening >= 7
                    ? 7
                    : listening >= 6
                      ? 6
                      : listening >= 5
                        ? 5
                        : listening >= 4
                          ? 4
                          : "CLB 4以下";
      const readingCLB =
        reading >= 12
          ? 10
          : reading >= 11
            ? 10
            : reading >= 10
              ? 10
              : reading >= 9
                ? 9
                : reading >= 8
                  ? 8
                  : reading >= 7
                    ? 7
                    : reading >= 6
                      ? 6
                      : reading >= 5
                        ? 5
                        : reading >= 4
                          ? 4
                          : "CLB 4以下";
      const writingCLB =
        writing >= 12
          ? 10
          : writing >= 11
            ? 10
            : writing >= 10
              ? 10
              : writing >= 9
                ? 9
                : writing >= 8
                  ? 8
                  : writing >= 7
                    ? 7
                    : writing >= 6
                      ? 6
                      : writing >= 5
                        ? 5
                        : writing >= 4
                          ? 4
                          : "CLB 4以下";
      const speakingCLB =
        speaking >= 12
          ? 10
          : speaking >= 11
            ? 10
            : speaking >= 10
              ? 10
              : speaking >= 9
                ? 9
                : speaking >= 8
                  ? 8
                  : speaking >= 7
                    ? 7
                    : speaking >= 6
                      ? 6
                      : speaking >= 5
                        ? 5
                        : speaking >= 4
                          ? 4
                          : "CLB 4以下";
      clbs = [listeningCLB, readingCLB, writingCLB, speakingCLB];
    } else if (testType === "pte") {
      const listeningCLB =
        listening >= 89
          ? 10
          : listening >= 82
            ? 9
            : listening >= 71
              ? 8
              : listening >= 60
                ? 7
                : listening >= 50
                  ? 6
                  : listening >= 39
                    ? 5
                    : listening >= 28
                      ? 4
                      : "CLB 4以下";
      const readingCLB =
        reading >= 88
          ? 10
          : reading >= 78
            ? 9
            : reading >= 69
              ? 8
              : reading >= 60
                ? 7
                : reading >= 51
                  ? 6
                  : reading >= 42
                    ? 5
                    : reading >= 33
                      ? 4
                      : "CLB 4以下";
      const writingCLB =
        writing >= 90
          ? 10
          : writing >= 88
            ? 9
            : writing >= 79
              ? 8
              : writing >= 69
                ? 7
                : writing >= 60
                  ? 6
                  : writing >= 51
                    ? 5
                    : writing >= 41
                      ? 4
                      : "CLB 4以下";
      const speakingCLB =
        speaking >= 89
          ? 10
          : speaking >= 84
            ? 9
            : speaking >= 76
              ? 8
              : speaking >= 68
                ? 7
                : speaking >= 59
                  ? 6
                  : speaking >= 51
                    ? 5
                    : speaking >= 42
                      ? 4
                      : "CLB 4以下";
      clbs = [listeningCLB, readingCLB, writingCLB, speakingCLB];
    } else if (testType === "tef") {
      const listeningCLB =
        listening >= 546
          ? 10
          : listening >= 503
            ? 9
            : listening >= 462
              ? 8
              : listening >= 434
                ? 7
                : listening >= 393
                  ? 6
                  : listening >= 352
                    ? 5
                    : listening >= 306
                      ? 4
                      : "CLB 4以下";
      const readingCLB =
        reading >= 546
          ? 10
          : reading >= 503
            ? 9
            : reading >= 462
              ? 8
              : reading >= 434
                ? 7
                : reading >= 393
                  ? 6
                  : reading >= 352
                    ? 5
                    : reading >= 306
                      ? 4
                      : "CLB 4以下";
      const writingCLB =
        writing >= 558
          ? 10
          : writing >= 512
            ? 9
            : writing >= 472
              ? 8
              : writing >= 428
                ? 7
                : writing >= 379
                  ? 6
                  : writing >= 330
                    ? 5
                    : writing >= 268
                      ? 4
                      : "CLB 4以下";
      const speakingCLB =
        speaking >= 556
          ? 10
          : speaking >= 518
            ? 9
            : speaking >= 494
              ? 8
              : speaking >= 456
                ? 7
                : speaking >= 422
                  ? 6
                  : speaking >= 387
                    ? 5
                    : speaking >= 328
                      ? 4
                      : "CLB 4以下";
      clbs = [listeningCLB, readingCLB, writingCLB, speakingCLB];
    } else if (testType === "tcf") {
      const listeningCLB =
        listening >= 549
          ? 10
          : listening >= 523
            ? 9
            : listening >= 503
              ? 8
              : listening >= 458
                ? 7
                : listening >= 398
                  ? 6
                  : listening >= 369
                    ? 5
                    : listening >= 331
                      ? 4
                      : "CLB 4以下";
      const readingCLB =
        reading >= 549
          ? 10
          : reading >= 523
            ? 9
            : reading >= 503
              ? 8
              : reading >= 458
                ? 7
                : reading >= 398
                  ? 6
                  : reading >= 369
                    ? 5
                    : reading >= 331
                      ? 4
                      : "CLB 4以下";
      const writingCLB =
        writing >= 549
          ? 10
          : writing >= 523
            ? 9
            : writing >= 503
              ? 8
              : writing >= 458
                ? 7
                : writing >= 398
                  ? 6
                  : writing >= 369
                    ? 5
                    : writing >= 331
                      ? 4
                      : "CLB 4以下";
      const speakingCLB =
        speaking >= 549
          ? 10
          : speaking >= 523
            ? 9
            : speaking >= 503
              ? 8
              : speaking >= 458
                ? 7
                : speaking >= 398
                  ? 6
                  : speaking >= 369
                    ? 5
                    : speaking >= 331
                      ? 4
                      : "CLB 4以下";
      clbs = [listeningCLB, readingCLB, writingCLB, speakingCLB];
    }

    return clbs;
  };

  // 计算第一语言分数
  const calculatePrimaryLanguageScore = (): number => {
    if (!formData.primaryLanguageTest || !formData.primaryListening || !formData.primaryReading || 
        !formData.primaryWriting || !formData.primarySpeaking) {
      return 0;
    }

    const clbs = convertToCLB(
      formData.primaryListening,
      formData.primaryReading,
      formData.primaryWriting,
      formData.primarySpeaking,
      formData.primaryLanguageTest
    );

    // 检查是否有"CLB 4以下"
    if (clbs.some(c => typeof c === "string")) return 0;

    // 根据每个技能的CLB等级单独计分
    let totalScore = 0;
    for (const clb of clbs as number[]) {
      if (clb >= 9) totalScore += 6;
      else if (clb === 8) totalScore += 5;
      else if (clb === 7) totalScore += 4;
      else if (clb >= 5) totalScore += 3;
    }

    return totalScore;
  };

  // 计算第二语言分数
  const calculateSecondaryLanguageScore = (): number => {
    if (formData.secondaryLanguage === "none") return 0;
    if (!formData.secondaryLanguageTest || !formData.secondaryListening || !formData.secondaryReading || 
        !formData.secondaryWriting || !formData.secondarySpeaking) {
      return 0;
    }

    const clbs = convertToCLB(
      formData.secondaryListening,
      formData.secondaryReading,
      formData.secondaryWriting,
      formData.secondarySpeaking,
      formData.secondaryLanguageTest
    );

    // 检查是否有"CLB 4以下"
    if (clbs.some(c => typeof c === "string")) return 0;

    const minCLB = Math.min(...(clbs as number[]));
    return minCLB >= 5 ? 4 : 0;
  };

  // 计算教育背景分数
  const calculateEducationScore = (): number => {
    const scores: { [key: string]: number } = {
      phd: 25,
      professional: 23,
      postgrad: 22,
      bachelor: 21,
      diploma2: 19,
      diploma1: 15,
      highschool: 5,
      below: 0,
    };
    return scores[formData.education] || 0;
  };

  // 计算工作经验分数
  const calculateWorkExperienceScore = (): number => {
    const scores: { [key: string]: number } = {
      "6plus": 15,
      "4to5": 13,
      "2to3": 11,
      "1year": 9,
    };
    return scores[formData.workExperience] || 0;
  };

  // 计算年龄分数
  const calculateAgeScore = (): number => {
    if (!formData.age) return 0;
    if (formData.age < 18 || formData.age >= 47) return 0;
    if (formData.age >= 18 && formData.age <= 35) return 12;
    if (formData.age === 36) return 11;
    // 36岁以上，每多1岁减1分
    return Math.max(0, 11 - (formData.age - 36));
  };

  // 计算工作安排分数
  const calculateJobArrangementScore = (): number => {
    const hasAny = formData.lmiaWork || formData.lmiaExemptWork || formData.lmiaOffer || formData.lmiaCurrentWork;
    return hasAny ? 10 : 0;
  };

  // 计算适应性分数
  const calculateAdaptabilityScore = (): number => {
    let score = 0;
    const conditions = [
      formData.spouseLanguage,
      formData.canadaEducation,
      formData.spouseCanadaEducation,
      formData.canadaWork,
      formData.lmiaEmployer,
      formData.canadaRelative,
    ];

    // 工作经历给10分，其他给5分
    if (formData.canadaWork) score += 10;
    else {
      const otherConditions = conditions.filter((c, i) => c && i !== 3);
      score += otherConditions.length * 5;
    }

    // 适应性总分最高10分
    return Math.min(score, 10);
  };

  const handleCalculate = () => {
    // 验证必填项
    if (!formData.primaryLanguageTest || !formData.primaryListening || !formData.primaryReading || 
        !formData.primaryWriting || !formData.primarySpeaking || !formData.education || 
        !formData.workExperience || !formData.age) {
      setValidationMessage("表单不能为空");
      setShowValidationError(true);
      return;
    }

    const primaryScore = calculatePrimaryLanguageScore();
    const secondaryScore = calculateSecondaryLanguageScore();
    const educationScore = calculateEducationScore();
    const workScore = calculateWorkExperienceScore();
    const ageScore = calculateAgeScore();
    const jobScore = calculateJobArrangementScore();
    const adaptabilityScore = calculateAdaptabilityScore();

    const totalScore = primaryScore + secondaryScore + educationScore + workScore + ageScore + jobScore + adaptabilityScore;

    setResult({
      primaryLanguage: primaryScore,
      secondaryLanguage: secondaryScore,
      education: educationScore,
      workExperience: workScore,
      age: ageScore,
      jobArrangement: jobScore,
      adaptability: adaptabilityScore,
      total: totalScore,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-12">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 flex items-center" style={{ fontFamily: "'Alibaba PuHuiTi', sans-serif", fontWeight: 900, fontSize: '48px' }}>
            <CalcIcon className="mr-3 h-12 w-12" />
            FSW算分工具
          </h1>
          <p className="text-lg opacity-90">
            最新FSW 67分工具/评估FSW入池/Federal Skilled Worker
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 语言技能 */}
            <Card>
              <CardHeader>
                <CardTitle>语言技能</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 第一语言 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">第一语言</h3>
                  <div>
                    <Label htmlFor="primaryLanguage" style={{paddingBottom: '8px'}}>选择语言</Label>
                    <Select value={formData.primaryLanguage} onValueChange={(value: any) => setFormData({ ...formData, primaryLanguage: value })}>
                      <SelectTrigger id="primaryLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">英语</SelectItem>
                        <SelectItem value="french">法语</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryLanguageTest" style={{paddingBottom: '8px'}}>考试类型</Label>
                    <Select value={formData.primaryLanguageTest} onValueChange={(value: any) => setFormData({ ...formData, primaryLanguageTest: value })}>
                      <SelectTrigger id="primaryLanguageTest">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ielts">IELTS</SelectItem>
                        <SelectItem value="celpip">CELPIP</SelectItem>
                        <SelectItem value="pte">PTE</SelectItem>
                        <SelectItem value="tef">TEF</SelectItem>
                        <SelectItem value="tcf">TCF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-start items-start">
                    <div className="flex flex-col items-start">
                      <Label htmlFor="primaryListening" className="mb-2">听力</Label>
                      <Input id="primaryListening" type="number" placeholder="0" value={formData.primaryListening || ""} onChange={(e) => setFormData({ ...formData, primaryListening: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Label htmlFor="primaryReading" className="mb-2">阅读</Label>
                      <Input id="primaryReading" type="number" placeholder="0" value={formData.primaryReading || ""} onChange={(e) => setFormData({ ...formData, primaryReading: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Label htmlFor="primaryWriting" className="mb-2">写作</Label>
                      <Input id="primaryWriting" type="number" placeholder="0" value={formData.primaryWriting || ""} onChange={(e) => setFormData({ ...formData, primaryWriting: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Label htmlFor="primarySpeaking" className="mb-2">口语</Label>
                      <Input id="primarySpeaking" type="number" placeholder="0" value={formData.primarySpeaking || ""} onChange={(e) => setFormData({ ...formData, primarySpeaking: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                    </div>
                  </div>
                </div>

                {/* 第二语言 */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">第二语言</h3>
                  <div>
                    <Label htmlFor="secondaryLanguage" style={{paddingBottom: '8px'}}>选择语言</Label>
                    <Select value={formData.secondaryLanguage} onValueChange={(value: any) => setFormData({ ...formData, secondaryLanguage: value, secondaryLanguageTest: "" })}>
                      <SelectTrigger id="secondaryLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">没有</SelectItem>
                        {formData.primaryLanguage === "english" && <SelectItem value="french">法语</SelectItem>}
                        {formData.primaryLanguage === "french" && <SelectItem value="english">英语</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.secondaryLanguage !== "none" && (
                    <>
                      <div>
                        <Label htmlFor="secondaryLanguageTest">考试类型</Label>
                        <Select value={formData.secondaryLanguageTest} onValueChange={(value: any) => setFormData({ ...formData, secondaryLanguageTest: value })}>
                          <SelectTrigger id="secondaryLanguageTest">
                            <SelectValue placeholder="请选择" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.secondaryLanguage === "french" && (
                              <>
                                <SelectItem value="tef">TEF</SelectItem>
                                <SelectItem value="tcf">TCF</SelectItem>
                              </>
                            )}
                            {formData.secondaryLanguage === "english" && (
                              <>
                                <SelectItem value="ielts">IELTS</SelectItem>
                                <SelectItem value="celpip">CELPIP</SelectItem>
                                <SelectItem value="pte">PTE</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-wrap gap-4 justify-start items-start">
                        <div className="flex flex-col items-start">
                          <Label htmlFor="secondaryListening" className="mb-2">听力</Label>
                          <Input id="secondaryListening" type="number" placeholder="0" value={formData.secondaryListening || ""} onChange={(e) => setFormData({ ...formData, secondaryListening: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                        </div>
                        <div className="flex flex-col items-start">
                          <Label htmlFor="secondaryReading" className="mb-2">阅读</Label>
                          <Input id="secondaryReading" type="number" placeholder="0" value={formData.secondaryReading || ""} onChange={(e) => setFormData({ ...formData, secondaryReading: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                        </div>
                        <div className="flex flex-col items-start">
                          <Label htmlFor="secondaryWriting" className="mb-2">写作</Label>
                          <Input id="secondaryWriting" type="number" placeholder="0" value={formData.secondaryWriting || ""} onChange={(e) => setFormData({ ...formData, secondaryWriting: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                        </div>
                        <div className="flex flex-col items-start">
                          <Label htmlFor="secondarySpeaking" className="mb-2">口语</Label>
                          <Input id="secondarySpeaking" type="number" placeholder="0" value={formData.secondarySpeaking || ""} onChange={(e) => setFormData({ ...formData, secondarySpeaking: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-24" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 教育背景 */}
            <Card>
              <CardHeader>
                <CardTitle>教育背景</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="education" style={{paddingBottom: '8px'}}>最高学历</Label>
                  <Select value={formData.education} onValueChange={(value: any) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger id="education">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phd">博士学位（Ph.D.）</SelectItem>
                      <SelectItem value="professional">硕士或专业学位（药学博士、JD等）</SelectItem>
                      <SelectItem value="postgrad">研究生文凭、证书</SelectItem>
                      <SelectItem value="bachelor">学士学位（含3年学制大专）</SelectItem>
                      <SelectItem value="diploma2">2年学制大专</SelectItem>
                      <SelectItem value="diploma1">1年学制大专</SelectItem>
                      <SelectItem value="highschool">高中</SelectItem>
                      <SelectItem value="below">高中以下</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 工作经验 */}
            <Card>
              <CardHeader>
                <CardTitle>工作经验</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="workExperience" style={{paddingBottom: '8px'}}>工作年限</Label>
                  <Select value={formData.workExperience} onValueChange={(value: any) => setFormData({ ...formData, workExperience: value })}>
                    <SelectTrigger id="workExperience">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6plus">6年及以上</SelectItem>
                      <SelectItem value="4to5">4到5年</SelectItem>
                      <SelectItem value="2to3">2到3年</SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 年龄 */}
            <Card>
              <CardHeader>
                <CardTitle>年龄</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="age" style={{paddingBottom: '8px'}}>周岁</Label>
                  <Input id="age" type="number" placeholder="0" value={formData.age || ""} onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })} style={{width: '112px'}} />
                </div>
              </CardContent>
            </Card>

            {/* 工作安排 */}
            <Card>
              <CardHeader>
                <CardTitle>工作安排</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.lmiaWork} onCheckedChange={(checked) => setFormData({ ...formData, lmiaWork: checked })} />
                  <Label>目前持LMIA工签在加拿大工作，属于TEER 0/1/2/3岗位</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.lmiaExemptWork} onCheckedChange={(checked) => setFormData({ ...formData, lmiaExemptWork: checked })} />
                  <Label>目前持LMIA豁免工签在加拿大工作，为工签指定雇主全职工作满一年</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.lmiaOffer} onCheckedChange={(checked) => setFormData({ ...formData, lmiaOffer: checked })} />
                  <Label>目前无工签，意向雇主持有LMIA并向你发出了工作邀请</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.lmiaCurrentWork} onCheckedChange={(checked) => setFormData({ ...formData, lmiaCurrentWork: checked })} />
                  <Label>目前合法在加拿大工作，当前雇主持有LMIA并向你发出了工作邀请</Label>
                </div>
              </CardContent>
            </Card>

            {/* 适应性 */}
            <Card>
              <CardHeader>
                <CardTitle>适应性</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.spouseLanguage} onCheckedChange={(checked) => setFormData({ ...formData, spouseLanguage: checked })} />
                  <Label>配偶语言能力各项在CLB 4及以上</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.canadaEducation} onCheckedChange={(checked) => setFormData({ ...formData, canadaEducation: checked })} />
                  <Label>有2年及以上加拿大高中或高等教育经历</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.spouseCanadaEducation} onCheckedChange={(checked) => setFormData({ ...formData, spouseCanadaEducation: checked })} />
                  <Label>配偶有2年及以上加拿大高中或高等教育经历</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.canadaWork} onCheckedChange={(checked) => setFormData({ ...formData, canadaWork: checked })} />
                  <Label>有至少1年加拿大全职工作经历（TEER 0/1/2/3）</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.lmiaEmployer} onCheckedChange={(checked) => setFormData({ ...formData, lmiaEmployer: checked })} />
                  <Label>雇主持有LMIA</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch checked={formData.canadaRelative} onCheckedChange={(checked) => setFormData({ ...formData, canadaRelative: checked })} />
                  <Label>申请人或配偶在加拿大有18岁以上PR或公民亲属</Label>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCalculate} className="w-full py-6 text-lg" style={{fontSize: '14px', paddingTop: '0px', paddingBottom: '0px', height: '36px'}}>
              我的计算结果
            </Button>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {!result ? (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>关于FSW</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">
                    联邦技术工人计划（FSW）是面向拥有海外工作经验的技术人员的联邦快速通道（EE）移民类别。申请人需要达到至少67分的门槛才可进入候选池，然后根据CRS分数等待被抽选。FSW申请人可以从境外申请，但所有申请人需要提供财务证明，有能力支持其本人及家庭在加拿大至少半年的生活所需。
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>您的计算结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-gray-600">总分</p>
                    <p className="text-4xl font-bold text-primary">{result.total}</p>
                    <p className="text-sm text-gray-600 mt-2">{result.total >= 67 ? "✓ 符合入池要求" : "✗ 未达到入池要求"}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>语言技能</span>
                      <span className="font-semibold">{result.primaryLanguage + result.secondaryLanguage}/28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>教育背景</span>
                      <span className="font-semibold">{result.education}/25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>工作经验</span>
                      <span className="font-semibold">{result.workExperience}/15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>年龄</span>
                      <span className="font-semibold">{result.age}/12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>工作安排</span>
                      <span className="font-semibold">{result.jobArrangement}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>适应性</span>
                      <span className="font-semibold">{result.adaptability}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Validation Error Dialog */}
      <Dialog open={showValidationError} onOpenChange={setShowValidationError}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>表单验证错误</DialogTitle>
            <DialogDescription>{validationMessage}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowValidationError(false)} className="w-full">
            确定
          </Button>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
