# BestPlay TalentPro - Local-First Development Plan

**Last Updated:** 2025-10-15  
**Status:** Ready for Implementation  
**Approach:** Local Development → Testing → Hostinger Deployment

---

## 🎯 Development Philosophy

Build and test everything on **localhost** before deploying to Hostinger VPS.

**Timeline:** 8-9 weeks of local development, then deploy to production.

**No VPS costs until Week 9** - Develop and test everything locally first.

---

## Phase 1: Local Go Development Environment Setup (Week 1)

### 1.1 Install Required Tools on Local Machine

**Go Development Setup:**
```bash
# Install Go 1.21+
# Download from https://go.dev/dl/

# Verify installation
go version

# Install Air for hot reload (optional but recommended)
go install github.com/air-verse/air@latest
```

**Docker for Local Services:**
```bash
# Install Docker Desktop
# Download from https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

**PostgreSQL Local Client:**
```bash
# Install psql client for database access
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client
# Windows: Download from postgresql.org
```

### 1.2 Initialize Go Project Structure

Create the following directory structure in your project root:

```
backend-go/
├── cmd/
│   ├── tagmango-webhook/
│   │   └── main.go              # TagMango webhook service
│   ├── ai-tools-api/
│   │   └── main.go              # AI tools API (sentiment, strategy)
│   └── jd-generator/
│       └── main.go              # JD generator with RAG
├── internal/
│   ├── auth/
│   │   ├── validator.go         # JWT validation middleware
│   │   └── middleware.go        # Gin auth middleware
│   ├── ai/
│   │   ├── openrouter.go        # OpenRouter client
│   │   └── sentiment.go         # Sentiment analysis logic
│   ├── rag/
│   │   ├── embeddings.go        # Vector embeddings
│   │   └── search.go            # Vector similarity search
│   └── database/
│       ├── postgres.go          # PostgreSQL connection
│       └── queries.go           # Database queries
├── pkg/
│   ├── config/
│   │   └── config.go            # Configuration management
│   └── logger/
│       └── logger.go            # Structured logging
├── config/
│   ├── config.yaml              # Configuration file
│   └── config.example.yaml      # Example configuration
├── docker-compose.local.yml     # Local development docker-compose
├── go.mod
└── go.sum
```

### 1.3 Create Docker Compose for Local Development

**File: `backend-go/docker-compose.local.yml`**

```yaml
version: '3.8'

services:
  # Redis for caching and rate limiting
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # PostgreSQL for local testing (optional - you can use Supabase)
  # postgres:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: bestplay_local
  #     POSTGRES_USER: postgres
  #     POSTGRES_PASSWORD: postgres
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

volumes:
  redis_data:
  # postgres_data:
```

Start local services:
```bash
cd backend-go
docker-compose -f docker-compose.local.yml up -d
```

### 1.4 Create Base Configuration Files

**File: `backend-go/config/config.example.yaml`**

```yaml
server:
  port: 8080
  mode: debug # debug, release

supabase:
  url: https://nclaesdxpwhfgkrnactl.supabase.co
  anon_key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbGFlc2R4cHdoZmdrcm5hY3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjUwNzksImV4cCI6MjA3MDUwMTA3OX0.TIEEZw1mJw174346f8EcQY5Inri9wAKakRKZvONXvd0
  service_key: ${SUPABASE_SERVICE_KEY} # Set via env variable
  jwt_secret: ${SUPABASE_JWT_SECRET} # Set via env variable

openrouter:
  api_key: ${OPENROUTER_API_KEY}
  base_url: https://openrouter.ai/api/v1

tagmango:
  webhook_secret: ${TAGMANGO_WEBHOOK_SECRET}

redis:
  host: localhost
  port: 6379
  password: ""
  db: 0

logging:
  level: debug
  format: json
```

**File: `backend-go/.env.example`**

```env
SUPABASE_SERVICE_KEY=your_service_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_key_here
TAGMANGO_WEBHOOK_SECRET=your_tagmango_secret_here
```

### 1.5 Initialize Go Modules

```bash
cd backend-go
go mod init github.com/yourusername/bestplay-backend

# Install core dependencies
go get github.com/gin-gonic/gin
go get github.com/golang-jwt/jwt/v5
go get github.com/go-redis/redis/v8
go get github.com/lib/pq
go get github.com/joho/godotenv
go get github.com/spf13/viper
go get go.uber.org/zap
```

---

## Phase 2: Database Schema Updates (Week 1-2)

### 2.1 Enable pgvector Extension in Supabase

You can do this via Supabase SQL Editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2.2 Update Subscriber Table for TagMango Integration

```sql
-- Add TagMango-related columns to subscriber table
ALTER TABLE subscriber 
ADD COLUMN IF NOT EXISTS tagmango_user_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tagmango_email TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriber_tagmango_id ON subscriber(tagmango_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriber_tier ON subscriber(subscription_tier);
```

### 2.3 Create New Tables

**TagMango Transaction Log:**
```sql
CREATE TABLE IF NOT EXISTS tagmango_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES subscriber(id) ON DELETE SET NULL,
  tagmango_user_id TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tagmango_transactions_webhook_id ON tagmango_transactions(webhook_id);
CREATE INDEX idx_tagmango_transactions_processed ON tagmango_transactions(processed);
```

**AI Tool Usage Tracking:**
```sql
CREATE TABLE IF NOT EXISTS ai_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES subscriber(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tier TEXT NOT NULL,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  model_used TEXT,
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_tool_usage_user ON ai_tool_usage(user_id, created_at DESC);
CREATE INDEX idx_ai_tool_usage_tool ON ai_tool_usage(tool_name, created_at DESC);
```

**JD Generation History:**
```sql
CREATE TABLE IF NOT EXISTS jd_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES subscriber(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  location TEXT,
  input_data JSONB NOT NULL,
  generated_jd TEXT NOT NULL,
  rag_sources JSONB,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jd_history_user ON jd_generation_history(user_id, created_at DESC);
```

**Vector Embeddings for RAG:**
```sql
CREATE TABLE IF NOT EXISTS jd_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimensions
  metadata JSONB,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector index for similarity search
CREATE INDEX ON jd_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 2.4 Implement Tier-Based Access Control

```sql
-- Create enum for subscription tiers
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'pro');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Function to check user tier
CREATE OR REPLACE FUNCTION has_tier(user_id UUID, required_tier subscription_tier)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM subscriber
  WHERE id = user_id;
  
  RETURN CASE
    WHEN required_tier = 'free' THEN TRUE
    WHEN required_tier = 'basic' THEN user_tier IN ('basic', 'premium', 'pro')
    WHEN required_tier = 'premium' THEN user_tier IN ('premium', 'pro')
    WHEN required_tier = 'pro' THEN user_tier = 'pro'
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.5 Add RLS Policies for New Tables

```sql
-- Enable RLS
ALTER TABLE tagmango_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE jd_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE jd_embeddings ENABLE ROW LEVEL SECURITY;

-- Only admins can see transaction logs (via service role)
CREATE POLICY "Service role can manage transactions"
  ON tagmango_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- Users can see their own tool usage
CREATE POLICY "Users can view own usage"
  ON ai_tool_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Users can see their own JD history
CREATE POLICY "Users can view own JD history"
  ON jd_generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own JD history"
  ON jd_generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- JD embeddings are readable by authenticated users
CREATE POLICY "Authenticated users can read embeddings"
  ON jd_embeddings FOR SELECT
  TO authenticated
  USING (true);
```

---

## Phase 3: Build TagMango Webhook Service (Week 2)

### 3.1 Implement TagMango Webhook Handler

**File: `backend-go/cmd/tagmango-webhook/main.go`**

Basic structure:

```go
package main

import (
    "github.com/gin-gonic/gin"
    // Add your internal packages here
)

func main() {
    // Load configuration
    // Initialize database connection
    // Initialize Gin router
    
    r := gin.Default()
    
    // Health check endpoint
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })
    
    // Webhook endpoints
    webhooks := r.Group("/webhooks/tagmango")
    {
        webhooks.POST("/user-created", handleUserCreated())
        webhooks.POST("/subscription-updated", handleSubscriptionUpdated())
    }
    
    r.Run(":8081")
}

func handleUserCreated() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Verify webhook signature
        // 2. Parse request body
        // 3. Check idempotency (webhook_id)
        // 4. Create user in Supabase Auth
        // 5. Create subscriber profile
        // 6. Log transaction
        // 7. Return 200 OK
        
        c.JSON(200, gin.H{"message": "User created successfully"})
    }
}

func handleSubscriptionUpdated() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Similar implementation for subscription updates
        c.JSON(200, gin.H{"message": "Subscription updated successfully"})
    }
}
```

### 3.2 Test Webhook Locally with ngrok

```bash
# Install ngrok
# Download from https://ngrok.com/download

# Start your webhook service locally
cd backend-go/cmd/tagmango-webhook
go run main.go

# In another terminal, expose it via ngrok
ngrok http 8081

# Use the ngrok URL for TagMango webhook configuration
# Example: https://abc123.ngrok.io/webhooks/tagmango/user-created
```

### 3.3 Create Mock Webhook Payloads for Testing

**File: `backend-go/test/mock-tagmango-payloads.json`**

```json
{
  "user_created": {
    "event": "user.created",
    "webhook_id": "wh_test_123456",
    "data": {
      "user_id": "tm_user_abc123",
      "email": "test@example.com",
      "name": "Test User",
      "phone": "+1234567890",
      "subscription_tier": "basic",
      "created_at": "2025-10-15T10:00:00Z"
    }
  },
  "subscription_updated": {
    "event": "subscription.updated",
    "webhook_id": "wh_test_789012",
    "data": {
      "user_id": "tm_user_abc123",
      "subscription_tier": "premium",
      "status": "active",
      "expires_at": "2026-10-15T10:00:00Z"
    }
  }
}
```

Test with curl:
```bash
curl -X POST http://localhost:8081/webhooks/tagmango/user-created \
  -H "Content-Type: application/json" \
  -d @test/mock-tagmango-payloads.json
```

---

## Phase 4: Migrate AI Services to Go (Week 3-4)

### 4.1 Create OpenRouter Client

**File: `backend-go/internal/ai/openrouter.go`**

Implement OpenRouter API client with:
- Chat completion support
- Streaming support (optional for Phase 1)
- Model selection based on tier
- Error handling and retry logic

### 4.2 Migrate Sentiment Analysis

Recreate the logic from `supabase/functions/calculate-sentiment/index.ts` in Go.

**File: `backend-go/cmd/ai-tools-api/main.go`**

```go
package main

import (
    "github.com/gin-gonic/gin"
    // Add auth middleware
)

func main() {
    r := gin.Default()
    
    // CORS middleware
    r.Use(corsMiddleware())
    
    // Auth middleware
    // authMiddleware := auth.NewJWTValidator(cfg.Supabase.JWTSecret)
    
    api := r.Group("/api/v1")
    // api.Use(authMiddleware)
    {
        api.POST("/ai/sentiment", handleSentimentAnalysis())
        api.POST("/ai/strategy", handleSearchStrategy())
    }
    
    r.Run(":8082")
}
```

### 4.3 Update Frontend to Use Local Go Services

**Create environment-based configuration:**

**File: `src/config/api.ts`**

```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8082/api/v1' 
  : 'https://api.bestplayhub.com/api/v1';

export const API_ENDPOINTS = {
  sentiment: `${API_BASE_URL}/ai/sentiment`,
  strategy: `${API_BASE_URL}/ai/strategy`,
  jdGenerate: `${API_BASE_URL}/jd/generate`,
};
```

### 4.4 Run Everything Locally

```bash
# Terminal 1: Start Redis
cd backend-go
docker-compose -f docker-compose.local.yml up

# Terminal 2: Start TagMango webhook service
cd backend-go/cmd/tagmango-webhook
go run main.go

# Terminal 3: Start AI tools API
cd backend-go/cmd/ai-tools-api
go run main.go

# Terminal 4: Start frontend
npm run dev
```

Now you can test:
- Frontend at `http://localhost:8080`
- AI Tools API at `http://localhost:8082`
- TagMango webhooks at `http://localhost:8081`

---

## Phase 5: Build RAG-Based JD Generator (Week 5-6)

### 5.1 Seed Vector Database with JD Templates

Create seeding script and prepare JD templates.

### 5.2 Implement JD Generator Service

**File: `backend-go/cmd/jd-generator/main.go`**

Implement RAG pipeline:
1. Accept user input
2. Generate query embedding
3. Perform vector similarity search
4. Construct prompt with context
5. Call OpenRouter LLM
6. Parse structured output
7. Save to database
8. Return JD with sources

### 5.3 Create Frontend JD Generator Page

**File: `src/pages/JDGenerator.tsx`**

Create multi-step form with:
- Job title, company, industry inputs
- Skills and requirements
- Live preview
- Export options
- History view

---

## Phase 6: Testing & Documentation (Week 7-8)

### 6.1 Local Integration Testing

Create test scripts for:
- TagMango webhook flow
- AI sentiment analysis
- JD generation
- End-to-end user flows

### 6.2 Performance Testing

Use k6 or similar tools for load testing.

### 6.3 Documentation

Create comprehensive documentation:
- Local development setup guide
- API documentation
- Database schema documentation
- Troubleshooting guide

---

## Phase 7: Prepare for Hostinger Deployment (Week 9)

### 7.1 Create Production Docker Compose

**File: `backend-go/docker-compose.prod.yml`**

Include all services with production configurations.

### 7.2 Create Dockerfiles for Each Service

Create optimized multi-stage Dockerfiles.

### 7.3 Create Nginx Configuration

Set up reverse proxy with SSL.

### 7.4 Create Deployment Script

**File: `backend-go/scripts/deploy.sh`**

Automate deployment process.

### 7.5 Document Hostinger Deployment Steps

**File: `backend-go/docs/HOSTINGER_DEPLOYMENT.md`**

Complete step-by-step deployment guide.

---

## Quick Reference Commands

### Start Local Development
```bash
# Terminal 1: Start Redis
docker-compose -f backend-go/docker-compose.local.yml up

# Terminal 2: TagMango Webhook Service
cd backend-go/cmd/tagmango-webhook && go run main.go

# Terminal 3: AI Tools API
cd backend-go/cmd/ai-tools-api && go run main.go

# Terminal 4: JD Generator
cd backend-go/cmd/jd-generator && go run main.go

# Terminal 5: Frontend
npm run dev
```

### Expose Webhooks with ngrok
```bash
ngrok http 8081
```

### Test Endpoints
```bash
# Health checks
curl http://localhost:8081/health
curl http://localhost:8082/health
curl http://localhost:8083/health

# Test webhook
curl -X POST http://localhost:8081/webhooks/tagmango/user-created \
  -H "Content-Type: application/json" \
  -d @backend-go/test/mock-tagmango-payloads.json
```

---

## Key Benefits of This Approach

✅ **No VPS required initially** - Develop and test everything locally  
✅ **Fast iteration** - Change code and see results immediately  
✅ **Cheaper development** - No cloud costs during development  
✅ **Better debugging** - Full access to logs and debugging tools  
✅ **Risk-free testing** - Test TagMango integration with ngrok before production  
✅ **Confidence before deployment** - Only deploy when everything works  

---

## Timeline Summary

- **Weeks 1-2**: Environment setup + Database schema
- **Week 2**: TagMango webhook service
- **Weeks 3-4**: Migrate AI services to Go
- **Weeks 5-6**: RAG-based JD Generator
- **Weeks 7-8**: Testing and documentation
- **Week 9**: Purchase Hostinger VPS and deploy
- **Weeks 10+**: Monitor, iterate, and scale

---

## Open Questions for Clarification

1. **TagMango Webhook Documentation:**
   - Do you have access to TagMango's webhook documentation?
   - What are the exact webhook events available?
   - How is webhook signature verification implemented?

2. **Subscription Tiers:**
   - What are the exact pricing for free/basic/premium/pro tiers?
   - What features are locked at each tier?
   - Can users switch tiers mid-subscription?

3. **ML Models:**
   - Do you have existing training data for sentiment analysis?
   - What accuracy benchmarks are expected?

4. **RAG Dataset:**
   - Do you have access to high-quality JD examples?
   - What industries should be prioritized?

5. **Go Service Hosting:**
   - What level of traffic is expected initially?
   - When do you anticipate needing horizontal scaling?

---

**Next Step:** Review PROGRESS.md to track your implementation progress!
