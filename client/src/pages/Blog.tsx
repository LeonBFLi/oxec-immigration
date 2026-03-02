import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const BLOG_CATEGORIES = [
  { key: "policy-interpretation", label: "政策解读", labelEn: "Policy Interpretation" },
  { key: "news", label: "新闻", labelEn: "News" },
  { key: "immigration-life", label: "移居生活", labelEn: "Immigration Life" },
  { key: "immigration-story", label: "移民故事", labelEn: "Immigration Story" },
  { key: "immigration-project", label: "移民项目", labelEn: "Immigration Project" },
];

export default function Blog() {
  const searchParams = new URLSearchParams(useSearch());
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const serviceItems = [
    { label: "投资移民", href: "/businessclass" },
    { label: "家庭团聚移民", href: "/familyclass" },
    { label: "枫叶卡续签与加急", href: "/prcard" },
    { label: "拒签与程序公正信", href: "/reconsideration" },
    { label: "留学与访问", href: "/temporary" },
    { label: "技术移民", href: "/skillworker" },
    { label: "公民入籍", href: "/citizenship" },
  ];

  const { data: posts, isLoading } = trpc.posts.list.useQuery({
    type: "blog",
    publishedOnly: true,
  });

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    return posts.filter((post: any) => {
      // 按分类过滤 - 检查多个可能的字段名
      const postCategory = post.blogCategory || post.category;
      if (selectedCategory && postCategory !== selectedCategory) {
        return false;
      }
      
      // 按搜索关键词过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey === selectedCategory ? "" : categoryKey);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm" style={{height: '55px'}}>
        <div className="container flex items-center py-4" style={{ justifyContent: 'space-between', height: '55px' }}>
          {/* Logo */}
          <Link href="/">
            <img src="/oxec-logo.png" alt="OXEC Immigration Services Ltd." className="cursor-pointer flex-shrink-0" style={{ height: '40px', width: '160px' }} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'space-around', marginLeft: '32px' }}>
            <Link href="/">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                {language === "en" ? "Home" : "首页"}
              </span>
            </Link>
            <div className="relative group">
              <button
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="flex items-center text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {language === "en" ? "Services" : "服务"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {servicesDropdownOpen && (
                <div
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-0 w-56 bg-white border border-border rounded-md shadow-lg z-50"
                >
                  {serviceItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className="block px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer first:rounded-t-md last:rounded-b-md">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/success-cases">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                {language === "en" ? "Success Cases" : "成功案例"}
              </span>
            </Link>
            <Link href="/blog">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                {language === "en" ? "Blog" : "博客"}
              </span>
            </Link>
            <Link href="/team">
              <span className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                {language === "en" ? "About" : "关于我们"}
              </span>
            </Link>
            <button
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
            >
              {language === "en" ? "中文" : "ENG"}
            </button>
            <Link href="/booking">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                <span>{language === "en" ? "Book Consultation" : "预约咨询"}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="container py-4 space-y-3">
              <Link href="/">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {language === "en" ? "Home" : "首页"}
                </span>
              </Link>
              <Link href="/success-cases">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {language === "en" ? "Success Cases" : "成功案例"}
                </span>
              </Link>
              <Link href="/blog">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {language === "en" ? "Blog" : "博客"}
                </span>
              </Link>
              <Link href="/team">
                <span className="block text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2">
                  {language === "en" ? "About" : "关于我们"}
                </span>
              </Link>
              <button
                onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium cursor-pointer py-2"
              >
                {language === "en" ? "中文" : "ENG"}
              </button>
              <Link href="/booking">
                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                  <span>{language === "en" ? "Book Consultation" : "预约咨询"}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-accent to-primary text-primary-foreground py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">
            {language === "en" ? "Blog" : "博客"}
          </h1>
          <p className="text-lg opacity-90">
            {language === "en" 
              ? "Latest immigration insights, policies, and professional advice"
              : "最新移民见解、政策和专业建议"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 flex-grow">
        {/* 分类过滤 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {language === "en" ? "Filter by Category" : "按分类筛选"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat.key
                    ? "bg-gray-400 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {language === "en" ? cat.labelEn : cat.label}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                {language === "en" ? "Clear Filter" : "清除筛选"}
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={language === "en" ? "Search blog posts..." : "搜索博客文章..."}
            className="w-full max-w-xl px-4 py-2 border-2 border-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Posts List with Sidebar */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === "en" ? "Loading..." : "加载中..."}
            </p>
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {filteredPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                  <div className="bg-white cursor-pointer pb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div className="w-full h-64 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex flex-col justify-start">
                        {/* Category Badge */}
                        {(post.blogCategory || post.category) && (
                          <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium mb-3 w-fit">
                            {getCategoryLabel(post.blogCategory || post.category, language)}
                          </span>
                        )}
                        
                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                        
                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        )}
                        
                        {/* Meta Information */}
                        <div className="text-sm text-muted-foreground flex flex-col gap-2 mt-auto">
                          {post.publishedAt && (
                            <span>
                              {language === "en" ? "Published on" : "发布于"} {new Date(post.publishedAt).toLocaleDateString(language === "en" ? "en-US" : "zh-CN")}
                            </span>
                          )}
                          {post.content && (
                            <span>
                              {language === "en" ? "Read time" : "阅读时间"} {Math.ceil(post.content.length / 300)} {language === "en" ? "minutes" : "分钟"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Latest Articles */}
              <div className="bg-gray-50 p-6 mb-8">
                <h4 className="text-lg font-bold mb-4">
                  {language === "en" ? "Latest Articles" : "最近的文章"}
                </h4>
                <div className="space-y-4">
                  {filteredPosts.slice(0, 3).map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug || post.id}`}>
                      <div className="pb-4 border-b last:border-b-0 hover:text-primary transition-colors cursor-pointer">
                        <p className="font-semibold text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.publishedAt).toLocaleDateString(language === "en" ? "en-US" : "zh-CN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 p-6">
                <h4 className="text-lg font-bold mb-4">
                  {language === "en" ? "Tags" : "标签"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {BLOG_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleCategoryClick(cat.key)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        selectedCategory === cat.key
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {language === "en" ? cat.labelEn : cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory 
                ? (language === "en" ? "No matching blog posts found." : "未找到匹配的博客文章。")
                : (language === "en" ? "No blog posts yet." : "暂无博客文章。")}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function getCategoryLabel(category: string, language: string): string {
  const labels: Record<string, { zh: string; en: string }> = {
    "policy-interpretation": { zh: "政策解读", en: "Policy Interpretation" },
    "news": { zh: "新闻", en: "News" },
    "immigration-life": { zh: "移居生活", en: "Immigration Life" },
    "immigration-story": { zh: "移民故事", en: "Immigration Story" },
    "immigration-project": { zh: "移民项目", en: "Immigration Project" },
    "other": { zh: "其他", en: "Other" },
  };
  
  const label = labels[category] || { zh: category, en: category };
  return language === "en" ? label.en : label.zh;
}
