# Deploying to Vercel

This Next.js application can be deployed to Vercel in several ways. Here are the options:

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

3. **Import your project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live in minutes!

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

## Important Notes

- **localStorage**: Characters are stored in each user's browser localStorage. This means:
  - Each user sees their own characters
  - Characters are not shared between users
  - Characters persist across sessions for the same user
  - If you want shared characters, you'll need a backend/database

- **Build Settings**: Vercel will automatically detect Next.js and use the correct build settings.

- **Environment Variables**: If you add any environment variables later, add them in the Vercel dashboard under Project Settings → Environment Variables.

## After Deployment

Your app will be available at:
- Production: `https://your-project-name.vercel.app`
- Preview deployments: Automatically created for each push/PR

You can share the URL with your party members, and each person can upload their own characters!

