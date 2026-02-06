# GitHub Pages Deployment Guide

This project includes everything needed to deploy to GitHub Pages.

## Quick Start

1. **Fork or clone this repository**

2. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Build and deployment", select **"GitHub Actions"**

3. **Configure the base path** (Important!):
   - Open `vite.config.ts`
   - Update line 13 to match your repository name:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/<YOUR-REPO-NAME>/' : '/',
   ```
   - Replace `<YOUR-REPO-NAME>` with your actual repository name

4. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push origin main
   ```

5. **Wait for deployment**:
   - Go to the "Actions" tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be live!

## Accessing Your Site

Your invoice generator will be available at:
```
https://<your-username>.github.io/<your-repo-name>/
```

## Manual Build

To build locally for testing:

```bash
# Build with GitHub Pages configuration
npm run build:gh-pages

# Preview the build
npm run preview
```

## Troubleshooting

### Site shows blank page
- Check that the `base` path in `vite.config.ts` matches your repository name exactly
- Ensure it has leading and trailing slashes: `'/repo-name/'`

### 404 errors on navigation
- Verify GitHub Pages is set to use "GitHub Actions" not "Deploy from branch"

### Workflow fails
- Check that all dependencies are in `package.json`
- Ensure Node version in workflow (20) matches your development environment

## Custom Domain

To use a custom domain:
1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## Environment Variables

The build automatically sets `GITHUB_PAGES=true` when using the deploy workflow or `build:gh-pages` script. For local development, this defaults to `false` and uses `/` as the base path.
