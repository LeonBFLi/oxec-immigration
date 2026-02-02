'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, Globe } from "lucide-react";
import { useState, useRef } from "react";
import { MapView } from "@/components/Map";

const CONSULTATION_SUBJECTS = [
  "移民",
  "留学",
  "家庭团聚",
  "招聘外籍工人",
  "短期入境",
  "疑难案件处理",
  "其他事项"
];

const WEEKDAYS = [
  { name: "周一", value: "monday" },
  { name: "周二", value: "tuesday" },
  { name: "周三", value: "wednesday" },
  { name: "周四", value: "thursday" },
  { name: "周五", value: "friday" }
];

export default function Booking() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consultationSubject: "",
    consultationType: "phone" as "phone" | "in-person",
    gender: "",
    maritalStatus: "",
    education: "",
    englishLevel: "",
    hasExamScore: false,
    workExperience: "",
    hasRefusal: false,
    refusalReason: "",
    hasCriminalRecord: false,
    criminalRecordDetails: "",
    message: "",
  });

  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: () => {
      toast.success("您的预约申请已收到，我们的专业顾问将在24小时内与您联系。");
      setFormData({
        name: "",
        email: "",
        phone: "",
        consultationSubject: "",
        consultationType: "phone",
        gender: "",
        maritalStatus: "",
        education: "",
        englishLevel: "",
        hasExamScore: false,
        workExperience: "",
        hasRefusal: false,
        refusalReason: "",
        hasCriminalRecord: false,
        criminalRecordDetails: "",
        message: "",
      });
      setSelectedTimeSlots([]);
    },
    onError: (error) => {
      toast.error("预约失败: " + error.message);
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

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSelectAll = () => {
    const allSlots = WEEKDAYS.flatMap(day => [
      `${day.value}-morning`,
      `${day.value}-afternoon`
    ]);
    setSelectedTimeSlots(allSlots);
  };

  const handleInvertSelection = () => {
    const allSlots = WEEKDAYS.flatMap(day => [
      `${day.value}-morning`,
      `${day.value}-afternoon`
    ]);
    const newSelection = allSlots.filter(slot => !selectedTimeSlots.includes(slot));
    setSelectedTimeSlots(newSelection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.consultationSubject) {
      toast.error("请填写所有必填项");
      return;
    }

    const preferredTimeSlots = selectedTimeSlots.length > 0 
      ? selectedTimeSlots.map(slot => {
          const [day, time] = slot.split('-');
          const dayName = WEEKDAYS.find(d => d.value === day)?.name || day;
          return `${dayName}${time === 'morning' ? '上午' : '下午'}`;
        }).join('、')
      : '';

    await createAppointment.mutate({
      ...formData,
      hasExamScore: formData.hasExamScore,
      hasRefusal: formData.hasRefusal,
      hasCriminalRecord: formData.hasCriminalRecord,
      preferredTimeSlots,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">返回首页</span>
            </div>
          </Link>
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md transition-colors text-primary-foreground font-medium"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? '中文' : 'ENG'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>预约咨询</CardTitle>
                <CardDescription>
                  请准确填写以下表单并提交，我们将在最短时间内评估您的需求，然后电话联系您确认面谈时间
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* RCIC Compliance Declaration */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>重要声明：</strong>本表单所采集的所有个人信息将严格遵循《加拿大移民顾问监管委员会职业操守条例》进行管理。我们承诺对您的所有资料严格保密，且仅用于评估您的移民资格。提交此表单并不构成正式的法律代理关系；正式代理关系仅在双方签署《专业服务协议》(Retainer Agreement) 后成立。我们在此确认，在处理您的咨询申请前已进行内部核查，确保不存在任何利益冲突。若后续发现潜在冲突，我们将立即向您披露并采取合规措施。
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">基本信息</h3>
                    
                    <div className="space-y-2">
                      <Label>客户名称 *</Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入您的全名"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>电子邮件 *</Label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="请输入您的邮箱地址"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>联系电话 *</Label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="请输入您的联系电话"
                      />
                    </div>
                  </div>

                  {/* Consultation Details Section */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-base font-semibold">预约详情</h3>

                    <div className="space-y-2">
                      <Label>需求类型 *</Label>
                      <RadioGroup value={formData.consultationSubject} onValueChange={(value) => setFormData({ ...formData, consultationSubject: value })}>
                        <div className="flex flex-wrap gap-3">
                          {CONSULTATION_SUBJECTS.map((subject) => (
                            <div key={subject} className="flex items-center space-x-2">
                              <RadioGroupItem value={subject} id={subject} />
                              <Label htmlFor={subject} className="font-normal cursor-pointer">{subject}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>咨询方式 *</Label>
                      <RadioGroup value={formData.consultationType} onValueChange={(value) => setFormData({ ...formData, consultationType: value as "phone" | "in-person" })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone" />
                            <Label htmlFor="phone" className="font-normal cursor-pointer">电话咨询</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="in-person" id="in-person" />
                            <Label htmlFor="in-person" className="font-normal cursor-pointer">线下咨询</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Time Slot Selector */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>预计咨询时间 *</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className="text-xs"
                          >
                            全选
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleInvertSelection}
                            className="text-xs"
                          >
                            反选
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                        {WEEKDAYS.map((day) => (
                          <div key={day.value} className="flex flex-wrap gap-4">
                            <span className="font-medium w-12">{day.name}</span>
                            <div className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${day.value}-morning`}
                                  checked={selectedTimeSlots.includes(`${day.value}-morning`)}
                                  onChange={() => handleTimeSlotToggle(`${day.value}-morning`)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor={`${day.value}-morning`} className="cursor-pointer">上午</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${day.value}-afternoon`}
                                  checked={selectedTimeSlots.includes(`${day.value}-afternoon`)}
                                  onChange={() => handleTimeSlotToggle(`${day.value}-afternoon`)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor={`${day.value}-afternoon`} className="cursor-pointer">下午</label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Background Information Section */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-base font-semibold">背景信息采集</h3>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label>性别</Label>
                      <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="font-normal cursor-pointer">男</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal cursor-pointer">女</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Marital Status */}
                    <div className="space-y-2">
                      <Label>婚姻状况</Label>
                      <RadioGroup value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single" className="font-normal cursor-pointer">单身</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="married" id="married" />
                            <Label htmlFor="married" className="font-normal cursor-pointer">已婚</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="divorced" id="divorced" />
                            <Label htmlFor="divorced" className="font-normal cursor-pointer">离异</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="widowed" id="widowed" />
                            <Label htmlFor="widowed" className="font-normal cursor-pointer">丧偶</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Education */}
                    <div className="space-y-2">
                      <Label>最高学历</Label>
                      <RadioGroup value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high-school" id="high-school" />
                            <Label htmlFor="high-school" className="font-normal cursor-pointer">高中及以下</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="diploma" id="diploma" />
                            <Label htmlFor="diploma" className="font-normal cursor-pointer">大专</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bachelor" id="bachelor" />
                            <Label htmlFor="bachelor" className="font-normal cursor-pointer">本科</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="master" id="master" />
                            <Label htmlFor="master" className="font-normal cursor-pointer">硕士</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phd" id="phd" />
                            <Label htmlFor="phd" className="font-normal cursor-pointer">博士</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* English Level */}
                    <div className="space-y-2">
                      <Label>英语水平</Label>
                      <RadioGroup value={formData.englishLevel} onValueChange={(value) => setFormData({ ...formData, englishLevel: value })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner" className="font-normal cursor-pointer">入门</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate" className="font-normal cursor-pointer">中级</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced" className="font-normal cursor-pointer">高级</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fluent" id="fluent" />
                            <Label htmlFor="fluent" className="font-normal cursor-pointer">流利</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Exam Score */}
                    <div className="space-y-2">
                      <Label>是否有考试成绩</Label>
                      <RadioGroup value={formData.hasExamScore ? "yes" : "no"} onValueChange={(value) => setFormData({ ...formData, hasExamScore: value === "yes" })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="exam-yes" />
                            <Label htmlFor="exam-yes" className="font-normal cursor-pointer">是</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="exam-no" />
                            <Label htmlFor="exam-no" className="font-normal cursor-pointer">否</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-2">
                      <Label>已工作年限</Label>
                      <RadioGroup value={formData.workExperience} onValueChange={(value) => setFormData({ ...formData, workExperience: value })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="less-1" id="less-1" />
                            <Label htmlFor="less-1" className="font-normal cursor-pointer">1年以下</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-3" id="1-3" />
                            <Label htmlFor="1-3" className="font-normal cursor-pointer">1-3年</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-5" id="3-5" />
                            <Label htmlFor="3-5" className="font-normal cursor-pointer">3-5年</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5-10" id="5-10" />
                            <Label htmlFor="5-10" className="font-normal cursor-pointer">5-10年</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10+" id="10+" />
                            <Label htmlFor="10+" className="font-normal cursor-pointer">10年以上</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Refusal History */}
                    <div className="space-y-2">
                      <Label>是否有拒签史</Label>
                      <RadioGroup value={formData.hasRefusal ? "yes" : "no"} onValueChange={(value) => setFormData({ ...formData, hasRefusal: value === "yes" })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="refusal-yes" />
                            <Label htmlFor="refusal-yes" className="font-normal cursor-pointer">是</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="refusal-no" />
                            <Label htmlFor="refusal-no" className="font-normal cursor-pointer">否</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {formData.hasRefusal && (
                        <Textarea
                          placeholder="请简述拒签原因"
                          value={formData.refusalReason}
                          onChange={(e) => setFormData({ ...formData, refusalReason: e.target.value })}
                          rows={3}
                        />
                      )}
                    </div>

                    {/* Criminal Record */}
                    <div className="space-y-2">
                      <Label>是否有犯罪记录</Label>
                      <RadioGroup value={formData.hasCriminalRecord ? "yes" : "no"} onValueChange={(value) => setFormData({ ...formData, hasCriminalRecord: value === "yes" })}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="criminal-yes" />
                            <Label htmlFor="criminal-yes" className="font-normal cursor-pointer">是</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="criminal-no" />
                            <Label htmlFor="criminal-no" className="font-normal cursor-pointer">否</Label>
                          </div>
                        </div>
                      </RadioGroup>
                      {formData.hasCriminalRecord && (
                        <Textarea
                          placeholder="请简述犯罪记录详情"
                          value={formData.criminalRecordDetails}
                          onChange={(e) => setFormData({ ...formData, criminalRecordDetails: e.target.value })}
                          rows={3}
                        />
                      )}
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div className="space-y-2 border-t pt-6">
                    <Label>需求说明</Label>
                    <Textarea
                      placeholder="请输入任何其他您想告诉我们的信息"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? "提交中..." : "提交预约申请"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Service Process Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">服务流程</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">首次咨询</h4>
                  <p className="text-sm text-muted-foreground">
                    移民顾问将和您进行30到60分钟的面谈，了解您的移民目标并评估您的现状与资质并提供初步的移民方案与报价。您可以根据顾问的反馈决定是否签署移民服务协议。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">签约及启动服务</h4>
                  <p className="text-sm text-muted-foreground">
                    双方签署《专业服务协议》后，我们将正式启动您的移民申请流程，包括文件准备、申请提交和后续跟进。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">服务终止与结案</h4>
                  <p className="text-sm text-muted-foreground">
                    申请获批或其他终止条件达成后，我们将完成所有必要的结案工作，并为您提供后续支持。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">初次咨询前的准备</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 准备您的护照或身份证件</li>
                  <li>• 准备学历和工作经历证明</li>
                  <li>• 准备语言考试成绩（如有）</li>
                  <li>• 准备财务证明文件</li>
                  <li>• 列出您的移民问题和关切</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">联系我们</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>电话：</strong> +1 (604) 555-0123</p>
                <p><strong>邮箱：</strong> Business@oxecimm.com</p>
                <p><strong>地址：</strong> 4710 Kingsway, Metrotower 1, Burnaby, BC V5H 4M2</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="bg-gray-100 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">我们的位置</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <MapView onMapReady={handleMapReady} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              4710 Kingsway, Metrotower 1, Burnaby, BC V5H 4M2, Canada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
