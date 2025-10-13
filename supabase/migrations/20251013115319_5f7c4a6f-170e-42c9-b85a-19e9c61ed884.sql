-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum for event types
CREATE TYPE public.event_type AS ENUM ('challenge', 'training', 'live_jam');

-- Create calendar_events table
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type public.event_type NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies - All authenticated users can view
CREATE POLICY "All users can view calendar events"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (true);

-- All authenticated users can create events
CREATE POLICY "All users can create calendar events"
ON public.calendar_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Users can update their own events
CREATE POLICY "Users can update their own events"
ON public.calendar_events
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

-- Users can delete their own events
CREATE POLICY "Users can delete their own events"
ON public.calendar_events
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();