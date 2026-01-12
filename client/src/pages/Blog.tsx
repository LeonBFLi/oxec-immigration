import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Search, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ publishedOnly: true });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Immigration Blog</h1>
          <p className="text-lg opacity-90">
            Latest updates on Canadian immigration policies, case studies, and expert insights
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {post.coverImage && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </div>
                  {post.category && (
                    <div className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded mb-2">
                      {post.category}
                    </div>
                  )}
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="line-clamp-3 flex-1">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </CardDescription>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No articles found matching your search." : "No articles published yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
