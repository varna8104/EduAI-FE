# Environment Variables Setup for Vercel Deployment

This guide explains how to set up environment variables for your KidAI project on Vercel.

## Required Environment Variables

### 1. Groq API Key (Required)
**Variable Name:** `NEXT_PUBLIC_GROQ_API_KEY`

**How to get it:**
1. Go to https://console.groq.com/
2. Sign in to your account
3. Go to "API Keys" section
4. Copy your API key (starts with `gsk_`)

**Example:** `gsk_your_actual_api_key_here`

### 2. Backend URL (Optional)
**Variable Name:** `NEXT_PUBLIC_BACKEND_URL`

**Options:**
- **For testing without backend:** `http://localhost:8000` (default)
- **For production backend:** `https://your-backend-domain.com`

## How to Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project

### Step 2: Add Environment Variables
1. Go to "Settings" tab
2. Click "Environment Variables"
3. Add each variable:

#### For Groq API Key:
- **Name:** `NEXT_PUBLIC_GROQ_API_KEY`
- **Value:** `gsk_your_actual_api_key_here`
- **Environment:** Production, Preview, Development

#### For Backend URL (if you have a deployed backend):
- **Name:** `NEXT_PUBLIC_BACKEND_URL`
- **Value:** `https://your-backend-domain.com`
- **Environment:** Production, Preview, Development

### Step 3: Save and Redeploy
1. Click "Save" for each variable
2. Go to "Deployments" tab
3. Click "Redeploy" on your latest deployment

## Local Development Setup

### Create .env.local file
Create a file named `.env.local` in the `frontend` directory:

```bash
# Frontend Environment Variables
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_actual_api_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Start Development Server
```bash
cd frontend
npm run dev
```

## Testing Your Setup

### 1. Test Groq API
- Go to any chat page in your app
- Try sending a message
- If it works, your Groq API key is configured correctly

### 2. Test Backend (if deployed)
- Try registering a new account
- Try logging in
- If it works, your backend URL is configured correctly

### 3. Test Mock Mode (if backend not deployed)
- Try registering a new account
- Try logging in with the same credentials
- Should work with mock data

## Troubleshooting

### Common Issues:

1. **"API key is not configured"**
   - Check that `NEXT_PUBLIC_GROQ_API_KEY` is set correctly
   - Make sure the value starts with `gsk_`

2. **"Unable to connect to server"**
   - Check that `NEXT_PUBLIC_BACKEND_URL` is correct
   - Make sure your backend is running and accessible

3. **404 errors**
   - Redeploy your application after setting environment variables
   - Check that all variables are saved in Vercel

### Debug Mode:
- Check browser console for error messages
- Check Vercel deployment logs for build errors

## Security Notes

- ✅ Never commit `.env.local` to Git
- ✅ Use strong, unique API keys
- ✅ Rotate API keys regularly
- ✅ Only use `NEXT_PUBLIC_` prefix for client-side variables 