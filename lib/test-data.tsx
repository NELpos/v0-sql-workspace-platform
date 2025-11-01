import type { ChatMessageWithArtifacts, Artifact } from "./types"

// Sample artifacts for testing
const sampleMarkdownArtifact: Artifact = {
  id: "artifact-md-1",
  type: "markdown",
  title: "Product Requirements Document",
  summary:
    "Comprehensive PRD for Next.js 15 WYSIWYG editor with PlateJS and AI integration, including technical stack and core features.",
  content: `# Product Requirements Document (PRD)

## Next.js 15 WYSIWYG Editor with PlateJS and AI Integration

### Project Overview

Next.js 15 기반의 고급 WYSIWYG 에디터를 구현하여 다양한 텍스트 편집 기능과 AI 자동 제공하는 컴포넌트를 개발합니다.

### Technical Stack

**Frontend & Libraries**
- **Next.js 15**: 메인 React 프레임워크
- **PlateJS**: WYSIWYG 에디터 프레임워크 (https://platejs.org/)
- **shadcn/ui**: 기본 UI 컴포넌트 라이브러리
- **Vercel AI SDK**: AI 기능 통합을 위한 SDK
- **pnpm**: 패키지 매니저

### Core Features

1. **기본 에디터 기능**
   - Rich text editing with formatting
   - Block-based content structure
   - Drag and drop support
   - Keyboard shortcuts

2. **AI Integration**
   - Auto-completion
   - Content suggestions
   - Grammar checking
   - Style improvements

3. **Collaboration**
   - Real-time editing
   - Comments and annotations
   - Version history
`,
  language: "markdown",
}

const samplePythonArtifact: Artifact = {
  id: "artifact-py-1",
  type: "python",
  title: "Data Processing Script",
  summary:
    "Python script for processing user data from CSV files with data cleaning, duplicate removal, and metric calculations.",
  content: `import pandas as pd
import numpy as np
from datetime import datetime

def process_user_data(file_path: str) -> pd.DataFrame:
    """
    Process user data from CSV file and perform data cleaning.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        Cleaned DataFrame with processed user data
    """
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['user_id'])
    
    # Handle missing values
    df['email'] = df['email'].fillna('unknown@example.com')
    df['age'] = df['age'].fillna(df['age'].median())
    
    # Convert date columns
    df['created_at'] = pd.to_datetime(df['created_at'])
    
    # Add derived columns
    df['account_age_days'] = (datetime.now() - df['created_at']).dt.days
    
    return df

def calculate_user_metrics(df: pd.DataFrame) -> dict:
    """Calculate key user metrics."""
    metrics = {
        'total_users': len(df),
        'avg_age': df['age'].mean(),
        'active_users': len(df[df['is_active'] == True]),
        'retention_rate': (df['is_active'].sum() / len(df)) * 100
    }
    return metrics

if __name__ == "__main__":
    df = process_user_data('users.csv')
    metrics = calculate_user_metrics(df)
    print(f"User Metrics: {metrics}")
`,
  language: "python",
}

const sampleSQLArtifact: Artifact = {
  id: "artifact-sql-1",
  type: "sql",
  title: "User Analytics Query",
  summary:
    "SQL query for calculating daily active users, cohort analysis, and retention metrics over 30-90 day periods.",
  content: `-- User engagement analytics query
-- Calculates daily active users and retention metrics

WITH daily_active_users AS (
  SELECT 
    DATE(activity_timestamp) as activity_date,
    COUNT(DISTINCT user_id) as dau
  FROM user_activities
  WHERE activity_timestamp >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(activity_timestamp)
),

user_cohorts AS (
  SELECT 
    user_id,
    DATE(created_at) as cohort_date,
    DATE(activity_timestamp) as activity_date,
    DATEDIFF(day, DATE(created_at), DATE(activity_timestamp)) as days_since_signup
  FROM users u
  JOIN user_activities ua ON u.id = ua.user_id
  WHERE u.created_at >= CURRENT_DATE - INTERVAL '90 days'
)

SELECT 
  cohort_date,
  COUNT(DISTINCT CASE WHEN days_since_signup = 0 THEN user_id END) as day_0_users,
  COUNT(DISTINCT CASE WHEN days_since_signup = 7 THEN user_id END) as day_7_users,
  COUNT(DISTINCT CASE WHEN days_since_signup = 30 THEN user_id END) as day_30_users,
  ROUND(
    COUNT(DISTINCT CASE WHEN days_since_signup = 7 THEN user_id END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT CASE WHEN days_since_signup = 0 THEN user_id END), 0) * 100, 
    2
  ) as day_7_retention_rate
FROM user_cohorts
GROUP BY cohort_date
ORDER BY cohort_date DESC;
`,
  language: "sql",
}

const sampleJSONArtifact: Artifact = {
  id: "artifact-json-1",
  type: "json",
  title: "API Configuration",
  summary:
    "Complete API configuration with endpoints, authentication, rate limiting, caching strategies, and database settings.",
  content: `{
  "api": {
    "version": "v1",
    "baseUrl": "https://api.example.com",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "endpoints": {
    "users": {
      "list": "/users",
      "detail": "/users/:id",
      "create": "/users",
      "update": "/users/:id",
      "delete": "/users/:id"
    },
    "auth": {
      "login": "/auth/login",
      "logout": "/auth/logout",
      "refresh": "/auth/refresh",
      "verify": "/auth/verify"
    }
  },
  "features": {
    "authentication": true,
    "rateLimit": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 900000
    },
    "caching": {
      "enabled": true,
      "ttl": 3600,
      "strategy": "lru"
    }
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "pool": {
      "min": 2,
      "max": 10
    }
  }
}`,
  language: "json",
}

const sampleHTMLArtifact: Artifact = {
  id: "artifact-html-1",
  type: "html",
  title: "Landing Page Template",
  summary:
    "Modern, responsive SaaS landing page with gradient hero section, CTA button, and feature cards using clean CSS.",
  content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern SaaS Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 20px;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .cta-button {
            background: white;
            color: #667eea;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .features {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 40px;
        }
        
        .feature-card {
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <section class="hero">
        <h1>Build Better Products Faster</h1>
        <p>The all-in-one platform for modern teams to collaborate and ship amazing products.</p>
        <button class="cta-button">Get Started Free</button>
    </section>
    
    <section class="features">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 20px;">
            Everything you need to succeed
        </h2>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚡ Lightning Fast</h3>
                <p>Built for speed with modern technologies and optimized performance.</p>
            </div>
            
            <div class="feature-card">
                <h3>🔒 Secure by Default</h3>
                <p>Enterprise-grade security with end-to-end encryption and compliance.</p>
            </div>
            
            <div class="feature-card">
                <h3>🎨 Beautiful Design</h3>
                <p>Stunning interfaces that your users will love to interact with.</p>
            </div>
        </div>
    </section>
</body>
</html>`,
  language: "html",
}

// Sample chat messages with artifacts
export const sampleMessages: ChatMessageWithArtifacts[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Can you create a Product Requirements Document for a Next.js WYSIWYG editor with AI integration?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "I've created a comprehensive Product Requirements Document for your Next.js 15 WYSIWYG editor project. The document outlines the technical stack, core features, and implementation details using PlateJS and Vercel AI SDK.",
    timestamp: new Date(Date.now() - 3500000),
    artifacts: [sampleMarkdownArtifact],
  },
  {
    id: "msg-3",
    role: "user",
    content: "Great! Now I need a Python script for processing user data from a CSV file.",
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: "msg-4",
    role: "assistant",
    content:
      "I've created a Python data processing script that handles CSV file reading, data cleaning, and metric calculations. The script includes functions for removing duplicates, handling missing values, and calculating key user metrics like retention rate.",
    timestamp: new Date(Date.now() - 2900000),
    artifacts: [samplePythonArtifact],
  },
  {
    id: "msg-5",
    role: "user",
    content: "Can you also write a SQL query for user analytics and an API configuration in JSON?",
    timestamp: new Date(Date.now() - 2000000),
  },
  {
    id: "msg-6",
    role: "assistant",
    content:
      "I've created two artifacts for you:\n\n1. **SQL Query**: A comprehensive user analytics query that calculates daily active users and retention metrics using cohort analysis.\n\n2. **JSON Configuration**: A complete API configuration file with endpoints, features, and database settings.\n\nBoth are ready to use in your project!",
    timestamp: new Date(Date.now() - 1900000),
    artifacts: [sampleSQLArtifact, sampleJSONArtifact],
  },
  {
    id: "msg-7",
    role: "user",
    content: "Finally, I need a modern landing page HTML template.",
    timestamp: new Date(Date.now() - 1000000),
  },
  {
    id: "msg-8",
    role: "assistant",
    content:
      "I've created a modern, responsive landing page template with a gradient hero section, call-to-action button, and feature cards. The template uses clean CSS with a professional design that's ready to customize for your SaaS product.",
    timestamp: new Date(Date.now() - 900000),
    artifacts: [sampleHTMLArtifact],
  },
]
