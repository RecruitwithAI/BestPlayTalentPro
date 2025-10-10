import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Building2, Users, Code, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const searchStrategySchema = z.object({
  industry: z.string().trim().min(1, "Industry is required").max(200, "Industry must be less than 200 characters"),
  region: z.string().trim().min(1, "Region/Country is required").max(200, "Region must be less than 200 characters"),
  jobDescription: z.string().trim().max(5000, "Job description must be less than 5000 characters").optional(),
});

type SearchResults = {
  companies?: string[];
  talent?: string[];
  booleanStrings?: string[];
  insights?: string;
};

const SearchStrategyCreator = () => {
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      // Validate inputs
      const validated = searchStrategySchema.parse({
        industry,
        region,
        jobDescription: jobDescription || undefined,
      });

      setIsLoading(true);
      setResults(null);

      const { data, error } = await supabase.functions.invoke('search-strategy', {
        body: {
          industry: validated.industry,
          region: validated.region,
          jobDescription: validated.jobDescription,
        },
      });

      if (error) {
        console.error('Search strategy error:', error);
        if (error.message?.includes('429')) {
          toast({
            title: 'Rate limit exceeded',
            description: 'Please try again later.',
            variant: 'destructive',
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: 'Payment required',
            description: 'Please add funds to your Lovable AI workspace.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to generate search strategy. Please try again.',
            variant: 'destructive',
          });
        }
        return;
      }

      setResults(data);
      toast({
        title: 'Search strategy generated',
        description: 'Your comprehensive search strategy is ready.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        console.error('Unexpected error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Search Strategy</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Search Strategy <span className="text-gradient">Creator</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate comprehensive talent acquisition strategies with AI-powered industry insights, 
            company research, and optimized boolean search strings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Search Parameters</CardTitle>
              <CardDescription>
                Enter your search criteria to generate a comprehensive strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region/Country *</Label>
                <Input
                  id="region"
                  placeholder="e.g., United States, Europe, Singapore"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here to extract key skills and generate targeted boolean strings..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  maxLength={5000}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {jobDescription.length}/5000 characters
                </p>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isLoading || !industry.trim() || !region.trim()}
                className="w-full"
                variant="gaming"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Generate Search Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {!results && !isLoading && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Enter your search parameters and click "Generate Search Strategy" to see results
                  </p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">
                    Analyzing industry data and generating your search strategy...
                  </p>
                </CardContent>
              </Card>
            )}

            {results && (
              <>
                {/* Companies */}
                {results.companies && results.companies.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle>Target Companies</CardTitle>
                      </div>
                      <CardDescription>
                        Relevant companies in {region} for {industry}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.companies.map((company, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2" />
                            <span className="text-sm">{company}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Senior Talent */}
                {results.talent && results.talent.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-secondary" />
                        <CardTitle>Key Senior Talent</CardTitle>
                      </div>
                      <CardDescription>
                        Notable professionals and roles to target
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.talent.map((person, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 mt-2" />
                            <span className="text-sm">{person}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Boolean Strings */}
                {results.booleanStrings && results.booleanStrings.length > 0 && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-accent" />
                        <CardTitle>Boolean Search Strings</CardTitle>
                      </div>
                      <CardDescription>
                        Optimized search strings for various platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.booleanStrings.map((str, index) => (
                          <div key={index} className="bg-muted/50 p-3 rounded-lg">
                            <code className="text-xs break-all">{str}</code>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Insights */}
                {results.insights && (
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Strategic Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {results.insights}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchStrategyCreator;