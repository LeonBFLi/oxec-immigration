import { ENV } from "./env";

export interface AppointmentEmailData {
  name: string;
  email: string;
  phone: string;
  consultationSubject: string;
  consultationType: string;
  preferredTimeSlots?: string;
  gender?: string;
  maritalStatus?: string;
  education?: string;
  englishLevel?: string;
  hasExamScore?: boolean;
  workExperience?: string;
  hasRefusal?: boolean;
  refusalReason?: string;
  hasCriminalRecord?: boolean;
  criminalRecordDetails?: string;
  message?: string;
}

export async function sendAppointmentEmail(data: AppointmentEmailData): Promise<boolean> {
  try {
    const htmlContent = generateEmailHTML(data);
    
    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: 'Business@oxecimm.com',
        subject: `[新预约申请] ${data.name} - ${data.consultationSubject}`,
        html: htmlContent,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send email via Manus API:', response.statusText);
      return false;
    }
    
    console.log('Email sent successfully to Business@oxecimm.com');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function generateEmailHTML(data: AppointmentEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h2 { color: #0066cc; margin-top: 20px; }
    h3 { color: #0066cc; margin-top: 20px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    tr { border: 1px solid #ddd; }
    tr:nth-child(even) { background-color: #f5f5f5; }
    td { padding: 10px; }
    td:first-child { font-weight: bold; width: 30%; }
    .section { margin-bottom: 30px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
  </style>
</head>
<body>
  <h2>[新预约申请] ${data.name} - ${data.consultationSubject}</h2>
  
  <div class="section">
    <h3>基本信息</h3>
    <table>
      <tr>
        <td>姓名</td>
        <td>${data.name}</td>
      </tr>
      <tr>
        <td>电子邮件</td>
        <td>${data.email}</td>
      </tr>
      <tr>
        <td>联系电话</td>
        <td>${data.phone}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h3>预约详情</h3>
    <table>
      <tr>
        <td>预约事项</td>
        <td>${data.consultationSubject}</td>
      </tr>
      <tr>
        <td>咨询方式</td>
        <td>${data.consultationType === 'phone' ? '电话咨询' : '线下咨询'}</td>
      </tr>
      <tr>
        <td>预计咨询时间</td>
        <td>${data.preferredTimeSlots || '未指定'}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h3>背景信息</h3>
    <table>
      <tr>
        <td>性别</td>
        <td>${data.gender || '未指定'}</td>
      </tr>
      <tr>
        <td>婚姻状况</td>
        <td>${data.maritalStatus || '未指定'}</td>
      </tr>
      <tr>
        <td>最高学历</td>
        <td>${data.education || '未指定'}</td>
      </tr>
      <tr>
        <td>英语水平</td>
        <td>${data.englishLevel || '未指定'}</td>
      </tr>
      <tr>
        <td>是否有考试成绩</td>
        <td>${data.hasExamScore ? '是' : '否'}</td>
      </tr>
      <tr>
        <td>工作年限</td>
        <td>${data.workExperience || '未指定'}</td>
      </tr>
      <tr>
        <td>拒签史</td>
        <td>${data.hasRefusal ? '是 - ' + (data.refusalReason || '') : '否'}</td>
      </tr>
      <tr>
        <td>犯罪记录</td>
        <td>${data.hasCriminalRecord ? '是 - ' + (data.criminalRecordDetails || '') : '否'}</td>
      </tr>
    </table>
  </div>
  
  <div class="section">
    <h3>额外说明</h3>
    <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #0066cc;">${data.message || '无'}</p>
  </div>
  
  <div class="footer">
    <p>此邮件由 OXEC Immigration Services 预约系统自动生成。</p>
  </div>
</body>
</html>
  `;
}
