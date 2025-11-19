-- Create leaderboard table to store player scores
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  leadership_score INTEGER NOT NULL,
  choices JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster queries on score sorting
CREATE INDEX idx_leaderboard_score ON public.leaderboard(leadership_score DESC);

-- Add index for recent entries
CREATE INDEX idx_leaderboard_created_at ON public.leaderboard(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view the leaderboard
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
TO public
USING (true);

-- Policy: Anyone can insert their score (no auth required for this game)
CREATE POLICY "Anyone can insert scores"
ON public.leaderboard
FOR INSERT
TO public
WITH CHECK (true);