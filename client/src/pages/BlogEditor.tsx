import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Edit,
  FileText,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { format } from "date-fns";
import { getLoginUrl } from "@/const";

export default function BlogEditor() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!loading && (!isAuthenticated || user?.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <Button onClick={() => (window.location.href = getLoginUrl())} className="w-full">
                Login
              </Button>
            ) : (
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Blog Editor</h1>
          <p className="opacity-90">Edit, schedule, and publish new blog posts</p>
        </div>
      </div>

      <div className="container py-8">
        <BlogEditorPanel onBackToAdmin={() => setLocation("/admin")} />
      </div>
    </div>
  );
}

function BlogEditorPanel({ onBackToAdmin }: { onBackToAdmin: () => void }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    published: false,
  });

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ publishedOnly: false });

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      utils.blog.list.invalidate();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      utils.blog.list.invalidate();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      utils.blog.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ title: "", slug: "", excerpt: "", content: "", category: "", published: false });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePost.mutate({ id: editingId, ...formData });
    } else {
      createPost.mutate(formData);
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "",
      published: post.published,
    });
    setEditingId(post.id);
    setIsCreating(true);
  };

  const handlePublish = (postId: number) => {
    updatePost.mutate({ id: postId, published: true });
  };

  if (isCreating || editingId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Create"} Blog Post</CardTitle>
          <CardDescription>Fill in the details for your blog post</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published" className="cursor-pointer">
                Publish immediately
              </Label>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
                {editingId ? "Update" : "Create"} Post
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="button" variant="ghost" onClick={onBackToAdmin}>
                Back to Admin Dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">Draft, review, and publish articles.</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {post.category && <span className="mr-2">Category: {post.category}</span>}
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!post.published && (
                      <Button size="sm" onClick={() => handlePublish(post.id)}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this post?")) {
                          deletePost.mutate(post.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt || post.content.substring(0, 150)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.slug}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="h-8 w-8" />
              <p>No blog posts yet. Create your first one!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
