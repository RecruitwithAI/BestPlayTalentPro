-- Rename profiles table to subscriber
ALTER TABLE public.profiles RENAME TO subscriber;

-- Drop existing policies on the old table (they will be recreated with new names)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.subscriber;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.subscriber;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.subscriber;

-- Recreate policies with updated names for subscriber table
CREATE POLICY "Subscribers are viewable by everyone" 
ON public.subscriber 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own subscriber profile" 
ON public.subscriber 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own subscriber profile" 
ON public.subscriber 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function to insert into subscriber table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriber (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$;