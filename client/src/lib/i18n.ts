export type Language = 'en' | 'zh';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.success_cases': 'Success Cases',
    'nav.blog': 'Blog',
    'nav.about': 'About Us',
    'nav.contact': 'Book Consultation',
    'nav.book_consultation': 'Book Consultation',

    // Hero Section
    'hero.subtitle': 'We are OXEC Immigration Services',
    'hero.title_part1': 'Professional, Leading, and Trustworthy',
    'hero.title_part2': 'Canadian Immigration Partner',
    'hero.description': 'OXEC Immigration Services Ltd. provides comprehensive immigration consulting services with expert guidance, personalized strategies, and a proven track record of success in helping clients achieve their Canadian dreams.',
    'hero.book_consultation': 'Book Consultation',
    'hero.success_cases': 'Success Cases',
    'hero.calculator': 'Immigration Calculator',

    // Services Section
    'services.title': 'Our Immigration Services',
    'services.subtitle': 'Comprehensive immigration solutions tailored to your unique needs and circumstances',
    'services.pr': 'Apply for PR',
    'services.pr_desc': 'Expert guidance through the Permanent Residence application process with comprehensive documentation support.',
    'services.visa': 'Apply for Temporary Visa or Permit',
    'services.visa_desc': 'Streamlined assistance for work permits, study permits, and visitor visas with high success rates.',
    'services.citizenship': 'Apply for Citizenship',
    'services.citizenship_desc': 'Complete citizenship application services ensuring all requirements are met efficiently.',
    'services.appeals': 'Immigration Appeals',
    'services.appeals_desc': 'Professional representation for immigration appeals and judicial reviews at all levels.',
    'services.invest': 'Invest in Canada',
    'services.invest_desc': 'Strategic investment immigration programs tailored to entrepreneurs and investors.',
    'services.calculator': 'Try Our Immigration Calculator',
    'nav.calculator': 'Immigration Calculator',

    // Why Choose Us Section
    'why.title': 'Why Choose OXEC Immigration?',
    'why.description': 'We combine deep expertise in Canadian immigration law with personalized service to deliver exceptional results for our clients.',
    'why.point1': 'Expert immigration consultants with proven track record',
    'why.point2': 'Personalized strategies for each client\'s unique situation',
    'why.point3': 'Comprehensive support throughout the entire process',
    'why.point4': 'High success rate in complex immigration cases',
    'why.point5': 'Transparent communication and regular updates',
    'why.cta_title': 'Ready to Start Your Journey?',
    'why.cta_desc': 'Book a consultation with our experienced immigration consultants today.',
    'why.schedule': 'Schedule Consultation',

    // Footer
    'footer.company': 'OXEC Immigration Services Ltd.',
    'footer.tagline': 'Your trusted partner for Canadian immigration success.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.email': 'business@oxecimm.com',
    'footer.copyright': '© 2026 OXEC Immigration Services Ltd. All rights reserved.',

    // Booking Page
    'booking.title': 'Book Your Consultation',
    'booking.subtitle': 'Schedule a consultation with our immigration experts',
    'booking.type': 'Consultation Type',
    'booking.type_phone': 'Phone Consultation',
    'booking.type_inperson': 'In-Person Meeting',
    'booking.name': 'Full Name',
    'booking.email': 'Email Address',
    'booking.phone': 'Phone Number',
    'booking.date': 'Preferred Date',
    'booking.time': 'Preferred Time',
    'booking.content': 'Consultation Content',
    'booking.submit': 'Book Consultation',
    'booking.success': 'Your consultation has been booked successfully!',

    // Calculator Page
    'calculator.title': 'Immigration Points Calculator',
    'calculator.subtitle': 'Calculate your immigration program score',
    'calculator.age': 'Age',
    'calculator.education': 'Education Level',
    'calculator.experience': 'Years of Work Experience',
    'calculator.language': 'Language Test Score',
    'calculator.score': 'Your CRS Score',
    'calculator.calculate': 'Calculate Score',

    // Blog Page
    'blog.title': 'Immigration Blog',
    'blog.subtitle': 'Latest immigration news and insights',
    'blog.search': 'Search articles',
    'blog.category': 'Category',
    'blog.all': 'All Articles',
    'blog.read_more': 'Read More',

    // Success Cases Page
    'cases.title': 'Success Cases',
    'cases.subtitle': 'Real stories from our satisfied clients',

    // About Page
    'about.title': 'About OXEC Immigration',
    'about.subtitle': 'Your partner in immigration success',
    'about.mission': 'Our Mission',
    'about.mission_text': 'To provide comprehensive, professional, and compassionate immigration consulting services that help individuals and families achieve their Canadian dreams.',
    'about.vision': 'Our Vision',
    'about.vision_text': 'To be the most trusted immigration consulting firm in Canada, known for our expertise, integrity, and client success.',
    'about.values': 'Our Values',
    'about.value1': 'Expertise: Deep knowledge of Canadian immigration law and procedures',
    'about.value2': 'Integrity: Honest and transparent communication with all clients',
    'about.value3': 'Excellence: Commitment to delivering the highest quality service',
    'about.value4': 'Compassion: Understanding the importance of immigration to our clients\' lives',

    // Admin Page
    'admin.title': 'Admin Dashboard',
    'admin.blog': 'Blog Management',
    'admin.cases': 'Success Cases Management',
    'admin.create': 'Create New',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.published': 'Published',
    'admin.draft': 'Draft',
  },
    zh: {
    // Navigation
    'nav.home': '首页',
    'nav.services': '服务',
    'nav.success_cases': '成功案例',
    'nav.blog': '博客',
    'nav.about': '关于我们',
    'nav.contact': '预约咨询',
    'nav.book_consultation': '预约咨询',

    // Hero Section
    'hero.subtitle': '我们是傲赛（OXEC）移民事务所',
    'hero.title_part1': '专业、领先、值得信赖的',
    'hero.title_part2': '加拿大移民合作伙伴',
    'hero.success_cases': '成功案例',
    'hero.calculator': '移民算分工具',

    // Services Section
    'services.title': '我们的移民服务',
    'services.subtitle': '根据您的独特需求和情况量身定制的全面移民解决方案',
    'services.pr': '申请永久居民',
    'services.pr_desc': '通过全面的文件支持，为永久居民申请流程提供专家指导。',
    'services.visa': '申请临时签证或许可',
    'services.visa_desc': '为工作许可、学习许可和访客签证提供流畅的协助，成功率高。',
    'services.citizenship': '申请公民身份',
    'services.citizenship_desc': '完整的公民身份申请服务，确保所有要求得到有效满足。',
    'services.appeals': '移民上诉',
    'services.appeals_desc': '在所有级别的移民上诉和司法审查中提供专业代理。',
    'services.invest': '投资加拿大',
    'services.invest_desc': '为企业家和投资者量身定制的战略投资移民项目。',
    'services.calculator': '尝试我们的移民算分工具',
    'nav.calculator': '移民算分工具',

    // Why Choose Us Section
    'why.title': '为什么选择OXEC移民？',
    'why.description': '我们将加拿大移民法的深厚专业知识与个性化服务相结合，为客户提供卓越的成果。',
    'why.point1': '拥有成功记录的专家移民顾问',
    'why.point2': '针对每个客户独特情况的个性化策略',
    'why.point3': '整个过程中的全面支持',
    'why.point4': '复杂移民案件的高成功率',
    'why.point5': '透明的沟通和定期更新',
    'why.cta_title': '准备开始您的旅程？',
    'why.cta_desc': '今天就与我们经验丰富的移民顾问预约咨询。',
    'why.schedule': '安排咨询',

    // Footer
    'footer.company': 'OXEC移民服务有限公司',
    'footer.tagline': '您值得信赖的加拿大移民成功合作伙伴。',
    'footer.links': '快速链接',
    'footer.contact': '联系我们',
    'footer.email': 'business@oxecimm.com',
    'footer.copyright': '© 2026 OXEC移民服务有限公司 版权所有。',

    // Booking Page
    'booking.title': '预约咨询',
    'booking.subtitle': '与我们的移民专家安排咨询',
    'booking.type': '咨询类型',
    'booking.type_phone': '电话咨询',
    'booking.type_inperson': '面对面会议',
    'booking.name': '全名',
    'booking.email': '电子邮件地址',
    'booking.phone': '电话号码',
    'booking.date': '首选日期',
    'booking.time': '首选时间',
    'booking.content': '咨询内容',
    'booking.submit': '预约咨询',
    'booking.success': '您的咨询已成功预约！',

    // Calculator Page
    'calculator.title': '移民算分工具',
    'calculator.subtitle': '计算您的移民项目得分',
    'calculator.age': '年龄',
    'calculator.education': '教育水平',
    'calculator.experience': '工作经验年数',
    'calculator.language': '语言测试成绩',
    'calculator.score': '您的CRS得分',
    'calculator.calculate': '计算得分',

    // Blog Page
    'blog.title': '移民博客',
    'blog.subtitle': '最新的移民新闻和见解',
    'blog.search': '搜索文章',
    'blog.category': '分类',
    'blog.all': '所有文章',
    'blog.read_more': '阅读更多',

    // Success Cases Page
    'cases.title': '成功案例',
    'cases.subtitle': '来自我们满意客户的真实故事',

    // About Page
    'about.title': '关于OXEC移民',
    'about.subtitle': '您的移民成功合作伙伴',
    'about.mission': '我们的使命',
    'about.mission_text': '提供全面、专业和富有同情心的移民咨询服务，帮助个人和家庭实现加拿大梦想。',
    'about.vision': '我们的愿景',
    'about.vision_text': '成为加拿大最值得信赖的移民咨询公司，以我们的专业知识、诚信和客户成功而闻名。',
    'about.values': '我们的价值观',
    'about.value1': '专业知识：深厚的加拿大移民法律和程序知识',
    'about.value2': '诚信：与所有客户进行诚实透明的沟通',
    'about.value3': '卓越：致力于提供最高质量的服务',
    'about.value4': '同情心：理解移民对我们客户生活的重要性',

    // Admin Page
    'admin.title': '管理员仪表板',
    'admin.blog': '博客管理',
    'admin.cases': '成功案例管理',
    'admin.create': '创建新项目',
    'admin.edit': '编辑',
    'admin.delete': '删除',
    'admin.published': '已发布',
    'admin.draft': '草稿',
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || key;
}
