# OXEC Immigration Services - Project TODO

## Database & Backend
- [x] Design database schema for appointments, blog posts, success cases
- [x] Create tRPC procedures for appointment booking
- [x] Create tRPC procedures for immigration calculator
- [x] Create tRPC procedures for blog article management (CRUD)
- [x] Create tRPC procedures for success cases management (CRUD)
- [x] Implement owner notification for new appointments
- [x] Add admin-only procedures for content management

## Frontend - Public Pages
- [x] Design color scheme and typography (elegant professional style)
- [x] Create responsive navigation bar with logo and menu
- [x] Build hero section with professional image and CTA buttons
- [x] Create services showcase grid (5 services)
- [x] Build appointment booking form with validation
- [x] Create immigration points calculator with real-time scoring
- [x] Build success cases showcase section
- [x] Create blog listing page with categories and search
- [ ] Build individual blog post page
- [ ] Create About Us section
- [x] Build footer with contact information

## Frontend - Admin Panel
- [x] Create admin dashboard layout
- [x] Build blog article creation/editing interface
- [x] Build success case creation/editing interface
- [x] Add content management tables with actions
- [x] Implement role-based access control

## Internationalization (i18n)
- [x] Create i18n configuration and translation files
- [x] Implement language context and provider
- [x] Add language toggle button to navigation
- [x] Translate all pages to Chinese
- [x] Add language persistence to localStorage
- [x] Test language switching across all pages

## Testing & Polish
- [x] Write vitest tests for all tRPC procedures
- [x] Test responsive design on mobile/tablet/desktop
- [x] Test appointment booking flow
- [x] Test calculator accuracy
- [x] Test admin content management
- [ ] Optimize performance and accessibility


## UI/UX Optimization (Current Sprint)
- [x] 导航栏布局重构 - 合并所有导航项为单一Flex Group，应用等距分隔
- [x] 标题排版优化 - 强制首行标题不换行（"专业、领先、值得信赖的"）
- [x] Logo尺寸微调 - 缩小至原尺寸的50%（从64px到32px）
- [x] 服务卡片视觉升级 - 用高质量图片替换Emoji图标，添加深色半透明遮罩


## Service Cards Enhancement (Current Sprint - Phase 2)
- [x] 恢复服务卡片文本内容 - 在图片下方添加标题和说明文字
- [x] 配置服务卡片路由链接 - 为5个卡片设置对应的路由
- [x] 生成5个服务子页面 - 创建/businessclass, /familyclass, /prcard, /reconsideration, /temporary页面
- [x] 添加悬停效果 - 实现卡片上浮和图片放大效果
- [x] 对齐优化 - 确保图片高度一致，文字对齐


## Team Page Implementation (Current Sprint - Phase 3)
- [x] 准备团队成员的头像图片 - 创建4位成员的头像
- [x] 创建团队页面结构 - 建立Team.tsx页面
- [x] 实现人员概览卡片区 - 4列网格布局，包含头像、姓名和职位
- [x] 实现详细介绍区域 - 4位成员的交替式图文布局
- [x] 添加平滑滚动交互 - 点击卡片平滑滚动到详细介绍
- [x] 应用视觉风格 - 纯白背景、充足留白、高端专业感
