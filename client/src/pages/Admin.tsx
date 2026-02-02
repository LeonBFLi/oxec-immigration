import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { 
  FileText, 
  Award, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit,
  ArrowLeft,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
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
              <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
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
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="opacity-90">Manage blog posts, success cases, and appointments</p>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="blog">
              <FileText className="mr-2 h-4 w-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="cases">
              <Award className="mr-2 h-4 w-4" />
              Success Cases
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="cases">
            <CasesManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BlogManagement() {
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
              <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
                {editingId ? "Update" : "Create"} Post
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
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
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {post.category && <span className="mr-2">Category: {post.category}</span>}
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this post?")) {
                          deletePost.mutate({ id: post.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt || post.content.substring(0, 150)}
                </p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CasesManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    caseType: "",
    clientBackground: "",
    challenge: "",
    solution: "",
    outcome: "",
    published: false,
  });

  const utils = trpc.useUtils();
  const { data: cases, isLoading } = trpc.successCases.list.useQuery({ publishedOnly: false });

  const createCase = trpc.successCases.create.useMutation({
    onSuccess: () => {
      toast.success("Success case created");
      utils.successCases.list.invalidate();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateCase = trpc.successCases.update.useMutation({
    onSuccess: () => {
      toast.success("Success case updated");
      utils.successCases.list.invalidate();
      resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteCase = trpc.successCases.delete.useMutation({
    onSuccess: () => {
      toast.success("Success case deleted");
      utils.successCases.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const resetForm = () => {
    setFormData({ title: "", caseType: "", clientBackground: "", challenge: "", solution: "", outcome: "", published: false });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCase.mutate({ id: editingId, ...formData });
    } else {
      createCase.mutate(formData);
    }
  };

  const handleEdit = (caseItem: any) => {
    setFormData({
      title: caseItem.title,
      caseType: caseItem.caseType,
      clientBackground: caseItem.clientBackground,
      challenge: caseItem.challenge || "",
      solution: caseItem.solution,
      outcome: caseItem.outcome,
      published: caseItem.published,
    });
    setEditingId(caseItem.id);
    setIsCreating(true);
  };

  if (isCreating || editingId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "Create"} Success Case</CardTitle>
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
                <Label htmlFor="caseType">Case Type *</Label>
                <Input
                  id="caseType"
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientBackground">Client Background *</Label>
              <Textarea
                id="clientBackground"
                rows={3}
                value={formData.clientBackground}
                onChange={(e) => setFormData({ ...formData, clientBackground: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge">Challenge</Label>
              <Textarea
                id="challenge"
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome *</Label>
              <Textarea
                id="outcome"
                rows={3}
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createCase.isPending || updateCase.isPending}>
                {editingId ? "Update" : "Create"} Case
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Success Cases</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : cases && cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Card key={caseItem.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{caseItem.title}</CardTitle>
                    <CardDescription>{caseItem.caseType}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(caseItem)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          deleteCase.mutate({ id: caseItem.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {caseItem.clientBackground}
                </p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    caseItem.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {caseItem.published ? "Published" : "Draft"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No success cases yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AppointmentsManagement() {
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Appointments</h2>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{apt.name}</CardTitle>
                    <CardDescription>
                      {apt.email} • {apt.phone}
                    </CardDescription>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                    apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Type:</span> {apt.consultationType}
                  </div>
                  <div>
                    <span className="font-semibold">Preferred Date:</span>{" "}
                    {apt.preferredDate ? format(new Date(apt.preferredDate), "MMM d, yyyy 'at' h:mm a") : 'N/A'}
                  </div>
                </div>
                {apt.message && (
                  <div className="text-sm">
                    <span className="font-semibold">Message:</span>
                    <p className="text-muted-foreground mt-1">{apt.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No appointments yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
