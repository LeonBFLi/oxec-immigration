import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface ArticleSidebarProps {
  currentPostId: number;
  postType: "blog" | "success-case";
  blogCategory?: string | null;
  successCaseCategory?: string | null;
  tags?: string[];
}

const BLOG_CATEGORIES = [
  { key: "policy-interpretation", label: "政策解读" },
  { key: "news", label: "新闻" },
  { key: "immigration-life", label: "移居生活" },
  { key: "immigration-story", label: "移民故事" },
  { key: "immigration-project", label: "移民项目" },
];

const SUCCESS_CASE_CATEGORIES = [
  { key: "investment-immigration", label: "投资移民" },
  { key: "skilled-worker", label: "技术移民" },
  { key: "family-reunion", label: "家庭团聚移民" },
  { key: "reconsideration", label: "拒签与程序公正信" },
  { key: "temporary-visit", label: "临时访问申请" },
];

export function ArticleSidebar({
  currentPostId,
  postType,
  blogCategory,
  successCaseCategory,
  tags = [],
}: ArticleSidebarProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // 获取最近的文章
  const { data: latestPosts, isLoading: latestLoading } = trpc.posts.list.useQuery({
    type: postType,
    publishedOnly: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 根据文章类型跳转到对应页面并传递搜索关键词
      const baseUrl = postType === "blog" ? "/blog" : "/success-cases";
      setLocation(`${baseUrl}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    // 根据文章类型跳转到对应页面并筛选分类
    const baseUrl = postType === "blog" ? "/blog" : "/success-cases";
    setLocation(`${baseUrl}?category=${encodeURIComponent(categoryKey)}`);
  };

  const handleTagClick = (tag: string) => {
    // 根据文章类型跳转到对应页面并筛选标签
    const baseUrl = postType === "blog" ? "/blog" : "/success-cases";
    setLocation(`${baseUrl}?tag=${encodeURIComponent(tag)}`);
  };

  const categories = postType === "blog" ? BLOG_CATEGORIES : SUCCESS_CASE_CATEGORIES;
  const currentCategory = postType === "blog" ? blogCategory : successCaseCategory;

  // 获取最近的其他文章（排除当前文章）
  const otherPosts = latestPosts?.filter(p => p.id !== currentPostId).slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* 文章分类 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">文章分类</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                currentCategory === cat.key
                  ? "bg-gray-300 text-gray-900"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 最近的文章 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">最近的文章</h3>
        {latestLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : otherPosts.length > 0 ? (
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <div key={post.id} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
                <h4 className="font-medium text-sm mb-2 line-clamp-2 hover:text-primary cursor-pointer">
                  <button
                    onClick={() => {
                      const url = postType === "blog" ? `/blog/${post.slug || post.id}` : `/success-cases/${post.slug || post.id}`;
                      setLocation(url);
                    }}
                    className="text-left hover:text-primary transition-colors"
                  >
                    {post.title}
                  </button>
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : new Date(post.createdAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                </p>
                <button
                  onClick={() => {
                    const url = postType === "blog" ? `/blog/${post.slug || post.id}` : `/success-cases/${post.slug || post.id}`;
                    setLocation(url);
                  }}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  点击阅读 →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">暂无其他文章</p>
        )}
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">标签</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索栏 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">搜索文章</h3>
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="flex gap-0">
            <Input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm border-2 border-gray-400 rounded-none flex-1"
            />
            <Button
              type="submit"
              size="sm"
              variant="default"
              className="rounded-none h-auto px-4 py-2"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
