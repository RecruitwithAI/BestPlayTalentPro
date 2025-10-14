-- Create enum for challenge status
CREATE TYPE public.challenge_status AS ENUM ('draft', 'active', 'closed', 'judging', 'completed');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('draft', 'submitted', 'shortlisted', 'winner', 'rejected');

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  candidate_situation TEXT NOT NULL,
  status challenge_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES public.subscriber(id) ON DELETE CASCADE,
  deadline TIMESTAMP WITH TIME ZONE,
  max_submissions INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge_submissions table
CREATE TABLE public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.subscriber(id) ON DELETE CASCADE,
  messaging_flow JSONB NOT NULL,
  sentiment_score DECIMAL(5,2),
  status submission_status NOT NULL DEFAULT 'draft',
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, submitted_by)
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges
CREATE POLICY "Everyone can view active challenges"
ON public.challenges
FOR SELECT
USING (status IN ('active', 'judging', 'completed'));

CREATE POLICY "Creators can manage their challenges"
ON public.challenges
FOR ALL
USING (auth.uid() = created_by);

-- RLS Policies for submissions
CREATE POLICY "Users can view all submitted entries"
ON public.challenge_submissions
FOR SELECT
USING (status != 'draft');

CREATE POLICY "Users can view their own drafts"
ON public.challenge_submissions
FOR SELECT
USING (auth.uid() = submitted_by);

CREATE POLICY "Users can create submissions"
ON public.challenge_submissions
FOR INSERT
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own submissions"
ON public.challenge_submissions
FOR UPDATE
USING (auth.uid() = submitted_by);

-- Triggers for updated_at
CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_submissions_updated_at
BEFORE UPDATE ON public.challenge_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();