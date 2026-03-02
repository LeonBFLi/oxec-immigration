import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, Calculator as CalcIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { updateMetaTags, pageMetaTags } from "@/lib/meta-tags";

export default function Calculator() {
  // 更新页面Meta标签
  useEffect(() => {
    updateMetaTags(pageMetaTags.calculator);
  }, []);

  const [familyStatus, setFamilyStatus] = useState<"single" | "married-no-spouse" | "married-with-spouse">("single");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    age: 0,
    education: "" as string,
    canadianEducation: "" as string,
    
    // Primary language
    primaryLanguage: "english" as "english" | "french",
    languageTest: "" as string,
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    
    // Secondary language
    secondaryLanguage: "none" as "english" | "french" | "none",
    secondLanguageTest: "none" as string,
    secondListening: 0,
    secondReading: 0,
    secondWriting: 0,
    secondSpeaking: 0,
    
    canadianWorkExperience: "none" as string,
    overseasWorkExperience: "" as string,
    
    // Transferable Skills
    hasLanguageEducationCombination: false,
    hasEducationWorkExperienceCombination: false,
    hasOverseasLanguageCombination: false,
    hasOverseasWorkExperienceCombination: false,
    canadianTradeCertificate: false,
    
    // Additional Factors
    hasSiblingInCanada: false,
    hasProvincialNomination: false,
    hasFrenchLanguage: false,
    hasCanadianEducation: false,
    
    // Spouse (if applicable)
    spouseAge: 17,
    spouseEducation: "bachelor" as string,
    spouseLanguageTest: "none" as string,
    spouseListening: 0,
    spouseReading: 0,
    spouseWriting: 0,
    spouseSpeaking: 0,
    spouseCanadianWorkExperience: "none" as string,
  });

  const [result, setResult] = useState<any>(null);
  const utils = trpc.useUtils();
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    // Validate required fields
    if (!formData.age || formData.age === 0) {
      setValidationError("请填写年龄");
      setShowErrorDialog(true);
      return;
    }
    if (!formData.education || formData.education === "default") {
      setValidationError("请选择最高学历");
      setShowErrorDialog(true);
      return;
    }
    if (!formData.primaryLanguage) {
      setValidationError("请选择第一语言");
      setShowErrorDialog(true);
      return;
    }
    if (!formData.languageTest || formData.languageTest === "default") {
      setValidationError("请选择语言考试类型");
      setShowErrorDialog(true);
      return;
    }
    if (!formData.canadianWorkExperience || formData.canadianWorkExperience === "default") {
      setValidationError("请选择加拿大工作经验");
      setShowErrorDialog(true);
      return;
    }
    // If language test is selected, validate language scores
    if (formData.languageTest && formData.languageTest !== "none") {
      if (!formData.listening || !formData.reading || !formData.writing || !formData.speaking) {
        setValidationError("请填写所有语言考试成绩");
        setShowErrorDialog(true);
        return;
      }
    }
    // If married with spouse, validate spouse fields
    if (familyStatus === 'married-with-spouse') {
      if (!formData.spouseAge || formData.spouseAge === 0) {
        setValidationError("请填写配偶年龄");
        setShowErrorDialog(true);
        return;
      }
      // Check if spouse age is less than 17
      if (formData.spouseAge < 17) {
        setValidationError("配偶年龄必须至少为17岁。请输入有效的配偶年龄。");
        setShowErrorDialog(true);
        return;
      }
      if (!formData.spouseEducation || formData.spouseEducation === "default") {
        setValidationError("请选择配偶最高学历");
        setShowErrorDialog(true);
        return;
      }
      if (!formData.spouseLanguageTest || formData.spouseLanguageTest === "none") {
        setValidationError("请选择配偶语言考试类型");
        setShowErrorDialog(true);
        return;
      }
      if (formData.spouseListening === 0 || formData.spouseReading === 0 || formData.spouseWriting === 0 || formData.spouseSpeaking === 0) {
        setValidationError("请填写配偶所有语言考试成绩");
        setShowErrorDialog(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Prepare payload based on family status
      const payload: any = {
        familyStatus,
        age: formData.age,
        education: formData.education,
        canadianEducation: formData.canadianEducation || undefined,
        primaryLanguage: formData.primaryLanguage,
        languageTest: formData.languageTest,
        listening: formData.listening,
        reading: formData.reading,
        writing: formData.writing,
        speaking: formData.speaking,
        secondaryLanguage: formData.secondaryLanguage !== "none" ? formData.secondaryLanguage : undefined,
        secondLanguageTest: formData.secondLanguageTest !== "none" ? formData.secondLanguageTest : undefined,
        secondListening: formData.secondListening || undefined,
        secondReading: formData.secondReading || undefined,
        secondWriting: formData.secondWriting || undefined,
        secondSpeaking: formData.secondSpeaking || undefined,
        canadianWorkExperience: formData.canadianWorkExperience,
        overseasWorkExperience: formData.overseasWorkExperience || undefined,
        hasSiblingInCanada: formData.hasSiblingInCanada,
        hasProvincialNomination: formData.hasProvincialNomination,
      };
      
      // Add spouse fields only if married with spouse
      if (familyStatus === 'married-with-spouse') {
        payload.spouseAge = formData.spouseAge;
        payload.spouseEducation = formData.spouseEducation;
        payload.spouseLanguageTest = formData.spouseLanguageTest;
        payload.spouseListening = formData.spouseListening;
        payload.spouseReading = formData.spouseReading;
        payload.spouseWriting = formData.spouseWriting;
        payload.spouseSpeaking = formData.spouseSpeaking;
        payload.spouseCanadianWorkExperience = formData.spouseCanadianWorkExperience;
      }
      
      const result = await utils.calculator.calculateCRS.fetch(payload);
      setResult(result);
    } catch (error: any) {
      toast.error("计算失败: " + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-12">
        <div className="container">
          <Link href="/" className="inline-flex items-center text-primary-foreground hover:opacity-80 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Link>
          <div className="flex items-center gap-4">
            <CalcIcon className="h-12 w-12" />
            <h1 className="text-4xl font-black" style={{ fontFamily: "'Alibaba PuHuiTi', sans-serif", fontWeight: 900, fontSize: '48px' }}>
              联邦快速通道CRS算分工具
            </h1>
          </div>
          <p className="text-lg opacity-90 mt-4">
            最新CRS Calculator/综合排名系统/评估入池分数/Express Entry
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Family Status Selection */}
            <Card>
              <CardHeader>
                <CardTitle>家庭移民安排</CardTitle>
                <CardDescription>作为主申请人</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" style={{marginTop: '-10px'}}>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="single"
                      checked={familyStatus === "single"}
                      onChange={(e) => setFamilyStatus(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span>我现在单身（含离异）</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="married-no-spouse"
                      checked={familyStatus === "married-no-spouse"}
                      onChange={(e) => setFamilyStatus(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span>我有配偶，但不带配偶申请</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="married-with-spouse"
                      checked={familyStatus === "married-with-spouse"}
                      onChange={(e) => setFamilyStatus(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span>我有配偶，且配偶一起申请</span>
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  注：配偶指已婚配偶、同居一年以上伴侣或事实配偶。
                </p>
              </CardContent>
            </Card>

            {/* Section 1: Human Capital Factors */}
            <Card>
              <CardHeader>
                <CardTitle>人力资源因素</CardTitle>
                <CardDescription>作为主申请人</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" style={{marginTop: '-10px'}}>
                {/* Age */}
                <div>
                  <Label htmlFor="age" style={{paddingBottom: '8px'}}>年龄</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.age || 0}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                {/* Education */}
                <div>
                  <Label htmlFor="education" style={{paddingBottom: '8px'}}>最高学历</Label>
                  <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger id="education">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">请选择</SelectItem>
                      <SelectItem value="phd">博士学位（Ph.D.）</SelectItem>
                      <SelectItem value="masters">硕士学位或专业学位（如医学博士、法律博士等）</SelectItem>
                      <SelectItem value="double">双学位、文凭或证书（必须含3年及以上学制项目）</SelectItem>
                      <SelectItem value="bachelor">学士学位或3年制大专</SelectItem>
                      <SelectItem value="two-year">2年制大专</SelectItem>
                      <SelectItem value="one-year">1年制大专</SelectItem>
                      <SelectItem value="highschool">高中</SelectItem>
                      <SelectItem value="below">高中以下</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Canadian Education Background */}
                <div>
                  <Label htmlFor="canadianEducation" style={{paddingBottom: '8px'}}>是否在加拿大取得了高等教育学位、文凭或证书</Label>
                  <Select value={formData.canadianEducation || "default"} onValueChange={(value) => setFormData({ ...formData, canadianEducation: value === "default" ? "" : value })}>
                    <SelectTrigger id="canadianEducation">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">请选择</SelectItem>
                      <SelectItem value="none">没有</SelectItem>
                      <SelectItem value="1-2year">1年或2年学制</SelectItem>
                      <SelectItem value="3plus">3年及以上学制</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Language Selection */}
                <div>
                  <Label htmlFor="primaryLanguage" style={{paddingBottom: '8px'}}>第一语言</Label>
                  <Select value={formData.primaryLanguage} onValueChange={(value) => setFormData({ ...formData, primaryLanguage: value as "english" | "french" })}>
                    <SelectTrigger id="primaryLanguage">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">英语</SelectItem>
                      <SelectItem value="french">法语</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Language Test Type */}
                <div>
                  <Label htmlFor="languageTest" style={{paddingBottom: '8px'}}>可以提供以下哪一类语言考试成绩</Label>
                  <Select value={formData.languageTest || "default"} onValueChange={(value) => setFormData({ ...formData, languageTest: value === "default" ? "" : value })}>
                    <SelectTrigger id="languageTest">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">请选择</SelectItem>
                      {formData.primaryLanguage === "english" ? (
                        <>
                          <SelectItem value="ielts">IELTS</SelectItem>
                          <SelectItem value="celpip">CELPIP</SelectItem>
                          <SelectItem value="pte">PTE</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="tef">TEF</SelectItem>
                          <SelectItem value="tcf">TCF</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Language Scores */}
                {formData.languageTest && (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="listening">听力</Label>
                      <Input
                        id="listening"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.listening || 0}
                        onChange={(e) => setFormData({ ...formData, listening: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reading">阅读</Label>
                      <Input
                        id="reading"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.reading || 0}
                        onChange={(e) => setFormData({ ...formData, reading: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="writing">写作</Label>
                      <Input
                        id="writing"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.writing || 0}
                        onChange={(e) => setFormData({ ...formData, writing: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="speaking">口语</Label>
                      <Input
                        id="speaking"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.speaking || 0}
                        onChange={(e) => setFormData({ ...formData, speaking: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}

                {/* Secondary Language Selection */}
                <div>
                  <Label htmlFor="secondaryLanguage" style={{paddingBottom: '8px'}}>第二语言</Label>
                  <Select value={formData.secondaryLanguage || "none"} onValueChange={(value) => setFormData({ ...formData, secondaryLanguage: value as "english" | "french" | "none" })}>
                    <SelectTrigger id="secondaryLanguage">
                      <SelectValue placeholder="没有" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">没有</SelectItem>
                      {formData.primaryLanguage !== "english" && <SelectItem value="english">英语</SelectItem>}
                      {formData.primaryLanguage !== "french" && <SelectItem value="french">法语</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Language Test Type */}
                {formData.secondaryLanguage && formData.secondaryLanguage !== "none" && (
                  <div>
                    <Label htmlFor="secondLanguageTest">第二语言考试类型</Label>
                    <Select value={formData.secondLanguageTest || "none"} onValueChange={(value) => setFormData({ ...formData, secondLanguageTest: value })}>
                      <SelectTrigger id="secondLanguageTest">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">请选择</SelectItem>
                        {formData.secondaryLanguage === "english" ? (
                          <>
                            <SelectItem value="ielts">IELTS</SelectItem>
                            <SelectItem value="celpip">CELPIP</SelectItem>
                            <SelectItem value="pte">PTE</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="tef">TEF</SelectItem>
                            <SelectItem value="tcf">TCF</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Secondary Language Scores */}
                {formData.secondaryLanguage && formData.secondaryLanguage !== "none" && formData.secondLanguageTest && formData.secondLanguageTest !== "none" && (
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="secondListening">听力</Label>
                      <Input
                        id="secondListening"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.secondListening || 0}
                        onChange={(e) => setFormData({ ...formData, secondListening: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondReading">阅读</Label>
                      <Input
                        id="secondReading"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.secondReading || 0}
                        onChange={(e) => setFormData({ ...formData, secondReading: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondWriting">写作</Label>
                      <Input
                        id="secondWriting"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.secondWriting || 0}
                        onChange={(e) => setFormData({ ...formData, secondWriting: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondSpeaking">口语</Label>
                      <Input
                        id="secondSpeaking"
                        type="number"
                        min="0"
                        max="9"
                        value={formData.secondSpeaking || 0}
                        onChange={(e) => setFormData({ ...formData, secondSpeaking: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}

                {/* Canadian Work Experience */}
                <div>
                  <Label htmlFor="canadianWorkExperience" style={{paddingBottom: '8px'}}>是否有加拿大工作经历</Label>
                  <Select value={formData.canadianWorkExperience || "default"} onValueChange={(value) => setFormData({ ...formData, canadianWorkExperience: value === "default" ? "" : value })}>
                    <SelectTrigger id="canadianWorkExperience">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">请选择</SelectItem>
                      <SelectItem value="none">没有或1年以下</SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                      <SelectItem value="2year">2年</SelectItem>
                      <SelectItem value="3year">3年</SelectItem>
                      <SelectItem value="4year">4年</SelectItem>
                      <SelectItem value="5plus">5年及以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Spouse Information (if applicable) */}
            {familyStatus === "married-with-spouse" && (
              <Card>
                <CardHeader>
                  <CardTitle>配偶信息</CardTitle>
                  <CardDescription>作为主申请人配偶</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Spouse Age */}
                  <div>
                    <Label htmlFor="spouseAge">配偶年龄</Label>
                    <Input
                      id="spouseAge"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.spouseAge || 0}
                      onChange={(e) => setFormData({ ...formData, spouseAge: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  {/* Spouse Education */}
                  <div>
                    <Label htmlFor="spouseEducation">配偶的最高学历</Label>
                    <Select value={formData.spouseEducation || "default"} onValueChange={(value) => setFormData({ ...formData, spouseEducation: value === "default" ? "" : value })}>
                      <SelectTrigger id="spouseEducation">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">请选择</SelectItem>
                        <SelectItem value="phd">博士学位（Ph.D.）</SelectItem>
                        <SelectItem value="masters">硕士学位或专业学位（如医学博士、法律博士等）</SelectItem>
                        <SelectItem value="double">双学位、文凭或证书（必须含3年及以上学制项目）</SelectItem>
                        <SelectItem value="bachelor">学士学位或3年制大专</SelectItem>
                        <SelectItem value="two-year">2年制大专</SelectItem>
                        <SelectItem value="one-year">1年制大专</SelectItem>
                        <SelectItem value="highschool">高中</SelectItem>
                        <SelectItem value="below">高中以下</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Spouse Language Test */}
                  <div>
                    <Label htmlFor="spouseLanguageTest">配偶是否参加了以下语言考试</Label>
                    <Select value={formData.spouseLanguageTest || "default"} onValueChange={(value) => setFormData({ ...formData, spouseLanguageTest: value === "default" ? "" : value })}>
                      <SelectTrigger id="spouseLanguageTest">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">请选择</SelectItem>
                        <SelectItem value="none">没有</SelectItem>
                        <SelectItem value="ielts">IELTS</SelectItem>
                        <SelectItem value="celpip">CELPIP</SelectItem>
                        <SelectItem value="pte">PTE</SelectItem>
                        <SelectItem value="tef">TEF</SelectItem>
                        <SelectItem value="tcf">TCF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Spouse Language Scores */}
                  {formData.spouseLanguageTest && formData.spouseLanguageTest !== "none" && (
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="spouseListening">听力</Label>
                        <Input
                          id="spouseListening"
                          type="number"
                          min="0"
                          max="9"
                          value={formData.spouseListening || 0}
                          onChange={(e) => setFormData({ ...formData, spouseListening: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouseReading">阅读</Label>
                        <Input
                          id="spouseReading"
                          type="number"
                          min="0"
                          max="9"
                          value={formData.spouseReading || 0}
                          onChange={(e) => setFormData({ ...formData, spouseReading: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouseWriting">写作</Label>
                        <Input
                          id="spouseWriting"
                          type="number"
                          min="0"
                          max="9"
                          value={formData.spouseWriting || 0}
                          onChange={(e) => setFormData({ ...formData, spouseWriting: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="spouseSpeaking">口语</Label>
                        <Input
                          id="spouseSpeaking"
                          type="number"
                          min="0"
                          max="9"
                          value={formData.spouseSpeaking || 0}
                          onChange={(e) => setFormData({ ...formData, spouseSpeaking: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Spouse Canadian Work Experience */}
                  <div>
                    <Label htmlFor="spouseCanadianWorkExperience">配偶是否有加拿大工作经验</Label>
                    <Select value={formData.spouseCanadianWorkExperience || "default"} onValueChange={(value) => setFormData({ ...formData, spouseCanadianWorkExperience: value === "default" ? "" : value })}>
                      <SelectTrigger id="spouseCanadianWorkExperience">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">请选择</SelectItem>
                        <SelectItem value="none">没有或1年以下</SelectItem>
                        <SelectItem value="1year">1年</SelectItem>
                        <SelectItem value="2year">2年</SelectItem>
                        <SelectItem value="3year">3年</SelectItem>
                        <SelectItem value="4year">4年</SelectItem>
                        <SelectItem value="5plus">5年及以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section 2: Skill Transferability */}
            <Card>
              <CardHeader>
                <CardTitle>可转移技能因素</CardTitle>
                <CardDescription>作为主申请人</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" style={{marginTop: '-10px'}}>
                {/* Overseas Work Experience */}
                <div>
                  <Label htmlFor="overseasWorkExperience" style={{paddingBottom: '8px'}}>是否有加拿大境外的直接相关工作经验</Label>
                  <Select value={formData.overseasWorkExperience || "none"} onValueChange={(value) => setFormData({ ...formData, overseasWorkExperience: value })}>
                    <SelectTrigger id="overseasWorkExperience">
                      <SelectValue placeholder="没有" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">没有</SelectItem>
                      <SelectItem value="1year">1年</SelectItem>
                      <SelectItem value="2year">2年</SelectItem>
                      <SelectItem value="3plus">3年及以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade Certificate */}
                <div>
                  <Label htmlFor="hasTradeCertificate" style={{paddingBottom: '8px'}}>是否拥有加拿大技工类职业证书</Label>
                  <Select 
                    value={formData.canadianTradeCertificate ? "yes" : (formData.canadianTradeCertificate === false ? "no" : "default")} 
                    onValueChange={(value) => setFormData({ ...formData, canadianTradeCertificate: value === "yes" ? true : value === "no" ? false : false })}
                  >
                    <SelectTrigger id="hasTradeCertificate">
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">请选择</SelectItem>
                      <SelectItem value="yes">有</SelectItem>
                      <SelectItem value="no">没有</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Additional Factors */}
            <Card>
              <CardHeader>
                <CardTitle>附加分项</CardTitle>
                <CardDescription>作为主申请人或配偶</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4" style={{marginTop: '-10px'}}>
                  {/* Sibling in Canada */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="hasSiblingInCanada"
                      checked={formData.hasSiblingInCanada}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasSiblingInCanada: checked })}
                    />
                    <Label htmlFor="hasSiblingInCanada" className="cursor-pointer">
                      有兄弟姐妹是加拿大公民或PR且居住在加拿大
                    </Label>
                  </div>

                  {/* Provincial Nomination */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="hasProvincialNomination"
                      checked={formData.hasProvincialNomination}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasProvincialNomination: checked })}
                    />
                    <Label htmlFor="hasProvincialNomination" className="cursor-pointer">
                      有加拿大省或地区提名计划出具的证明
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculate Button */}
            <Button 
              onClick={handleCalculate} 
              disabled={isLoading}
              className="w-full h-12 text-lg"
              size="lg" style={{fontSize: '14px', height: '40px'}}
            >
              {isLoading ? "计算中..." : "计算我的分数"}
            </Button>
          </div>

          {/* Info Panel or Score Board */}
          <div className="lg:col-span-1">
            {result ? (
              <Card className="sticky top-8 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <CardTitle className="flex items-center">
                    <CalcIcon className="mr-2 h-5 w-5" />
                    您的CRS分数
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {result.totalScore}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold text-sm mb-3">分数明细</h4>
                    
                    {/* 核心人力资本 */}
                    {result.breakdown?.核心人力资本 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold bg-blue-50 p-2 rounded">
                          <span>核心人力资本因素</span>
                          <span className="text-blue-600">{result.breakdown.核心人力资本.小计}</span>
                        </div>
                        <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                          {result.breakdown.核心人力资本.年龄 > 0 && (
                            <div className="flex justify-between">
                              <span>年龄</span>
                              <span>{result.breakdown.核心人力资本.年龄}</span>
                            </div>
                          )}
                          {result.breakdown.核心人力资本.学历 > 0 && (
                            <div className="flex justify-between">
                              <span>学历</span>
                              <span>{result.breakdown.核心人力资本.学历}</span>
                            </div>
                          )}
                          {result.breakdown.核心人力资本.第一语言 > 0 && (
                            <div className="flex justify-between">
                              <span>第一语言</span>
                              <span>{result.breakdown.核心人力资本.第一语言}</span>
                            </div>
                          )}
                          {result.breakdown.核心人力资本.第二语言 > 0 && (
                            <div className="flex justify-between">
                              <span>第二语言</span>
                              <span>{result.breakdown.核心人力资本.第二语言}</span>
                            </div>
                          )}
                          {result.breakdown.核心人力资本.加国经验 > 0 && (
                            <div className="flex justify-between">
                              <span>加国工作经验</span>
                              <span>{result.breakdown.核心人力资本.加国经验}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 配偶因素 */}
                    {result.breakdown?.配偶因素 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold bg-green-50 p-2 rounded">
                          <span>配偶因素</span>
                          <span className="text-green-600">{result.breakdown.配偶因素.小计}</span>
                        </div>
                        <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                          {result.breakdown.配偶因素.配偶学历 > 0 && (
                            <div className="flex justify-between">
                              <span>配偶学历</span>
                              <span>{result.breakdown.配偶因素.配偶学历}</span>
                            </div>
                          )}
                          {result.breakdown.配偶因素.配偶语言 > 0 && (
                            <div className="flex justify-between">
                              <span>配偶语言</span>
                              <span>{result.breakdown.配偶因素.配偶语言}</span>
                            </div>
                          )}
                          {result.breakdown.配偶因素.配偶加国经验 > 0 && (
                            <div className="flex justify-between">
                              <span>配偶加国经验</span>
                              <span>{result.breakdown.配偶因素.配偶加国经验}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 可转移技能 */}
                    {result.breakdown?.可转移技能 && result.breakdown.可转移技能.小计 > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold bg-purple-50 p-2 rounded">
                          <span>可转移技能加分</span>
                          <span className="text-purple-600">{result.breakdown.可转移技能.小计}</span>
                        </div>
                        <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                          {result.breakdown.可转移技能["学历+语言"] > 0 && (
                            <div className="flex justify-between">
                              <span>学历+语言</span>
                              <span>{result.breakdown.可转移技能["学历+语言"]}</span>
                            </div>
                          )}
                          {result.breakdown.可转移技能["学历+加国经验"] > 0 && (
                            <div className="flex justify-between">
                              <span>学历+加国经验</span>
                              <span>{result.breakdown.可转移技能["学历+加国经验"]}</span>
                            </div>
                          )}
                          {result.breakdown.可转移技能["海外经验+语言"] > 0 && (
                            <div className="flex justify-between">
                              <span>海外经验+语言</span>
                              <span>{result.breakdown.可转移技能["海外经验+语言"]}</span>
                            </div>
                          )}
                          {result.breakdown.可转移技能["海外经验+加国经验"] > 0 && (
                            <div className="flex justify-between">
                              <span>海外经验+加国经验</span>
                              <span>{result.breakdown.可转移技能["海外经验+加国经验"]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 附加分 */}
                    {result.breakdown?.附加分 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold bg-orange-50 p-2 rounded">
                          <span>附加分项</span>
                          <span className="text-orange-600">{result.breakdown.附加分.小计}</span>
                        </div>
                        <div className="pl-3 space-y-1 text-xs text-muted-foreground">
                          {result.breakdown.附加分.加拿大学习 > 0 && (
                            <div className="flex justify-between">
                              <span>加拿大学习</span>
                              <span>{result.breakdown.附加分.加拿大学习}</span>
                            </div>
                          )}
                          {result.breakdown.附加分.兄弟姐妹 > 0 && (
                            <div className="flex justify-between">
                              <span>兄弟姐妹在加拿大</span>
                              <span>{result.breakdown.附加分.兄弟姐妹}</span>
                            </div>
                          )}
                          {result.breakdown.附加分.省提名 > 0 && (
                            <div className="flex justify-between">
                              <span>省提名证明</span>
                              <span>{result.breakdown.附加分.省提名}</span>
                            </div>
                          )}
                          {result.breakdown.附加分.法语技能 > 0 && (
                            <div className="flex justify-between">
                              <span>法语技能</span>
                              <span>{result.breakdown.附加分.法语技能}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full mt-6"
                    onClick={() => window.location.href = '/booking'}
                  >
                    预约咨询专业顾问
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">关于联邦快速通道CRS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2"></p>
                    <p className="text-sm text-muted-foreground" style={{marginTop: '-25px'}}>
                      综合排名系统（CRS）是一个基于积分的系统，IRCC用它来评估申请人的个人资料并对其进行评分，从而在快速通道候选池中进行排名。
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span>最高分数：</span>
                      <span className="font-semibold">1200分</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>典型邀请分数：</span>
                      <span className="font-semibold">480-550分</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Validation Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>表单验证错误</DialogTitle>
            <DialogDescription>
              {validationError}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
