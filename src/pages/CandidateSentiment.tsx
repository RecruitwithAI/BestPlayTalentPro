import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, Send, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";

type Challenge = {
  id: string;
  title: string;
  description: string;
  candidate_situation: string;
  status: string;
  deadline: string;
  created_at: string;
};

type Submission = {
  id: string;
  challenge_id: string;
  messaging_flow: any;
  sentiment_score: number | null;
  status: string;
  created_at: string;
};

const CandidateSentiment = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenges();
    fetchSubmissions();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({ title: "Error loading challenges", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const addMessage = (role: string) => {
    if (!currentMessage.trim()) return;
    setMessages([...messages, { role, content: currentMessage }]);
    setCurrentMessage("");
  };

  const submitFlow = async () => {
    if (!selectedChallenge || messages.length === 0) {
      toast({ title: "Please create at least one message", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Calculate sentiment score
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `https://nclaesdxpwhfgkrnactl.supabase.co/functions/v1/calculate-sentiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            messagingFlow: messages,
            candidateSituation: selectedChallenge.candidate_situation,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to calculate sentiment");
      }

      const sentimentResult = await response.json();

      // Save submission
      const { error } = await supabase.from("challenge_submissions").insert({
        challenge_id: selectedChallenge.id,
        submitted_by: user.id,
        messaging_flow: messages,
        sentiment_score: sentimentResult.score,
        status: "submitted",
      });

      if (error) throw error;

      toast({
        title: "Submission successful!",
        description: `Your sentiment score: ${sentimentResult.score}/100`,
      });

      setMessages([]);
      setSelectedChallenge(null);
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Candidate Sentiment Challenge</h1>
          <p className="text-muted-foreground">
            Create empathetic communication flows and achieve the highest sentiment score
          </p>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            {challenges.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active challenges at the moment
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription className="mt-2">{challenge.description}</CardDescription>
                        </div>
                        <Badge>{challenge.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Candidate Situation:</h4>
                          <p className="text-sm text-muted-foreground">{challenge.candidate_situation}</p>
                        </div>
                        <Button onClick={() => setSelectedChallenge(challenge)} className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Create Submission
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedChallenge && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Create Your Messaging Flow</CardTitle>
                  <CardDescription>
                    Design a communication flow for: {selectedChallenge.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          msg.role === "recruiter"
                            ? "bg-primary/10 ml-8"
                            : "bg-muted mr-8"
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 uppercase">
                          {msg.role}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message">New Message</Label>
                    <Textarea
                      id="message"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => addMessage("recruiter")}
                        className="flex-1"
                      >
                        Add as Recruiter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addMessage("candidate")}
                        className="flex-1"
                      >
                        Add as Candidate
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedChallenge(null);
                        setMessages([]);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitFlow}
                      disabled={submitting || messages.length === 0}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Flow
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  You haven't made any submissions yet
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Submission</CardTitle>
                        <div className="flex gap-2 items-center">
                          {submission.sentiment_score && (
                            <Badge variant="secondary">
                              <Trophy className="mr-1 h-3 w-3" />
                              {submission.sentiment_score}/100
                            </Badge>
                          )}
                          <Badge>{submission.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateSentiment;
