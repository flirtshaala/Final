/*
  # Create response_history table for FlirtShaala

  1. New Tables
    - `response_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `response` (text)
      - `original_text` (text)
      - `response_type` (text)
      - `image_uri` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `response_history` table
    - Add policy for users to read their own responses
    - Add policy for users to insert their own responses
    - Add policy for users to delete their own responses
*/

CREATE TABLE IF NOT EXISTS response_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  response text NOT NULL,
  original_text text NOT NULL,
  response_type text NOT NULL CHECK (response_type IN ('flirty', 'witty', 'savage')),
  image_uri text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE response_history ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own responses
CREATE POLICY "Users can read own responses"
  ON response_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own responses
CREATE POLICY "Users can insert own responses"
  ON response_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own responses
CREATE POLICY "Users can delete own responses"
  ON response_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_response_history_user_created 
  ON response_history(user_id, created_at DESC);