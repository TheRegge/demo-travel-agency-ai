# Google Cloud AI API Setup Guide

This guide documents how to set up Google Cloud projects and obtain AI API keys for development projects, specifically using Google AI Studio (Gemini) for simpler demo/portfolio applications.

## Overview

For demo and portfolio projects, Google AI Studio provides a simpler alternative to the full Google Cloud Console setup. This approach is ideal for:
- Quick prototyping
- Portfolio demonstrations
- Small-scale applications
- Development and testing

## Option 1: Google AI Studio (Recommended for Demos)

### Step 1: Access Google AI Studio

1. Navigate to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Accept the terms of service if prompted

### Step 2: Create an API Key

1. In the left sidebar, click on **"Get API key"**
2. Click **"Create API key"**
3. Choose or create a Google Cloud project:
   - For new projects: Click "Create a new project"
   - For existing projects: Select from the dropdown
4. Copy the generated API key immediately

### Step 3: Store the API Key

1. Create a `.env` file in your project root
2. Add the API key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
   ```
3. Ensure `.env` is in your `.gitignore` file

### Step 4: Managing Multiple Demo Projects

To differentiate API usage between multiple demo applications:

1. **Create separate Google Cloud projects** for each demo:
   - In AI Studio, when creating an API key, always create a new project
   - Name projects descriptively: `demo-travel-agency`, `demo-ecommerce`, etc.

2. **Monitor usage per project**:
   - Each API key is tied to a specific project
   - View usage in Google Cloud Console under the specific project

3. **Set up quotas** (optional):
   - In Google Cloud Console, navigate to APIs & Services → Quotas
   - Set per-project limits to control costs

## Option 2: Google Cloud Console (Full Setup)

### Prerequisites
- Google account
- Credit card for billing (free tier available)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project details:
   - **Project name**: `demo-travel-agency` (or your project name)
   - **Project ID**: Auto-generated or customize
   - **Organization**: Select if applicable
5. Click **"Create"**

### Step 2: Enable the Generative AI API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Generative Language API" or "Vertex AI"
3. Click on the API and then **"Enable"**

### Step 3: Create Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the API key
4. Click **"Restrict Key"** for security:
   - Under "Application restrictions": Choose "None" for development
   - Under "API restrictions": Select "Restrict key" and choose the Generative AI API
5. Click **"Save"**

### Step 4: Set Up Billing

1. Go to **Billing** in the navigation menu
2. Create a billing account if you don't have one
3. Link it to your project
4. Set up budget alerts to monitor spending

## Security Best Practices

### For Development
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Use `.env.example` files with dummy values

### For Production
- Use Google Cloud Secret Manager
- Implement API key restrictions
- Set up proper authentication (OAuth 2.0)
- Monitor usage and set alerts

## Environment Setup in Next.js

### 1. Install dependencies
```bash
npm install @ai-sdk/google
```

### 2. Create environment configuration
```typescript
// lib/env.ts
export const env = {
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
}
```

### 3. Initialize the client
```typescript
// lib/ai.ts
import { GoogleGenerativeAI } from '@ai-sdk/google'
import { env } from './env'

export const genAI = new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY)
```

## Troubleshooting

### API Key Not Working
1. Verify the key is correctly copied (no extra spaces)
2. Check if the API is enabled in your project
3. Ensure billing is set up
4. Wait 5-10 minutes after creating a new key

### Finding APIs in Cloud Console
- The Generative AI API might be listed as:
  - "Generative Language API"
  - "Vertex AI API"
  - "Gemini API"
- Use the search function in the API Library

### Rate Limiting
- Free tier has usage limits
- Monitor usage in Cloud Console
- Implement client-side rate limiting in your application

## Cost Management

### Free Tier
- Google AI Studio provides free quota for development
- Sufficient for portfolio demos and testing

### Monitoring Costs
1. Set up budget alerts in Cloud Console
2. Use the Google Cloud Pricing Calculator
3. Implement usage tracking in your application

### Cost Optimization
- Cache responses when possible
- Implement rate limiting
- Use shorter prompts
- Batch requests when applicable

## References

- [Google AI Studio](https://aistudio.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Cloud Pricing](https://cloud.google.com/pricing)