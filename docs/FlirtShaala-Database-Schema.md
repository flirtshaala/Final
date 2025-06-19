# FlirtShaala Database Schema

## Overview

FlirtShaala uses Supabase as its backend database service. This document outlines the database schema, relationships, and access patterns.

## Database Tables

### 1. `users` Table

**Purpose**: Store user profile information and subscription status

**Schema**:
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  age integer CHECK (age >= 13 AND age <= 120),
  usage_count integer DEFAULT 0,
  plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Indexes**:
- Primary Key: `id`
- Unique Index: `email`

**Row-Level Security Policies**:
```sql
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

**Triggers**:
```sql
-- Update updated_at timestamp on row update
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. `response_history` Table

**Purpose**: Store user's generated responses and associated metadata

**Schema**:
```sql
CREATE TABLE response_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  response text NOT NULL,
  original_text text NOT NULL,
  response_type text NOT NULL CHECK (response_type IN ('flirty', 'witty', 'savage')),
  image_uri text,
  created_at timestamptz DEFAULT now()
);
```

**Indexes**:
- Primary Key: `id`
- Index: `idx_response_history_user_created` on `(user_id, created_at DESC)`

**Row-Level Security Policies**:
```sql
-- Users can read their own responses
CREATE POLICY "Users can read own responses"
  ON response_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own responses"
  ON response_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own responses"
  ON response_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐       ┌─────────────────────┐
│     users       │       │   response_history   │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │       │ id (PK)             │
│ email           │       │ user_id (FK)        │
│ name            │       │ response            │
│ gender          │◄──────┤ original_text       │
│ age             │       │ response_type       │
│ usage_count     │       │ image_uri           │
│ plan_type       │       │ created_at          │
│ created_at      │       └─────────────────────┘
│ updated_at      │
└─────────────────┘
```

## Access Patterns

### Users Table

1. **Get User Profile**:
   ```sql
   SELECT * FROM users WHERE id = :user_id;
   ```

2. **Update User Profile**:
   ```sql
   UPDATE users
   SET name = :name, gender = :gender, age = :age, updated_at = now()
   WHERE id = :user_id
   RETURNING *;
   ```

3. **Increment Usage Count**:
   ```sql
   UPDATE users
   SET usage_count = usage_count + 1, updated_at = now()
   WHERE id = :user_id
   RETURNING *;
   ```

4. **Update Subscription Status**:
   ```sql
   UPDATE users
   SET plan_type = :plan_type, updated_at = now()
   WHERE id = :user_id
   RETURNING *;
   ```

### Response History Table

1. **Save Response**:
   ```sql
   INSERT INTO response_history (user_id, response, original_text, response_type, image_uri)
   VALUES (:user_id, :response, :original_text, :response_type, :image_uri)
   RETURNING *;
   ```

2. **Get User's Response History with Pagination**:
   ```sql
   SELECT * FROM response_history
   WHERE user_id = :user_id
   ORDER BY created_at DESC
   LIMIT :limit OFFSET :offset;
   ```

3. **Get Total Count of User's Responses**:
   ```sql
   SELECT COUNT(*) FROM response_history
   WHERE user_id = :user_id;
   ```

4. **Delete a Response**:
   ```sql
   DELETE FROM response_history
   WHERE id = :response_id AND user_id = :user_id;
   ```

5. **Clear All User History**:
   ```sql
   DELETE FROM response_history
   WHERE user_id = :user_id;
   ```

## Data Migration

Database migrations are stored in the `supabase/migrations/` directory:

1. **Initial Schema** (`20250613035044_royal_cloud.sql`):
   - Creates the `users` table
   - Sets up RLS policies
   - Creates update trigger

2. **Response History** (`20250616094010_muddy_poetry.sql`):
   - Creates the `response_history` table
   - Sets up RLS policies
   - Creates performance indexes

## Local Storage Fallback

For guest users or when offline, the app uses local storage:

1. **User Data**:
   - Stored with key `flirtshaala_user_data`
   - Contains user ID, usage stats, and preferences

2. **Response History**:
   - Stored with key `flirtshaala_response_history`
   - Limited to last 50 responses
   - Contains same fields as database table

## Data Synchronization

When a guest user signs up or logs in:
1. Local usage statistics are merged with server data
2. Local response history is uploaded to the database
3. User preferences are synchronized