import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";

export default function SuccessCases() {
  const { data: cases, isLoading } = trpc.successCases.list.useQuery({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-primary text-primary-foreground py-12">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <CheckCircle2 className="mr-3 h-10 w-10" />
            Success Stories
          </h1>
          <p className="text-lg opacity-90">
            Real stories of clients who achieved their Canadian immigration dreams with our help
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading success stories...</p>
          </div>
        ) : cases && cases.length > 0 ? (
          <div className="space-y-8">
            {cases.map((caseItem) => (
              <Card key={caseItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-3 gap-6">
                  {caseItem.coverImage && (
                    <div className="lg:col-span-1">
                      <img
                        src={caseItem.coverImage}
                        alt={caseItem.title}
                        className="w-full h-full object-cover min-h-[300px]"
                      />
                    </div>
                  )}
                  <div className={caseItem.coverImage ? "lg:col-span-2" : "lg:col-span-3"}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {caseItem.caseType}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">{caseItem.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Client Background
                        </h4>
                        <p className="text-muted-foreground">{caseItem.clientBackground}</p>
                      </div>

                      {caseItem.challenge && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Challenge</h4>
                          <p className="text-muted-foreground">{caseItem.challenge}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-primary mb-2">Our Solution</h4>
                        <p className="text-muted-foreground">{caseItem.solution}</p>
                      </div>

                      <div className="bg-accent/5 border-l-4 border-accent p-4 rounded">
                        <h4 className="font-semibold text-accent mb-2 flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Successful Outcome
                        </h4>
                        <p className="text-foreground">{caseItem.outcome}</p>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No success stories published yet.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Write Your Success Story?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Let our experienced consultants guide you through your immigration journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Book Your Consultation Today
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
