import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

function formatDate(date: Date | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function LatestArticlesSection() {
  // 获取最新的博客文章
  const { data: blogPosts, isLoading: blogLoading } = trpc.posts.list.useQuery(
    {
      type: 'blog',
      publishedOnly: true,
    },
    { retry: 2 }
  );

  // 获取最新的成功案例
  const { data: successCases, isLoading: successLoading } = trpc.posts.list.useQuery(
    {
      type: 'success-case',
      publishedOnly: true,
    },
    { retry: 2 }
  );

  const latestBlog = blogPosts?.[0];
  const latestSuccessCase = successCases?.[0];

  const DEFAULT_COVER_URL = 'https://private-us-east-1.manuscdn.com/sessionFile/i9ZSSj6IB1QFKBGCY6lMon/sandbox/HKiDtbWNfdZrc6GJJIe87h-img-1_1771010848000_na1fn_ZGVmYXVsdC1hcnRpY2xlLWNvdmVy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvaTlaU1NqNklCMVFGS0JHQ1k2bE1vbi9zYW5kYm94L0hLaUR0YldOZmRacmM2R0pKSWU4N2gtaW1nLTFfMTc3MTAxMDg0ODAwMF9uYTFmbl9aR1ZtWVhWc2RDMWhjblJwWTJ4bExXTnZkbVZ5LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rIo0CYsuXv4Ux4r6XcQAhYoofw6RyoVzzsxWI0C~x3IbiQql9Vjpr1nYksC~cgrkiNTw5qVnckKAyWYZ~XCbxn9MFsWXSY3N7KC0Lcfjd6nxJ52t4YZp-lFq9atqtMPeWNG2j7-eHIf5UoFf1j-146eTjpTJdYE11a83B~1UI9Q4noYolY1dO2xpnFBbm7djehpVSDuGCJt~mGLzYxMidCQ-LtFbHSwO08afT8mO3Vh45r7iSrvdru7gsZxjyh5TaGLvxZoVucxDt8XPO-LV0DYu~5-m3ykMeOIF8Bq7VXmSHU85n05i8qnuodkFHaw0n7twp7U1NKQHxxdYhqyUYg__';

  return (
    <section className="relative z-20 w-full bg-background" style={{ padding: 'clamp(40px, 8vw, 80px) 0' }}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-bold text-foreground mb-4" style={{ fontFamily: '"Alibaba PuHuiTi", "Noto Sans SC", sans-serif', fontSize: '48px', fontWeight: 900 }}>最新资讯</h2>
          <p className="text-lg text-muted-foreground">了解最新的移民政策和成功案例</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {/* Latest Blog Article */}
          {latestBlog && !blogLoading ? (
            <Link href={`/blog/${latestBlog.slug || latestBlog.id}`}>
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-lg" style={{ maxWidth: '640px', width: '100%' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                  <img 
                    src={latestBlog.coverImage || DEFAULT_COVER_URL} 
                    alt={latestBlog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{latestBlog.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{latestBlog.publishedAt ? formatDate(latestBlog.publishedAt) : '未发布'}</p>
                  <span className="text-primary font-semibold">点击阅读 →</span>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/blog">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-lg" style={{ maxWidth: '640px', width: '100%' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                  <img src={DEFAULT_COVER_URL} alt="Latest Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">最新移民观察</h3>
                  <p className="text-muted-foreground mb-4">了解最新的加拿大移民政策动态和专业见解</p>
                  <span className="text-primary font-semibold">点击阅读 →</span>
                </div>
              </div>
            </Link>
          )}

          {/* Latest Success Case */}
          {latestSuccessCase && !successLoading ? (
            <Link href={`/success-cases/${latestSuccessCase.slug || latestSuccessCase.id}`}>
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-lg" style={{ maxWidth: '640px', width: '100%' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                  <img 
                    src={latestSuccessCase.coverImage || DEFAULT_COVER_URL} 
                    alt={latestSuccessCase.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{latestSuccessCase.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{latestSuccessCase.publishedAt ? formatDate(latestSuccessCase.publishedAt) : '未发布'}</p>
                  <span className="text-primary font-semibold">点击阅读 →</span>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/success-cases">
              <div className="group relative overflow-hidden bg-white border border-border cursor-pointer transition-all duration-300 hover:shadow-lg" style={{ maxWidth: '640px', width: '100%' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
                  <img src={DEFAULT_COVER_URL} alt="Latest Success Case" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">最近成功案例</h3>
                  <p className="text-muted-foreground mb-4">查看我们最近帮助客户实现的移民梦想</p>
                  <span className="text-primary font-semibold">点击阅读 →</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
